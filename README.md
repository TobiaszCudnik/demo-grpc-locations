# gRPC Drones

Example implementation of a location reporting system based on gRPC and
protocol buffers. Clients send diff based location data in binary streams.
The server lists them and marks the stalled ones.

Part of an interview proces with Balena (2020).

### Building

```bash
yarn install
yarn build
```

### Testing

```bash
yarn test
```

### Debugging

```bash
DEBUG=drones:*
```

### Docker

```bash
docker build -t tob/grpc-drones .
docker run tob/grpc-drones
```

### CLI

**Server**

`$ DEBUG=drones:* node build/server.js`

**Client**

`$ DEBUG=drones:* node build/client-cli.js`


### Config

There's no config file, but the following can be adjusted:

- `Server.pruneLocationsAfterSec`
- `Client.updateDiffIntervalSec`
- `Client.updateFullIntervalSec`
- `defaultRpcUrl`
- `defaultHttpPort`
