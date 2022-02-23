const { emitLog } = require('./log.js');
const { Option } = require('./Option.js');
const utils = require('./utils.js');
const wiki = require('./wiki.js')

class Room {
    constructor(id) {
        this.players = [];
        this.id = id;
        this.leader = null
        this.scoreboard = new Map();
        this.votes = null;
        this.options = new Option();
        this.onGame = false;
        this.pages = null;

    }
    addPlayer(player) {
        this.players.push(player);
        this.scoreboard.set(player.id, 0);
    }
    removePlayer(player) {
        this.players = utils.arrayObjRemove(this.players, player.id);
        if (this.leader == player) {
            this.leader = this.players[0];
        }
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
        if (this.onGame) {
            emitLog(this.leader.socket, 306);
            return
        }

        this.onGame = true;
        this.players.forEach((player) => player.inGame = true);
        this.pages = new Map();


        var promises = [];
        this.players.forEach((player) => {
            if (player.inGame)
                promises.push(this.sendWikiPage(player))
        });

        Promise.all(promises).then(() => {
            this.runRound().then(
                () => this.runVote().then(
                    () => {
                        this.onGame = false;
                        this.players.forEach((player) => player.inGame = false);
                        this.pages = null;
                    }
                )
            )
        })
    }

    runRound() {
        return new Promise((resolve, reject) => {
            var timeCounter = this.options.roundTime.valueOf();

            this.sendGameLog(203);
            var roundInterval = setInterval(() => {
                this.sendGameLog(100, timeCounter, 'timer');

                if (timeCounter <= 0) {
                    clearInterval(roundInterval);
                    this.sendGameLog(204);
                    resolve();
                }
                timeCounter--;
            }, 1000);
        })
    }

    runVote() {
        return new Promise((resolve, reject) => {
            var timeCounter = this.options.voteTime.valueOf();
            this.votes = new Map();
            this.sendGameLog(205);
            this.sendLog(102, this.getVotes(), [], "votes")

            var voteInterval = setInterval(() => {
                this.sendGameLog(100, timeCounter, 'timer');

                if (timeCounter <= 0) {
                    clearInterval(voteInterval);
                    this.updateScore();
                    this.sendLog(103, this.getScoreboard(), [], "scoreboard")
                    this.votes = null;
                    this.sendGameLog(206);
                    resolve();
                }
                timeCounter--;
            }, 1000);
        });
    }

    sendWikiPage(player) {
        return new Promise((resolve, reject) => {
            wiki.getRandomWiki(player.lang).then((value) => {
                this.pages.set(player.id, value);
                emitLog(player.socket, 209, value.title);
                resolve();
            },
                (err) => {
                    emitLog(player.socket, 307);
                    reject()
                })
        });
    }

    playerVote(fromId, toId) {
        return new Promise((resolve, reject) => {
            if (!this.votes) {
                reject(308)
                return
            }

            var isInFrom, isInTo = false;
            this.players.forEach((player)=>{
                if (player.id == fromId) isInFrom = true;
                if (player.id == toId) isInTo = true;
            });
            if (!isInFrom) {reject(309); return;};
            if (!isInTo) {reject(310); return;};

            this.votes.set(fromId, toId);
            this.sendLog(102, this.getVotes(), [], "votes")
            resolve(210);
        });
    }

    updateScore() {
        var votesBoard = this.getVotes();
        var max = 0;
        var playercount = 0;
        votesBoard.forEach((value)=>{
            if (value.vote > max) {max = value.vote; playercount = 1}
            else if (value.vote == max) playercount++;
        })

        if (max == 0 || playercount == 0) return
        votesBoard.forEach((value)=>{
            if (value.vote == max) {
                this.scoreboard.set(value.id, this.scoreboard.get(value.id) + (playercount>1?this.options.pointsEqual:this.options.pointsPerWin));
            }
        })

    }

    getVotes() {
        var votesBoard = [];

        this.players.forEach((player) => {
            if (player.inGame)
                votesBoard.push({ id: player.id, name: "Guest", vote: 0 })
        })

        this.votes.forEach((value, key) => {

            votesBoard.forEach((vote) => {
                if (value == vote.id) vote.vote++;
            })
        })

        return votesBoard;
    }

    getScoreboard() {
        var scoreboard = [];

        this.players.forEach((player) => {
            scoreboard.push({ id: player.id, name: "Guest", score: this.scoreboard.get(player.id) })
        })

        return scoreboard;
    }
}

module.exports.Room = Room;