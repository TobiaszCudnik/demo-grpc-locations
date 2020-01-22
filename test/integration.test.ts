import delay from "delay";
import { Drone } from "../src/client";
import { createRpcServer } from "../src/server";

describe("connection", () => {
  test("full", async () => {
    const server = createRpcServer();
    const drone1 = new Drone();
    const drone2 = new Drone();

    // run for a sec
    await delay(1000);

    // tear down
    drone1.close();
    drone2.close();
    await new Promise(resolve => {
      server.tryShutdown(resolve);
    });
  });

  test("diffs", async () => {
    const server = createRpcServer();
    const drone1 = new Drone();
    const drone2 = new Drone();

    // run for 3 secs
    await delay(3000);

    // tear down
    drone1.close();
    drone2.close();
    await new Promise(resolve => {
      server.tryShutdown(resolve);
    });
  });
});
