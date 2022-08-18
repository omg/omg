import { randomUUID } from "crypto";
import { GameDirectory, GameCode } from "../GameDirectory";
import io from "..";
import { BaseGame } from "./BaseGame";
import { Player } from "./Player";

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

  addPlayer(player: Player) {
    if (this.players.includes(player)) return;
    this.players.push(player);

    player.socket.join(this.ID);
    player.socket.emit('connectToRoom', this.ID, this.players, this.gameCode);
    player.socket.to(this.ID).emit('joinedRoom', this.ID, player);

    console.log("Player joined room " + this.ID + " - " + this.players.length + " in room");

    if (this.inProgress) {
      player.socket.emit('initGame', this.ID);
      if (this.game.playerJoined) this.game.playerJoined(player);
    }
  }

  removePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);

      player.socket.leave(this.ID);
      io.to(this.ID).emit('leaveRoom', this.ID, player);

      console.log("Player left room " + this.ID + " - " + this.players.length + " in room");

      if (this.inProgress) {
        if (this.game.playerQuit) this.game.playerQuit(player);
      }
    }
  }

  startGame() {
    if (this.inProgress) return;

    this.inProgress = true;

    io.to(this.ID).emit('initGame', this.ID);
    this.game = new GameDirectory[this.gameCode].game(this);
  }

  endGame() {
    if (!this.inProgress) return;

    io.to(this.ID).emit('endGame', this.ID);
    if (this.game.cleanup) this.game.cleanup();
    delete this.game;
    this.inProgress = false;
  }
}