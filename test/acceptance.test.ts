import delay from "delay";
import fetch from "node-fetch";
import { Drone } from "../src/client";
import { Server } from "../src/server";
import { TRow } from "../src/table";
import { uniqid } from "../src/utils";

const rpcUrl = "localhost:25200";
const httpPort = 25201;

test("table", async () => {
  const server = new Server(rpcUrl, httpPort);
  const drone1 = new Drone(uniqid(), rpcUrl);
  const drone2 = new Drone(uniqid(), rpcUrl);

  drone1.location = { x: 100, y: 100 };
  drone2.location = { x: 100, y: 100 };

  // TODO wait on clients connected
  await delay(1100);

  drone1.location = { x: 100, y: 100 };
  drone2.location = { x: 101, y: 101 };
  // tick
  await delay(1100);

  drone1.location = { x: 100, y: 100 };
  drone2.location = { x: 102, y: 102 };
  // tick
  await delay(1100);

  async function getTable(): Promise<string> {
    const req = await fetch(`http://localhost:${httpPort}`);
    return await req.text();
  }

  async function getJson(): Promise<TRow[]> {
    const req = await fetch(`http://localhost:${httpPort}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return await req.json();
  }

  const [table, json] = await Promise.all([getTable(), getJson()]);

  // drone1 didnt move
  expect(table).toContain("stalled-" + drone1.id);
  expect(json.find(r => r.id === drone1.id)).toMatchObject({
    speed: 0,
    isStalled: true
  });

  // drone2
  expect(json.find(r => r.id === drone2.id)).toMatchObject({
    speed: 3.39,
    isStalled: false
  });

  // tear down
  drone1.close();
  drone2.close();
  await server.close();
});
