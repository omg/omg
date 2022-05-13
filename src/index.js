import { Application, Sprite, Graphics, Text, Container } from 'pixi.js';
import scss from './style.scss';

const app = new Application({
	autoResize: true,
  resolution: devicePixelRatio 
});

document.body.appendChild(app.view);

let container = new Container();
container.pivot.set(133, 128);
app.stage.addChild(container);


// Listen for window resize events

// Function to call when the app is resized
function resize() {
	// Resize the renderer
	app.renderer.resize(window.innerWidth, window.innerHeight);
  container.position.set(window.innerWidth / 2, window.innerHeight- 20);
}
window.addEventListener('resize', resize);
resize();

//-----------------------------------------------------------

const BLACKJACK_DISPLAY_TEXT = "Blackjack!";
const BUST_DISPLAY_TEXT = "(Bust!)";

const CARD_FACES = {
  ["Ace"]: { value: 1, texture: "1" }, // ace is the exception to the value property!
  ["Deuce"]: { value: 2, texture: "2" },
  ["Three"]: { value: 3, texture: "3" },
  ["Four"]: { value: 4, texture: "4" },
  ["Five"]: { value: 5, texture: "5" },
  ["Six"]: { value: 6, texture: "6" },
  ["Seven"]: { value: 7, texture: "7" },
  ["Eight"]: { value: 8, texture: "8" },
  ["Nine"]: { value: 9, texture: "9" },
  ["Ten"]: { value: 10, texture: "10" },
  ["Jack"]: { value: 10, texture: "11" }, // texture is 11 so that it's alphabetically ordered in File Explorer
  ["Queen"]: { value: 10, texture: "12" },
  ["King"]: { value: 10, texture: "13" }
};

const CARD_SUITS = {
  ["Clubs"]: { texture: "clubs" },
  ["Diamonds"]: { texture: "diamonds" },
  ["Hearts"]: { texture: "hearts" },
  ["Spades"]: { texture: "spades" }
};

//making buttons for bottom of the screen
const BUTTON_COLOR = 0xFFFFFF;

let hitButton = new Graphics();
hitButton.beginFill(BUTTON_COLOR);
hitButton.drawRect(0, 0, 128, 128);
hitButton.endFill();
hitButton.interactive = true;
hitButton.buttonMode = true;

//adding the text for the button as well
var hitButtonText = new Text('HIT', { fontFamily: 'Comic Sans', fontSize: 48, fill: 0x000000 });
hitButtonText.anchor.set(0.5, 0.5);
hitButtonText.position.set(64, 64);

container.addChild(hitButton);
hitButton.addChild(hitButtonText);

let standButton = new Graphics();
standButton.beginFill(BUTTON_COLOR);
standButton.drawRect(0, 0, 128, 128);
standButton.x = 138;
standButton.endFill();
standButton.interactive = true;
standButton.buttonMode = true;

var standButtonText = new Text('STAND', { fontFamily: 'Comic Sans', fontSize: 36, fill: 0x000000 });
standButtonText.anchor.set(0.5, 0.5);
standButtonText.position.set(64, 64)

container.addChild(standButton);
standButton.addChild(standButtonText);

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
    for (const face in CARD_FACES) {
      for (const suit in CARD_SUITS) {
        shoe.push({ face, suit });
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

function getCardTexture(card) {
  return `./assets/cards/${CARD_SUITS[card.suit].texture}-${CARD_FACES[card.face].texture}.png`;
}

//function to add a card
function addCard(forPlayer) {
  var cardForObject = shoe.pop();
  console.log(getCardTexture(cardForObject));
  let card = {
    'face': cardForObject.face,
    'suit': cardForObject.suit,
    'sprite': Sprite.from(getCardTexture(cardForObject))
  };

  app.stage.addChild(card.sprite);
  cards.push(card);

  //incrementing cardCoords to keep proper positioning between cards

  card.sprite.width = cardDimensions.width;
  card.sprite.height = cardDimensions.height;

  card.sprite.position.set(200 + cards.length * 30, 100 + cards.length * 30);
}

addCard(true);
addCard(true);

console.log(cards);

var playerHandTotal = 0;
//secondary hand total is for when you have aces in hand (i.e hand could be 5 or 15)
var playerSecondaryHandTotal = 0;
var handTotalText = new Text('0', { fontFamily: 'Comic Sans', fontSize: 48, fill: 0xffffff });

handTotalText.position.set(200, 500);

app.stage.addChild(handTotalText);

//function to get hand total and update handTotalText
function getHandTotal() {
  //reset hand totals
  playerHandTotal = 0;
  playerSecondaryHandTotal = 0;
  let numberOfAces = 0;
  for (const card of cards) {
    if (CARD_FACES[card.face].value == 1) {
      numberOfAces++;
    }
    playerHandTotal += CARD_FACES[card.face].value;
  }

  playerSecondaryHandTotal = playerHandTotal + 10 * numberOfAces;

  if (playerSecondaryHandTotal == 21 && cards.length == 2) {
    handTotalText.text = BLACKJACK_DISPLAY_TEXT;
  }

  else if (playerHandTotal > 21) {
    handTotalText.text = playerHandTotal + " " + BUST_DISPLAY_TEXT; 
  }

  else if (playerHandTotal == 21 || playerSecondaryHandTotal == 21) {
    handTotalText.text = "21";
  }

  else if (numberOfAces == 0) {
    handTotalText.text = playerHandTotal;
  }

  else if (numberOfAces != 0 && playerSecondaryHandTotal > 21) {
    handTotalText.text = playerHandTotal;
  }

  else if (numberOfAces != 0) {
    handTotalText.text = playerHandTotal + "/" + playerSecondaryHandTotal;
  }
  
}

function hit() {
  //making sure that you don't have a blackjack or are over 21
  if (playerHandTotal < 21 && (handTotalText.text != BLACKJACK_DISPLAY_TEXT) && isPlayersTurn) {
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