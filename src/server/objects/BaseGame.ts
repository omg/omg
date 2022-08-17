import { GameCode } from '../GameDirectory';
import { Player } from './Player';
import { Room } from './Room';
import io from '../server';

export class BaseGame {
  gameCode: GameCode;

  gameState: GameState;
  room: Room;

  init(room: Room) {
    this.room = room;

    io.to(this.room.ID).emit('initGame', this.gameCode);
    // initializing the game on the client without any information results in a weird limbo state on the client

    this.startGame();
  }

  startGame() {}
  playerJoined?(player: Player) {};
  playerQuit?(player: Player) {};
  cleanup?() {};

  // endGame() {
  //   if (this.cleanup) this.cleanup();
  //   this.room.gameEnded();
  // }

  // broadcastState(event: string = "init") {
  //   for (let player in this.room.players) {

  //   }
  // }

  // emitState(player: Player, event: string = "init") {

  // }

  private muteItem(player: Player, item: any): any {
    if (typeof item === "object") {
      if (typeof item.visibleTo === "object") {
        // This is a StateObject
        if (!item.visibleTo.includes(player)) {
          // The player is not allowed to view this StateObject
          return null;
        }
      }
      let mutedObj: any = {};
      for (let key in item) {
        mutedObj[key] = this.muteItem(player, item[key]);
      }
    }
    if (item instanceof Player) return item.reduce();
    return item;
  }

  getState(player: Player) {
    return this.muteItem(player, this.gameState);
  }
}

export type GameState = {
  [key: string]: any
}

export type StateObject<T> = {
  value: T;
  visibleTo: [Player?]; // add teams later
}