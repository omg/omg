import { Player } from "../entities/Player";
import { Team } from "../entities/Team";

export class GameSettings {
  //game: typeof Game;
  // Game can be in the GameHandler - is not necessary to be in GameSettings
  // since the game doesn't care about this information - keep GameSettings
  // about variables the game may need which can be modified by the room

  // TODO let the game decide if the teams or minPlayers should be modifiable
  // TODO where do maxPlayers fit? gamesettings? room?
  // TODO spectators?
  
  minPlayers: number;
  teams: Team[];
  //mods: Mod[];
  //teamBalancing: boolean;
  //minPlayers: number;
  //map from Crashgrid

  private checkTeams() {
    if (this.teams.length === 0) this.teams.push(new Team("Players", false));
  }

  constructor(minPlayers: number, teams: Team[]) {
    this.minPlayers = minPlayers;
    this.teams = teams;
    this.checkTeams();
  }

  getTeam(player: Player) {
    for (let team of this.teams) {
      if (team.hasPlayer(player)) return team;
    }
    return null;
  }
}