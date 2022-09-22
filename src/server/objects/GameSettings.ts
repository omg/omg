import { GameCode } from "../GameDirectory";

// could upgrade to a class later - but right now no special methods are required
export type GameSettings = {
  // TODO let the game decide if the teams or minPlayers should be modifiable
  // TODO where do maxPlayers fit? gamesettings? room?
  // one of the prior AND lobby?

  gameCode: GameCode;
  
  minPlayers: number;

  //teams: Team[]; ?? TODO Where do teams go????

  //mods: Mod[];
  //gameOptions: any; ?? TODO
  //teamBalancing: boolean;
  //minPlayers: number;
  //map from Crashgrid
}