import { Container } from "pixi.js";
import { Game } from "./Game";
import { GameLobby } from "../gamehandlers/GameLobby";

export type DummyGameState = {}

export class DummyGame extends Game {
  // TODO: WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // TODO: WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // TODO: WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // TODO: WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // TODO: WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // TODO: WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // TODO: WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // TODO: WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  gameState: DummyGameState;
  
  gameHandler: GameLobby;
  gameContainer: Container;
  
  timer;

  start() {
    // this.timer = setTimeout(() => {
    //   this.room.endGame();
    // }, 5000);
  }

  cleanup() {
    clearTimeout(this.timer);
  }
}