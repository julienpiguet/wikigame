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
      var room = new Room(id);
      room.addPlayer(player);
      room.leader = player;
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
              room.addPlayer(player)
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
  constructor(id) {
    this.players = [];
    this.id = id;
    this.leader = null
    this.scoreboard = []
    this.options = new Option();
    this.onGame = false;
  }
  addPlayer(player) {
    this.players.push(player);
  }
  removePlayer(player) {
    utils.arrayRemove(this.players, player);
  }
  contains(player){
    return this.players.includes(player);
  }
  sendMsg(type,msg, exclude = []) {
    this.players.forEach( (player) => {
      if (!exclude.includes(player))
        player.socket.emit(type, msg);
    });
  }

  sendGameMsg(type, msg){
    this.players.forEach( (player) => {
      if (player.inGame)
        player.socket.emit(type, msg);
    });
  }

  startRound(){
    this.onGame = true;
    this.players.forEach( (player) => player.inGame = true);
    
    

    this.runRound();
    

    /*setTimeout(() => {
      clearInterval(roundInterval);
      console.log('Room '+ this.id + ' round over ');
      this.sendGameMsg('log', 'Round over');
    }, this.options.roundTime*1000);*/

  }

  runRound(){
    var timeCounter = this.options.roundTime.valueOf();
    this.sendGameMsg('log', 'Start round');

    var roundInterval = setInterval(() => {
      //console.log('Room '+ this.id + ' remains '+ (this.timeCounter).toString() + ' sec of game');
      this.sendGameMsg('timer', timeCounter);
      
      if (timeCounter <= 0) {
        clearInterval(roundInterval);
        this.sendGameMsg('log', 'Round Over');
        this.runVote()
      }
      timeCounter--;
    }, 1000);
  }

  runVote(){
    var timeCounter = this.options.voteTime.valueOf();
    this.sendGameMsg('log', 'Start votes');

    var voteInterval = setInterval(() => {
      //console.log('Room '+ this.id + ' remains '+ (this.timeCounter).toString() + ' sec of vote');
      this.sendGameMsg('timer', timeCounter);
      
      if (timeCounter <= 0) {
        clearInterval(voteInterval);
        this.sendGameMsg('log', 'Votes Over');
      }
      timeCounter--;
    }, 1000);
  }
}

class Player {
  constructor(game, socket){
    this.id = uuidv4();
    this.socket = socket;
    this.room = null;
    this.inGame = false;

    socket.on('create', () => {
      if (this.room){
        this.socket.emit('err', 'Already in room')
        return
      }
      game.createRoom(this).then(
        (room) => {
          this.room = room;
          room.sendMsg("log", 'Room created with id: '+ room.id);
        },
        (err) => socket.emit('err', err))
    });
    socket.on('join', (id) => {
      game.joinRoom(this,id).then(
        (room) => {
          this.room = room;
          room.sendMsg("log", this.id + ' joined the room', [this]);
          this.socket.emit('log', 'Room joined')
        },
        (err) => socket.emit('err', err)
      )
    });

    socket.on('leave', () => {
      if (this.room) {
        this.room.removePlayer(this);
        this.room = null;
        socket.emit("log", "Room left");
      } else {
        socket.emit("err", "No current room");
      }
      
    })

    socket.on('start', () => {
      if (this.room && this.room.leader==this)
        this.room.startRound();
      else
        this.socket.emit('err', 'Cannot start the round')
    })

    console.log('User '+this.id+' connected')
  }
}


class Option {
  constructor(){
    this.roundTime = 20;
    this.voteTime= 10;
  }
}

new Game(io);


/****************************************
 * Server
 ****************************************/

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});