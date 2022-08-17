import { GameCode } from '../GameDirectory';
import { Player } from './Player';
import { Room } from './Room';

export class BaseGame {
  gameCode: GameCode;

  gameState: GameState;
  room: Room;

  constructor(room: Room) {
    this.room = room;

    // TODO?

    this.init();
  }

  init() {}
  cleanup?() {};
}

export type GameState = {
  [key: string]: any
}

export type StateObject<T> = {
  value: T;
  visibleTo: [Player?]; // add teams later
}