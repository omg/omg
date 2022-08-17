import { GameCode } from "../GameDirectory";
import { BaseGame, StateObject } from "../objects/BaseGame";

export type NumberGameState = {
  epicNumber: StateObject<number>
}

export class NumberGame extends BaseGame {
  gameCode = GameCode.NUMBER_GAME;

  gameState: NumberGameState;

  init() {
    // TODO
  }
}