import { DummyGame } from "./games/DummyGame"
import { Game } from "./objects/Game";
import { Player } from "./objects/Player";
import { Winnable } from "./objects/Winnable";

// need game name
// want gamesettings to be a thing sent to clients from somewhere rooms are viewed
// therefore the Game variable and "teamBalancing" is useless information
// how do we solve this separation problem?

export class Team implements Winnable {
  name: string;
  color: number;
  teamChat: boolean;
  players: Player[];

  
  // color
  // teamChat: boolean
  // 
  // private LanguageMod name;
  // private ChatColor teamColor;
  // private boolean teamChat;
  // private List<Player> players;
}

export type TeamInfo = {
  teamBalancing: boolean;

  teams: Team[];
}

export type DirectoryInformation = {
  game: typeof Game;

  minPlayers: number;
  
}

export type GameCode = typeof GameDirectory[keyof typeof GameDirectory];
export const GameDirectory: {[name: string]: DirectoryInformation} = {
  ["DummyGame"]: {
    game: DummyGame,

    minPlayers: 2
  },
} as const;