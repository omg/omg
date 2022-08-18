import { Container, Graphics, Sprite } from "pixi.js";
import { app, connectResizeFunction } from "../app";
import { GameCode } from "../GameDirectory";
import { BaseGame } from "./BaseGame";
import { Player } from "./Player";

export class Room {
  ID: string;
  players: [Player?];

  gameCode: GameCode;
  game?: BaseGame;

  roomContainer: Container;
  backgroundColorGraphics: Graphics;
  blobSprite: Sprite;
  
  constructor(ID: string, players: [Player?], gameCode: GameCode) {
    this.ID = ID;
    this.players = players;
    this.gameCode = gameCode;

    // Room graphics
    this.roomContainer = new Container();
    app.stage.addChild(this.roomContainer);

    this.backgroundColorGraphics = new Graphics();
    this.roomContainer.addChild(this.backgroundColorGraphics);

    this.blobSprite = Sprite.from('./assets/letters/whiteBlob.png');
    this.backgroundColorGraphics.addChild(this.blobSprite);
    this.blobSprite.tint = 0xffe29c;

    // Background
    connectResizeFunction(() => {
      this.resize();
    });
  }

  resize() {
    this.backgroundColorGraphics.clear().beginFill(0xffd369).drawRect(0, 0, window.innerWidth, window.innerHeight);

    if (window.innerWidth / window.innerHeight > 1) {
      this.blobSprite.height = window.innerHeight * 1.1;
      this.blobSprite.width = this.blobSprite.height;
    } else {
      this.blobSprite.width = window.innerWidth * 1.1;
      this.blobSprite.height = this.blobSprite.width;
    }
    this.blobSprite.x = window.innerWidth / 2 - this.blobSprite.width / 2;
    this.blobSprite.y = window.innerHeight / 2 - this.blobSprite.height / 2;
  }

  addPlayer(player: Player) {
    this.players.push(player);

    console.log("Player joined room " + this.ID + " - " + this.players.length + " in room");
  }

  removePlayer(player: Player) {
    let index = this.players.findIndex((result: Player) => result.ID == player.ID);
    if (index > -1) {
      this.players.splice(index, 1);

      console.log("Player left room " + this.ID + " - " + this.players.length + " in room");
    }
  }

  startGame() {
    // TODO
  }

  endGame() {
    // TODO
  }
}