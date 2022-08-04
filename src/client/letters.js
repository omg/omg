import { Application, Sprite, Graphics, Text, Container, AppLoaderPlugin } from 'pixi.js';
import anime from 'animejs';

// By including this line, webpack adds the CSS style to our HTML page
import scss from './sass/style.scss';

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
// game

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

//

let keyContainer = new Container();
gameContainer.addChild(keyContainer);

let x = 0;
function createLetter(letter) {
  let keySprite = Sprite.from('./assets/letters/key.png');
  keySprite.scale.set(0.3);

  let keyText = new Text(letter, {
    fontFamily: 'Gotham Black',
    fontSize: 34,
    fill: 0x000000,
    align: 'center'
  });
  keyText.scale.set(2);
  keyText.anchor.set(0.5);
  keyText.position.set(40, 50 - 3);

  keySprite.position.x = x;
  x += 24 + 2;

  keySprite.addChild(keyText);
  keyContainer.addChild(keySprite);
  keyContainer.pivot.set((x - 2) / 2, 30 / 2);
  console.log(keyContainer.pivot.x, keyContainer.pivot.y);
  console.log('done');
  
  let keyTimeline = anime.timeline();
  keyTimeline.add({
    targets: keySprite.position,
    y: 30 / -2,
    duration: 150,
    easing: 'easeOutQuad'
  });
  keyTimeline.add({
    targets: keySprite.position,
    y: 0,
    duration: 240,
    easing: 'easeOutBounce'
  });

}

keyContainer.scale.set(0.9)

function createWord(word) {
  for (let i = 0; i < word.length; i++) {
    setTimeout(() => {
      createLetter(word[i]);
      console.log(i);
    }, 70 * i + 500);
  }
}

//createWord("KINDERGARTEN");
window.addEventListener('keydown', (event) => {
  if (event.key.length != 1) return;
  createLetter(event.key.toUpperCase());
})

//-----------------------------------------------------------
// Resize stuffs

// Listen for window resize events
function resize() {
	app.renderer.resize(window.innerWidth, window.innerHeight);

  // Reposition the action container
  keyContainer.position.set(window.innerWidth / 2, window.innerHeight / 2);

  // Redraw the background color
  backgroundColor.clear().beginFill(0xffd369).drawRect(0, 0, window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);
resize();