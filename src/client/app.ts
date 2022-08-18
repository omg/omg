import { Application, Container } from 'pixi.js';
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

// Background

// Console logging userID
// socket.on('tellID', (userID) => {
//   console.log(userID);
// });

//

//-----------------------------------------------------------
// Resize stuffs

// Listen for window resize events
connectResizeFunction(() => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
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