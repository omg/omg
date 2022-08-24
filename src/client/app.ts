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

let myPlayer: Player;

socket.on('connected', (player: Player) => {
  myPlayer = player;
});

//-----------------------------------------------------------
// Lobby stuff

let connectedRooms: Room[] = [];

// Handle if the player completely disconnects from the server

socket.on('connectToRoom', (ID: string, players: [Player], gameCode: string) => {
  console.log("Connected to room " + ID + "!\nPlayers in room:");
  for (let player of players) console.log(player.ID + " - " + player.username);

  connectedRooms.push(new Room(ID, players, <GameCode> gameCode));
});

socket.on('joinedRoom', (ID: string, player: Player) => {
  let room = connectedRooms.find((room) => room.ID == ID);
  if (room) room.addPlayer(player);
});

socket.on('leaveRoom', (ID: string, player: Player) => {
  let room = connectedRooms.find((room) => room.ID == ID);
  if (!room) return;

  if (player.ID == myPlayer.ID) {
    connectedRooms.splice(connectedRooms.indexOf(room), 1);
    room.cleanup();
    return;
  }
  room.removePlayer(player);
});

socket.on('initGame', (ID: string) => {
  let room = connectedRooms.find((room) => room.ID == ID);
  if (room) room.startGame();
});

socket.on('endGame', (ID: string) => {
  let room = connectedRooms.find((room) => room.ID == ID);
  if (room) room.endGame();
});

export {
  app,
  connectResizeFunction,
  removeResizeFunction
}