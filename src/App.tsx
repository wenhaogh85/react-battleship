import "./App.css";
import Game from "./components/Game";
import PlaceShip from "./components/PlaceShip";
import { useAppSelector } from "./store/hooks";

function App() {
  const { gameState } = useAppSelector((state) => state.gameProfile);

  const beginGame = ["player", "computer", "over"].includes(gameState);

  return <div className="App">{beginGame ? <Game /> : <PlaceShip />}</div>;
}

export default App;
