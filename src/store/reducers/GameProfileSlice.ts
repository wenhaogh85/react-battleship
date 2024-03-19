import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import SHIPS from "../../data/shipData";
import { Attack } from "../../type/Attack";
import { GameState } from "../../type/GameState";
import { Ship } from "../../type/Ship";
import type { RootState } from "../store";
import { GameProfile } from "../../type/GameProfile";
import Coordinate from "../../type/Coordinate";
import { isSameCoordinate } from "../../utility/coordinate";
import { generateShips } from "../../utility/ship";
import { board } from "../../utility/grid";

const initialState: GameProfile = {
  gameState: "none",
  player: {
    shipsLeftToPlace: SHIPS,
    selectedShip: null,
    isWin: false,
    shipList: [],
    attackHistory: [],
    shipsHit: 0,
  },
  computer: {
    isWin: false,
    shipList: [],
    targetCoordinates: [],
    attackHistory: [],
    shipsHit: 0,
  },
  dashboardMessage: "",
};

export const gameProfileSlice = createSlice({
  name: "gameProfile",
  initialState,
  reducers: {
    setSelectedShip: (state, action: PayloadAction<Ship>) => {
      state.player.selectedShip = action.payload;
    },

    rotateSelectedShip: (state) => {
      if (state.player.selectedShip) {
        const currentOrientation = state.player.selectedShip.orientation;
        const newOrientation =
          currentOrientation === "horizontal" ? "vertical" : "horizontal";
        state.player.selectedShip.orientation = newOrientation;

        state.player.shipsLeftToPlace = state.player.shipsLeftToPlace.map(
          (ship) => {
            if (state.player.selectedShip) {
              if (ship.name === state.player.selectedShip.name) {
                ship.orientation = newOrientation;
                return ship;
              }
            }
            return ship;
          }
        );
      }
    },

    startGame: (state) => {
      state.player.shipList = state.player.shipList.sort(
        (ship1, ship2) => ship1.length - ship2.length
      );
      state.computer.shipList = generateShips(board).sort(
        (ship1, ship2) => ship1.length - ship2.length
      );
      state.gameState = "player";
      state.dashboardMessage = "Select a location to bomb in computer board";
    },

    confirmShipPlacement: (state, action: PayloadAction<Ship>) => {
      // adds selected ship to player ship list
      state.player.shipList = [...state.player.shipList, action.payload];

      // removes selected ship from ships left to place
      state.player.shipsLeftToPlace = state.player.shipsLeftToPlace.filter(
        (ship) => ship.name !== action.payload.name
      );

      // resets selected ship to default - null
      state.player.selectedShip = null;
      state.gameState = "none";
    },

    updateGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload;
    },

    updatePlayerShipList: (state, action: PayloadAction<Ship[]>) => {
      state.player.shipList = action.payload;
    },

    updateComputerShipList: (state, action: PayloadAction<Ship[]>) => {
      state.computer.shipList = action.payload;
    },

    updateAttacksByPlayer: (state, action: PayloadAction<Attack>) => {
      state.player.attackHistory = [
        ...state.player.attackHistory,
        action.payload,
      ];
    },

    addToComputerTargetCoordinates: (
      state,
      action: PayloadAction<Coordinate[]>
    ) => {
      state.computer.targetCoordinates = [
        ...state.computer.targetCoordinates,
        ...action.payload,
      ];
    },

    removeFromComputerTargetCoordinates: (
      state,
      action: PayloadAction<Coordinate>
    ) => {
      state.computer.targetCoordinates =
        state.computer.targetCoordinates.filter(
          (coordinate) => !isSameCoordinate(coordinate, action.payload)
        );
    },

    updateAttacksByComputer: (state, action: PayloadAction<Attack>) => {
      state.computer.attackHistory = [
        ...state.computer.attackHistory,
        action.payload,
      ];
    },

    addShipsHitByPlayer: (state) => {
      state.player.shipsHit += 1;
    },

    addShipsHitByComputer: (state) => {
      state.computer.shipsHit += 1;
    },

    updateDashboardMessage: (state, action: PayloadAction<string>) => {
      state.dashboardMessage = action.payload;
    },

    switchTurn: (state) => {
      state.gameState = state.gameState === "player" ? "computer" : "player";
    },

    setWinner: (state, action: PayloadAction<"player" | "computer">) => {
      if (action.payload === "player") state.player.isWin = true;
      if (action.payload === "computer") state.computer.isWin = true;
      state.gameState = "over";
    },

    newGame: (state) => {
      state.gameState = "none";

      state.player.shipsLeftToPlace = SHIPS;
      state.player.selectedShip = null;
      state.player.isWin = false;
      state.player.shipList = [];
      state.player.attackHistory = [];
      state.player.shipsHit = 0;

      state.computer.isWin = false;
      state.computer.shipList = [];
      state.computer.targetCoordinates = [];
      state.computer.attackHistory = [];
      state.computer.shipsHit = 0;

      state.dashboardMessage = "";
    },
  },
});

// defines actions that can be dispatched to game profile reducers
export const {
  setSelectedShip,
  rotateSelectedShip,
  startGame,
  confirmShipPlacement,
  updateGameState,
  updatePlayerShipList,
  updateComputerShipList,
  updateAttacksByPlayer,
  addToComputerTargetCoordinates,
  removeFromComputerTargetCoordinates,
  updateAttacksByComputer,
  addShipsHitByPlayer,
  addShipsHitByComputer,
  updateDashboardMessage,
  switchTurn,
  setWinner,
  newGame,
} = gameProfileSlice.actions;

// defines how other component can select game profile's attributes
export const selectGameProfile = (state: RootState) => state.gameProfile;

// exports game profile reducers to be used in other components
export default gameProfileSlice.reducer;
