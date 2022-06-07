
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);

const dns = require('dns');
dns.setServers(['8.8.8.8']);

const wiki = require('./game/wiki.js')


const {Game} = require('./game/Game.js');

const hostname = 'localhost';
const port = 3000;

/****************************************
 * API
 ****************************************/

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/example/test.html');

});

app.get('/random', (req, res) => {

  wiki.getRandomWiki().then(
    (data) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send({ data });
    },
    (err) => {
      console.error("Error: " + err.message);
      res.statusCode = 500;
      res.end("Error: " + err.message);
    }
  )
});

app.get('/join/:id', (req, res) => {

});



/****************************************
 * Game
 ****************************************/

 const { Server } = require("socket.io");
 const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080"
  }
});

new Game(io);


/****************************************
 * Server
 ****************************************/

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});