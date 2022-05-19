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
    this.handContainer.addChild(this.moneyText);

    this.handTotal = 0;
    // Secondary hand total is for when you have aces in hand (i.e hand could be 5 or 15)
    this.secondaryHandTotal = 0;

    this.handTotalText = new Text('0', { fontFamily: TEXT_FONT, fontSize: 48, fill: 0xffffff });
    this.handTotalText.position.set(0, 450);
    
    this.handContainer.addChild(this.handTotalText);
    
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
    this.getHandTotal();
  }

  addCards(amount) {
    for (let i = 0; i < amount; i++) this.addCard();
  }

  // Making this a separate function for now because there will be more to this later on
  betMoney(amount) {
    this.bet = amount;
    this.money = this.money - amount;
    this.moneyText.text = "$" + this.money;
  }

  // Function to get hand total and update handTotalText
  getHandTotal() {
    // Reset hand totals
    this.handTotal = 0;
    this.secondaryHandTotal = 0;
    let numberOfAces = 0;
    for (const card of this.hand) {
      if (CARD_FACES[card.face].value == 1) {
        numberOfAces++;
      }
      this.handTotal += CARD_FACES[card.face].value;
     }

    this.secondaryHandTotal = this.handTotal + 10 * numberOfAces;

     if (this.secondaryHandTotal == 21 && this.hand.length == 2) {
      this.handTotalText.text = BLACKJACK_DISPLAY_TEXT;
    }

    else if (this.handTotal > 21) {
       this.handTotalText.text = this.handTotal + " " + BUST_DISPLAY_TEXT; 
     }

     else if (this.handTotal == 21 || this.secondaryHandTotal == 21) {
       this.handTotalText.text = "21";
     }

     else if (numberOfAces == 0) {
      this.handTotalText.text = this.handTotal;
     }

     else if (numberOfAces != 0 && this.secondaryHandTotal > 21) {
      this.handTotalText.text = this.handTotal;
    }

    else if (numberOfAces != 0) {
       this.handTotalText.text = this.handTotal + "/" + this.secondaryHandTotal;
     }
   }

   pay(amount) {
     this.money += amount;
     this.moneyText.text = "$" + this.money;
   }

   // Returns the higher of the player's hand totals that does not bust them
   getSignificantTotal() {
    return this.secondaryHandTotal > 21 ? this.handTotal : this.secondaryHandTotal;
   }
}

let dealer = new Player("Dealer");
let player = new Player("Lame Guest");

// Temporarily just move the hand containers
player.handContainer.position.set(200, 100);
dealer.handContainer.position.set(1320, 100);

//-----------------------------------------------------------
// Game logic

// Boolean to check if player has already stood on their turn
let hasStood = false;

// Boolean to check if player has already bet on their turn
let hasBet = false;

// Face down card sprite for initial dealer hand (player should only be able to see one upcard from the dealer)
let faceDownCardSprite = Sprite.from('./assets/cards/card-back.png');
faceDownCardSprite.width = CARD_DIMENSIONS.width;
faceDownCardSprite.height = CARD_DIMENSIONS.height;
faceDownCardSprite.position.set(30, 30);
faceDownCardSprite.zIndex = 1;
dealer.handContainer.addChild(faceDownCardSprite);

// The dealer's hand total should not be visible before their first card is revealed
dealer.handTotalText.visible = false;

// The dealer is a special type of player, so they technically have a bet too, but it should never be shown
dealer.moneyText.visible = false;

// Boolean to check if it is players turn (you are not allowed to press buttons if it is not your turn!)
let isPlayersTurn = true;

// Function that hides all containers from view (meant to be used to hide things before player has bet)
function hideContainers() {
  actionContainer.visible = false;
  dealer.handContainer.visible = false;
  player.handTotalText.visible = false;
}

// Function that shows all containers (meant to be used to show things to player after they have bet)
function showContainers() {
  actionContainer.visible = true;
  dealer.handContainer.visible = true;
  dealer.handTotalText.visible = false;
  player.handTotalText.visible = true;
}

