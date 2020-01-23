import assert from "assert";
import debug, { Debugger } from "debug";
import * as grpc from "grpc";
import { ServiceError } from "grpc";
import { promisify } from "util";
import { LocationClient } from "./proto/api_grpc_pb";
import { LocationMsg, Ack } from "./proto/api_pb";
import { defaultRpcUrl, SEC, TLocation, uniqid } from "./utils";

// DEFS

export class Drone {
  client: LocationClient;

  /**
   * Current location, defined in meters and relative to the point 0.
   */
  location: TLocation = { x: 0, y: 0 };

  updateFullIntervalSec = 60;
  updateDiffIntervalSec = 1;

  forceFullUpdate: boolean = false;
  lastFullUpdate: number = 0;
  lastSentLocation: TLocation = { x: 0, y: 0 };

  protected logHandler: Debugger;
  protected tickTimer: number | undefined = undefined;

  protected stream: grpc.ClientWritableStream<LocationMsg> | null = null;

  constructor(public id: number = uniqid(), url: string = defaultRpcUrl) {
    this.logHandler = debug("drones:client:" + id);
    this.log("started", url);
    this.client = this.createRpcClient(url);

    this.client.waitForReady(Date.now() + 10 * SEC, (err: Error | null) => {
      if (err) {
        throw err;
      }
      this.log("connected");
      this.initStream();
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

  /**
   * Send location to the server.
   */
  async sendLocation() {
    this.initStream();

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

  protected createRpcClient(url: string): LocationClient {
    return new LocationClient(url, grpc.credentials.createInsecure());
  }

  protected log(...msg: any[]) {
    // @ts-ignore
    this.logHandler(...msg);
  }

  protected initStream() {
    // skip if exists
    if (this.stream) {
      return;
    }

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

    try {
      await this.sendLocation();
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
    msg.setX(this.location.x - this.lastSentLocation.x);
    msg.setY(this.location.y - this.lastSentLocation.y);
    msg.setFull(false);

    await this.write(msg);

    // deep copy the location obj
    this.lastSentLocation = { ...this.location };
  }

  protected async fullUpdate() {
    const msg = new LocationMsg();
    msg.setId(this.id);
    msg.setX(this.location.x);
    msg.setY(this.location.y);
    msg.setFull(true);

    this.forceFullUpdate = false;
    this.lastFullUpdate = Date.now();
    await this.write(msg);

    // deep copy the location obj
    this.lastSentLocation = { ...this.location };
  }

  protected async write(msg: LocationMsg) {
    assert(this.stream);
    const stream = this.stream!;
    this.log("write", msg.toObject());

    if (!stream.write(msg)) {
      await promisify(stream.once).call(stream, "drain");
    }
  }
}
