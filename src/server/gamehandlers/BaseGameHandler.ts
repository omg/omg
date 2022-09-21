import { GameSettings } from "../objects/GameSettings";

// could be a class that demonstrates idle - so other classes call super() on this

export interface BaseGameHandler {
  gameSettings: GameSettings;
  inProgress: boolean;

  startGame(): StartResult;
  // getCommands(): Command[];
  // scoreboardRequestEvent() from Crashgrid
  endGame(): void; // Should maybe make an event?
  getStatus(): string;
}

export enum StartResult {
  OK,
  GAME_REFUSED,
  GAME_ERROR,
  GAME_IN_PROGRESS,
  MISSING_SETTINGS,
  MISSING_GAME,
  GAMEHANDLER_REFUSED,
}

export enum EndResult {
  OK,
  GAME_NOT_RUNNING,
  GAMEHANDLER_REFUSED
}