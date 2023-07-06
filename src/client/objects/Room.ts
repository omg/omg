import { Container, Graphics, Sprite } from "pixi.js";
import { app, connectResizeFunction, removeResizeFunction } from "../app";
import { Game } from "../games/classes/Game";
import { PlayerContainer } from "./PlayerContainer";
import { GameCode } from "@shared/games/directory/GameDirectory";
import { GameDirectory } from "@client/games/directory/GameDirectory";
import { Player } from "./Player";

export class Room {
  ID: string;
  playerContainer: PlayerContainer;

  gameCode: GameCode;
  game?: Game;

  roomContainer: Container;
  backgroundColorGraphics: Graphics;
  blobSprite: Sprite;

  resizingFunction: () => void;
  
  constructor(ID: string, playerContainer: PlayerContainer, gameCode: GameCode) {
    this.ID = ID;
    this.playerContainer = playerContainer;
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
    this.resizingFunction = () => {
      this.resize();
    }
    connectResizeFunction(this.resizingFunction);
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
    this.playerContainer.addPlayer(player);

    console.log("Player joined room " + this.ID + " - " + this.playerContainer.length + " in room");
  }

  removePlayer(player: Player) {
    this.playerContainer.removePlayer(player);

    console.log("Player left room " + this.ID + " - " + this.playerContainer.length + " in room");
  }

  startGame() {
    if (this.game) return;

    this.roomContainer.visible = false;
    
    this.game = new GameDirectory[this.gameCode].Game(this);
  }

  endGame() {
    if (!this.game) return;

    this.roomContainer.visible = true;
    
    if (this.game.cleanup) this.game.cleanup();
    this.game.gameContainer.destroy({ children: true });
    delete this.game;
  }

  cleanup() {
    this.endGame();
    removeResizeFunction(this.resizingFunction);
    this.roomContainer.destroy({ children: true });
  }
}