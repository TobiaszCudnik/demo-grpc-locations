import delay from "delay";
import { Drone } from "../src/client";
import { createRpcServer } from "../src/server";

test("basic", async () => {
  const server = createRpcServer();
  await delay(1000);

  const drone1 = new Drone();
  const drone2 = new Drone();

  drone1.updateLocation();
  drone2.updateLocation();

  await delay(1000);

  await new Promise(resolve => server.tryShutdown(resolve));
});
