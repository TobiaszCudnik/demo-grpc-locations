import debug, { Debugger } from "debug";
import express from "express";
import * as grpc from "grpc";
import { Server as GrpcServer } from "grpc";
import * as http from "http";
import { ILocationServer, LocationService } from "./proto/api_grpc_pb";
import { LocationMsg, Ack } from "./proto/api_pb";
import table, { TRow } from "./table";
import {
  defaultRpcUrl,
  TLocation,
  SEC,
  TClientID,
  TLocationDiff,
  TLocationEntry,
  defaultHttpPort
} from "./utils";

// HANDLERS

export class Service implements ILocationServer {
  constructor(public server: Server) {}

  sendLocation(
    call: grpc.ServerReadableStream<LocationMsg>,
    callback: grpc.sendUnaryData<Ack>
  ) {
    this.server.log("new sendLocation stream");
    let clientID: number;

    call.on("data", (req: LocationMsg) => {
      const data = req.toObject();
      this.server.log("sendLocation", data);
      const id = data.id || clientID;
      // memorize the client ID from the first req
      clientID = id;

      const location = data.full ? data : this.server.computeDiff(id, data);
      this.server.addLocation(id, location);
      this.server.pruneOldLocations();
    });

    call.on("end", () => {
      this.server.log("sendLocation end");
      const ack = new Ack();
      callback(null, ack);
    });
  }
}

export class Server {
  /**
   * RPC server instance.
   */
  grpc: GrpcServer;

  /**
   * Web server instance.
   */
  http: http.Server;

  /**
   * Drones' locations.
   *
   * Newest in the front (FIFO).
   */
  locations = new Map<number, TLocationEntry[]>();
  pruneLocationsAfterSec = 20;

  protected logHandler: Debugger;

  constructor(rpcHost = defaultRpcUrl, httpPort = defaultHttpPort) {
    this.logHandler = debug("drones:server");
    this.grpc = this.createGrpc(rpcHost);
    this.http = this.createExpress(httpPort);
    this.log("started");
    this.log("grpc", rpcHost);
    this.log("http", httpPort);
  }

  log(...msg: any[]) {
    // @ts-ignore
    this.logHandler(...msg);
  }

  /**
   * Add a new location for drone `id`.
   * @param id
   * @param location
   */
  addLocation(id: TClientID, location: TLocation) {
    const history = this.locations.get(id) || [];
    history.unshift({
      location: { x: location.x, y: location.y },
      time: Date.now()
    });
    this.locations.set(id, history);
  }

  computeDiff(id: TClientID, diff: TLocationDiff): TLocation {
    const location = this.getLastLocation(id);
    location.x = location.x + diff.x;
    location.y = location.y + diff.y;

    return location;
  }

  getLastLocation(id: TClientID): TLocation {
    const entries = this.locations.get(id);
    if (!entries) {
      throw new Error(`Unknown client ${id}`);
    }

    // return a copy
    return { ...entries[0].location };
  }

  pruneOldLocations() {
    for (const [id, locs] of this.locations) {
      for (const loc of locs) {
        if (loc.time + this.pruneLocationsAfterSec * SEC < Date.now()) {
          // prune everything after this entry (inclusive)
          this.locations.set(id, locs.slice(0, locs.indexOf(loc)));
          break;
        }
      }
    }
  }

  /**
   * Returns true if the client didnt move more then 1m during the past `secs`.
   *
   * Calculates the movement, not the start vs end positions.
   */
  isStalled(id: TClientID, secs: number = 10): boolean {
    const locations = this.getEntriesFromLast(id, secs).map(e => e.location);

    if (locations.length < 2) {
      return false;
    }

    // number of meter moved on x and y axises.
    const diff = { x: 0, y: 0 };
    for (let i = 1; i < locations.length; i++) {
      const loc = locations[i];
      const prev = locations[i - 1];
      diff.x += Math.abs(loc.x - prev.x);
      diff.y += Math.abs(loc.y - prev.y);
    }

    return !Boolean(diff.x + diff.y);
  }

  /**
   * Returns speed (in kmph) within the last X seconds. Calculated based only on
   * the first and last positions.
   */
  speed(id: TClientID, secs: number = 10): number {
    const entries = this.getEntriesFromLast(id, secs);

    if (entries.length < 2) {
      return 0;
    }

    const loc1 = entries[0];
    const loc2 = entries[entries.length - 1];

    const x = loc1.location.x - loc2.location.x;
    const y = loc1.location.y - loc2.location.y;
    const elapsed = Math.round((loc1.time - loc2.time) / 1000);

    const meters = Math.sqrt(x * x + y * y);
    const scale = (60 * 60) / elapsed;

    return Number(((scale * meters) / 1000).toFixed(2));
  }

  table(json = false): string | TRow[] {
    const rows: TRow[] = [];

    for (const [id] of this.locations) {
      rows.push({
        id,
        speed: this.speed(id),
        isStalled: this.isStalled(id)
      });
    }

    return json ? rows : table(rows);
  }

  // TODO nesting
  async close(): Promise<any> {
    return Promise.all([
      new Promise(resolve => {
        if (!this.http) {
          resolve();
        } else {
          this.http.close(resolve);
        }
      }),
      new Promise(resolve => {
        if (!this.grpc) {
          resolve();
        } else {
          this.grpc.tryShutdown(resolve);
        }
      })
    ]);
  }

  /**
   * Returns entires from the last X seconds.
   */
  protected getEntriesFromLast(
    id: TClientID,
    secs: number = 10
  ): TLocationEntry[] {
    const now = Date.now();
    const entries = this.locations.get(id);
    if (!entries) {
      throw new Error(`Unknown client ${id}`);
    }

    return (
      entries
        // filter relative entries based on time
        .filter(e => e.time >= now - secs * SEC)
    );
  }

  protected createGrpc(host: string): GrpcServer {
    const server = new GrpcServer();
    server.addService(
      LocationService,
      (new Service(this) as any) as ILocationServer
    );

    server.bind(host, grpc.ServerCredentials.createInsecure());
    // sync call
    server.start();

    return server;
  }

  protected createExpress(port: number): http.Server {
    const server = express();

    // routes
    server.get("/", (req, res) => {
      if (req.headers && req.headers["content-type"] === "application/json") {
        res.json(this.table(true));
      } else {
        res.send(this.table());
      }
    });

    return server.listen(port);
  }
}

// init the server when ran directly
if (module === require.main) {
  new Server();
}
