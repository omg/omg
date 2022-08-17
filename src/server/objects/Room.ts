import { randomUUID } from "crypto";
import { GameDirectory, GameCode } from "../GameDirectory";
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