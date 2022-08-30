import { Container } from "pixi.js";
import { Game } from "../objects/Game";
import { BaseGameHandler } from "../gamehandlers/BaseGameHandler";

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
  
  gameHandler: BaseGameHandler;
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