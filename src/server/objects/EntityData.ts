import { Player } from "../entities/Player";
import { PlayerQueueResult, Team } from "../entities/Team";

export type PlayerInfo = {
  player: Player;
  nickname: string;
  color: number;
  grayed: boolean;
  prefix: string;
}

// TODO rewrite this a little
// entitydata can't balance players by itself
// the basegamehandler needs to feed it data
// don't develop this class like it can do it by itself

export class EntityData {
  teams: Team[];
  teamBalancing: boolean;

  playerInfo: PlayerInfo[] = [];
  // default team?

  constructor(teams: Team[] = [], teamBalancing: boolean = true) {
    this.teams = teams;
    this.teamBalancing = teamBalancing;
    this.checkTeams();
  }

  private checkTeams() {
    // default team?
    if (this.teams.length === 0) this.teams.push(new Team("Players", false));
  }

  private isTeamFull(team: Team) {
    return team.players.length + 1 > team.balancePercentage * this.playerInfo.length;
    // return team.players.length >= team.balancePercentage * this.playerInfo.length;
  }

  getAvailableTeams() {
    return this.teams.filter(team => !this.isTeamFull(team));
  }

  getNextAvailableTeam() {
    let availableTeams = this.getAvailableTeams();
    if (availableTeams.length === 0) return null;
    // get a random team
    return availableTeams[Math.floor(Math.random() * availableTeams.length)];
  }

  getTeamlessPlayers() {
    return this.playerInfo.filter(playerInfo => !this.getTeamOf(playerInfo.player));
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

  forcePlayersIntoTeams() {
    // get all players who aren't in a team yet
    let playersWithoutTeam = this.getTeamlessPlayers();

    // put all players into the next available team
    for (let playerInfo of playersWithoutTeam) {
      let team = this.getNextAvailableTeam();
      if (!team) break;
      team.players.push(playerInfo.player);
    }

    // watch the team queues - when a player is placed in a team, queues need to be updated

  }

  addPlayer(player: Player) {
    this.playerInfo.push({
      player,
      nickname: null,
      color: null,
      grayed: false,
      prefix: null
    });
  }

  removePlayer(player: Player) {
    let index = this.playerInfo.findIndex(playerInfo => playerInfo.player === player);
    if (index > -1) this.playerInfo.splice(index, 1);

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