import style from "./styles.module.css";
import { Ship } from "../../type/Ship";
import { capitalize } from "../../utility/util";

interface ShipyardProps {
  ships: Ship[];
}

const Shipyard: React.FC<ShipyardProps> = ({ ships }) => {
  return (
    <div className={style.shipyard}>
      <h3>Ships</h3>
      <div className={style.fleet}>
        {ships.map(({ name, length, isSunk }) => (
          <p
            key={name}
            className={`${isSunk ? style.sunk : ""}`}
          >{`${capitalize(name)} (${length})`}</p>
        ))}
      </div>
    </div>
  );
};

export default Shipyard;
