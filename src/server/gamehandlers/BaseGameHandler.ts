import { GameCode } from "../GameDirectory";
import { BaseGame } from "../games/BaseGame";
import { GameSettings } from "../objects/GameSettings";
import { Room } from "../objects/Room";

// could be a class that demonstrates idle - so other classes call super() on this

export class BaseGameHandler extends Room {
  gameSettings: GameSettings;
  inProgress: boolean = false;
  
  gameCode: GameCode;
  game?: BaseGame;

  constructor() {
    super();
  }

  getRoomInfo() {
    return {
      type: "game",

      ID: this.ID,
      players: this.players,

      gameCode: this.gameCode
    }
  }

  // TODO: need to know when the teams change so this can be updated in the GameHandler as teams are part of the GameHandler - not the BaseGame

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