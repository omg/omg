import { Entity } from "./Entity";
import { Player } from "./Player";

export class Team implements Entity {
  name: string;
  canTeamChat: boolean;
  color: number;
  players: Player[];

  constructor(name: string, canTeamChat: boolean, color: number = 0x2afa23) {
    this.name = name;
    this.canTeamChat = canTeamChat;
    this.color = color;
    this.players = [];
  }

  getPlayers(): Player[] {
    return this.players;
  }
}