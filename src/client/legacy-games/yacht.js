import { Application, Sprite, Graphics, Text, Container } from 'pixi.js';
import anime from 'animejs';

// By including this line, webpack adds the CSS style to our HTML page
import scss from './sass/style.scss';

// socket.io
// import { io } from "socket.io-client";
// const socket = io();

//-----------------------------------------------------------
// Application

const app = new Application({
	autoResize: true,
  resolution: devicePixelRatio,
  autoDensity: true
});
document.body.appendChild(app.view);

//-----------------------------------------------------------
// Utility

function sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function connectResizeFunction(fx) {
  window.addEventListener('resize', fx);
  fx();
}

//-----------------------------------------------------------
// Game

let gameContainer = new Container();
app.stage.addChild(gameContainer);

// Background

let backgroundColor = new Graphics();
gameContainer.addChild(backgroundColor);

let blob = Sprite.from('./assets/letters/whiteBlob.png');
backgroundColor.addChild(blob);
blob.tint = 0xffe29c;

connectResizeFunction(() => {
  if (window.innerWidth / window.innerHeight > 1) {
    blob.height = window.innerHeight * 1.1;
    blob.width = blob.height;
  } else {
    blob.width = window.innerWidth * 1.1;
    blob.height = blob.width;
  }
  blob.x = window.innerWidth / 2 - blob.width / 2;
  blob.y = window.innerHeight / 2 - blob.height / 2;
});

// Console logging userID
// socket.on('tellID', (userID) => {
//   console.log(userID);
// });

//

//-----------------------------------------------------------
// Resize stuffs

// Listen for window resize events
function resize() {
	app.renderer.resize(window.innerWidth, window.innerHeight);

  // Redraw the background color
  backgroundColor.clear().beginFill(0xffd369).drawRect(0, 0, window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);
resize();