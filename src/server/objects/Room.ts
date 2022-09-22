import { randomUUID } from "crypto";
import { GameDirectory, GameCode } from "../GameDirectory";
import io from "..";
import { clearInterval } from "timers";
import { BaseGameHandler, StartResult } from "../gamehandlers/BaseGameHandler";
import { Player } from "../entities/Player";
import { DedicatedGameHandler } from "../gamehandlers/DedicatedGameHandler";

// DedicatedGameHandler is an extension of Lobby that can run games
// Room is an extension of DedicatedGameHandler with a host and moderators and eventually more
// Lobbies inherently support chat - chat should go here
// If needed, there can be a toggle for chat in Lobby

export class Lobby { // probably should do a HostedGameHandler or something
  ID: string;
  players: [Player?];
  
  constructor() {
    this.ID = randomUUID();
    this.players = [];
  }

  getLobbyInfo() {
    return {
      type: "lobby",

      ID: this.ID,
      players: this.players
    }
  }

  // TODO some of these methods should be in BaseGameHandler
  emit(player: Player) {
    return player.socket.emit('game:')
  }

  addPlayer(player: Player) {
    if (this.players.includes(player)) return;
    this.players.push(player);

    player.socket.join(this.ID);
    player.socket.emit('lobby:connect', this.getLobbyInfo());
    player.socket.to(this.ID).emit(`${this.ID}:join`, this.getLobbyInfo()); //TODO is this correct?

    console.log("Player joined lobby " + this.ID + " - " + this.players.length + " in lobby");

    // get an onPlayerAdded method by extending an Emitter and have BaseGameHandler listen for it
    
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
      this.players.splice(index, 1);

      player.socket.leave(this.ID);
      player.socket.emit('lobby:leave', this.ID);
      io.to(this.ID).emit(`${this.ID}:leave`, this.ID, player);

      console.log("Player left lobby " + this.ID + " - " + this.players.length + " in lobby");

      // if (this.inProgress) {
      //   if (this.game.playerQuit) this.game.playerQuit(player);
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
    
  }
}