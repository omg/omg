import { Game } from "../Game";
import { Lobby, LobbyAddResult, LobbyRemoveResult } from "./Lobby";
import { Player } from "@server/games/classes/entities/Player";
import { GameDirectory } from "@server/games/directory/GameDirectory";
import { GameCode } from "@shared/games/directory/GameDirectory";
import io from "@server/index";

// could be a class that demonstrates idle - so other classes call super() on this

// how do we construct a gamelobby from a Room object? let's just not worry about that for now and choose a random game
// export type GameLobbySettings = {
//   gameSettings?: GameSettings;
//   gameCode?: GameCode;
// }

// instanceof
export abstract class GameLobby extends Lobby { // made this abstract so it can't be instantiated!
  // gameSettings: GameSettings;

  inProgress: boolean;
  gameCode: GameCode;
  game?: Game;

  constructor(gameCode: GameCode) {
    super();

    this.inProgress = false;
    this.gameCode = gameCode;

    // doesn't make sense to store the game code in game settings, right?
    // wtf even is game settings?

    // lobbies should store settings they need in something like LobbySettings
    // some games have settings that may override the lobby settings - such as min/max players

    // rooms 

    // this.gameSettings = // TODO
    // anything else to do here?
  }

  public getLobbyInfo() {
    return {
      // gameSettings: this.gameSettings,
      // send the game?
      inProgress: this.inProgress,
      gameCode: this.gameCode,

      ...super.getLobbyInfo()
    }
  }

  // CEX, FFS, FS

  // should this be abstract and defined by the handler? god knows
  // abstract startGame(): StartResult;
  // abstract endGame(): void;

  public addPlayer(player: Player): LobbyAddResult {
    // do i have to do more here? should i just delete this method?
    return super.addPlayer(player);
  }

  public removePlayer(player: Player): LobbyRemoveResult {
    let superResult = super.removePlayer(player);
    if (superResult != LobbyRemoveResult.OK) return superResult;

    // tell the game that the player left
    if (this.inProgress) this.game.playerLeft(player);

    return LobbyRemoveResult.OK;
  }

  cleanup() {
    // do more here with cleaning up the game and such if it's in progress (i guess)
    super.cleanup();
  }

  // TODO games won't continue if a game has failed to start
  // TODO teams need to be reset if the game has already modified them
  startGame(): StartResult {
    if (this.inProgress) return StartResult.GAME_IN_PROGRESS;
    // if (!this.gameSettings) return StartResult.MISSING_SETTINGS;
    // attempting to start
    try {
      this.inProgress = true;
      console.log("Lobby " + this.ID + " - game started: " + GameDirectory[this.gameCode].name + ".");
      
      io.to(`${this.ID}:start`).emit(); // doesn't need info?
      this.game = new GameDirectory[this.gameCode].Game(this);
      // this.game = new this.gameCode.Game(this);
      // Can't know if the game wants to stop the startup!
    } catch (err) {
      this.inProgress = false;
      io.to(`${this.ID}:end`).emit();
      console.log(GameDirectory[this.gameCode].name + " errored on startup - " + err);
      if (this.game) {
        try {
          this.game.cleanup();
        } catch (err) {
          console.log(GameDirectory[this.gameCode].name + " errored on cleanup - " + err);
        }
        delete this.game;
      }

    }
  }

  endGame(): EndResult {
    throw new Error("Method not implemented.");
  }

  // getCommands(): Command[];
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