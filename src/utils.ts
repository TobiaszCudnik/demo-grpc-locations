export type TClientID = number;

export type TLocation = {
  x: number;
  y: number;
};

export type TLocationDiff = {
  x: number;
  y: number;
};

export const defaultUrl = "0.0.0.0:25000";

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
