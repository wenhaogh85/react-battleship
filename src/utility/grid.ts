import { TileItem, TileState } from "../type/TileItem";
import Coordinate from "../type/Coordinate";
import { Ship } from "../type/Ship";
import { Attack } from "../type/Attack";
import { Board } from "../type/Board";

export const board: Board = {
  rows: 10,
  columns: 10,
};

export function cloneGrid(grid: TileItem[][]): TileItem[][] {
  return grid.map((row) =>
    row.map((column) => {
      return { ...column };
    })
  );
}

export function generateGrid(board: Board): TileItem[][] {
  const grid: TileItem[][] = [];

  for (let row = 0; row < board.rows; row++) {
    const gridRow: TileItem[] = [];

    for (let column = 0; column < board.columns; column++) {
      const tile: TileItem = {
        coordinate: {
          row: row,
          column: column,
        },
        state: "empty",
      };

      gridRow.push(tile);
    }

    grid.push(gridRow);
  }

  return grid;
}

type TargetCoordinate = Coordinate | Coordinate[];

/**
 * coordinate is Coordinate is a type predicate which means that
 * this function not only returns a boolean but also reduces the
 * type to Coordinate
 */
export function isCoordinate(
  coordinate: TargetCoordinate
): coordinate is Coordinate {
  return (coordinate as Coordinate).row !== undefined;
}

export function updateGrid(
  currentGrid: TileItem[][],
  targetCoordinate: TargetCoordinate,
  tileState: TileState
): TileItem[][] {
  const newGrid = cloneGrid(currentGrid);

  if (isCoordinate(targetCoordinate)) {
    newGrid[targetCoordinate.row][targetCoordinate.column].state = tileState;
  } else {
    targetCoordinate.forEach(
      (coordinate) =>
        (newGrid[coordinate.row][coordinate.column].state = tileState)
    );
  }

  return newGrid;
}

export function updateGridWithShips(
  currentGrid: TileItem[][],
  ships: Ship[]
): TileItem[][] {
  let newGrid = cloneGrid(currentGrid);

  ships.forEach((ship) => {
    newGrid = updateGrid(newGrid, ship.coordinates, "ship");
  });

  return newGrid;
}

export function updateGridWithAttacks(
  currentGrid: TileItem[][],
  attacks: Attack[]
): TileItem[][] {
  let newGrid = cloneGrid(currentGrid);

  attacks.forEach((attack) => {
    newGrid = updateGrid(newGrid, attack.coordinate, attack.outcome);
  });

  return newGrid;
}

export function isCoordinateOutOfGrid(
  coordinate: Coordinate,
  board: Board
): boolean {
  if (coordinate.row > board.rows - 1 || coordinate.row < 0) return true;
  if (coordinate.column > board.columns - 1 || coordinate.column < 0)
    return true;
  return false;
}
