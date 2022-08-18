import { BaseGame } from "../objects/BaseGame";

export type DummyGameState = {}

export class DummyGame extends BaseGame {
  gameState: DummyGameState;

  timer;

  startGame() {
    this.timer = setTimeout(() => {
      this.room.endGame();
    }, 5000);
  }

  cleanup() {
    clearTimeout(this.timer);
  }
}

/*
playerJoined?: (player: Player) => void;
  playerQuit?: (player: Player) => void;
  cleanup?: () => void;
  */