import style from "./styles.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  updateDashboardMessage,
  startGame,
} from "../../store/reducers/GameProfileSlice";
import Border from "../Border";
import PlayerBoard from "../Board/PlayerBoard";
import SidePanel from "../SidePanel";
import WithHeader from "../WithHeader";
import Wrapper from "../Wrapper";
import Dashboard from "../Dashboard";
import { useEffect } from "react";

const PlaceShip: React.FC = () => {
  const { player } = useAppSelector((state) => state.gameProfile);

  const dispatch = useAppDispatch();

  const canStartGame = player.shipsLeftToPlace.length === 0;

  useEffect(() => {
    if (player.shipsLeftToPlace.length !== 0)
      dispatch(
        updateDashboardMessage(
          "Select a ship to place in your fleet from ship panel"
        )
      );

    if (player.selectedShip)
      dispatch(
        updateDashboardMessage(
          "Place the selected ship by clicking on a tile in your fleet"
        )
      );
  }, [dispatch, player.shipsLeftToPlace.length, player.selectedShip]);

  return (
    <WithHeader width="small">
      <Wrapper>
        {!canStartGame && <SidePanel />}
        {!canStartGame && <Border />}
        <PlayerBoard />
      </Wrapper>
      {canStartGame && (
        <button className={style.button} onClick={() => dispatch(startGame())}>
          Start Game
        </button>
      )}
      {!canStartGame && <Dashboard />}
    </WithHeader>
  );
};

export default PlaceShip;
