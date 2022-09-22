import EventEmitter = require("events");
import { Player } from "../entities/Player";

export class ConnectedPlayers extends EventEmitter {
  private players: Player[] = [];

  addPlayer(player: Player) {
    this.players.push(player);
    this.emit("join", player);
  }

  removePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
      this.emit("leave", player);
    }
  }

  getPlayers(): Player[] {
    return this.players;
  }
}