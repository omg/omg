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

function sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

async function wait() {
  await sleep(1000);
}

//-----------------------------------------------------------

var cardDimensions = {
  width: 137, 
  height: 187
};

var cardBackSprite = Sprite.from('./assets/cards/card-back.png');
cardBackSprite.width = cardDimensions.width;
cardBackSprite.height = cardDimensions.height;
cardBackSprite.position.set(1380, 160);
cardBackSprite.zIndex = 2;
app.stage.addChild(cardBackSprite);

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

const FONT = 'Comic Sans MS';

let hitButton = new Graphics();
hitButton.beginFill(BUTTON_COLOR);
hitButton.drawRect(0, 0, 100, 50);
hitButton.endFill();
hitButton.interactive = true;
hitButton.buttonMode = true;

//adding the text for the button as well
var hitButtonText = new Text('HIT', { fontFamily: FONT, fontSize: 36, fill: 0x000000 });
hitButtonText.anchor.set(0.5, 0.5);
hitButtonText.position.set(50, 25);

container.addChild(hitButton);
hitButton.addChild(hitButtonText);

let standButton = new Graphics();
standButton.beginFill(BUTTON_COLOR);
standButton.drawRect(0, 0, 156, 50);
standButton.x = 112;
standButton.endFill();
standButton.interactive = true;
standButton.buttonMode = true;

var standButtonText = new Text('STAND', { fontFamily: FONT, fontSize: 36, fill: 0x000000 });
standButtonText.anchor.set(0.5, 0.5);
standButtonText.position.set(78, 25)

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

var playerCards = [];
var dealerCards = [];

function getCardTexture(card) {
  return `./assets/cards/${CARD_SUITS[card.suit].texture}-${CARD_FACES[card.face].texture}.png`;
}

//function to add a card
function addCard(cardRecipient) {
  if (cardRecipient == 'player') {
    var cardForObject = shoe.pop();
    console.log(getCardTexture(cardForObject));
    let card = {
      'face': cardForObject.face,
      'suit': cardForObject.suit,
      'sprite': Sprite.from(getCardTexture(cardForObject))
    };

    app.stage.addChild(card.sprite);
    playerCards.push(card);

    //incrementing cardCoords to keep proper positioning between cards

    card.sprite.width = cardDimensions.width;
    card.sprite.height = cardDimensions.height;
    card.sprite.position.set(200 + playerCards.length * 30, 100 + playerCards.length * 30);
  }

  else if (cardRecipient == 'dealer') {
    var cardForObject = shoe.pop();
    console.log(getCardTexture(cardForObject));
    let card = {
      'face': cardForObject.face,
      'suit': cardForObject.suit,
      'sprite': Sprite.from(getCardTexture(cardForObject))
    };

    app.stage.addChild(card.sprite);
    dealerCards.push(card);

    //incrementing cardCoords to keep proper positioning between cards

    card.sprite.width = cardDimensions.width;
    card.sprite.height = cardDimensions.height;
    card.sprite.position.set(1320 + dealerCards.length * 30, 100 + dealerCards.length * 30)
  }
}

addCard('player');
addCard('player');

addCard('dealer');
addCard('dealer');


//replacing one starter card sprite with card back sprite
dealerCards[1].sprite.visible = false;
console.log(playerCards);

var playerHandTotal = 0;
//secondary hand total is for when you have aces in hand (i.e hand could be 5 or 15)
var playerSecondaryHandTotal = 0;
var dealerHandTotal = 0;
var dealerSecondaryHandTotal = 0;

var playerHandTotalText = new Text('0', { fontFamily: FONT, fontSize: 48, fill: 0xffffff });

playerHandTotalText.position.set(200, 500);

var dealerHandTotalText = new Text('0', { fontFamily: FONT, fontSize: 48, fill: 0xffffff });
dealerHandTotalText.position.set(1320, 500);

app.stage.addChild(playerHandTotalText);
app.stage.addChild(dealerHandTotalText);

//function to get hand total and update handTotalText
function getHandTotal(totalRecipient) {

  if (totalRecipient == 'player') {
    //reset hand totals
    playerHandTotal = 0;
    playerSecondaryHandTotal = 0;
    let numberOfAces = 0;
    for (const card of playerCards) {
      if (CARD_FACES[card.face].value == 1) {
        numberOfAces++;
      }
      playerHandTotal += CARD_FACES[card.face].value;
    }

    playerSecondaryHandTotal = playerHandTotal + 10 * numberOfAces;

    if (playerSecondaryHandTotal == 21 && playerCards.length == 2) {
      playerHandTotalText.text = BLACKJACK_DISPLAY_TEXT;
    }

    else if (playerHandTotal > 21) {
      playerHandTotalText.text = playerHandTotal + " " + BUST_DISPLAY_TEXT; 
    }

    else if (playerHandTotal == 21 || playerSecondaryHandTotal == 21) {
      playerHandTotalText.text = "21";
    }

    else if (numberOfAces == 0) {
      playerHandTotalText.text = playerHandTotal;
    }

    else if (numberOfAces != 0 && playerSecondaryHandTotal > 21) {
      playerHandTotalText.text = playerHandTotal;
    }

    else if (numberOfAces != 0) {
      playerHandTotalText.text = playerHandTotal + "/" + playerSecondaryHandTotal;
    }
  }

  else if (totalRecipient == 'dealer') {
    //reset hand totals
    dealerHandTotal = 0;
    dealerSecondaryHandTotal = 0;
    let numberOfAces = 0;
    for (const card of dealerCards) {
      if (CARD_FACES[card.face].value == 1) {
        numberOfAces++;
      }
      dealerHandTotal += CARD_FACES[card.face].value;
    }
    
    dealerSecondaryHandTotal = dealerHandTotal + 10 * numberOfAces;
    
    if (dealerSecondaryHandTotal == 21 && dealerCards.length == 2) {
      dealerHandTotalText.text = BLACKJACK_DISPLAY_TEXT;
    }
    
    else if (dealerHandTotal > 21) {
      dealerHandTotalText.text = dealerHandTotal + " " + BUST_DISPLAY_TEXT; 
    }
    
    else if (dealerHandTotal == 21 || dealerSecondaryHandTotal == 21) {
      dealerHandTotalText.text = "21";
    }
    
    else if (numberOfAces == 0) {
      dealerHandTotalText.text = dealerHandTotal;
    }
    
    else if (numberOfAces != 0 && dealerSecondaryHandTotal > 21) {
      dealerHandTotalText.text = dealerHandTotal;
    }
    
    else if (numberOfAces != 0) {
      dealerHandTotalText.text = dealerHandTotal + "/" + dealerSecondaryHandTotal;
    }
  }
}

async function dealerTurn() {
  addCard('dealer');
  getHandTotal('dealer');
  if (dealerHandTotal <= 17 && dealerSecondaryHandTotal != 21) {
    await sleep(1000);
    dealerTurn();
  }
}

function hit() {
  //making sure that you don't have a blackjack or are over 21
  if (playerHandTotal < 21 && (playerHandTotalText.text != BLACKJACK_DISPLAY_TEXT) && isPlayersTurn) {
    addCard('player');
    getHandTotal('player');
  }
}

function stand() {
  isPlayersTurn = false;
  if (dealerHandTotal <= 17 && dealerSecondaryHandTotal != 21) {
  dealerTurn();
  }
}

//adding button listeners HERE
hitButton.on("pointerup", hit);
standButton.on("pointerup", stand);

//getting hand total for when the program loads up
getHandTotal('player');
getHandTotal('dealer');

//-----------------------------------------------------------