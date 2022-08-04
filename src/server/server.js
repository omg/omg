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

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('letter', (letter) => {
    socket.broadcast.emit('letter', letter);
  });
});

server.listen(PORT, () => {
  console.log("💝 OMG server running at port " + PORT);
});