import { useCallback, useEffect, useState } from "react";
import SHIPS from "../../../data/shipData";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  addShipsHitByComputer,
  updateAttacksByComputer,
  addToComputerTargetCoordinates,
  removeFromComputerTargetCoordinates,
  updatePlayerShipList,
  setWinner,
  switchTurn,
  updateDashboardMessage,
} from "../../../store/reducers/GameProfileSlice";
import style from "../../../styles/board.module.css";
import { AIDecision } from "../../../type/AIDecision";
import { Attack } from "../../../type/Attack";
import { Ship } from "../../../type/Ship";
import { TileItem, TileState } from "../../../type/TileItem";
import { huntTargetMinParity } from "../../../utility/AI";
import {
  generateValidShipCoordinate,
  toAlphabet,
} from "../../../utility/coordinate";
import {
  board,
  generateGrid,
  updateGrid,
  updateGridWithAttacks,
  updateGridWithShips,
} from "../../../utility/grid";
import {
  allShipPartsBombed,
  cloneShip,
  isValidShipPlacement,
  updatePartsBombed,
} from "../../../utility/ship";
import Banner from "../../Banner";
import Shipyard from "../../Shipyard";
import Tile from "../../Tile";

const PlayerBoard: React.FC = () => {
  const { player, computer, gameState } = useAppSelector(
    (state) => state.gameProfile
  );
  const dispatch = useAppDispatch();

  const [canPlaceSelectedShip, setCanPlaceSelectedShip] = useState(true);
  const [grid, setGrid] = useState<TileItem[][]>(generateGrid(board));

  const beginGame = ["player", "computer", "over"].includes(gameState);

  const handleComputerTurn = useCallback(() => {
    setTimeout(() => {
      let futureShipsHitByComputer = computer.shipsHit;

      const coordinatesHistory = computer.attackHistory.map(
        (attack) => attack.coordinate
      );

      const AIDecision: AIDecision = huntTargetMinParity(
        player.shipList,
        computer.targetCoordinates,
        coordinatesHistory,
        board
      );

      if (AIDecision.targetCoordinateToRemove)
        dispatch(
          removeFromComputerTargetCoordinates(
            AIDecision.targetCoordinateToRemove
          )
        );

      if (AIDecision.targetCoordinatesToAdd.length > 0)
        dispatch(
          addToComputerTargetCoordinates(AIDecision.targetCoordinatesToAdd)
        );

      const row = AIDecision.guessCoordinate.row;
      const column = AIDecision.guessCoordinate.column;

      if (AIDecision.hitShipIndex > -1) {
        const hitShip = cloneShip(player.shipList[AIDecision.hitShipIndex]);

        hitShip.partsBombed = updatePartsBombed(
          hitShip,
          AIDecision.guessCoordinate
        );

        let newPlayerShipList: Ship[];

        if (allShipPartsBombed(hitShip.partsBombed)) {
          newPlayerShipList = player.shipList.map((ship) => {
            if (ship.name === hitShip.name) return { ...hitShip, isSunk: true };
            return cloneShip(ship);
          });

          dispatch(addShipsHitByComputer());
          futureShipsHitByComputer += 1;

          dispatch(updateDashboardMessage(`Computer sunk ${hitShip.name}`));
        } else {
          newPlayerShipList = player.shipList.map((ship) => {
            if (ship.name === hitShip.name) return { ...hitShip };
            return cloneShip(ship);
          });

          dispatch(
            updateDashboardMessage(
              `Computer hit at coordinate ${toAlphabet(column)}${row}`
            )
          );
        }

        dispatch(updatePlayerShipList(newPlayerShipList));
      } else {
        dispatch(
          updateDashboardMessage(
            `Computer miss at coordinate ${toAlphabet(column)}${row}`
          )
        );
      }

      const attack: Attack = {
        coordinate: { ...AIDecision.guessCoordinate },
        outcome: AIDecision.hitShipIndex > -1 ? "hit" : "miss",
      };

      dispatch(updateAttacksByComputer(attack));

      if (futureShipsHitByComputer === SHIPS.length) {
        dispatch(setWinner("computer"));
      } else {
        dispatch(switchTurn());
      }
    }, 500);
  }, [
    computer.attackHistory,
    computer.targetCoordinates,
    dispatch,
    player.shipList,
    computer.shipsHit,
  ]);

  useEffect(() => {
    let newGrid = generateGrid(board);

    if (player.shipList.length > 0)
      newGrid = updateGridWithShips(newGrid, player.shipList);

    if (player.selectedShip) {
      if (player.selectedShip.coordinates.length > 0) {
        const startCoordinate = player.selectedShip.coordinates[0];

        const validCoordinates = generateValidShipCoordinate(
          startCoordinate,
          player.selectedShip.length,
          player.selectedShip.orientation,
          board
        );

        let tileState: TileState = "awaiting";
        if (
          !isValidShipPlacement(
            player.shipList,
            player.selectedShip.length,
            validCoordinates
          )
        ) {
          tileState = "invalid";
          setCanPlaceSelectedShip(false);
        } else {
          setCanPlaceSelectedShip(true);
        }

        newGrid = updateGrid(newGrid, validCoordinates, tileState);
      }
    }

    if (gameState === "computer") {
      /**
       * when timeout just started, computer board component re-renders
       * with updated game state of computer where user cannot make a move.
       * Once 1 seconds has passed, computer makes a move and updates game state
       * to player again
       */
      handleComputerTurn();
    }

    if (computer.attackHistory.length > 0)
      newGrid = updateGridWithAttacks(newGrid, computer.attackHistory);

    setGrid(newGrid);
  }, [
    computer.attackHistory,
    computer.targetCoordinates,
    dispatch,
    gameState,
    handleComputerTurn,
    player.shipList,
    player.selectedShip,
    computer.shipsHit,
  ]);

  return (
    <div>
      <Banner title="Your Fleet" color="dark-grey" />

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
              row.map((column, columnIndex) => (
                <Tile
                  key={`${rowIndex}-${columnIndex}`}
                  coordinate={column.coordinate}
                  state={column.state}
                  tileMode={gameState === "placement" ? "placement" : "static"}
                  canPlaceSelectedShip={canPlaceSelectedShip}
                />
              ))
            )}
          </div>
        </div>

        {player.isWin && <div className={style.overlay}></div>}
        {player.isWin && <div className={style.winner}>🎉 You Won 🎉</div>}
      </div>

      {beginGame && <Shipyard ships={player.shipList} />}
    </div>
  );
};

export default PlayerBoard;
