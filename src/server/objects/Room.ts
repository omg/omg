import { randomUUID } from "crypto";
import { GameDirectory, GameCode } from "../GameDirectory";
import io from "..";
import { LegacyBaseGame } from "./LegacyBaseGame";
import { clearInterval } from "timers";
import { BaseGameHandler, StartResult } from "../gamehandlers/BaseGameHandler";
import { Player } from "../entities/Player";

export class Room {
  ID: string;
  players: [Player?];

  //gameCode: GameCode;
  //inProgress: boolean;

  //game?: LegacyBaseGame;
  //timer;

  gameHandler: BaseGameHandler; // Do rooms REQUIRE a game handler? What if it's just a chatroom or something?
  
  constructor() { //gameCode: GameCode
    this.ID = randomUUID();
    this.players = [];

    //this.gameCode = gameCode;
    //this.inProgress = false;

    // let x = 15;
    // this.timer = setInterval(() => {
    //   if (this.inProgress) return;
    //   if (this.players.length < GameDirectory[this.gameCode].minPlayers) {
    //     x = 15;
    //   } else {
    //     if (x < 0) {
    //       this.startGame();
    //       x = 15;
    //       return;
    //     }
    //     if (x == 15 || x == 5) console.log('Lobby ' + this.ID + ' is starting in ' + x + ' seconds!');
    //     x--;
    //   }
    // }, 1000);
  }

  getRoomInfo() {
    return {
      ID: this.ID,
      players: this.players,
      // gameCode: this.gameCode
      // add GameHandler information here
    }
  }

  addPlayer(player: Player) {
    if (this.players.includes(player)) return;
    this.players.push(player);

    player.socket.join(this.ID);
    player.socket.emit('room/connect', this.getRoomInfo());
    player.socket.to(this.ID).emit(`${this.ID}/join`, this.getRoomInfo()); //TODO is this correct?

    console.log("Player joined room " + this.ID + " - " + this.players.length + " in room");

    // if (this.inProgress) {
    //   player.socket.emit('initGame', this.ID);
    //   if (this.game.playerJoined) this.game.playerJoined(player);
    // }
  }

  removePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);

      player.socket.leave(this.ID);
      player.socket.emit('room/leave', this.ID);
      io.to(this.ID).emit(`${this.ID}/leave`, this.ID, player);

      console.log("Player left room " + this.ID + " - " + this.players.length + " in room");

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