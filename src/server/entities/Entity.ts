import { Player } from "./Player";

export interface Entity {
  name: string;
  color: number;

  getPlayers(): Player[];
}