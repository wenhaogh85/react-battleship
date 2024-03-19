import Coordinate from "./Coordinate";

export type Outcome = "hit" | "miss";

export interface Attack {
  coordinate: Coordinate;
  outcome: Outcome;
}
