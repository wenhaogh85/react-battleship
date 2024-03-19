import Coordinate from "./Coordinate";

export type TileState =
  | "empty"
  | "invalid"
  | "awaiting"
  | "ship"
  | "hit"
  | "miss";

export interface TileItem {
  coordinate: Coordinate;
  state: TileState;
}

export type TileMode = "static" | "placement" | "game";
