import { Container } from "pixi.js";
import { Player } from "../entities/Player";
import { BaseGameHandler } from "../gamehandlers/BaseGameHandler";
import { GameSettings } from "../objects/GameSettings";

export class BaseGame {
  gameState: GameState;
  
  gameHandler: BaseGameHandler;

  gameContainer: Container;

  constructor(gameHandler: BaseGameHandler) {
    this.gameHandler = gameHandler;

    // how will players be accessed without the GameHandler?
    // BaseGame can't access the gamehandler like this so it can't call it's endGame

    this.start();
  }

  start?(): void;
  playerJoined?(player: Player): void;
  playerLeft?(player: Player): void;
  cleanup?(): void;

  endGame() {
    this.gameHandler.endGame();
  }

  private muteItem(player: Player, item: any) {
    if (typeof item === "object") {
      if (typeof item.visibleTo === "object") { // This is a StateObject
        if (!item.visibleTo.includes(player)) { // The player is not allowed to view this StateObject
          return null;
        }
      }
      let mutedObj = {};
      for (let key in item) mutedObj[key] = this.muteItem(player, item[key]);
    }
    return item;
  }

  getState(player: Player) {
    return this.muteItem(player, this.gameState);
  }
  
  get gameSettings(): GameSettings {
    return this.gameHandler.gameSettings;
  }
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