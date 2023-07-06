import { TeamSettings } from "@shared/teams/TeamTypes";
import { Player } from "./Player";

export type PlayerInfo = {
  player: Player;
  nickname: string;
  color: number;
  grayed: boolean;
  prefix: string;
}

export type Team = TeamSettings & {
  players: number;
  queue: number;
}

export class PlayerContainer {
  playerInfo: PlayerInfo[];
  teams: Team[];

  constructor(playerInfo: PlayerInfo[], teams: Team[]) {
    this.playerInfo = playerInfo;
    this.teams = teams;
  }

  get length(): number {
    return this.playerInfo.length;
  }

  get players(): Player[] {
    return this.playerInfo.map(playerInfo => playerInfo.player);
  }

  hasPlayer(player: Player): boolean {
    // todo check this
    return this.playerInfo.some(playerInfo => playerInfo.player === player);
  }

  addPlayer(player: Player): void {
    this.playerInfo.push({
      player,
      nickname: null,
      color: null,
      grayed: false,
      prefix: null
    });
  }

  removePlayer(player: Player): void {
    let index = this.playerInfo.findIndex(playerInfo => playerInfo.player === player);
    if (index === -1) return;

    this.playerInfo.splice(index, 1);
  }
}