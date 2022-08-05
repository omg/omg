const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require("path");

app.use(express.static(path.join(__dirname, "../../public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/dist', 'index.html'));
});

const PORT = 8080;

let gameState = {
  players: [],
  turnIndex: 0,
  rollsRemaining: 3,
  dice: [],
  heldDice: []
}

// Giving each player a userID when they join the server
let currentUserID = 1;

let connectedPlayers = {};

// Function to get number of players connected to the server
function getNumberOfPlayers() {
  return Object.keys(connectedPlayers).length;
}

function checkIfStart() {

}

io.on('connection', (socket) => {
  console.log('User connected');

  let userID = currentUserID;
  connectedPlayers[userID] = socket;
  currentUserID++;

  socket.emit('tellID', userID);

  console.log("Connected players: " + getNumberOfPlayers());

  checkIfStart();

  socket.on('disconnect', () => {
    console.log('User disconnected');
    delete connectedPlayers[userID];

    console.log("Connected players: " + getNumberOfPlayers());
  });
});

server.listen(PORT, () => {
  console.log("💝 OMG server running at port " + PORT);
});