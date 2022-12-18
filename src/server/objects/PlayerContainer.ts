import { WeightType } from "shared/teams/TeamTypes";
import { Player } from "server/entities/Player";
import { DEFAULT_TEAM_SETTINGS, Team } from "server/entities/Team";

export type PlayerInfo = {
  player: Player;
  nickname: string;
  color: number;
  grayed: boolean;
  prefix: string;
}

export enum PlayerQueueResult {
  ALREADY_IN_QUEUE,
  ALREADY_ON_TEAM,
  ADDED_TO_QUEUE,
  ADDED_TO_TEAM
}

export class PlayerContainer {
  teams: Team[];
  teamBalancing: boolean;
  respectGroupStick: boolean = true;

  playerInfo: PlayerInfo[] = [];

  constructor(teams: Team[] = [], teamBalancing: boolean = true) {
    this.teams = teams;
    this.teamBalancing = teamBalancing;

    // TODO if teams are given, playerinfo probably needs to be populated
    // or teams should just be stripped of players

    this.checkTeams();
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

  private checkTeams(): void {
    if (this.teams.length === 0) this.teams.push(new Team(DEFAULT_TEAM_SETTINGS));
  }

  private getCombinedWeight(): number {
    // combine all team weights from teams with weight type weight
    return this.teams.reduce((total, team) => {
      if (team.balanceType === WeightType.WEIGHT) return total + team.balanceWeight;
      return total;
    }, 0);
  }

  private isTeamFull(team: Team): boolean {
    switch (team.balanceType) {
      case WeightType.PERCENTAGE:
        return team.players.length + 1 > team.balanceWeight * this.playerInfo.length;
      case WeightType.WEIGHT:
        let combinedWeight = this.getCombinedWeight();
        if (combinedWeight === 0) return false;
        return team.players.length + 1 > (team.balanceWeight / combinedWeight) * this.playerInfo.length;
      default:
        return false;
    }
  }

  getAvailableTeams(): Team[] {
    return this.teams.filter(team => !this.isTeamFull(team));
  }

  getNextAvailableTeam(): Team {
    let availableTeams = this.getAvailableTeams();
    if (availableTeams.length === 0) return null;
    // get a random team
    return availableTeams[Math.floor(Math.random() * availableTeams.length)];
  }

  getTeamlessPlayers(): Player[] {
    return this.playerInfo.map(playerInfo => playerInfo.player).filter(player => !this.getTeamOf(player));
  }

  addPlayerToTeam(player: Player, newTeam: Team): PlayerQueueResult {
    if (newTeam.isInQueue(player)) return PlayerQueueResult.ALREADY_IN_QUEUE;
    if (newTeam.hasPlayer(player)) return PlayerQueueResult.ALREADY_ON_TEAM;
    
    if (this.isTeamFull(newTeam)) {
      // team is full, add to queue
      newTeam.unsafeAddToQueue(player);
      return PlayerQueueResult.ADDED_TO_QUEUE;
    }

    // team is not full, add to team
    let oldTeam = this.getTeamOf(player);
    newTeam.unsafeAddPlayer(player);

    if (oldTeam) {
      oldTeam.unsafeRemovePlayer(player);

      // if the old team has a player in queue, add them to the team
      let playerToMove = oldTeam.queue.shift();
      if (playerToMove) {
        oldTeam.unsafeAddPlayer(playerToMove);
      }
    }

    // TODO the old player needs to be removed from their current team and the process needs to be repeated for that team

    // needs to return players who were moved
    return PlayerQueueResult.ADDED_TO_TEAM;
  }

  forcePlayersIntoTeams(): void {
    // get all players who aren't in a team yet
    let playersWithoutTeam = this.getTeamlessPlayers();

    // put all players into the next available team
    for (let player of playersWithoutTeam) {
      let team = this.getNextAvailableTeam();
      if (!team) break;
      team.players.push(player);
    }

    // watch the team queues - when a player is placed in a team, queues need to be updated

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

    // remove player from team
    for (let team of this.teams) {
      if (team.hasPlayer(player)) {
        team.players.splice(team.players.indexOf(player), 1);
        break;
      }
    }
  }

  getTeamOf(player: Player): Team {
    for (let team of this.teams) {
      if (team.hasPlayer(player)) return team;
    }
    return null;
  }

  getStrippedTeams() {
    // is this even required if we're just going to emit it anyway?
    return this.teams.map(team => team.getJSON());
  }

  getJSON() {
    return {
      teams: this.getStrippedTeams(),
      playerInfo: this.playerInfo
    }
  }
}