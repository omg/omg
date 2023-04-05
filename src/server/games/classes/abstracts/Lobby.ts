import { randomUUID } from "crypto";
import { GameDirectory, GameCode } from "../GameDirectory";
import io from "../../..";
import { clearInterval } from "timers";
import { GameLobby, StartResult } from "./GameLobby";
import { Player } from "../entities/Player";
import { DedicatedGameHandler } from "../gamehandlers/DedicatedGameHandler";
import { PlayerContainer } from "../../../objects/PlayerContainer";
import EventEmitter = require("events");

// DedicatedGameHandler is an extension of BaseGameHandler that can run games
// Room is an extension of DedicatedGameHandler with a host and moderators and eventually more
// Lobbies inherently support chat - chat should go here
// If needed, there can be a toggle for chat in Lobby. But that's not needed for now.

export enum LobbyAddResult {
  OK,
  ALREADY_IN_LOBBY,
  LOBBY_FULL
}

export enum LobbyRemoveResult {
  OK,
  NOT_IN_LOBBY
}

/*

Lobbies support chat - chat should go here.
If needed, there can be a toggle for chat in Lobby. But that's not needed for now.

DedicatedGameHandler is an extension of GameLobby

*/

export abstract class Lobby {
  public ID: string;

  public playerContainer: PlayerContainer;
  public maxPlayers: number = 10; // idk where to put this. this is definitely part of lobby settings
  
  constructor() {
    // super();

    this.ID = randomUUID();
    this.playerContainer = new PlayerContainer();
  }

  getLobbyInfo() {
    return {
      ID: this.ID,
      //players: this.players,

      playerContainer: this.playerContainer
    }
  }

  // TODO some of these methods should be in BaseGameHandler
  // emit(player: Player) {
  //   return player.socket.emit('game:')
  // }

  addPlayer(player: Player): LobbyAddResult {
    // Check if the player is already in the lobby
    if (this.playerContainer.hasPlayer(player)) return LobbyAddResult.ALREADY_IN_LOBBY;
    
    // Add the player to the lobby
    this.playerContainer.addPlayer(player);
    // force player on team on the extending class after calling super() on THIS method.

    // Add the player to the EntityData
    // if the game is about to start - force them on a team - otherwise don't

    // Tell all players in the lobby that a player has joined
    player.socket.join(this.ID);
    player.socket.emit('lobby:connect', this.getLobbyInfo());
    player.socket.to(this.ID).emit(`${this.ID}:join`, player);

    // Emit to this object that a player has joined
    // this.emit('join', player);
    console.log("Player joined lobby " + this.ID + " - " + this.playerContainer.length + " in lobby"); // make a getter for length

    // get an onPlayerJoin method by extending an Emitter and have BaseGameHandler listen for it
    
    // This will go in game handlers
    // if (this.inProgress) {
    //   player.socket.emit(`${this.ID}:init`);
    //   if (this.game.playerJoined) {
    //     let data = this.game.playerJoined(player);
    //     this.startPlayer(player, data);
    //   }
    // }

    return LobbyAddResult.OK;
  }

  removePlayer(player: Player): LobbyRemoveResult {
    if (!this.playerContainer.hasPlayer(player)) return LobbyRemoveResult.NOT_IN_LOBBY;
    
    // Tell all players in the lobby that a player has left
    player.socket.leave(this.ID);
    player.socket.emit('lobby:leave', this.ID);
    io.to(this.ID).emit(`${this.ID}:leave`, this.ID, player);

    // Emit to this object that a player has left
    // this.emit('leave', player);
    console.log("Player left lobby " + this.ID + " - " + this.playerContainer.length + " in lobby");

    // This will go in game handlers
    // if (this.inProgress) {
    //   if (this.game.playerLeft) this.game.playerLeft(player);
    // }

    return LobbyRemoveResult.OK;
  }

  // startGame(): StartResult {
  //   if (this.inProgress) return StartResult.GAME_IN_PROGRESS;

  //   this.inProgress = true;
  //   console.log('Lobby ' + this.ID + ' - game started: ' + GameDirectory[this.gameCode].name + '.');

  //   io.to(this.ID).emit('initGame', this.ID);
  //   this.game = new GameDirectory[this.gameCode].game(this);

  //   return StartResult.OK;
  // }

  // endGame() {
  //   if (!this.inProgress) return;

  //   console.log('Lobby ' + this.ID + ' - game ended.');

  //   io.to(this.ID).emit('endGame', this.ID);
  //   if (this.game.cleanup) this.game.cleanup();
  //   delete this.game;
  //   this.inProgress = false;
  // }

  // cleanup() {
  //   // TODO end the game and kick everyone
  //   clearInterval(this.timer);
  // }
  
  cleanup() {
    for (let player of this.playerContainer.players) this.removePlayer(player);
  }

  abstract getStatus(): string;
}