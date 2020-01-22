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
  });

  afterAll(() => {
    // restore the originals
    sandbox.restore();
  });

  beforeEach(() => {
    server = new Server();
  });

  afterEach(() => {
    // reset mocks' counters
    sandbox.reset();
  });

  test.only("stalled", async () => {
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

  test.only("moved", async () => {
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
});
