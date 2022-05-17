import { Application, Sprite, Graphics, Text, Container } from 'pixi.js';
import scss from './style.scss';

//-----------------------------------------------------------
// Application

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
  actionContainer.position.set(window.innerWidth / 2, window.innerHeight - 60);
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

function getCardTexture(card) {
  return `./assets/cards/${CARD_SUITS[card.suit].texture}-${CARD_FACES[card.face].texture}.png`;
}

//-----------------------------------------------------------
// Constants

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
// Buttons

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
// Shoe

let shoe;
function createShoe(numberOfDecks) {
  shoe = [];

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

//-----------------------------------------------------------
// Players

let players = [];

// Boolean to check if player has already bet on their turn or not
let hasBet = false;

// Grabbing input field
let moneyInput = document.getElementById("money_input");

class Player {
  constructor(username) {
    this.username = username;
    this.hand = [];
    this.money = 5000; 

    // Current bet needs to be stored from turn to turn so that player can be paid out and so that double downs and splits can be processed correctly
    this.bet;
    
    this.handContainer = new Container();
    this.handContainer.sortableChildren = true; // Apparently, this is not performant (see pixijs/layers instead)
    app.stage.addChild(this.handContainer);

    // Txt variable that displays money on screen
    this.moneyText = new Text("$" + this.money, { fontFamily: TEXT_FONT, fontSize: 48, fill: 0xffffff });
    this.moneyText.position.set(0, 520);
    this.moneyText.visible = true;
    this.handContainer.addChild(this.moneyText);

    players.push(this);
  }

  addCard() {
    let card = shoe.pop();

    // Create the sprite
    let cardSprite = Sprite.from(getCardTexture(card));
    cardSprite.width = CARD_DIMENSIONS.width;
    cardSprite.height = CARD_DIMENSIONS.height;
    cardSprite.position.set(this.hand.length * 30, this.hand.length * 30);
    cardSprite.zIndex = this.hand.length;

    // Add the sprite to the player's hand container
    this.handContainer.addChild(cardSprite);

    // Add the sprite to the card object
    card.sprite = cardSprite;
    
    this.hand.push(card);
  }

  addCards(amount) {
    for (let i = 0; i < amount; i++) this.addCard();
  }

  // Making this a separate function for now because there will be more to this later on
  betMoney() {
    if (moneyInput.value <= this.money) {
      moneyInput.className = "modal hidden";
      this.bet = moneyInput.value;
      this.money = this.money - moneyInput.value;
      this.moneyText.text = this.money;
    }
  }
}

let dealer = new Player("Dealer");
let player = new Player("Lame Guest");

dealer.moneyText.visible = false;

moneyInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && !hasBet) {
    hasBet = true;
    player.betMoney();
  }
});

dealer.addCards(2);
player.addCards(2);

// Temporarily just move the hand containers
player.handContainer.position.set(200, 100);
dealer.handContainer.position.set(1320, 100);

//-----------------------------------------------------------
// Game logic

// TODO make this part of the container

// Face down card sprite for initial dealer hand (player should only be able to see one upcard from the dealer)
let faceDownCardSprite = Sprite.from('./assets/cards/card-back.png');
faceDownCardSprite.width = CARD_DIMENSIONS.width;
faceDownCardSprite.height = CARD_DIMENSIONS.height;
faceDownCardSprite.position.set(30, 30);
faceDownCardSprite.zIndex = 1;
dealer.handContainer.addChild(faceDownCardSprite);

// Boolean to check if it is players turn (you are not allowed to press buttons if it is not your turn!)
let isPlayersTurn = true;

// Replacing one starter card sprite with card back sprite
dealer.hand[1].sprite.visible = false;

let playerHandTotal = 0;
// Secondary hand total is for when you have aces in hand (i.e hand could be 5 or 15)
let playerSecondaryHandTotal = 0;
let dealerHandTotal = 0;
let dealerSecondaryHandTotal = 0;

let playerHandTotalText = new Text('0', { fontFamily: TEXT_FONT, fontSize: 48, fill: 0xffffff });

playerHandTotalText.position.set(200, 500);

let dealerHandTotalText = new Text('0', { fontFamily: TEXT_FONT, fontSize: 48, fill: 0xffffff });
dealerHandTotalText.position.set(1320, 500);
dealerHandTotalText.visible = false;

app.stage.addChild(playerHandTotalText);
app.stage.addChild(dealerHandTotalText);

// Function to get hand total and update handTotalText
function getHandTotal(totalRecipient) {

  if (totalRecipient == 'player') {
    // Reset hand totals
    playerHandTotal = 0;
    playerSecondaryHandTotal = 0;
    let numberOfAces = 0;
    for (const card of player.hand) {
      if (CARD_FACES[card.face].value == 1) {
        numberOfAces++;
      }
      playerHandTotal += CARD_FACES[card.face].value;
    }

    playerSecondaryHandTotal = playerHandTotal + 10 * numberOfAces;

    if (playerSecondaryHandTotal == 21 && player.hand.length == 2) {
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
    for (const card of dealer.hand) {
      if (CARD_FACES[card.face].value == 1) {
        numberOfAces++;
      }
      dealerHandTotal += CARD_FACES[card.face].value;
    }
    
    dealerSecondaryHandTotal = dealerHandTotal + 10 * numberOfAces;
    
    if (dealerSecondaryHandTotal == 21 && dealer.hand.length == 2) {
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
  dealer.addCard();
  getHandTotal('dealer');
  if (dealerHandTotal < 17 && dealerSecondaryHandTotal != 21) {
    await sleep(1000);
    dealerTurn();
  }
}

function hit() {
  // Making sure that you don't have a blackjack or are over 21
  if (playerHandTotal < 21 && (playerHandTotalText.text != BLACKJACK_DISPLAY_TEXT) && isPlayersTurn) {
    player.addCard();
    getHandTotal('player');
  }
}

async function stand() {
  isPlayersTurn = false;
  
  dealerHandTotalText.visible = true;
  dealer.hand[1].sprite.visible = true;
  faceDownCardSprite.visible = false;
  
  if (dealerHandTotal < 17 && dealerSecondaryHandTotal != 21) {
    await sleep(1000);
    dealerTurn();
  }
}

// Adding button listeners HERE
hitButton.on("pointerup", hit);
standButton.on("pointerup", stand);

// Getting hand total for when the program loads up
getHandTotal('player');
getHandTotal('dealer');

function startHand() {
  //TO DO WRITE TURN LOGIC HERE AND LET THE USER PLAY THE FUCKING GAME
}