import { DummyGame } from "./games/DummyGame"
import { NumberGame } from "./games/NumberGame"
import { BaseGame } from "./objects/BaseGame";

type GameSettings = {
  name: string;
  game: typeof BaseGame;

  minPlayers: number;
}

export enum GameCode {
  DUMMY_GAME = "DG",
  NUMBER_GAME = "NG"
}

export const GameDirectory: {[index: string]: GameSettings} = {
  [GameCode.DUMMY_GAME]: {
    name: "Dummy Game",
    game: DummyGame,

    minPlayers: 1
  },

  [GameCode.NUMBER_GAME]: {
    name: "Number Game",
    game: NumberGame,
    
    minPlayers: 2
  }
}