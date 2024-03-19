import SHIPS from "../data/shipData";
import { Orientation, Ship } from "../type/Ship";
import {
  generateOverlapCoordinate,
  generateValidShipCoordinate,
  isSameCoordinate,
} from "./coordinate";
import Coordinate from "../type/Coordinate";
import { getRandomNumber } from "./util";
import { Board } from "../type/Board";

export function cloneShip(ship: Ship): Ship {
  const clone: Ship = {
    ...ship,
    coordinates: ship.coordinates.map((coordinate) => ({ ...coordinate })),
    partsBombed: [...ship.partsBombed],
  };
  return clone;
}

export function cloneShipList(ships: Ship[]): Ship[] {
  const cloneList: Ship[] = ships.map((ship) => cloneShip(ship));
  return cloneList;
}

export function generateShips(board: Board): Ship[] {
  const shipList: Ship[] = [];

  const cloneShips = cloneShipList(SHIPS);

  let index = 0;
  while (index < cloneShips.length) {
    const ship = cloneShip(cloneShips[index]);

    ship.orientation = getRandomOrientation();

    const startingCoordinate: Coordinate = {
      row: getRandomNumber(0, board.rows),
      column: getRandomNumber(0, board.columns),
    };

    const validCoordinates = generateValidShipCoordinate(
      startingCoordinate,
      ship.length,
      ship.orientation,
      board
    );

    if (isValidShipPlacement(shipList, ship.length, validCoordinates)) {
      ship.coordinates = validCoordinates;
      shipList.push(ship);
      index++;
    }
  }

  return shipList;
}

// checks if the ship coordinate is out of grid or overlaps other ship coordinates
export function isValidShipPlacement(
  ships: Ship[],
  shipLength: number,
  coordinates: Coordinate[]
): boolean {
  const expectedTotalNumberOfCoordinates = shipLength;

  const isOutOfGrid = coordinates.length !== expectedTotalNumberOfCoordinates;

  const overlapCoordinates = generateOverlapCoordinate(ships, coordinates);

  const hasOverlapCoordinates = overlapCoordinates.length > 0;

  if (!isOutOfGrid && !hasOverlapCoordinates) return true;

  return false;
}

export function getRandomOrientation(): Orientation {
  const isHorizontal = Math.random() < 0.5;

  let orientation: Orientation = "horizontal";

  if (isHorizontal) return orientation;

  orientation = "vertical";
  return orientation;
}

//  finds the index of the ship in the ship list based on the coordinate provided
export function getIndexOfShip(
  ships: Ship[],
  targetCoordinate: Coordinate
): number {
  const index = ships.findIndex((ship) => {
    const foundCoordinate = ship.coordinates.find((coordinate) =>
      isSameCoordinate(coordinate, targetCoordinate)
    );

    return foundCoordinate ? true : false;
  });

  return index;
}

/**
 * finds the ship part's bombed to be updated from false to true
 * based on specified coordinate
 */
export function updatePartsBombed(
  ship: Ship,
  coordinate: Coordinate
): boolean[] {
  for (let index = 0; index < ship.coordinates.length; index++) {
    const shipCoordinate = ship.coordinates[index];

    if (isSameCoordinate(shipCoordinate, coordinate)) {
      ship.partsBombed[index] = true;
      return ship.partsBombed;
    }
  }

  return ship.partsBombed;
}

/**
 * checks if all ship's part is bombed by iterating through a list of booleans
 * and checks if all its boolean value is true
 */
export function allShipPartsBombed(partsBombed: boolean[]): boolean {
  return partsBombed.every((partBombed) => partBombed === true);
}
