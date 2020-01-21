import * as grpc from "grpc";
// @ts-ignore
import * as uniqid from "uniqid";
import { LocationClient } from "./api/api_grpc_pb";
import { LocationMsg, LocationDiffMsg } from "./api/api_pb";
import { log, defaultUrl } from "./utils";

// DEFS

export class Drone {
  client: LocationClient;

  constructor(public id: string = uniqid(), url: string = defaultUrl) {
    this.client = new LocationClient(url, grpc.credentials.createInsecure());
  }

  async updateLocation() {
    const data = new LocationMsg();
    data.setId(this.id);
    data.setX(123);
    data.setY(123);

    const ack = await new Promise(resolve => {
      this.client.sendLocation(data, resolve);
    });
    log("ack", ack);
  }

  async updateLocationDiff() {
    const data = new LocationDiffMsg();
    data.setId(this.id);
    data.setX(123);
    data.setY(123);

    const ack = await new Promise(resolve => {
      this.client.sendLocationDiff(data, resolve);
    });
    log("ack", ack);
  }
}
