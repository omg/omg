import { BaseGame, GameState, StateObject } from "./game";

export type NumberGameState = {
  epicNumber: StateObject<number>
}

export class NumberGame extends BaseGame {
  gameCode = "NUM";
  gameName = "Number Game";

  gameState: NumberGameState;

  startGame() {
    this.gameState = {
      epicNumber: {
        visibleTo: this.lobby.players,
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