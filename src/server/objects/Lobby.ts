import { randomUUID } from "crypto";
import { GameDirectory, GameCode } from "../GameDirectory";
import io from "..";
import { clearInterval } from "timers";
import { BaseGameHandler, StartResult } from "../gamehandlers/BaseGameHandler";
import { Player } from "../entities/Player";
import { DedicatedGameHandler } from "../gamehandlers/DedicatedGameHandler";
import { EntityData } from "./EntityData";
import EventEmitter = require("events");

// DedicatedGameHandler is an extension of BaseGameHandler that can run games
// Room is an extension of DedicatedGameHandler with a host and moderators and eventually more
// Lobbies inherently support chat - chat should go here
// If needed, there can be a toggle for chat in Lobby. But that's not needed for now.

export class Lobby extends EventEmitter {
  lobbyType: string = "lobby"; // this might be a weird way to do object detection

  ID: string;
  players: Player[];

  entityData: EntityData;
  
  constructor() {
    super();

    this.ID = randomUUID();
    this.players = [];
    this.entityData = new EntityData();
  }

  getLobbyInfo() {
    return {
      ID: this.ID,
      players: this.players,

      entityData: this.entityData
    }
  }

  // TODO some of these methods should be in BaseGameHandler
  // emit(player: Player) {
  //   return player.socket.emit('game:')
  // }

  addPlayer(player: Player) {
    // Check if the player is already in the lobby
    if (this.players.includes(player)) return;
    
    // Add the player to the lobby
    this.players.push(player);

    // Add the player to the EntityData
    // if the game is about to start - force them on a team - otherwise don't

    // Tell all players in the lobby that a player has joined
    player.socket.join(this.ID);
    player.socket.emit('lobby:connect', this.lobbyType, this.getLobbyInfo());
    player.socket.to(this.ID).emit(`${this.ID}:join`, player);

    // Emit to this object that a player has joined
    this.emit('join', player);
    console.log("Player joined lobby " + this.ID + " - " + this.players.length + " in lobby");

    // get an onPlayerJoin method by extending an Emitter and have BaseGameHandler listen for it
    
    // This will go in game handlers
    // if (this.inProgress) {
    //   player.socket.emit(`${this.ID}:init`);
    //   if (this.game.playerJoined) {
    //     let data = this.game.playerJoined(player);
    //     this.startPlayer(player, data);
    //   }
    // }
  }

  removePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      // Remove the player from the lobby
      this.players.splice(index, 1);

      // Tell all players in the lobby that a player has left
      player.socket.leave(this.ID);
      player.socket.emit('lobby:leave', this.ID);
      io.to(this.ID).emit(`${this.ID}:leave`, this.ID, player);

      // Emit to this object that a player has left
      this.emit('leave', player);
      console.log("Player left lobby " + this.ID + " - " + this.players.length + " in lobby");

      // This will go in game handlers
      // if (this.inProgress) {
      //   if (this.game.playerLeft) this.game.playerLeft(player);
      // }
    }
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
    for (let player of this.players) this.removePlayer(player);
  }
}