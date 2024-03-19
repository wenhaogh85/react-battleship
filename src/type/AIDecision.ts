import Coordinate from "./Coordinate";
import Nullable from "./Nullable";

export interface AIDecision {
  guessCoordinate: Coordinate;
  targetCoordinateToRemove: Nullable<Coordinate>;
  targetCoordinatesToAdd: Coordinate[];
  hitShipIndex: number;
}
