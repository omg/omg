import { DummyGame } from "./games/DummyGame"
import { Game } from "./objects/Game";
import { Team } from "./objects/Team";

export type DirectoryInformation = {
  name: string;
  game: typeof Game;

  minPlayers: number;
  getDefaultTeams(): Team[];
}

export type GameCode = typeof GameDirectory[keyof typeof GameDirectory];
export const GameDirectory: {[name: string]: DirectoryInformation} = {

  DummyGame: {
    name: "Dummy Game",
    game: DummyGame,
    
    minPlayers: 2,
    getDefaultTeams() {
      return [];
    },
  },

} as const;
