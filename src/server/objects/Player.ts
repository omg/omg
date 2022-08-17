import { Socket } from "socket.io";

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