import { Entity } from "./Entity";
import { Player } from "./Player";

export class Team implements Entity {
  name: string;
  color: number;
  canTeamChat: boolean;
  players: Player[];

  getPlayers(): Player[] {
    return this.players;
  }
}