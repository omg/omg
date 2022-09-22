import { BaseGame } from "../games/BaseGame";
import { GameSettings } from "../objects/GameSettings";
import { Lobby } from "../objects/Lobby";
import { EntityData } from "../objects/EntityData";

// could be a class that demonstrates idle - so other classes call super() on this

export class BaseGameHandler extends Lobby {
  lobbyType: string = "baselobby";

  gameSettings: GameSettings;
  teamSettings: EntityData; // this is teams + "playerinfo"

  inProgress: boolean = false;
  
  game?: BaseGame;

  constructor() {
    super();
  }

  getRoomInfo() {
    return {
      ID: this.ID,
      players: this.players,

      gameSettings: this.gameSettings,
      inProgress: this.inProgress
    }
  }

  // TODO: need to know when the teams change so this can be updated in the GameHandler as teams are part of the GameHandler - not the BaseGame

  startGame(): StartResult {
    return StartResult.GAMEHANDLER_REFUSED;
  };

  // getCommands(): Command[];
  // scoreboardRequestEvent() from Crashgrid
  endGame(): void {} // Should maybe make an event?

  getStatus(): string {
    return "Lobby is idle.";
  }
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