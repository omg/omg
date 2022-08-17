import { BaseGame } from "../game";
import { GameCode } from "../GameDirectory";

export type DummyGameState = {}

export class DummyGame extends BaseGame {
  gameCode = GameCode.DUMMY_GAME;

  gameState: DummyGameState;

  startGame() {
    
  }
}

/*
playerJoined?: (player: Player) => void;
  playerQuit?: (player: Player) => void;
  cleanup?: () => void;
  */