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
            console.log(this.id+ " create room");
            if (this.room) {
                console.log("Already in room");
                emitLog(this.socket, 300)
                return
            }
            game.createRoom(this).then(
                (room) => {
                    this.room = room;
                    emitLog(this.socket, 109, true, "owner")
                    room.sendLog(200, room.id);
                },
                (err) => emitLog(socket, err))
        });

        socket.on('join', (id) => {
            game.joinRoom(this, id).then(
                (room) => {
                    this.room = room;
                    room.sendLog(207, this.name, [this]);
                    emitLog(this.socket, 201)
                },
                (err) => emitLog(socket, err)
            )
        });

        socket.on('leave', () => {
            if (this.room) {
                var currentRoom = this.room;
                this.room = null;
                this.inGame = false;
                currentRoom.removePlayer(this).then(
                    () => {
                        currentRoom.sendLog(208, this.name, [this])
                        emitLog(socket, 202)
                    },
                    (err) => {
                        console.log("Delete room: " + err)
                    }
                );
            } else {
                emitLog(socket, 301)
            }

        });

        socket.on('start', () => {
            if (this.room) {
                if (this.room.leader == this)
                    this.room.startRound();
                else emitLog(this.socket, 303)
            } else
                emitLog(this.socket, 302)
        });

        socket.on('vote', (id) => {
            if (this.room) {
                this.room.playerVote(this.id, id).then(
                    (msg) => emitLog(this.socket, msg),
                    (err) => emitLog(this.socket, err)
                )
            } else
                emitLog(this.socket, 302)
        });

        socket.on('image', (img) => {
            if (this.room) {
                this.room.addImage(this, img).then(
                    (msg) => emitLog(this.socket, msg),
                    (err) => emitLog(this.socket, err)
                )
            } else
                emitLog(this.socket, 302)
        });

        socket.on('setname', (name) => {
            var oldname = this.name;
            name = name.toString();
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if(format.test(name)){
                emitLog(socket, 313);
                return;
            }

            if (name.length>20){
                emitLog(socket, 312);
                return;
            }

            this.name = name;
            emitLog(socket, 212, name);
            emitLog(this.socket, 108, this.name, "username");
            if (this.room) {
                this.room.sendLogPrefix(216, name, [this], oldname)
                this.room.sendScoreboard();
            }
        });

        socket.on('setlang', (lang) => {
            if (isValidLang(lang)){
                this.lang = lang;
                emitLog(socket, 211, getLang(lang));
            } else {
                emitLog(socket, 311);
            }
        });
        
        socket.on('getname', () => {
            emitLog(this.socket, 108, this.name, "username");
        })

        socket.on('chatmsg', (msg) => {
            if (!this.room) emitLog(socket, 301)
            this.room.sendChatMsg(msg, this);
        })
        
        emitLog(this.socket, 108, this.name, "username");
        console.log('User ' + this.name + ' connected');
    }
}

module.exports.Player = Player;
