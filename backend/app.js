const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dns = require('dns');
dns.setServers(['8.8.8.8']);
const { v4: uuidv4 } = require('uuid')

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
    this.players = [];

    io.on('connection', (socket) => {
      this.players.push(new Player(this, socket));
    });

    io.on('disconnect', (socket) => {
      console.log('Socket '+ socket.id +' disconected');
    });

  }
  createRoom(player){
    var rooms = this.rooms
    return new Promise( function (resolve, reject){
      var id = utils.generateId(10);
      console.log('Create room: ' + id);
      var room = new Room(io, id);
      room.addPlayer(player);
      rooms.push(room);
      resolve(room);
    });
  }
  joinRoom(player, roomId){
    var rooms = this.rooms
    return new Promise( function (resolve, reject){
      var added = false;
        rooms.forEach((room, index, array) => {
          if (room.id == roomId) {
            if (!room.contains(player)){
              //room.sendMsg("log", "New user in room");
              room.addPlayer(player)
              //socket.emit("log", "Room joined");
              resolve(room)
            } else {
              reject("Already in room")
            }
            added = true;
          }
        })
        if (!added) reject("Room not found"); 
    });
    
  }
}

class Room {
  constructor(io, id) {
    this.players = [];
    this.id = id;
  }
  addPlayer(player) {
    this.players.push(player);
  }
  removePlayer(player) {
    utils.arrayRemove(this.players, player);
  }
  contains(player){
    return this.players.find( elm => elm == player) != undefined
  }
  sendMsg(type,msg) {
    this.players.forEach( (player) => player.socket.emit(type, msg));
  }
}

class Player {
  constructor(game, socket){
    this.id = uuidv4();
    this.socket = socket;
    this.room = null;

    socket.on('create', () => {
      game.createRoom(this).then(
        (room) => {
          this.room = room;
          room.sendMsg("log", 'Room created with id: '+ room.id);
        },
        (err) => socket.emit('log', err))
    });
    socket.on('join', (id) => {
      game.joinRoom(this,id).then(
        (room) => {
          this.room = room;
          room.sendMsg("log", this.id + ' joined the room');
        },
        (err) => socket.emit('log', err)
      )
    });

    socket.on('leave', () => {
      game.rooms.forEach(room => utils.arrayRemove(room.player_sockets, socket));
      socket.emit("log", "Leave room");
    })

    console.log('User '+this.id+' connected')
  }
}


new Game(io);


/****************************************
 * Server
 ****************************************/

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});