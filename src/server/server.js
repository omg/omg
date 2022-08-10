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

let connectedPlayers = {};
let currentUserID = 1;

function getNumberOfPlayers() {
  return Object.keys(connectedPlayers).length;
}

export default io;

io.on('connection', (socket) => {
  let userID = currentUserID;
  connectedPlayers[userID] = socket;
  currentUserID++;

  console.log('Player connected to Boba server - ' + getNumberOfPlayers() + ' online.');

  socket.on('disconnect', () => {
    delete connectedPlayers[userID];

    console.log("Player disconnected from Boba server - " + getNumberOfPlayers() + ' online.');
  });
});

server.listen(PORT, () => {
  console.log("💝 Boba server active!");
});