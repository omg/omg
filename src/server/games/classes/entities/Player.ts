import { Socket } from "socket.io";
import { Entity } from "./Entity";

let currentPlayerID = 1;

export class Player implements Entity {
  ID: number;
  name: string;
  color: number;
  socket: Socket;

  constructor(socket: Socket) {
    this.ID = currentPlayerID;
    this.name = "Lame Guest";
    this.socket = socket;

    // use HSV instead so that it doesn't generate
    // shitty colors
    this.color = Math.random() * 0xffffff;

    currentPlayerID++;
  }

  getPlayers(): Player[] {
    return [this];
  }

  toJSON() {
    return {
      ID: this.ID,
      name: this.name
    }
  }
}