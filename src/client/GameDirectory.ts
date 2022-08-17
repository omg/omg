import { NumberGame } from "./games/NumberGame";
import { BaseGame } from "./objects/BaseGame";

type GameSettings = {
  name: string;
  game: typeof BaseGame;

  minPlayers: number;
}

export enum GameCode {
  NUMBER_GAME = "NG"
}

export const GameDirectory: {[index: string]: GameSettings} = {
  [GameCode.NUMBER_GAME]: {
    name: "Number Game",
    game: NumberGame,
    
    minPlayers: 2
  }
}