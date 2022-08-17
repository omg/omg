import { GameCode } from "../GameDirectory";
import { BaseGame } from "./BaseGame";
import { Player } from "./Player";

export class Room {
  ID: string;
  players: [Player?];

  gameCode: GameCode;

  game?: BaseGame;
  
  constructor(ID: string, players: [Player?], gameCode: GameCode) {
    this.ID = ID;
    this.players = players;
    this.gameCode = gameCode;
  }

  addPlayer(player: Player) {
    this.players.push(player);

    console.log("Player joined room " + this.ID + " - " + this.players.length + " in room");
  }

  removePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);

      console.log("Player left room " + this.ID + " - " + this.players.length + " in room");
    }
  }

  startGame() {
    // TODO
  }

  endGame() {
    // TODO
  }
}