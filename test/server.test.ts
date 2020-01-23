import sinon, { SinonSandbox } from "sinon";
import { Server } from "../src/server";
import { SEC } from "../src/utils";

describe("locations", () => {
  let server: Server;
  let sandbox: SinonSandbox;

  beforeAll(() => {
    // MOCK
    sandbox = sinon.createSandbox();

    // @ts-ignore
    sinon.stub(Server.prototype, "createGrpc");
    // @ts-ignore
    sinon.stub(Server.prototype, "createExpress");
  });

  afterAll(() => {
    // restore the originals
    sandbox.restore();
  });

  beforeEach(() => {
    server = new Server();
  });

  afterEach(async () => {
    await server.close();
    // reset mocks' counters
    sandbox.reset();
  });

  test("stalled", async () => {
    const now = Date.now();
    const id = 123;
    server.locations.set(id, [
      { time: now, location: { x: 200, y: 100 } },
      { time: now - SEC, location: { x: 200, y: 100 } },
      { time: now - 2 * SEC, location: { x: 200, y: 100 } },
      { time: now - 3 * SEC, location: { x: 100, y: 100 } }
    ]);
    expect(server.isStalled(id, 2)).toBeTruthy();
  });

  test("moved", async () => {
    const now = Date.now();
    const id = 123;
    server.locations.set(id, [
      { time: now, location: { x: 200, y: 100 } },
      { time: now - SEC, location: { x: 200, y: 100 } },
      { time: now - 2 * SEC, location: { x: 200, y: 100 } },
      { time: now - 3 * SEC, location: { x: 100, y: 100 } }
    ]);
    expect(server.isStalled(id, 4)).toBeFalsy();
  });

  test("speed1", async () => {
    const now = Date.now();
    const id = 123;
    server.locations.set(id, [
      { time: now, location: { x: 1, y: 0 } },
      { time: now - SEC, location: { x: 0, y: 0 } }
    ]);
    // 3.6 kmph
    expect(server.speed(id)).toEqual((60 * 60) / 1000);
  });

  test("speed2", async () => {
    const now = Date.now();
    const id = 123;
    server.locations.set(id, [
      { time: now, location: { x: 1, y: 1 } },
      { time: now - SEC, location: { x: 0, y: 0 } }
    ]);
    expect(server.speed(id)).toEqual(5.09);
  });
});
