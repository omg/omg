import { BaseGameHandler, StartResult } from "./BaseGameHandler";
import { GameSettings } from "../objects/GameSettings";

// TODO: dedicated, idle, and arcade-type rooms

export class DedicatedGameHandler implements BaseGameHandler {
  gameSettings: GameSettings;
  inProgress: boolean = false;

  constructor(gameSettings: GameSettings) {
    this.gameSettings = gameSettings;

    // TODO is there more to do?
  }

  startGame(): StartResult {
    throw new Error("Method not implemented.");
  }

  minigameEnded(): void {
    throw new Error("Method not implemented.");
  }

  getStatus(): string {
    throw new Error("Method not implemented.");
  }
}