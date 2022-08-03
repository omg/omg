import { Application, Sprite, Graphics, Text, Container } from 'pixi.js';
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

let keyContainer = new Container();
app.stage.addChild(keyContainer);

// Listen for window resize events
function resize() {
	app.renderer.resize(window.innerWidth, window.innerHeight);

  // Reposition the action container
  keyContainer.position.set(window.innerWidth / 2, window.innerHeight / 2);
}
window.addEventListener('resize', resize);
resize();

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

//-----------------------------------------------------------
// Constants

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

createWord("KINDERGARTEN");

//app.stage.addChild(keyText);

//keySprite.width = 80;
//keySprite.height = 100;