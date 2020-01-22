import delay from "delay";
import sinon from "sinon";
import { Drone } from "../src/client";
import { Server } from "../src/server";

describe("connection", () => {
  test("full", async () => {
    const server = new Server();
    const drone1 = new Drone();
    const drone2 = new Drone();

    // run for a sec
    await delay(1000);

    // tear down
    drone1.close();
    drone2.close();
    await new Promise(resolve => {
      server.grpc.tryShutdown(resolve);
    });
  });

  test("diffs", async () => {
    const server = new Server();
    const drone1 = new Drone();
    const drone2 = new Drone();

    // run for 3 secs
    await delay(3000);

    // tear down
    drone1.close();
    drone2.close();
    await new Promise(resolve => {
      server.grpc.tryShutdown(resolve);
    });
  });
});

describe("positions", () => {
  beforeAll(() => {
    // @ts-ignore
    sinon.stub(Drone.prototype, "tick");
  });

  afterAll(() => {
    // @ts-ignore
    Drone.prototype.tick.restore();
  });

  test("move", async () => {
    const server = new Server();
    const drone1 = new Drone();
    drone1.location = { x: 100, y: 100 };

    // TODO wait on clients connected
    await delay(1000);

    await drone1.sendLocation();
    // move 100,0
    drone1.location = { x: 200, y: 100 };
    await drone1.sendLocation();
    // move 0, 100
    drone1.location = { x: 200, y: 200 };
    await drone1.sendLocation();
    // move 100, 0
    drone1.location = { x: 300, y: 200 };
    await drone1.sendLocation();

    // TODO wait on server received
    await delay(1000);

    expect(server.locations.size).toEqual(1);
    const locations = server.locations.get(drone1.id)!;

    expect(locations[0].location).toMatchObject({x: 300, y: 200})
    expect(locations[1].location).toMatchObject({x: 200, y: 200})
    expect(locations[2].location).toMatchObject({x: 200, y: 100})
    expect(locations[3].location).toMatchObject({x: 100, y: 100})

    // tear down
    drone1.close();
    await new Promise(resolve => {
      server.grpc.tryShutdown(resolve);
    });
  });
});
