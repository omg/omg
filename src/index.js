import { Application, Sprite, Graphics, Text, Container } from 'pixi.js';
import scss from './style.scss';

const app = new Application({
	autoResize: true,
  resolution: devicePixelRatio 
});

document.body.appendChild(app.view);

// Create the action container which will have the buttons
let actionContainer = new Container();
function actionContainerResized() {
  actionContainer.pivot.set(actionContainer.width / 2, 50);
}
app.stage.addChild(actionContainer);

// Listen for window resize events
function resize() {
	app.renderer.resize(window.innerWidth, window.innerHeight);

  // Reposition the action container
  actionContainer.position.set(window.innerWidth / 2, window.innerHeight - 20);
}
window.addEventListener('resize', resize);
resize();

//-----------------------------------------------------------

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

const BLACKJACK_DISPLAY_TEXT = "Blackjack!";
const BUST_DISPLAY_TEXT = "(Bust!)";

const BUTTON_COLOR = 0xFFFFFF;
const TEXT_FONT = 'Comic Sans MS';

const CARD_DIMENSIONS = {
  width: 137, 
  height: 187
};

const CARD_FACES = {
  ["Ace"]: { value: 1, texture: "1" }, // Ace is the exception to the value property!
  ["Deuce"]: { value: 2, texture: "2" },
  ["Three"]: { value: 3, texture: "3" },
  ["Four"]: { value: 4, texture: "4" },
  ["Five"]: { value: 5, texture: "5" },
  ["Six"]: { value: 6, texture: "6" },
  ["Seven"]: { value: 7, texture: "7" },
  ["Eight"]: { value: 8, texture: "8" },
  ["Nine"]: { value: 9, texture: "9" },
  ["Ten"]: { value: 10, texture: "10" },
  ["Jack"]: { value: 10, texture: "11" }, // Texture is 11 so that it's alphabetically ordered in File Explorer
  ["Queen"]: { value: 10, texture: "12" },
  ["King"]: { value: 10, texture: "13" }
};
const CARD_SUITS = {
  ["Clubs"]: { texture: "clubs" },
  ["Diamonds"]: { texture: "diamonds" },
  ["Hearts"]: { texture: "hearts" },
  ["Spades"]: { texture: "spades" }
};

const BUTTON_MARGIN = 12;

//-----------------------------------------------------------

// Create action buttons
let actionPosition = 0;
function createActionButton(width, text) {
  // Create new button at current position and move the pointer
  let newButton = new Graphics()
    .beginFill(BUTTON_COLOR)
    .drawRect(0, 0, width, 50)
    .endFill();
  newButton.interactive = true;
  newButton.buttonMode = true;

  newButton.x = actionPosition;
  actionPosition += width + BUTTON_MARGIN;

  // Create text at the center of the button
  let buttonText = new Text(text, { fontFamily: TEXT_FONT, fontSize: 36, fill: 0x000000 });
  buttonText.anchor.set(0.5, 0.5);
  buttonText.position.set(width / 2, 25);

  // Add text and button as children
  newButton.addChild(buttonText);
  actionContainer.addChild(newButton);

  return newButton;
}

let hitButton = createActionButton(100, 'HIT');
let standButton = createActionButton(156, 'STAND');
actionContainerResized();

//-----------------------------------------------------------

// TODO make this part of the container
let faceDownCardSprite = Sprite.from('./assets/cards/card-back.png');
faceDownCardSprite.width = CARD_DIMENSIONS.width;
faceDownCardSprite.height = CARD_DIMENSIONS.height;
faceDownCardSprite.position.set(1380, 160);
faceDownCardSprite.zIndex = 2;
app.stage.addChild(faceDownCardSprite);

// Boolean to check if it is players turn (you are not allowed to press buttons if it is not your turn!)
let isPlayersTurn = true;

let shoe = [];

// Function to create shoe
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

let playerCards = [];
let dealerCards = [];

function getCardTexture(card) {
  return `./assets/cards/${CARD_SUITS[card.suit].texture}-${CARD_FACES[card.face].texture}.png`;
}

// Function to add a card
function addCard(cardRecipient) {
  if (cardRecipient == 'player') {
    let cardForObject = shoe.pop();
    console.log(getCardTexture(cardForObject));
    let card = {
      'face': cardForObject.face,
      'suit': cardForObject.suit,
      'sprite': Sprite.from(getCardTexture(cardForObject))
    };

    app.stage.addChild(card.sprite);
    playerCards.push(card);

    card.sprite.width = CARD_DIMENSIONS.width;
    card.sprite.height = CARD_DIMENSIONS.height;
    card.sprite.position.set(200 + playerCards.length * 30, 100 + playerCards.length * 30);
  }

  else if (cardRecipient == 'dealer') {
    let cardForObject = shoe.pop();
    console.log(getCardTexture(cardForObject));
    let card = {
      'face': cardForObject.face,
      'suit': cardForObject.suit,
      'sprite': Sprite.from(getCardTexture(cardForObject))
    };

    app.stage.addChild(card.sprite);
    dealerCards.push(card);

    card.sprite.width = CARD_DIMENSIONS.width;
    card.sprite.height = CARD_DIMENSIONS.height;
    card.sprite.position.set(1320 + dealerCards.length * 30, 100 + dealerCards.length * 30)
  }
}

addCard('player');
addCard('player');

addCard('dealer');
addCard('dealer');


// Replacing one starter card sprite with card back sprite
dealerCards[1].sprite.visible = false;
console.log(playerCards);

let playerHandTotal = 0;
// Secondary hand total is for when you have aces in hand (i.e hand could be 5 or 15)
let playerSecondaryHandTotal = 0;
let dealerHandTotal = 0;
let dealerSecondaryHandTotal = 0;

let playerHandTotalText = new Text('0', { fontFamily: TEXT_FONT, fontSize: 48, fill: 0xffffff });

playerHandTotalText.position.set(200, 500);

let dealerHandTotalText = new Text('0', { fontFamily: TEXT_FONT, fontSize: 48, fill: 0xffffff });
dealerHandTotalText.position.set(1320, 500);

app.stage.addChild(playerHandTotalText);
app.stage.addChild(dealerHandTotalText);

// Function to get hand total and update handTotalText
function getHandTotal(totalRecipient) {

  if (totalRecipient == 'player') {
    // Reset hand totals
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
    // Reset hand totals
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
  if (dealerHandTotal < 17 && dealerSecondaryHandTotal != 21) {
    await sleep(1000);
    dealerTurn();
  }
}

function hit() {
  // Making sure that you don't have a blackjack or are over 21
  if (playerHandTotal < 21 && (playerHandTotalText.text != BLACKJACK_DISPLAY_TEXT) && isPlayersTurn) {
    addCard('player');
    getHandTotal('player');
  }
}

function stand() {
  isPlayersTurn = false;
  if (dealerHandTotal < 17 && dealerSecondaryHandTotal != 21) {
  dealerTurn();
  }
}

// Adding button listeners HERE
hitButton.on("pointerup", hit);
standButton.on("pointerup", stand);

// Getting hand total for when the program loads up
getHandTotal('player');
getHandTotal('dealer');

//-----------------------------------------------------------