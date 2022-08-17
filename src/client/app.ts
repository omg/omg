import { Application, Sprite, Graphics, Container } from 'pixi.js';
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

/*
  Start by having a "waiting for lobby" text on the screen
  Then, when the lobby has been initialized, use animation to load up the lobby which just displays a list of players in the lobby
  When the game starts, use the animation to load up the game
  When the game ends, use the animation to close out the game and bring back up the lobby container
  If the lobby tells the client they're kicked, close out the game and the lobby
*/

