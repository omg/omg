import { Entity } from "./Entity";
import { Player } from "./Player";

export enum AddResult {
  ALREADY_IN_QUEUE,
  ALREADY_ON_TEAM,
  ADDED_TO_QUEUE,
  ADDED_TO_TEAM
}

export type TeamSettings = {
  name: string;
  canTeamChat?: boolean;
  hiddenPlayers?: boolean;
  balancePercentage?: number;
  color?: number;
}

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

  unsafeAddPlayer(player: Player) {
    this.players.push(player);
  }

  unsafeRemovePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
    }
  }

  isInQueue(player: Player) {
    return this.queue.includes(player);
  }

  unsafeAddToQueue(player: Player) {
    this.queue.push(player);
  }

  unsafeRemoveFromQueue(player: Player) {
    let index = this.queue.indexOf(player);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
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