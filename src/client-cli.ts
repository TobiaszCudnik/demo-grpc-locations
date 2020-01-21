import { option, leaf, cli } from "@carnesen/cli";
import { Drone } from "./client";
import { defaultUrl, log } from "./utils";
// @ts-ignore
import * as uniqid from "uniqid";

const drone = leaf({
  commandName: "drone",
  description: "Start a drone client",
  options: {
    url: option({
      typeName: "string",
      nullable: false,
      description: "Server's URL",
      defaultValue: defaultUrl
    }),
    id: option({
      typeName: "string",
      nullable: false,
      description: "Drone's ID",
      defaultValue: uniqid()
    })
  },
  action: async ({ url, id }) => {
    const drone = new Drone(id, url);
    log("connecting...");
    // wait max 10 secs
    await new Promise(resolve => {
      drone.client.waitForReady(Date.now() + 10 * 1000, resolve);
    });
    log(`connected to ${url}`);
  }
});

if (module === require.main) {
  cli(drone)();
}
