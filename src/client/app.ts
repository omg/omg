import { Application, Container } from 'pixi.js';
import { GameCode } from './GameDirectory';
import { Player } from './objects/Player';
import { Room } from './objects/Room';
import socket from './utils/socket';
//import anime from 'animejs';

//-----------------------------------------------------------
// Application

const app = new Application({
  // autoResize: true,
  resolution: devicePixelRatio,
  autoDensity: true
});
document.body.appendChild(app.view);

//-----------------------------------------------------------
// Utility

function connectResizeFunction(fx) {
  window.addEventListener('resize', fx);
  fx();
}

function removeResizeFunction(fx) {
  window.removeEventListener('resize', fx);
}

//-----------------------------------------------------------
// Game

let gameContainer = new Container();
app.stage.addChild(gameContainer);

//-----------------------------------------------------------
// Resize stuffs

// Listen for window resize events
connectResizeFunction(() => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

//-----------------------------------------------------------
// Connections

let myPlayer = null;

socket.on('connected', (player: Player) => {
  myPlayer = player;
});

//-----------------------------------------------------------
// Lobby stuff

// Eventually change this to be able to be in multiple rooms and be able to be kicked from rooms safely
let currentRoom: Room;

socket.on('joinRoom', (ID: string, players: [Player], gameCode: GameCode) => {
  if (currentRoom) {
    // Can't cleanup the current room! We'll just return for now
    return;
  }

  console.log("Joined room " + ID + "!\nPlayers in room:");
  for (let player of players) console.log(player.ID + " - " + player.username);

  currentRoom = new Room(ID, players, gameCode);
});

socket.on('joinedRoom', (player: Player) => {
  // TODO: use room ID to know from which room this player has left
  currentRoom.addPlayer(player);
});

socket.on('leaveRoom', (id: string) => {
  // TODO
});

socket.on('leftRoom', (player: Player) => {
  // TODO: use room ID to know from which room this player has left
  currentRoom.removePlayer(player);
});

socket.on('initGame', (gameCode: GameCode) => {
  // TODO
});

socket.on('endGame', () => {
  // TODO
});

/*
  Start by having a "waiting for lobby" text on the screen
  Then, when the lobby has been initialized, use animation to load up the lobby which just displays a list of players in the lobby
  When the game starts, use the animation to load up the game
  When the game ends, use the animation to close out the game and bring back up the lobby container
  If the lobby tells the client they're kicked, close out the game and the lobby
*/

export {
  app,
  connectResizeFunction,
  removeResizeFunction
}