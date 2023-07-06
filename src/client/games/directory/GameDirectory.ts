import { DummyGame } from "../DummyGame";
import { Game } from "../classes/Game";
import { BaseDirectoryGame, BaseGameDirectory } from "@shared/games/directory/GameDirectory";

const DIRECTORY: DirectoryInformation = BaseGameDirectory;

//
DIRECTORY.DummyGame.Game = DummyGame;
//

export type DirectoryGame = BaseDirectoryGame & {
  Game?: typeof Game;
};

export type DirectoryInformation = { [key in keyof typeof BaseGameDirectory]: DirectoryGame };
// turn the DIRECTORY into an enum automatically using the keys of the object
export const GameDirectory: DirectoryInformation = DIRECTORY;