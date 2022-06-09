const { emitLog } = require('./log.js');
const { Option } = require('./Option.js');
const utils = require('./utils.js');
const wiki = require('./wiki.js')
const { state } = require('./State.js')

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
        this.images = null;
        this.state = state(1);
    }

    addPlayer(player) {
        this.players.push(player);
        this.scoreboard.set(player.id, 0);
        if (this.onGame)
            this.updatePlayerState(player,7);
        else
            this.updatePlayerState(player,1);
        this.sendScoreboard();
        emitLog(player.socket, 110, this.id, "room");
    }

    removePlayer(player) {
        return new Promise((resolve, reject) => {
            this.players = utils.arrayObjRemove(this.players, player.id);
            if (this.players.length==0) reject(this.id);
            if (this.leader == player) {
                this.leader = this.players[0];
                emitLog(this.leader.socket, 109, true, "owner")
            }
            this.updatePlayerState(player,0);
            this.scoreboard.delete(player.id)
            this.sendScoreboard()
            resolve();
        })
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

    sendLogPrefix(id, data = null, exclude = [], prefix = '') {
        this.players.forEach((player) => {
            if (!exclude.includes(player))
                emitLog(player.socket, id, data, 'log', prefix)
        });
    }

    sendGameLog(id, data = null, type = null) {
        this.sendLog(id, data, [], type, true)
    }

    updatePlayerState(player, id){
        emitLog(player.socket, 107, state(id), 'state');
    }

    updateState(id, inGame = true){
        this.players.forEach((player) => {
            if ((player.inGame == inGame) || !inGame)
                    this.updatePlayerState(player, id)
        });
    }


    startRound() {
        if (this.onGame) {
            emitLog(this.leader.socket, 306);
            return
        }

        this.onGame = true;
        this.players.forEach((player) => player.inGame = true);
        this.pages = new Map();
        this.images = new Map();

        
        this.updateState(2)
        
        var getPagePromises = [];
        this.players.forEach((player) => {
            if (player.inGame)
                getPagePromises.push(this.sendWikiPage(player))
        });

        Promise.all(getPagePromises).then(() => {
            this.runRound().then(
                () => {
                    
                    var getImagePromises = [];
                    this.players.forEach((player) => {
                        if (player.inGame)
                            getImagePromises.push(this.collectImage(player));
                    });
                    this.sendGameLog(214);
                    Promise.all(getImagePromises).then(() => {
                        this.sendGameLog(215);
                        this.runVote().then(() => {
                                this.onGame = false;
                                this.players.forEach((player) => player.inGame = false);
                                this.pages = null;
                                this.images = null;
                            }
                        )
                    });
                }
            )
        })
    }

    runRound() {
        return new Promise((resolve, reject) => {
            var timeCounter = this.options.roundTime.valueOf();
            this.updateState(3)
            this.sendGameLog(203);
            this.sendGameLog(104, null, 'start');
            var roundInterval = setInterval(() => {
                this.sendGameLog(100, timeCounter, 'timer');

                if (timeCounter <= 0) {
                    clearInterval(roundInterval);
                    this.updateState(4)
                    this.sendGameLog(204);
                    this.sendGameLog(105, null, 'stop');
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
            this.sendImages();
            this.updateState(5)
            this.sendGameLog(205);
            this.sendLog(102, this.getVotes(), [], "votes")

            var voteInterval = setInterval(() => {
                this.sendGameLog(100, timeCounter, 'timer');

                if (timeCounter <= 0) {
                    clearInterval(voteInterval);
                    this.updateScore();
                    this.updateState(6)
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
                emitLog(player.socket, 101, value, 'page');
                resolve();
            },
                (err) => {
                    emitLog(player.socket, 307);
                    reject()
                })
        });
    }

    collectImage(player) {
        return new Promise((resolve, reject) => {
            emitLog(player.socket, 111, null, 'waitimage');
            var timeleft = this.options.imageUploadTime.valueOf();
            var collectInterval = setInterval(() => {
                if (this.images.has(player.id)) {
                    clearInterval(collectInterval);
                    resolve();
                }
                if (timeleft<=0) {
                    clearInterval(collectInterval);
                    emitLog(player.socket, 314);
                    resolve();
                }
                timeleft--;
            }, 1000);
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
                votesBoard.push({ id: player.id, name: player.name , vote: 0 })
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
            scoreboard.push({ id: player.id, name: player.name, score: this.scoreboard.get(player.id), isLeader:  this.leader==player})
        })

        return scoreboard;
    }

    addImage(player, image){
        return new Promise((resolve, reject) => {
            if (!this.onGame) reject(315);
            this.images.set(player.id, {id: player.id, name: player.name, page: this.pages.get(player.id).title ,image: image});
            resolve(213);
        });
    }

    sendImages(){
        this.images.forEach( (img, key) => {
            this.sendGameLog(106, img, "image");
        })
    }

    sendScoreboard(){
        this.sendLog(103, this.getScoreboard(), [], "scoreboard")
    }
}

module.exports.Room = Room;