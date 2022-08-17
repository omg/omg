import { GameCode } from "../GameDirectory";
import { BaseGame } from "../objects/BaseGame";

export type NumberGameState = {
  epicNumber?: number
}

export class NumberGame extends BaseGame {
  gameCode = GameCode.NUMBER_GAME;

  gameState: NumberGameState;

  init() {
    // TODO
  }
}