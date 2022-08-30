import { Container } from "pixi.js";
import { Player } from "../entities/Player";
import { BaseGameHandler } from "../gamehandlers/BaseGameHandler";

export class BaseGame {
  gameState: GameState;
  
  gameHandler: BaseGameHandler; // ?
  gameContainer: Container;

  start?(): void;
  cleanup?(): void;
}
// since Game is forced to be a class because of GameDirectory limitations
// we can try and allow endGame and emit functions and can do a getter for emits
// and game state stuff !

export type GameState = {
  [key: string]: any
}

export type StateObject<T> = {
  value: T;
  visibleTo: [Player?]; // add teams later
}