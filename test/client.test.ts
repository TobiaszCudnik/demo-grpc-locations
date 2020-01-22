import sinon, { SinonSandbox, SinonStub } from "sinon";
import { Drone } from "../src/client";

describe("msgs", () => {
  let drone: Drone;
  let sandbox: SinonSandbox;

  beforeAll(() => {
    // MOCK
    sandbox = sinon.createSandbox();

    // @ts-ignore
    sinon.stub(Drone.prototype, "tick");
    // @ts-ignore
    sinon.stub(Drone.prototype, "initStream");
    // @ts-ignore
    sinon.stub(Drone.prototype, "write").returns(Promise.resolve());
    // @ts-ignore
    sinon.stub(Drone.prototype, "createRpcClient").returns({
      waitForReady: sinon.spy()
    });
  });

  afterAll(() => {
    // restore the originals
    sandbox.restore();
  });

  beforeEach(() => {
    drone = new Drone();
  });

  afterEach(() => {
    // reset mocks' counters
    sandbox.reset();
  });

  test("diffs", async () => {
    const { id } = drone;
    drone.location = { x: 100, y: 200 };
    await drone.sendLocation();
    drone.location = { x: 200, y: 200 };
    await drone.sendLocation();
    drone.location = { x: 200, y: 300 };
    await drone.sendLocation();
    drone.location = { x: 100, y: 300 };
    await drone.sendLocation();

    // @ts-ignore
    const write: SinonStub = drone.write;
    const msgs = write.getCalls().map(c => c.args[0].toObject());
    expect(msgs).toMatchObject([
      { id, x: 100, y: 200 },
      { id: 0, x: 100, y: 0 },
      { id: 0, x: 0, y: 100 },
      { id: 0, x: -100, y: 0 },
    ]);
  });
});
