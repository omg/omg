import { BaseGame } from "../games/BaseGame";

export type GameSettings = {
  //game: typeof Game;
  // Game can be in the GameHandler - is not necessary to be in GameSettings
  // since the game doesn't care about this information - keep GameSettings
  // about variables the game may need which can be modified by the room
  
  minPlayers: number;
  //mods: Mod[];
  //teamBalancing: boolean;
  //teams: Team[];
  //minPlayers: number;
  //map from Crashgrid
}