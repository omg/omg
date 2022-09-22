import { Entity } from "./Entity";
import { Player } from "./Player";

export class Team implements Entity {
  name: string;
  canTeamChat: boolean;
  hiddenPlayers: boolean;
  balancePercentage: number;
  color: number;

  players: Player[];
  queue: Player[];

  constructor(name: string, canTeamChat: boolean, hiddenPlayers: boolean = false, balancePercentage: number = 1, color: number = 0x2afa23) {
    this.name = name;
    this.canTeamChat = canTeamChat;
    this.hiddenPlayers = hiddenPlayers;
    this.balancePercentage = balancePercentage;
    this.color = color;

    this.players = [];
    this.queue = [];
  }

  getPlayers(): Player[] {
    return this.players;
  }

  hasPlayer(player: Player) {
    return this.players.includes(player);
  }

  getJSON() {
    return {
      name: this.name,
      color: this.color,
      players: this.hiddenPlayers ? -1 : this.players.length,
      queue: this.hiddenPlayers ? -1 : this.queue.length
    }
  }
}