const {Room} = require('./Room.js');
const {Player} = require('./Player.js');
const utils = require('./utils.js');

class Game {

    constructor(io) {
        this.rooms = [];
        this.io = io;
        this.players = [];
        this.delay = 1000;

        io.on('connection', (socket) => {
            this.players.push(new Player(this, socket));
        });

        io.on('connect_error', (socket) => {
            console.log('Socket ' + socket.id + ' disconected');
        });

    }
    createRoom(player) {
        var rooms = this.rooms;
        return new Promise(function (resolve, reject) {
            var id = utils.generateId(10);
            console.log('Create room: ' + id);
            var room = new Room(id);
            room.leader = player;
            room.addPlayer(player);
            rooms.push(room);
            resolve(room);
        });
    }

    joinRoom(player, roomId) {
        var rooms = this.rooms;
        return new Promise(function (resolve, reject) {
            var added = false;
            rooms.forEach((room, index, array) => {
                if (room.id == roomId) {
                    if (!room.contains(player)) {
                        room.addPlayer(player)
                        resolve(room)
                    } else {
                        reject(300)
                    }
                    added = true;
                }
            })
            if (!added) reject(304);
        });
    }

    run(){
        return setInterval(this.runtime, this.delay, this);
    }

    runtime(game) {
        var toDelete = []
        game.rooms.forEach( room => {
            if (room.deleted) toDelete.push(room);
        });
        toDelete.forEach(room => {
            game.rooms = utils.arrayObjRemove(game.rooms, room);
        })
    }
}

module.exports.Game = Game;