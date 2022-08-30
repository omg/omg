import { GameSettings } from "../objects/GameSettings";


export interface BaseGameHandler {
  gameSettings: GameSettings;
  inProgress: boolean;

  startGame(): StartResult;
  // getCommands(): Command[];
  // scoreboardRequestEvent() from Crashgrid
  minigameEnded(): void; // Should maybe make an event?
  getStatus(): string;
}

export enum StartResult {
  OK,
  GAME_REFUSED,
  GAME_ERROR,
  GAMEHANDLER_REFUSED,
  GAME_IN_PROGRESS,
  MISSING_SETTINGS
}