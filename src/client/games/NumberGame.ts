import { Game } from "./classes/Game";

export type NumberGameState = {
  epicNumber?: number
}

export class NumberGame extends Game {
  gameState: NumberGameState;

  init() {
    // TODO
  }
}