import style from "./styles.module.css";
import rotateIcon from "../../icons/rotate.svg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  rotateSelectedShip,
  setSelectedShip,
  updateGameState,
} from "../../store/reducers/GameProfileSlice";
import { Orientation, ShipLength, ShipName } from "../../type/Ship";
import ShipModel from "../ShipModel";

interface ShipContainerProps {
  name: ShipName;
  length: ShipLength;
  orientation: Orientation;
  isSelected: boolean;
}

const ShipContainer: React.FC<ShipContainerProps> = ({
  name,
  length,
  orientation,
  isSelected,
}) => {
  const { player } = useAppSelector((state) => state.gameProfile);
  const dispatch = useAppDispatch();

  /**
   * updates the selectedShipToPlace state if Ship object is found
   * from a list of Ships based on the ship name
   */
  function selectShipContainer(shipName: ShipName): void {
    const ship = player.shipsLeftToPlace.find((ship) => ship.name === shipName);

    if (ship) {
      dispatch(setSelectedShip(ship));
      dispatch(updateGameState("placement"));
    }
  }

  return (
    <div
      className={style.shipContainer}
      onClick={() => selectShipContainer(name)}
    >
      <div className={style.wrapper}>
        <h3 className={isSelected ? style.highlight : ""}>{name}</h3>
        {isSelected && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              dispatch(rotateSelectedShip());
            }}
          >
            <img src={rotateIcon} alt="" />
          </button>
        )}
      </div>

      <ShipModel length={length} orientation={orientation} />
    </div>
  );
};

export default ShipContainer;
