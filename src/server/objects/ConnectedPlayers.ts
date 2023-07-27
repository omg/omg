import EventEmitter from "events";
import { Player } from "../games/classes/entities/Player";

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

  hasPlayer(player: Player) {
    return this.players.includes(player);
  }

  getPlayers(): Player[] {
    return this.players;
  }

  // toJSON() {
  //   return this.players; // or this.players.map(player => player.toJSON());
  // }
}