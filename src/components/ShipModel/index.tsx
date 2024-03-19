import { Orientation, ShipLength } from "../../type/Ship";
import style from "./styles.module.css";

interface ShipLengthProps {
  length: ShipLength;
  orientation: Orientation;
}

const ShipModel: React.FC<ShipLengthProps> = ({ length, orientation }) => {
  return (
    <div
      className={`${style.model} ${
        orientation === "horizontal" ? style.horizontal : style.vertical
      }`}
    >
      {new Array(length).fill(null).map((_, index) => (
        <div key={index} className={style.unit}></div>
      ))}
    </div>
  );
};

export default ShipModel;
