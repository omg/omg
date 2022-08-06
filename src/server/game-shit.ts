import { Socket } from "socket.io";


let currentGameID = 0;

export type Player = {
  ID: number;
  socket: Socket;
}

export class Lobby {
  players: [Player];
  game: Game;
  inProgress: boolean;
  ID: number;

  constructor(game: Game) {
    this.game = game;
    this.ID = currentGameID;

    currentGameID++;
  }

  // call this whenever a player joins the lobby
  addPlayer(player: Player) {
    this.players.push(player);
    if (this.inProgress) this.game.playerJoined(player);
  }

  // call this whenever a player leaves the lobby
  removePlayer(player: Player) {
    let index = this.players.indexOf(player);
    if (index > -1) {
      this.players.splice(index, 1);
      if (this.inProgress) this.game.playerQuit(player);
    }
  }

  // call this to start the game
  startGame() {
    if (this.inProgress) return;
    this.inProgress = true;

    this.game.startGame();
  }

  // call this to end the game
  endGame() {
    this.game.endGame();
  }

  // called when the game ends
  gameEnded() {
    if (!this.inProgress) return;
    this.inProgress = false;
  }
}

export class Game {
  private lobby: Lobby;

  init(lobby: Lobby) {
    this.lobby = lobby;
    this.startGame();
  }

  // this is called when the game starts
  startGame() {

  }

  // this is called whenever a player joins
  playerJoined(player: Player) {

  }

  // this is called whenever a player leaves
  playerQuit(player: Player) {

  }

  // this is called whenever the game is ending
  cleanup() {

  }

  // call this to end the game
  endGame() {
    this.cleanup();
    this.lobby.gameEnded();
  }
}