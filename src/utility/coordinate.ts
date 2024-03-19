import Coordinate from "../type/Coordinate";
import { Ship } from "../type/Ship";
import { Orientation } from "../type/Ship";
import { Board } from "../type/Board";
import { isCoordinateOutOfGrid } from "./grid";

export function toAlphabet(index: number): string {
  const alphabets = "abcdefghij";
  return alphabets.split("")[index].toUpperCase();
}

export function generateShipCoordinate(
  startingCoordinate: Coordinate,
  shipLength: number,
  shipOrientation: Orientation
): Coordinate[] {
  // initialise an empty array which also includes the ship starting coordinate
  const coordinates: Coordinate[] = [startingCoordinate];

  // based on observation, the column value increases by 1 in each increment
  // if the ship orientation is horizontal
  const startRow = startingCoordinate.row;
  const startColumn = startingCoordinate.column;

  const orientation = shipOrientation;

  // shipLength - 1 since we already have the 1st coordinate value
  const numberOfCoordinatesLeft = shipLength - 1;

  // increment starts from 1 since we are generating
  // the next column value for 2nd coordinate
  for (let increment = 1; increment <= numberOfCoordinatesLeft; increment++) {
    let coordinate: Coordinate;

    if (orientation === "horizontal") {
      coordinate = {
        row: startRow,
        column: startColumn + increment,
      };
    } else {
      coordinate = {
        row: startRow + increment,
        column: startColumn,
      };
    }

    coordinates.push(coordinate);
  }

  return coordinates;
}

export function generateValidShipCoordinate(
  startingCoordinate: Coordinate,
  shipLength: number,
  shipOrientation: Orientation,
  board: Board
): Coordinate[] {
  // initialise an empty array which also includes the ship starting coordinate
  const coordinates: Coordinate[] = [startingCoordinate];

  const startRow = startingCoordinate.row;
  const startColumn = startingCoordinate.column;

  const orientation = shipOrientation;

  // shipLength - 1 since we already have the 1st coordinate value
  const numberOfCoordinatesLeft = shipLength - 1;

  // increment starts from 1 since we are generating
  // the next row or column value for 2nd coordinate
  for (let increment = 1; increment <= numberOfCoordinatesLeft; increment++) {
    let coordinate: Coordinate;

    if (orientation === "horizontal") {
      coordinate = {
        row: startRow,
        column: startColumn + increment,
      };
    } else {
      coordinate = {
        row: startRow + increment,
        column: startColumn,
      };
    }

    if (!isCoordinateOutOfGrid(coordinate, board)) coordinates.push(coordinate);
  }

  return coordinates;
}

export function isSameCoordinate(
  coordinate1: Coordinate,
  coordinate2: Coordinate
): boolean {
  const isSameRow = coordinate1.row === coordinate2.row;
  const isSameColumn = coordinate1.column === coordinate2.column;
  return isSameRow && isSameColumn;
}

function getCommonCoordinates(
  coordinates1: Coordinate[],
  coordinates2: Coordinate[]
): Coordinate[] {
  const commonCoordinates: Coordinate[] = [];

  coordinates1.forEach((coordinate1) => {
    coordinates2.forEach((coordinate2) => {
      if (isSameCoordinate(coordinate1, coordinate2))
        commonCoordinates.push(coordinate1);
    });
  });

  return commonCoordinates;
}

export function generateOverlapCoordinate(
  ships: Ship[],
  coordinates: Coordinate[]
): Coordinate[] {
  const overlapCoordinates: Coordinate[] = [];

  ships.forEach((ship) => {
    const shipCoordinates = ship.coordinates;

    const commonCoordinates = getCommonCoordinates(
      shipCoordinates,
      coordinates
    );

    if (commonCoordinates.length > 0) {
      commonCoordinates.forEach((commonCoordinate) => {
        overlapCoordinates.push(commonCoordinate);
      });
    }
  });

  return overlapCoordinates;
}

export function getNonOverlapCoordinates(
  coordinates1: Coordinate[],
  coordinates2: Coordinate[]
): Coordinate[] {
  if (coordinates1.length === 0 && coordinates2.length === 0) return [];
  if (coordinates1.length === 0 && coordinates2.length > 0) return coordinates2;
  if (coordinates1.length > 0 && coordinates2.length === 0) return coordinates1;

  // (set a union set b)
  const unionCoordinates = [...coordinates1, ...coordinates2];

  // (set a intersect set b)
  const intersectCoordinates = getCommonCoordinates(coordinates1, coordinates2);

  // (set a union set b) - (set a intersect set b)
  const nonOverlapCoordinates = unionCoordinates.reduce(
    (hashset, coordinate) => {
      let hasIntersect = intersectCoordinates.some((intersectCoordinate) =>
        isSameCoordinate(intersectCoordinate, coordinate)
      );

      return hasIntersect ? hashset : [...hashset, coordinate];
    },
    [] as Coordinate[]
  );

  return nonOverlapCoordinates;
}

export function getNeighbouringCoordinates(
  coordinate: Coordinate
): Coordinate[] {
  const northCoordinate: Coordinate = {
    row: coordinate.row + 1,
    column: coordinate.column,
  };

  const eastCoordinate: Coordinate = {
    row: coordinate.row,
    column: coordinate.column + 1,
  };

  const southCoordinate: Coordinate = {
    row: coordinate.row - 1,
    column: coordinate.column,
  };

  const westCoordinate: Coordinate = {
    row: coordinate.row,
    column: coordinate.column - 1,
  };

  return [northCoordinate, eastCoordinate, southCoordinate, westCoordinate];
}

export function isCoordinateInCoordinateList(
  targetCoordinate: Coordinate,
  coordinateList: Coordinate[]
): boolean {
  const foundCoordinate = coordinateList.find((coordinate) =>
    isSameCoordinate(coordinate, targetCoordinate)
  );
  return foundCoordinate ? true : false;
}
