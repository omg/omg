import { BaseGame, StateObject } from "../objects/BaseGame";

export type NumberGameState = {
  epicNumber: StateObject<number>
}

export class NumberGame extends BaseGame {
  gameState: NumberGameState;

  startGame() {
    this.gameState = {
      epicNumber: {
        visibleTo: this.room.players,
        value: Math.ceil(Math.random() * 10)
      }
    }
  }
}