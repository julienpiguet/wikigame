const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dns = require('dns');
dns.setServers(['8.8.8.8']);

const wiki = require('./wiki.js')

const hostname = 'localhost';
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/example/index.html');

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

/*io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
  });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });*/

//io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});