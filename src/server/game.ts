import { randomUUID } from "crypto";
import { Socket } from "socket.io";
import { GameDirectory, GameCode } from "./GameDirectory";
import io from './server';

let currentPlayerID = 1;
export class Player {
  ID: number;
  username: string;
  socket: Socket;

  constructor(socket: Socket) {
    this.ID = currentPlayerID;
    this.username = "Lame Guest";
    this.socket = socket;

    currentPlayerID++;
  }

  reduce() {
    return {
      ID: this.ID,
      username: this.username
    }
  }
}

export class Room {
  ID: string;
  players: [Player?];

  gameCode: GameCode;
  inProgress: boolean;

  game?: BaseGame;
  
  constructor(gameCode: GameCode) {
    this.ID = randomUUID();
    this.players = [];

    this.gameCode = gameCode;
    this.inProgress = false;
  }

  getReducedPlayers() {
    return this.players.map((player: Player) => player.reduce());
  }

  addPlayer(player: Player) {
    if (this.players.includes(player)) return;
    this.players.push(player);

    player.socket.join(this.ID);
    player.socket.emit('joinRoom', this.ID); // TODO: tell the user who else is in the room and update it + chat stuff ?
    console.log("Player joined room " + this.ID + " - " + this.players.length + " in room");

    if (this.inProgress) {
      player.socket.emit('initGame', this.gameCode);
      if (this.game.playerJoined) this.game.playerJoined(player);
    }
  }

  removePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);

      player.socket.leave(this.ID);
      player.socket.emit('leaveRoom', this.ID); // TODO same as above
      console.log("Player left room " + this.ID + " - " + this.players.length + " in room");

      if (this.inProgress) {
        player.socket.emit('endGame');
        if (this.game.playerQuit) this.game.playerQuit(player);
      }
    }
  }

  startGame() {
    if (this.inProgress) return;

    this.game = new GameDirectory[this.gameCode].game();
    this.inProgress = true;
    this.game.startGame();
  }

  endGame() {
    if (!this.inProgress) return;

    if (this.game.cleanup) this.game.cleanup();
    delete this.game;
    this.inProgress = false;
  }
}

export type GameState = {
  [key: string]: any
}

export class BaseGame {
  gameCode: GameCode;

  gameState: GameState;
  room: Room;

  init(room: Room) {
    this.room = room;

    io.to(this.room.ID).emit('initGame', this.gameCode);
    // initializing the game on the client without any information results in a weird limbo state on the client

    this.startGame();
  }

  startGame() {}
  playerJoined?(player: Player) {};
  playerQuit?(player: Player) {};
  cleanup?() {};

  // endGame() {
  //   if (this.cleanup) this.cleanup();
  //   this.room.gameEnded();
  // }

  // broadcastState(event: string = "init") {
  //   for (let player in this.room.players) {

  //   }
  // }

  // emitState(player: Player, event: string = "init") {

  // }

  private muteItem(player: Player, item: any): any {
    if (typeof item === "object") {
      if (typeof item.visibleTo === "object") {
        // This is a StateObject
        if (!item.visibleTo.includes(player)) {
          // The player is not allowed to view this StateObject
          return null;
        }
      }
      let mutedObj: any = {};
      for (let key in item) {
        mutedObj[key] = this.muteItem(player, item[key]);
      }
    }
    if (item instanceof Player) return item.reduce();
    return item;
  }

  getState(player: Player) {
    return this.muteItem(player, this.gameState);
  }
}

export type StateObject<T> = {
  value: T;
  visibleTo: [Player?]; // add teams later
}