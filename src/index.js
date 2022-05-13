import { Application, Sprite, Graphics, Text } from 'pixi.js';
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

const BLACKJACK_DISPLAY_TEXT = "Blackjack!";
const BUST_DISPLAY_TEXT = "(Bust!)";

const FACES = {
  'ace': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'jack': 10,
  'queen': 10,
  'king': 10
};

const SUITS = [
  'clubs',
  'diamonds',
  'hearts',
  'spades',
]

//making buttons for bottom of the screen
const BUTTON_COLOR = 0xFFFFFF;

let hitButton = new Graphics();
hitButton.beginFill(BUTTON_COLOR);
hitButton.drawRect((app.view.width / 2) - 100, (app.view.height) - 300, 128, 128);
hitButton.endFill;
hitButton.interactive = true;
hitButton.buttonMode = true;

//adding the text for the button as well
var hitButtonText = new Text('HIT', { fontFamily: 'Comic Sans', fontSize: 48, fill: 0x000000 });
hitButtonText.x = (app.view.width / 2) - 76;
hitButtonText.y = (app.view.height) - 260;

app.stage.addChild(hitButton);
app.stage.addChild(hitButtonText);

let standButton = new Graphics();
standButton.beginFill(BUTTON_COLOR);
standButton.drawRect((app.view.width / 2) - 300, (app.view.height) - 300, 128, 128);
standButton.endFill;
standButton.interactive = true;
standButton.buttonMode = true;

var standButtonText = new Text('STAND', { fontFamily: 'Comic Sans', fontSize: 36, fill: 0x000000 });
standButtonText.x = (app.view.width / 2) - 294;
standButtonText.y = (app.view.height) - 258;

app.stage.addChild(standButton);
app.stage.addChild(standButtonText);

//boolean to check if it is players turn (you are not allowed to press buttons if it is not your turn!)
var isPlayersTurn = true;

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

var shoe = [];

//function to create shoe
function createShoe(numberOfDecks) {
  for (let i = 0; i < numberOfDecks; i++) {
    for (const face in FACES) {
      for (const suit of SUITS) {
        shoe.push({ face, suit })
      }
    }
  }
  shuffle(shoe);
}
createShoe(6);
console.log(shoe);

var cards = [];
var cardDimensions = {
  width: 137, 
  height: 187
};


//function to add a card
function addCard() {
  var cardForObject = shoe.pop();
  let card = {
    'face': cardForObject.face,
    'suit': cardForObject.suit,
    'sprite': Sprite.from(`./assets/cards/${cardForObject.face}_of_${cardForObject.suit}.png`)
  };

  app.stage.addChild(card.sprite);
  cards.push(card);

  //incrementing cardCoords to keep proper positioning between cards

  card.sprite.width = cardDimensions.width;
  card.sprite.height = cardDimensions.height;

  card.sprite.x = 200 + cards.length * 30;
  card.sprite.y = 100 + cards.length * 30;
}

addCard();
addCard();

console.log(cards);

var handTotal = 0;
//secondary hand total is for when you have aces in hand (i.e hand could be 5 or 15)
var secondaryHandTotal = 0;
var handTotalText = new Text('0', { fontFamily: 'Comic Sans', fontSize: 48, fill: 0xffffff });

handTotalText.x = 200;
handTotalText.y = 500;

app.stage.addChild(handTotalText);

//function to get hand total and update handTotalText
function getHandTotal() {
  //reset hand totals
  handTotal = 0;
  secondaryHandTotal = 0;
  let numberOfAces = 0;
  for (const card of cards) {
    if (card.face == 'ace') {
      numberOfAces++;
    }
    handTotal += FACES[card.face];
  }

  secondaryHandTotal = handTotal + 10 * numberOfAces;

  if (secondaryHandTotal == 21 && cards.length == 2) {
    handTotalText.text = BLACKJACK_DISPLAY_TEXT;
  }

  else if (handTotal > 21) {
    handTotalText.text = handTotal + " " + BUST_DISPLAY_TEXT; 
  }

  else if (handTotal == 21 || secondaryHandTotal == 21) {
    handTotalText.text = "21";
  }

  else if (numberOfAces == 0) {
    handTotalText.text = handTotal;
  }

  else if (numberOfAces != 0 && secondaryHandTotal > 21) {
    handTotalText.text = handTotal;
  }

  else if (numberOfAces != 0) {
    handTotalText.text = handTotal + "/" + secondaryHandTotal;
  }
  
}

function hit() {
  //making sure that you don't have a blackjack or are over 21
  if (handTotal < 21 && (handTotalText.text != BLACKJACK_DISPLAY_TEXT) && isPlayersTurn) {
    addCard();
    getHandTotal();
  }
}

function stand() {
  isPlayersTurn = false;
}

//adding button listeners HERE
hitButton.on("pointerup", hit);
standButton.on("pointerup", stand);

//getting hand total for when the program loads up
getHandTotal();

//-----------------------------------------------------------