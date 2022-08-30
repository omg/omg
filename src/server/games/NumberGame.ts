import { LegacyBaseGame, StateObject } from "../objects/LegacyBaseGame";

export type NumberGameState = {
  epicNumber: StateObject<number>
}

export class NumberGame extends LegacyBaseGame {
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