import * as grpc from "grpc";
import { Server as GrpcServer } from "grpc";
import { ILocationServer, LocationService } from "./proto/api_grpc_pb";
import { LocationMsg, Ack } from "./proto/api_pb";
import {
  defaultUrl,
  TLocation,
  SEC,
  TClientID,
  TLocationDiff
} from "./utils";
import debug from "debug";

// TODO compose
const log = debug('drones:server')

// HANDLERS

export class LocationServer implements ILocationServer {
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

  // TODO compose
  sendLocation(
    call: grpc.ServerReadableStream<LocationMsg>,
    callback: grpc.sendUnaryData<Ack>
  ) {
    log('new sendLocation stream')
    let clientID: number

    call.on("data", (req: LocationMsg) => {
      const data = req.toObject();
      log("sendLocation", data);
      const id = data.id || clientID
      // memorize the client ID from the first req
      clientID = id

      const location = data.full ? data : this.computeDiff(id, data);
      this.addLocation(id, location);
      this.pruneOldLocations();
    });

    call.on("end", () => {
      log("sendLocation end");
      const ack = new Ack();
      callback(null, ack);
    });
  }

  /**
   * Add a new location for drone `id`.
   * @param id
   * @param location
   */
  addLocation(id: TClientID, location: TLocation) {
    if (!this.locations.has(id)) {
      this.locations.set(id, []);
    }
    this.locations.get(id)!.unshift({
      location: { x: location.x, y: location.y },
      time: Date.now()
    });
  }

  computeDiff(id: TClientID, diff: TLocationDiff): TLocation {
    const location = this.getLastLocation(id);
    location.x = location.x + diff.x;
    location.y = location.y + diff.y;

    return location;
  }

  getLastLocation(id: TClientID): TLocation {
    let locations = this.locations.get(id);
    if (!locations) {
      throw new Error(`Unknown client ${id}`);
    }

    // return a copy
    return { ...locations[0].location };
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
}

// SERVER

// TODO compose
export function createRpcServer(host = defaultUrl): GrpcServer {
  const rpcServer = new GrpcServer();
  rpcServer.addService(
    LocationService,
    // TODO compose
    (new LocationServer() as any) as ILocationServer
  );

  rpcServer.bind(host, grpc.ServerCredentials.createInsecure());
  // sync call
  rpcServer.start();
  log("started");

  return rpcServer;
}

// init the server when ran directly
if (module === require.main) {
  createRpcServer();
}
