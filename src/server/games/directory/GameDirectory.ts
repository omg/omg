import { DummyGame } from "../DummyGame";
import { Game } from "../classes/Game";


const DIRECTORY = {
  ["DummyGame"]: {
    Game: DummyGame,
    name: "Dummy Game",

    minPlayers: 2,
    getDefaultTeams() { // should this be here?
      return [];
    }
  },
} as const;

export type DirectoryGame = {
  Game: typeof Game;
  name: string;
};

export type DirectoryInformation = { [key in keyof typeof DIRECTORY]: DirectoryGame };
export const GameDirectory: DirectoryInformation = DIRECTORY;

// let dg: DummyGame = new GameDirectory.DummyGame.game();