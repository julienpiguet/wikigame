const {emitLog} = require('./log.js');
const {Option} = require('./Option.js');
const utils = require('./utils.js');

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
        this.players = utils.arrayObjRemove(this.players, player.id);
    }
    contains(player) {
        return this.players.includes(player);
    }
    sendLog(id, data = null, exclude = [], type = null, inGame = false) {
        this.players.forEach((player) => {
            if (!exclude.includes(player) && ((player.inGame == inGame) || !inGame))
                if (type != null)
                    emitLog(player.socket, id, data, type)
                else
                    emitLog(player.socket, id, data)
        });
    }

    sendGameLog(id, data = null, type = null) {
        this.sendLog(id, data, [], type, true)
    }

    startRound() {
        this.onGame = true;
        this.players.forEach((player) => player.inGame = true);

        this.runRound();

    }

    runRound() {
        var timeCounter = this.options.roundTime.valueOf();
        this.sendGameLog(203);

        var roundInterval = setInterval(() => {
            //console.log('Room '+ this.id + ' remains '+ (this.timeCounter).toString() + ' sec of game');
            this.sendGameLog(100, timeCounter, 'timer');

            if (timeCounter <= 0) {
                clearInterval(roundInterval);
                this.sendGameLog(204);
                this.runVote()
            }
            timeCounter--;
        }, 1000);
    }

    runVote() {
        var timeCounter = this.options.voteTime.valueOf();
        this.sendGameLog(205);

        var voteInterval = setInterval(() => {
            //console.log('Room '+ this.id + ' remains '+ (this.timeCounter).toString() + ' sec of vote');
            this.sendGameLog(100, timeCounter, 'timer');

            if (timeCounter <= 0) {
                clearInterval(voteInterval);
                this.sendGameLog(206);
            }
            timeCounter--;
        }, 1000);
    }
}

module.exports.Room = Room;