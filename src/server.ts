import * as grpc from "grpc";
import { Server } from "grpc";
import { ILocationServer, LocationService } from "./api/api_grpc_pb";
import { LocationMsg, LocationDiffMsg, Ack } from "./api/api_pb";
import { log, defaultUrl } from "./utils";

// HANDLERS

class RpcServer implements ILocationServer {
  sendLocation(
    call: grpc.ServerUnaryCall<LocationMsg>,
    callback: grpc.sendUnaryData<Ack>
  ) {
    const data = call.request.toObject();
    log("sendLocation", data);
    const ack = new Ack();
    callback(null, ack);
  }

  sendLocationDiff(
    call: grpc.ServerReadableStream<LocationDiffMsg>,
    callback: grpc.sendUnaryData<Ack>
  ) {
    call.on("data", (location: LocationDiffMsg) => {
      log("sendLocationDiff", location);
      // TODO
    });
    call.on("end", () => {
      log("sendLocationDiff", "ended");
      const ack = new Ack();
      callback(null, ack);
    });
  }
}

// SERVER

// TODO config
export function createRpcServer(host = defaultUrl): Server {
  const rpcServer = new Server();
  rpcServer.addService(LocationService, new RpcServer());

  rpcServer.bind(host, grpc.ServerCredentials.createInsecure());
  rpcServer.start();
  log("server started");

  return rpcServer;
}

// init the server when ran directly
if (module === require.main) {
  createRpcServer();
}
