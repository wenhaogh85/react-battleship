import style from "./styles.module.css";
import Coordinate from "../../type/Coordinate";
import { TileMode, TileState } from "../../type/TileItem";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { Ship } from "../../type/Ship";
import {
  setSelectedShip,
  confirmShipPlacement,
} from "../../store/reducers/GameProfileSlice";
import { generateShipCoordinate } from "../../utility/coordinate";

interface TileProps {
  coordinate: Coordinate;
  state: TileState;
  tileMode: TileMode;
  canPlaceSelectedShip?: boolean;
  handlePlayerTurn?(playerCoordinate: Coordinate): void;
}

const Tile: React.FC<TileProps> = ({
  coordinate,
  state,
  tileMode,
  canPlaceSelectedShip,
  handlePlayerTurn,
}) => {
  const { player } = useAppSelector((state) => state.gameProfile);
  const dispatch = useAppDispatch();

  function mapStateToCssClass(state: TileState): string {
    switch (state) {
      case "empty":
        return style.empty;
      case "invalid":
        return style.invalid;
      case "awaiting":
        return style.awaiting;
      case "ship":
        return style.ship;
      case "hit":
        return style.hit;
      case "miss":
        return style.miss;
      default:
        return style.empty;
    }
  }

  const staticTile: JSX.Element = (
    <div className={`${style.tile} ${mapStateToCssClass(state)}`} />
  );

  const placementTile: JSX.Element = (
    <div
      className={`${style.tile} ${mapStateToCssClass(state)} ${style.placing}`}
      onMouseOver={() => {
        if (player.selectedShip) {
          const ship: Ship = {
            ...player.selectedShip,
            coordinates: [{ ...coordinate }],
          };

          dispatch(setSelectedShip(ship));
        }
      }}
      onMouseOut={() => {
        if (player.selectedShip) {
          const ship: Ship = {
            ...player.selectedShip,
            coordinates: [],
          };

          dispatch(setSelectedShip(ship));
        }
      }}
      onClick={() => {
        if (player.selectedShip && canPlaceSelectedShip) {
          const startCoordinate = player.selectedShip.coordinates[0];
          const shipLength = player.selectedShip.length;
          const shipOrientation = player.selectedShip.orientation;

          const ship: Ship = {
            ...player.selectedShip,
            coordinates: generateShipCoordinate(
              startCoordinate,
              shipLength,
              shipOrientation
            ),
          };

          dispatch(confirmShipPlacement(ship));
        }
      }}
    />
  );

  const gameTile = (
    <div
      className={`${style.tile} ${mapStateToCssClass(state)} ${style.game}`}
      onClick={() => {
        if (handlePlayerTurn) {
          handlePlayerTurn(coordinate);
        }
      }}
    />
  );

  switch (tileMode) {
    case "static":
      return staticTile;
    case "placement":
      return placementTile;
    case "game":
      return gameTile;
    default:
      return staticTile;
  }
};

export default Tile;
