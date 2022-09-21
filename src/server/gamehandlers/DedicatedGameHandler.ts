import { BaseGameHandler, StartResult } from "./BaseGameHandler";
import { GameSettings } from "../objects/GameSettings";
import { createGameSettings, GameCode, GameDirectory } from "../GameDirectory";
import { BaseGame } from "../games/BaseGame";

// TODO: dedicated, idle, and arcade-type rooms

export class DedicatedGameHandler implements BaseGameHandler {
  gameSettings: GameSettings;
  inProgress: boolean = false;

  gameCode: GameCode;
  game?: BaseGame;

  constructor(gameCode: GameCode) {
    this.gameCode = gameCode;
    this.gameSettings = createGameSettings(GameDirectory[gameCode])

    // TODO is there more to do?
  }

  // TODO games won't continue if a game has failed to start
  // TODO teams need to be reset if the game has already modified them
  startGame(): StartResult {
    if (this.inProgress) return StartResult.GAME_IN_PROGRESS;
    if (!this.gameSettings) return StartResult.MISSING_SETTINGS;
    // attempting to start
    try {
      this.game = new GameDirectory[this.gameCode].game(this);
      // Can't know if the game wants to stop the startup!
    } catch (err) {
      console.log(this.gameCode + " errored on startup - " + err);
      if (this.game) {
        try {
          this.game.cleanup();
        } catch (err) {
          console.log(this.gameCode + " errored on cleanup - " + err);
        }
        delete this.game;
      }

    }
  }

  endGame(): void {
    throw new Error("Method not implemented.");
  }

  getStatus(): string {
    throw new Error("Method not implemented.");
  }
}