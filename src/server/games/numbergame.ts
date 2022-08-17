import { GameCode } from "../GameDirectory";
import { BaseGame, StateObject } from "../objects/BaseGame";

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