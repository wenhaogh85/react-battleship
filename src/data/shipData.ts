import { Ship } from "../type/Ship";

const SHIPS: Ship[] = [
  {
    name: "Carrier",
    length: 5,
    orientation: "horizontal",
    coordinates: [],
    partsBombed: [false, false, false, false, false],
    isSunk: false,
  },
  {
    name: "Battleship",
    length: 4,
    orientation: "horizontal",
    coordinates: [],
    partsBombed: [false, false, false, false],
    isSunk: false,
  },
  {
    name: "Cruiser",
    length: 3,
    orientation: "horizontal",
    coordinates: [],
    partsBombed: [false, false, false],
    isSunk: false,
  },
  {
    name: "Submarine",
    length: 3,
    orientation: "horizontal",
    coordinates: [],
    partsBombed: [false, false, false],
    isSunk: false,
  },
  {
    name: "Destroyer",
    length: 2,
    orientation: "horizontal",
    coordinates: [],
    partsBombed: [false, false],
    isSunk: false,
  },
];

export default SHIPS;
