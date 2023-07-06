// just do the Room getJSON() method instead

import { Player } from "../games/classes/entities/Player";
import { GameInfo } from "./GameInfo";

export type RoomInfo = {
  players: Player[];
  gameInfo: GameInfo;
}