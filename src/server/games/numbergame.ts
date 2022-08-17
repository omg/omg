import { BaseGame, StateObject } from "../game";
import { GameCode } from "../GameDirectory";

export type NumberGameState = {
  epicNumber: StateObject<number>
}

export class NumberGame extends BaseGame {
  gameCode = GameCode.NUMBER_GAME;

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