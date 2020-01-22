import debug, { Debugger } from "debug";
import * as grpc from "grpc";
import { Server as GrpcServer } from "grpc";
import { ILocationServer, LocationService } from "./proto/api_grpc_pb";
import { LocationMsg, Ack } from "./proto/api_pb";
import { defaultUrl, TLocation, SEC, TClientID, TLocationDiff } from "./utils";

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
   * Drones' locations.
   *
   * Newest in the front (FIFO).
   */
  locations = new Map<
    number,
    Array<{
      time: TClientID;
      location: TLocation;
    }>
  >();
  pruneLocationsAfterSec = 20;

  protected logHandler: Debugger;

  constructor(host = defaultUrl) {
    this.logHandler = debug("drones:server");
    this.grpc = this.createGrpc(host);
    this.log("started");
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
    const now = Date.now();
    const entries = this.locations.get(id);
    if (!entries) {
      throw new Error(`Unknown client ${id}`);
    }

    const locations = entries
      // filter relative entries based on time
      .filter(e => e.time >= now - secs * SEC)
      // pick
      .map(e => e.location);

    if (locations.length < 2) {
      return false;
    }

    // number of meter moved on x and y axises.
    const diff = { x: 0, y: 0 };
    for (let i = 1; i < locations.length; i++) {
      const loc = locations[i];
      const prev = locations[i - 1];
      diff.x = Math.abs(loc.x - prev.x);
      diff.y = Math.abs(loc.y - prev.y);
    }

    return !Boolean(diff.x + diff.y)
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

    return server
  }
}

// init the server when ran directly
if (module === require.main) {
  new Server();
}
