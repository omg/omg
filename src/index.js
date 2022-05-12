import { Application, Graphics, Sprite} from 'pixi.js';
import scss from './style.scss';

const app = new Application({
	autoResize: true,
  resolution: devicePixelRatio 
});

document.body.appendChild(app.view);

// Listen for window resize events

// Function to call when the app is resized
function resize() {
	// Resize the renderer
	app.renderer.resize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);
resize();

//-----------------------------------------------------------

const FACES = [
  'ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'jack',
  'queen',
  'king'
];

const SUITS = [
  'clubs',
  'diamonds',
  'hearts',
  'spades',
]

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


let shoe = [];

//function to create shoe
function createShoe(numberOfDecks) {
  for (let i = 0; i < numberOfDecks; i++) {
    for (const face of FACES) {
      for (const suit of SUITS) {
        shoe.push({ face, suit })
      }
    }
  }
  shuffle(shoe);
}
createShoe(6);
console.log(shoe);

let cardOne = shoe.pop();
let cardOneSprite = Sprite.from(`./assets/cards/${cardOne.face}_of_${cardOne.suit}.png`);

cardOneSprite.width = 137;
cardOneSprite.height = 187;
cardOneSprite.x = 200;
cardOneSprite.y = 100;

app.stage.addChild(cardOneSprite);


// Let's draw a red square at the bottom right
const square = new Graphics()
	.beginFill(0xff0000)
  .drawRect(-100, -100, 100, 100); // Offset -100, -100 // Size 100, 100
  
// Add it to the stage
app.stage.addChild(square);