// just do the Room getJSON() method instead

import { GameInfo } from "./GameInfo";
import { Player } from "./Player";

export type RoomInfo = {
  players: Player[];
  gameInfo: GameInfo;
}