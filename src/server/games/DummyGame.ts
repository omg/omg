import { Container } from "pixi.js";
import { Game } from "../objects/Game";
import { GameHandler } from "../objects/GameHandler";

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
  
  gameHandler: GameHandler;
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