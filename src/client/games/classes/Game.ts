import { Container } from 'pixi.js';
import { app } from '../../app';
// import { GameCode } from '@shared/games/directory/GameDirectory';
import { Room } from '../../objects/Room';

export class Game {
  // gameCode: GameCode;

  gameState: GameState;
  room: Room;

  gameContainer: Container;

  constructor(room: Room) {
    this.room = room;

    this.gameContainer = new Container();
    app.stage.addChild(this.gameContainer);

    this.init();
  }

  init() {}
  cleanup?() {};
}

export type GameState = {
  [key: string]: any
}