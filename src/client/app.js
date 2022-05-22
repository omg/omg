import { Application, Sprite, Graphics, Text, Container } from 'pixi.js';

// By including this line, webpack adds the CSS style to our HTML page
import scss from './sass/style.scss';

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
let doubleDownButton = createActionButton(330, 'DOUBLE DOWN');
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

    // Text variable that displays money on screen
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

    let hasAce = false;
    for (const card of this.hand) {
      if (CARD_FACES[card.face].value == 1) hasAce = true;
      this.handTotal += CARD_FACES[card.face].value;
    }

    this.secondaryHandTotal = hasAce == true ? this.handTotal + 10 : this.handTotal;

    if (this.secondaryHandTotal == 21 && this.hand.length == 2) {
      // Update text for a blackjack
      this.handTotalText.text = BLACKJACK_DISPLAY_TEXT;
    } else if (this.handTotal > 21) {
      // Update text for a bust
      this.handTotalText.text = this.handTotal + " " + BUST_DISPLAY_TEXT; 
    } else if (this.handTotal == 21 || this.secondaryHandTotal == 21) {
      // Simplify text to 21 when achieved (in case the hand is 11/21)
      this.handTotalText.text = "21";
    } else if (!hasAce) {
      // Update text to the total when player has no aces
      this.handTotalText.text = this.handTotal;
    } else if (hasAce && this.secondaryHandTotal > 21) {
      // Update text to the total when the player has aces but the secondary total is a bust
      this.handTotalText.text = this.handTotal;
    } else if (hasAce) {
      // Update text to show both totals when the secondary total doesn't bust
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

   // Checks if player has a Blackjack
   hasBlackjack() {
     if (this.getSignificantTotal() == 21 && this.hand.length == 2) return true;
     return false;
   }
}

let dealer = new Player("Dealer");
let player = new Player("Lame Guest");

// Temporarily just move the hand containers
player.handContainer.position.set(200, 100);
dealer.handContainer.position.set(1320, 100);

//-----------------------------------------------------------
// Game logic

let hasBet = false; // For performing actions
let hasHit = false; // For doubling down
let hasStood = false; // For knowing if the player has stood
let isPlayersTurn = true; // For knowing if the player is allowed to perform actions

// Face down card sprite for the dealer's hand
let faceDownCardSprite = Sprite.from('./assets/cards/card-back.png');
faceDownCardSprite.width = CARD_DIMENSIONS.width;
faceDownCardSprite.height = CARD_DIMENSIONS.height;
faceDownCardSprite.position.set(30, 30);
faceDownCardSprite.zIndex = 1;
dealer.handContainer.addChild(faceDownCardSprite);

// Special dealer behavior
dealer.handTotalText.visible = false;
dealer.moneyText.visible = false;

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
async function resetGame(fromStart = false) {
  if (!fromStart) await sleep(2000);

  // Reset logic
  hasHit = false;
  hasStood = false;
  hasBet = false;
  isPlayersTurn = true;

  hideContainers();

  // Make the betting box visible again
  moneyInput.className = "modal";
  moneyInput.focus();
  moneyInput.select();

  // Delete all added cards from every player
  for (const currentPlayer of players) {
    for (const card of currentPlayer.hand) {
      currentPlayer.handContainer.removeChild(card.sprite);
    }
    currentPlayer.hand = [];
  }

  // Create new shoe if it is almost empty
  if (shoe.length <= 78) createShoe(6);
}

// Function to pay out player depending on if they won, lost, tied, or got a Blackjack
function payPlayer(player) {
  // Do not continue if the dealer has a blackjack and the player doesn't
  if (!player.hasBlackjack() && dealer.hasBlackjack()) return;

  // Pay out a blackjack if the dealer doesn't have a blackjack
  if (player.handTotalText.text == BLACKJACK_DISPLAY_TEXT && dealer.handTotalText.text != BLACKJACK_DISPLAY_TEXT) {
    player.pay(Math.ceil(2.5 * player.bet));
    return;
  }
  
  // Pay out a win from a higher total or dealer bust
  if (player.getSignificantTotal() > dealer.getSignificantTotal() || dealer.getSignificantTotal() > 21) {
    player.pay(2 * player.bet);
    return;
  }
  
  // Pay out a push from an equivalent total
  if (player.getSignificantTotal() == dealer.getSignificantTotal()) {
    player.pay(player.bet);
  }
}

// Function to handle dealer drawing cards
async function dealerTurn() {
  await sleep(1000);

  if (dealer.handTotal < 17 && dealer.secondaryHandTotal != 21) {
    dealer.addCard();
    dealerTurn();
    return;
  }

  payPlayer(player);
  resetGame();
}

function hit() {
  if (player.getSignificantTotal() >= 21 || !isPlayersTurn) return;

  hasHit = true;
  player.addCard();
  
  if (player.handTotal > 21) {
    resetGame();
  } else if (player.getSignificantTotal() == 21) {
    stand();
  }
}
hitButton.on("click", hit);

function stand() {
  if (hasStood) return;

  hasStood = true;
  isPlayersTurn = false;
  
  dealer.handTotalText.visible = true;
  dealer.hand[1].sprite.visible = true;
  faceDownCardSprite.visible = false;

  dealerTurn();
}
standButton.on("click", stand);

// Doubling down doubles your bet, hits once, then stands
function doubleDown() {
  // Repeating original bet
  if (!isPlayersTurn || hasHit || player.money < player.bet) return;

  player.pay(-player.bet);
  player.bet *= 2;

  player.addCard();

  if (player.handTotal > 21) {
    resetGame();
  } else {
    stand();
  }
}
doubleDownButton.on("click", doubleDown);

async function checkForBlackjack(player) {
  if (player.handTotalText.text == BLACKJACK_DISPLAY_TEXT) {
    await sleep(1000);
    stand();
  }
}

function startHand() {
  // Give all players fresh cards
  for (const player of players) {
    player.addCards(2);
  }

  // Replace the second card sprite with the dummy card back
  dealer.hand[1].sprite.visible = false;
  faceDownCardSprite.visible = true;

  showContainers();
  checkForBlackjack(player);
}

// Listen for bet input box updates
function betUpdated() {
  // Removes leading 0s and anything that's not a number
  moneyInput.value = moneyInput.value.replace(/^0+|[^0-9]/g, "");
}
moneyInput.addEventListener("input", betUpdated);
moneyInput.addEventListener("propertychange", betUpdated); // for IE8

function bet() {
  let bet = parseInt(moneyInput.value) || 0;
  if (bet <= 0 || bet > player.money || hasBet) return;

  hasBet = true;
  player.betMoney(bet);
  moneyInput.className = "modal hidden";
  startHand();
}

moneyInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") bet();
});

// Start game
resetGame(true);