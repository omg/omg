import { Game } from "../Game";
import { GameSettings } from "../../../../../old/GameSettings";
import { Lobby, LobbyAddResult } from "./Lobby";
import { PlayerContainer } from "../../../objects/PlayerContainer";
import { Player } from "server/games/classes/entities/Player";
import { GameCode } from "server/GameDirectory";

// could be a class that demonstrates idle - so other classes call super() on this

// how do we construct a gamelobby from a Room object? let's just not worry about that for now and choose a random game
// export type GameLobbySettings = {
//   gameSettings?: GameSettings;
//   gameCode?: GameCode;
// }

// instanceof
export abstract class GameLobby extends Lobby { // made this abstract so it can't be instantiated!
  gameSettings: GameSettings;

  inProgress: boolean;
  game?: Game;

  constructor() {
    super();

    this.inProgress = false;

    // doesn't make sense to store the game code in game settings, right?
    // wtf even is game settings?

    // lobbies should store settings they need in something like LobbySettings
    // some games have settings that may override the lobby settings - such as min/max players

    // rooms 

    this.gameSettings = // TODO
    // anything else to do here?
  }

  public getLobbyInfo() {
    return {
      gameSettings: this.gameSettings,
      inProgress: this.inProgress,

      ...super.getLobbyInfo()
    }
  }

  // CEX, FFS, FS

  abstract startGame(): StartResult;
  abstract endGame(): void;

  public addPlayer(player: Player): LobbyAddResult {
    // do i have to do more here? should i just delete this method?
    return super.addPlayer(player);
  }

  cleanup() {
    // do more here with cleaning up the game and such if it's in progress (i guess)
    super.cleanup();
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