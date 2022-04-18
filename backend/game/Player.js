const { emitLog } = require('./log.js');
const { v4: uuidv4 } = require('uuid')
const { isValidLang, getLang } = require('./lang.js');

class Player {
    constructor(game, socket) {
        this.id = uuidv4();
        this.socket = socket;
        this.room = null;
        this.inGame = false;
        this.lang = "fr";
        this.name = "Guest " + this.id.substring(0,4);

        socket.on('create', () => {
            if (this.room) {
                emitLog(this.socket, 300)
                return
            }
            game.createRoom(this).then(
                (room) => {
                    this.room = room;
                    room.sendLog(200, room.id);
                },
                (err) => emitLog(socket, err))
        });
        socket.on('join', (id) => {
            game.joinRoom(this, id).then(
                (room) => {
                    this.room = room;
                    room.sendLog(207, this.id, [this]);
                    emitLog(this.socket, 201)
                },
                (err) => emitLog(socket, err)
            )
        });

        socket.on('leave', () => {
            if (this.room) {
                var currentRoom = this.room;
                this.room.removePlayer(this);
                this.room = null;
                currentRoom.sendLog(208, this.id, [this])
                emitLog(socket, 202)
            } else {
                emitLog(socket, 301)
            }

        })

        socket.on('start', () => {
            if (this.room) {
                if (this.room.leader == this)
                    this.room.startRound();
                else emitLog(this.socket, 303)
            } else
                emitLog(this.socket, 302)
        })

        socket.on('vote', (id) => {
            if (this.room) {
                this.room.playerVote(this.id, id).then(
                    (msg) => emitLog(this.socket, msg),
                    (err) => emitLog(this.socket, err)
                )
            } else
                emitLog(this.socket, 302)
        })

        socket.on('image', (img) => {
            this.room.addImage(this, img).then(
                (msg) => emitLog(this.socket, msg),
                (err) => emitLog(this.socket, err)
            )
        })

        socket.on('setname', (name) => {
            name = name.toString();
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if(format.test(name)){
                emitLog(socket, 313);
                return;
            }

            if (name.length>32){
                emitLog(socket, 312);
                return;
            }

            this.name = name;
            emitLog(socket, 212, name);
        })

        socket.on('setlang', (lang) => {
            if (isValidLang(lang)){
                this.lang = lang;
                emitLog(socket, 211, getLang(lang));
            } else {
                emitLog(socket, 311);
            }
        })

        console.log('User ' + this.id + ' connected')
    }
}

module.exports.Player = Player;
