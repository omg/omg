import { BaseGame, StateObject } from "../game";

export type NumberGameState = {
  epicNumber: StateObject<number>
}

export class NumberGame extends BaseGame {
  gameName = "Number Game";

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

/*
playerJoined?: (player: Player) => void;
  playerQuit?: (player: Player) => void;
  cleanup?: () => void;
  */