// Function to reset the GUI to its original position after a hand has been played
async function resetGame() {
  await sleep(1000);
  // Resetting flag booleans
  hasStood = false;
  hasBet = false;
  isPlayersTurn = true;
  hideContainers();
  // Making the betting box visible again
  moneyInput.className = "modal";
  moneyInput.focus();
  moneyInput.select();

  // Deleting all added cards from the player's hand containers
  for (const currentPlayer of players) {
    for (const card of currentPlayer.hand) {
      currentPlayer.handContainer.removeChild(card.sprite);
    }
    currentPlayer.hand = [];
  }
}

// Function to pay out player depending on if they won, lost, tied, or got a Blackjack
function payPlayer(player) {

  console.log(player.getSignificantTotal(), dealer.getSignificantTotal());
  // For Blackjacks
  if (player.handTotalText.text != BLACKJACK_DISPLAY_TEXT && dealer.handTotalText.text == BLACKJACK_DISPLAY_TEXT) return;

  if (player.handTotalText.text == BLACKJACK_DISPLAY_TEXT && dealer.handTotalText.text != BLACKJACK_DISPLAY_TEXT) {
    player.pay(Math.ceil(2.5 * player.bet));
  }

  else if (player.getSignificantTotal() > dealer.getSignificantTotal() || dealer.getSignificantTotal() > 21) {
    player.pay(2 * player.bet);
  }
  // For pushes
  else if (player.getSignificantTotal() == dealer.getSignificantTotal()) {
    player.pay(player.bet);
  }
}

// Function to handle dealer drawing cards
async function dealerTurn() {
  dealer.getHandTotal();
  await sleep(1000);
  console.log(dealer.handTotal);
  if (dealer.handTotal < 17 && dealer.secondaryHandTotal != 21) {
    dealer.addCard();
    dealerTurn();
    return;
  }
  payPlayer(player);
  await sleep(3000);
  resetGame();
}

async function hit() {
  // Making sure that you don't have a blackjack or are over 21
  if (player.handTotal < 21 && (player.handTotalText.text != BLACKJACK_DISPLAY_TEXT) && isPlayersTurn) {
    player.addCard();
    // Resets game upon player busting
    if (player.handTotal > 21) {
      await sleep(3000);
      resetGame();
    }

    else if (player.handTotal == 21 || player.secondaryHandTotal == 21) {
      stand();
    }
  }
}

function stand() {
  if (hasStood == false) {
    hasStood = true;
    isPlayersTurn = false;
    
    dealer.handTotalText.visible = true;
    dealer.hand[1].sprite.visible = true;
    faceDownCardSprite.visible = false;

    dealerTurn();
  }
}

async function checkForBlackJack(player) {
  if (player.handTotalText.text == BLACKJACK_DISPLAY_TEXT) {
    await sleep(1000);
    stand();
  }
}

// Adding button listeners HERE
hitButton.on("pointerup", hit);
standButton.on("pointerup", stand);

function startHand() {
  //giving the player and dealer brand new cards
  player.addCards(2);
  dealer.addCards(2);

  // Replacing one starter card sprite with card back sprite
  console.log(dealer.handContainer.children);
  dealer.hand[1].sprite.visible = false;
  faceDownCardSprite.visible = true;

  showContainers();
  checkForBlackJack(player);
}

function betUpdated() {
  // Removes leading 0s and anything that's not a number
  moneyInput.value = moneyInput.value.replace(/^0+|[^0-9]/g, "");
}

function bet() {
  let bet = parseInt(moneyInput.value) || 0;
  if (bet > player.money || hasBet) return;

  hasBet = true;
  player.betMoney(bet);
  moneyInput.className = "modal hidden";
  startHand();
}

// Listen for bet input update
moneyInput.addEventListener("input", betUpdated);
moneyInput.addEventListener("propertychange", betUpdated); // for IE8

moneyInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") bet();
});

// Starting off with containers hidden
hideContainers();
console.log(dealer.handContainer.children);


//TODO
//HANDLE PAYOUTS IN dealerTurn() (payPlayer())
//HIDE EVERYTHING AGAIN AND BRING BACK THE BET BUTTON (resetGame())