import assert from "assert";
import * as grpc from "grpc";
import { ServiceError } from "grpc";
import { promisify } from "util";
import { LocationClient } from "./proto/api_grpc_pb";
import { LocationMsg, Ack } from "./proto/api_pb";
import { defaultUrl, SEC, TLocation, uniqid } from "./utils";
import debug, { Debugger } from "debug";

// DEFS

export class Drone {
  client: LocationClient;
  location: TLocation = { x: 0, y: 0 };

  updateFullIntervalSec = 60;
  updateDiffIntervalSec = 1;

  forceFullUpdate: boolean = false;
  lastFullUpdate: number = 0;
  lastSentLocation: TLocation = { x: 0, y: 0 };

  protected logHandler: Debugger;
  protected tickTimer: number | undefined = undefined;

  protected stream: grpc.ClientWritableStream<LocationMsg> | null = null;

  constructor(public id: number = uniqid(), url: string = defaultUrl) {
    this.logHandler = debug("drones:client:" + id);
    this.log("started");
    this.client = new LocationClient(url, grpc.credentials.createInsecure());

    this.client.waitForReady(Date.now() + 10 * SEC, (err: Error | null) => {
      if (err) {
        throw err;
      }
      this.log("connected");
      this.tick();
    });
  }

  // PUBLIC

  close() {
    if (this.stream) {
      this.stream.end();
    }
    this.client.close();
    if (this.tickTimer !== undefined) {
      clearTimeout(this.tickTimer);
    }
  }

  async updateLocation() {
    const nextFullUpdate =
      this.lastFullUpdate + this.updateFullIntervalSec * SEC;

    const shouldFullUpdate =
      this.forceFullUpdate || Date.now() > nextFullUpdate;

    if (shouldFullUpdate) {
      await this.fullUpdate();
    } else {
      await this.diffUpdate();
    }
  }

  // INTERNAL

  protected log(...msg: any[]) {
    // @ts-ignore
    this.logHandler(...msg);
  }

  protected initStream() {
    this.stream = this.client.sendLocation(
      (err: ServiceError | null, _: Ack) => {
        if (err) {
          this.log(err);
          throw err;
        }
        // GC
        this.log("stream closed");
        this.stream = null;
      }
    );
    // include the ID in the first req
    this.forceFullUpdate = true;
    this.log("stream inited");
  }

  protected async tick() {
    // check if the channel is still open
    try {
      this.client.getChannel().getConnectivityState(true);
    } catch (err) {
      // channel closed, abort
      this.log("channel's closed");
      return;
    }

    // init the stream if none
    if (!this.stream) {
      this.initStream();
    }

    try {
      await this.updateLocation();
    } catch (err) {
      this.log(err);
    }
    // delayed self call
    // @ts-ignore fix DOM vs node typings
    this.tickTimer = setTimeout(
      this.tick.bind(this),
      this.updateDiffIntervalSec * SEC
    );
  }

  protected async diffUpdate() {
    const msg = new LocationMsg();
    // dont sent ID in the diff
    msg.setId(0);
    msg.setX(this.lastSentLocation.x - this.location.x);
    msg.setY(this.lastSentLocation.y - this.location.y);
    msg.setFull(false);

    await this.write(msg);
  }

  protected async fullUpdate() {
    const msg = new LocationMsg();
    msg.setId(this.id);
    msg.setX(this.location.x);
    msg.setY(this.location.y);
    msg.setFull(true);

    this.forceFullUpdate = false;
    this.lastFullUpdate = Date.now()
    await this.write(msg);
  }

  protected async write(msg: LocationMsg) {
    assert(this.stream);
    const stream = this.stream!;
    this.log("write", msg.toObject());

    if (!stream.write(msg)) {
      await promisify(stream.once).call(stream, "drain");
    }

    // deep copy the location obj
    this.lastSentLocation = { ...this.location };
  }
}
