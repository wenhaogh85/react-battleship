import { useEffect, useState } from "react";
import SHIPS from "../../../data/shipData";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  updateComputerShipList,
  addShipsHitByPlayer,
  updateAttacksByPlayer,
  setWinner,
  switchTurn,
  updateDashboardMessage,
} from "../../../store/reducers/GameProfileSlice";
import style from "../../../styles/board.module.css";
import { Attack } from "../../../type/Attack";
import Coordinate from "../../../type/Coordinate";
import { GameState } from "../../../type/GameState";
import { Ship } from "../../../type/Ship";
import { TileItem, TileState } from "../../../type/TileItem";
import { toAlphabet } from "../../../utility/coordinate";
import {
  board,
  generateGrid,
  updateGridWithAttacks,
} from "../../../utility/grid";
import {
  getIndexOfShip,
  cloneShip,
  updatePartsBombed,
  allShipPartsBombed,
} from "../../../utility/ship";
import Banner from "../../Banner";
import Shipyard from "../../Shipyard";
import Tile from "../../Tile";

const ComputerBoard: React.FC = () => {
  const { player, computer, gameState } = useAppSelector(
    (state) => state.gameProfile
  );

  const dispatch = useAppDispatch();

  const [grid, setGrid] = useState<TileItem[][]>(generateGrid(board));

  /**
   * checks if player coordinate hits any computer ships and
   * create a history of player attacks by appending it into
   * the attack list
   */
  function handlePlayerTurn(playerCoordinate: Coordinate): void {
    let futureShipsHitByPlayer = player.shipsHit;

    const row = playerCoordinate.row;
    const column = playerCoordinate.column;

    const index = getIndexOfShip(computer.shipList, playerCoordinate);

    if (index > -1) {
      const hitShip = cloneShip(computer.shipList[index]);

      hitShip.partsBombed = updatePartsBombed(hitShip, playerCoordinate);

      let newComputerShipList: Ship[];

      if (allShipPartsBombed(hitShip.partsBombed)) {
        newComputerShipList = computer.shipList.map((ship) => {
          if (ship.name === hitShip.name) return { ...hitShip, isSunk: true };
          return cloneShip(ship);
        });

        dispatch(addShipsHitByPlayer());
        futureShipsHitByPlayer += 1;

        dispatch(updateDashboardMessage(`Player sunk ${hitShip.name}`));
      } else {
        newComputerShipList = computer.shipList.map((ship) => {
          if (ship.name === hitShip.name) return { ...hitShip };
          return cloneShip(ship);
        });

        dispatch(
          updateDashboardMessage(
            `Player hit at coordinate ${toAlphabet(column)}${row}`
          )
        );
      }

      dispatch(updateComputerShipList(newComputerShipList));
    } else {
      dispatch(
        updateDashboardMessage(
          `Player miss at coordinate ${toAlphabet(column)}${row}`
        )
      );
    }

    const attack: Attack = {
      coordinate: { ...playerCoordinate },
      outcome: index > -1 ? "hit" : "miss",
    };

    dispatch(updateAttacksByPlayer(attack));

    if (futureShipsHitByPlayer === SHIPS.length) {
      dispatch(setWinner("player"));
    } else {
      dispatch(switchTurn());
    }
  }

  useEffect(() => {
    let newGrid = generateGrid(board);

    if (player.attackHistory.length > 0)
      newGrid = updateGridWithAttacks(newGrid, player.attackHistory);

    setGrid(newGrid);
  }, [player.attackHistory]);

  return (
    <div>
      <Banner title="Computer" color="dark-grey" />

      <div className={style.board}>
        <div className={style.columnLabel}>
          {" abcdefghij".split("").map((alphabet) => (
            <h3 key={alphabet}>{alphabet}</h3>
          ))}
        </div>

        <div className={style.row}>
          <div className={style.rowLabel}>
            {new Array(10).fill(0).map((_, index) => (
              <h3 key={index}>{index}</h3>
            ))}
          </div>

          <div className={style.grid}>
            {grid.map((row, rowIndex) =>
              row.map((column, columnIndex) => {
                const attackTiles: TileState[] = ["hit", "miss"];
                const invalidStates: GameState[] = [
                  "computer",
                  "over",
                  "placement",
                  "none",
                ];

                const canDisableTile =
                  invalidStates.includes(gameState) ||
                  attackTiles.includes(column.state);

                return (
                  <Tile
                    key={`${rowIndex}-${columnIndex}`}
                    coordinate={column.coordinate}
                    state={column.state}
                    tileMode={canDisableTile ? "static" : "game"}
                    handlePlayerTurn={handlePlayerTurn}
                  />
                );
              })
            )}
          </div>
        </div>

        {computer.isWin && <div className={style.overlay}></div>}
        {computer.isWin && (
          <div className={style.winner}>🎉 Computer Won 🎉</div>
        )}
      </div>

      <Shipyard ships={computer.shipList} />
    </div>
  );
};

export default ComputerBoard;
