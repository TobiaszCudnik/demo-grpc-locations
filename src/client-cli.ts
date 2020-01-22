import { option, leaf, cli } from "@carnesen/cli";
import { Drone } from "./client";
import { defaultUrl, uniqid } from "./utils";

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
      typeName: "number",
      nullable: false,
      description: "Drone's ID",
      defaultValue: uniqid()
    })
  },
  action: async ({ url, id }) => {
    new Drone(id, url);
  }
});

if (module === require.main) {
  cli(drone)();
}
