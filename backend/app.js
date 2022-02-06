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
const utils = require('./utils.js');
const { Interface } = require('readline');

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
 * Socket
 ****************************************/



/*io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
  });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });*/

//io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

/****************************************
 * Game
 ****************************************/

class Game {
  constructor(io) {
    this.rooms = [];
    this.io = io;

    io.on('connection', (socket) => {
      socket.on('create', () => {
        var id = utils.generateId(10);
        console.log('Create room: ' + id);
        var room = new Room(io, id);
        room.addPlayer(socket);
        this.rooms.push(room);
        room.sendMsg("log", 'Room created with id: '+ id)
      });
      socket.on('join', (id) => {
        var added = false;
        this.rooms.forEach((room, index, array) => {
          if (room.id == id) {
            if (room.player_sockets.find( element => element == socket) == undefined){
              room.sendMsg("log", "New user in room");
              room.player_sockets.push(socket)
              socket.emit("log", "Room joined");
            } else {
              socket.emit("log", "Already in room");
            }
            added = true;
          }
        })
        if (!added) socket.emit("log", "Room not found");
      });

      socket.on('leave', () => {
        this.rooms.forEach(room => utils.arrayRemove(room.player_sockets, socket));
        socket.emit("log", "Leave room");
      })
    });

  }
}

class Room {
  constructor(io, id) {
    this.player_sockets = [];
    this.id = id;
  }
  addPlayer(socket) {
    this.player_sockets.push(socket);
  }
  removePlayer(socket) {
    utils.arrayRemove(this.player_sockets, socket);
  }
  sendMsg(type,msg) {
    this.player_sockets.forEach( (socket) => socket.emit(type, msg));
  }
}



new Game(io);


/****************************************
 * Server
 ****************************************/

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});