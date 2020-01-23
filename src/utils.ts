export type TClientID = number;

export type TLocation = {
  x: number;
  y: number;
};

export type TLocationDiff = {
  x: number;
  y: number;
};

export type TLocationEntry = {
  time: TClientID;
  location: TLocation;
};

export const defaultRpcUrl = "localhost:25000";
export const defaultHttpPort = 8080;

export const SEC = 1000;

/**
 * Generated a random ID.
 *
 * Keep in sync with the datatype in proto/api.proto
 */
export function uniqid(): number {
  return parseInt(
    Math.random()
      .toString()
      .substr(2, 5),
    10
  );
}
