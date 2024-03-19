import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { newGame } from "../../store/reducers/GameProfileSlice";
import style from "./styles.module.css";

const Dashboard: React.FC = () => {
  const { gameState, dashboardMessage } = useAppSelector(
    (state) => state.gameProfile
  );

  const dispatch = useAppDispatch();

  const beginGame = ["player", "computer", "over"].includes(gameState);

  const canEnableButton = ["player", "over"].includes(gameState);

  function handleNewGame(): void {
    if (canEnableButton) dispatch(newGame());
  }

  return (
    <div className={style.dashboard}>
      <h2>{dashboardMessage}</h2>
      {beginGame && (
        <button
          className={`${!canEnableButton ? style.disabled : ""}`}
          onClick={handleNewGame}
        >
          New Game
        </button>
      )}
    </div>
  );
};

export default Dashboard;
