import { Attack } from "./Attack";
import Coordinate from "./Coordinate";
import { GameState } from "./GameState";
import Nullable from "./Nullable";
import { Ship } from "./Ship";

interface Player {
  shipsLeftToPlace: Ship[];
  selectedShip: Nullable<Ship>;
  isWin: boolean;
  shipList: Ship[];
  attackHistory: Attack[];
  shipsHit: number;
}

interface Computer {
  isWin: boolean;
  shipList: Ship[];
  targetCoordinates: Coordinate[];
  attackHistory: Attack[];
  shipsHit: number;
}

export interface GameProfile {
  gameState: GameState;
  player: Player;
  computer: Computer;
  dashboardMessage: string;
}
