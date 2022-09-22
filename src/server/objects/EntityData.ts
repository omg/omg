import { Player } from "../entities/Player";
import { Team } from "../entities/Team";

export type PlayerInfo = {
  nickname: string;
  badgeName: string;
  color: number;
  dead: boolean;
  spectating: boolean;
  prefix: string;
}

// TODO rewrite this a little
// entitydata can't balance players by itself
// the basegamehandler needs to feed it data
// don't develop this class like it can do it by itself

export class EntityData {
  teams: Team[];
  teamBalancing: boolean;

  playerInfo: { [player: number]: PlayerInfo }
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

  getTeamOf(player: Player): Team {
    for (let team of this.teams) {
      if (team.hasPlayer(player)) return team;
    }
    return null;
  }

  getStrippedTeams() {
    let strippedTeams = [];
    for (let team of this.teams) strippedTeams.push(team.getJSON());
    return strippedTeams;
  }

  getJSON() {
    return {
      teams: this.getStrippedTeams(),
      playerInfo: this.playerInfo
    }
  }
}