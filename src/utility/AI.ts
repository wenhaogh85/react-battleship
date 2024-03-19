import { Board } from "../type/Board";
import Coordinate from "../type/Coordinate";
import Nullable from "../type/Nullable";
import { Ship } from "../type/Ship";
import {
  getNeighbouringCoordinates,
  getNonOverlapCoordinates,
  isCoordinateInCoordinateList,
} from "./coordinate";
import { generateGrid, isCoordinateOutOfGrid } from "./grid";
import { getIndexOfShip } from "./ship";
import { getRandomNumber } from "./util";
import { AIDecision } from "../type/AIDecision";

// parity is optional parameter if huntTargetMinParity is not used
export function guessRandomCoordinate(
  coordinatesHistory: Coordinate[],
  board: Board,
  parity?: number
): Coordinate {
  const grid = generateGrid(board);

  const allCoordinates = grid
    .map((row) => row.map((column) => column.coordinate))
    .flat();

  // gets remaining coordinates for computer to guess
  const filteredCoordinates = getNonOverlapCoordinates(
    coordinatesHistory,
    allCoordinates
  );

  /**
   * if parity is provided, keep generating guess coordinate
   * until it fulfils parity condition else return random
   * guess coordinate (not parity based)
   */
  let guessCoordinate: Coordinate;
  while (true) {
    const minimumIndex = 0;
    const maximumIndex = filteredCoordinates.length - 1;
    const index = getRandomNumber(minimumIndex, maximumIndex);

    guessCoordinate = filteredCoordinates[index];

    if (parity) {
      if ((guessCoordinate.row + guessCoordinate.column) % parity === 0) {
        return guessCoordinate;
      }
    } else {
      return guessCoordinate;
    }
  }
}

export function huntTarget(
  playerShipList: Ship[],
  targetCoordinates: Coordinate[],
  coordinatesHistory: Coordinate[],
  board: Board,
  parity?: number
): AIDecision {
  let guessCoordinate: Coordinate;
  let targetCoordinateToRemove: Nullable<Coordinate> = null;

  /**
   * if computer has no target coordinate,
   * generate random parity coordinate if provided or
   * random coordinate
   */
  if (targetCoordinates.length === 0) {
    // random parity coordinate
    if (parity) {
      guessCoordinate = guessRandomCoordinate(
        coordinatesHistory,
        board,
        parity
      );

      // random coordinate
    } else guessCoordinate = guessRandomCoordinate(coordinatesHistory, board);
  } else {
    guessCoordinate = targetCoordinates[targetCoordinates.length - 1];
    targetCoordinateToRemove = guessCoordinate;
  }

  // checks if guess coordinate hits a player ship
  const index = getIndexOfShip(playerShipList, guessCoordinate);

  let potentialTargetCoordinates: Coordinate[] = [];

  // checks if guess coordinate hits a player ship
  if (index > -1) {
    // gets neighbouring coordinate based on current hit coordinate
    const neighbouringCoordinates = getNeighbouringCoordinates(guessCoordinate);

    // removes neighbouring coordinate that is out of the grid
    potentialTargetCoordinates = neighbouringCoordinates.filter(
      (coordinate) => !isCoordinateOutOfGrid(coordinate, board)
    );

    // removes neighbouring coordinate that has been guess before by computer
    potentialTargetCoordinates = potentialTargetCoordinates.filter(
      (coordinate) =>
        !isCoordinateInCoordinateList(coordinate, [
          ...coordinatesHistory,
          ...targetCoordinates,
        ])
    );
  }

  const AIDecision: AIDecision = {
    guessCoordinate: guessCoordinate,
    targetCoordinateToRemove: targetCoordinateToRemove,
    targetCoordinatesToAdd: potentialTargetCoordinates,
    hitShipIndex: index,
  };

  return AIDecision;
}

export function huntTargetMinParity(
  playerShipList: Ship[],
  targetCoordinates: Coordinate[],
  coordinatesHistory: Coordinate[],
  board: Board
): AIDecision {
  const unsunkShips = playerShipList.filter((ship) => !ship.isSunk);

  // finds ship with smallest size (length) that is not yet sunk
  const smallestUnsunkShip = unsunkShips.reduce(
    (smallestLength, currentShip) =>
      smallestLength > currentShip.length ? currentShip.length : smallestLength,
    playerShipList[0].length
  );

  // gets guess coordinate based on parity of ship with smallest size
  return huntTarget(
    playerShipList,
    targetCoordinates,
    coordinatesHistory,
    board,
    smallestUnsunkShip
  );
}
