import Coordinate from "./Coordinate";

export type ShipName =
  | "Carrier"
  | "Battleship"
  | "Cruiser"
  | "Submarine"
  | "Destroyer";

export type ShipLength = 2 | 3 | 4 | 5;

export type Orientation = "horizontal" | "vertical";

export interface Ship {
  name: ShipName;
  length: ShipLength;
  orientation: Orientation;
  coordinates: Coordinate[];
  partsBombed: boolean[];
  isSunk: boolean;
}
