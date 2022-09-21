import { DummyGame } from "./games/DummyGame"
import { BaseGame } from "./games/BaseGame";
import { Team } from "./entities/Team";
import { GameSettings } from "./objects/GameSettings";

const DIRECTORY = {
  
  DummyGame: {
    name: "Dummy Game",
    game: DummyGame,
    
    minPlayers: 2,
    getDefaultTeams() {
      return [];
    },
  },
  
} as const;

export type DirectoryInformation = {
  name: string;
  game: typeof BaseGame;

  minPlayers: number;
  getDefaultTeams(): Team[];
}

export function createGameSettings(game: DirectoryInformation) {
  return new GameSettings(game.minPlayers, game.getDefaultTeams());
}

export type GameCode = keyof typeof DIRECTORY;
export const GameDirectory: {[name: string]: DirectoryInformation} = DIRECTORY;