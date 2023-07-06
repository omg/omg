import { GameLobby } from "../abstracts/GameLobby";

// TODO: dedicated, idle, and arcade-type rooms

export class DedicatedGameHandler extends GameLobby {
  lobbyType: string = "dedicatedlobby";

  timer;

  // constructor(selectedGame: DirectoryGame) {
  //   super(selectedGame);

  //   // this.gameCode = gameCode;
  //   // this.gameSettings = createGameSettings(GameDirectory[gameCode]);
  // }

  // 
  getRoomInfo() {
    return {
      type: "",

      ID: this.ID,
      // probably should say the game?? or is that in game lobby lol
      // players: this.players,

      // gameCode: this.gameCode,
      // gameSettings: this.gameSettings
    }
  }

  getStatus(): string {
    throw new Error("Method not implemented.");
  }
}