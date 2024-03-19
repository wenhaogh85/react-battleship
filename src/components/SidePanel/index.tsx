import { useAppSelector } from "../../store/hooks";
import Banner from "../Banner";
import ShipContainer from "../ShipContainer";
import style from "./styles.module.css";

const SidePanel: React.FC = () => {
  const { player } = useAppSelector((state) => state.gameProfile);

  return (
    <div className={style.sidePanel}>
      <Banner title={"Ship Panel"} color={"dark-grey"} />

      {player.shipsLeftToPlace.map(({ name, length, orientation }) => {
        const isSelected = name === player.selectedShip?.name;

        return (
          <ShipContainer
            key={name}
            name={name}
            length={length}
            orientation={orientation}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
};

export default SidePanel;
