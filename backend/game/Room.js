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
        this.images = null;
        this.state = state(1);
        this.page = null;
        this.pages = null;
        this.playerPage = null;
        this.pageVotes = null;

        this.deleted = false;
    }

    /////////////////////////////////////////////////
    //  Object functions
    /////////////////////////////////////////////////

    addPlayer(player) {
        this.players.push(player);
        this.scoreboard.set(player.id, 0);
        if (this.onGame)
            this.updatePlayerState(player, 9);
        else
            this.updatePlayerState(player, 1);
        this.sendScoreboard();
        emitLog(player.socket, 110, this.id, "room");
    }

    removePlayer(player) {
        return new Promise((resolve, reject) => {
            if (this.players.filter(e => e.id == player.id).length == 0) reject();
            this.players = utils.arrayObjRemove(this.players, player);
            if (this.players.length == 0) {
                this.deleted = true;
                this.deleteRoom();
                resolve();
            }
            if (this.leader == player) {
                this.leader = this.players[0];
                emitLog(this.leader.socket, 109, true, "owner")
            }
            this.updatePlayerState(player, 0);
            this.scoreboard.delete(player.id)
            this.sendScoreboard()
            resolve();
        })
    }

    deleteRoom() {
        this.deleted = true;
    }

    contains(player) {
        return this.players.includes(player);
    }


    resetRoundData() {
        this.onGame = true;
        this.players.forEach((player) => player.inGame = true);
        this.images = new Map();
        this.votes = new Map();
        this.page = null;
        this.pages = new Map();
        this.playerPage = new Map();
        this.pageVotes = new Map();
    }

    removeRoundData() {
        this.onGame = false;
        this.players.forEach((player) => player.inGame = false);
        this.images = null;
        this.votes = null;
        this.page = null;
        this.pages = null;
        this.playerPage = null;
        this.pageVotes = null;
    }


    /////////////////////////////////////////////////
    //  Run functions
    /////////////////////////////////////////////////

    startRound() {
        if (this.onGame) {
            emitLog(this.leader.socket, 306);
            return
        }

        this.resetRoundData()

        try {
            this.runSendPages().then(() => {
                if (this.deleted) return;
                this.runChoosePage().then(() => {
                    if (this.deleted) return;
                    this.runVotePage().then(() => {
                        if (this.deleted) return;
                        this.runRound().then(() => {
                            if (this.deleted) return;
                            this.runWaitImage().then(() => {
                                if (this.deleted) return;
                                this.runVote().then(() => {
                                    this.removeRoundData();
                                })
                            })
                        })
                    })
                })
            })

        } catch (error) {
            console.error(error);
        }
    }

    runSendPages() {
        this.updateState(2)
        var getPagePromises = [];
        this.players.forEach((player) => {
            if (player.inGame) {
                for (let nb = 1; nb <= this.options.pageChoice.valueOf(); nb++)
                    getPagePromises.push(this.sendWikiPage(player, nb))
            }
        });
        return Promise.all(getPagePromises);
    }

    runChoosePage() {
        return new Promise((resolve, reject) => {
            var timeCounter = this.options.pageChoiceTime.valueOf();
            this.updateState(3)
            this.sendGameLog(217);
            var choseInterval = setInterval(() => {
                this.sendGameLog(100, timeCounter, 'timer');
                if (timeCounter <= 0) {
                    clearInterval(choseInterval);
                    this.sendGameLog(218);
                    resolve();
                }
                timeCounter--;
            }, 1000);
        });
    }

    runVotePage() {
        return new Promise((resolve, reject) => {


            this.players.forEach((player) => {
                if (player.inGame) {
                    this.playerPage.forEach((page, key) => {
                        emitLog(player.socket, 101, this.pages.get(page), 'votepage');
                    })
                }
            });

            this.updateState(4)
            var timeCounter = this.options.votePageTime.valueOf();
            this.sendGameLog(219);
            var choseInterval = setInterval(() => {
                this.sendGameLog(100, timeCounter, 'timer');
                if (timeCounter <= 0) {
                    clearInterval(choseInterval);
                    this.updatePage();
                    this.sendGameLog(220);
                    resolve();
                }
                timeCounter--;
            }, 1000);
        });

    }

    runRound() {
        return new Promise((resolve, reject) => {
            this.players.forEach((player) => {
                if (player.inGame) {
                    emitLog(player.socket, 209, this.page.page.title);
                    emitLog(player.socket, 101, this.page, 'page');
                }
            });

            var timeCounter = this.options.roundTime.valueOf();
            this.updateState(5)
            this.sendGameLog(203);
            this.sendGameLog(104, null, 'start');
            var roundInterval = setInterval(() => {
                this.sendGameLog(100, timeCounter, 'timer');

                if (timeCounter <= 0) {
                    clearInterval(roundInterval);
                    this.sendGameLog(204);
                    this.sendGameLog(105, null, 'stop');
                    resolve();
                }
                timeCounter--;
            }, 1000);
        })
    }

    runWaitImage() {
        this.updateState(6)
        var getImagePromises = [];
        this.players.forEach((player) => {
            if (player.inGame)
                getImagePromises.push(this.collectImage(player));
        });
        this.sendGameLog(214);
        return Promise.all(getImagePromises);
    }

    runVote() {
        return new Promise((resolve, reject) => {
            this.sendGameLog(215);
            var timeCounter = this.options.voteTime.valueOf();
            this.sendImages();
            this.updateState(7)
            this.sendGameLog(205);
            this.sendLog(102, this.getVotes(), [], "votes")

            var voteInterval = setInterval(() => {
                this.sendGameLog(100, timeCounter, 'timer');

                if (timeCounter <= 0) {
                    clearInterval(voteInterval);
                    this.updateScore();
                    this.updateState(8)
                    this.sendLog(103, this.getScoreboard(), [], "scoreboard")
                    this.votes = null;
                    this.sendGameLog(206);
                    resolve();
                }
                timeCounter--;
            }, 1000);
        });
    }

    /////////////////////////////////////////////////
    //  Sender functions
    /////////////////////////////////////////////////

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

    sendWikiPage(player, nb) {
        return new Promise((resolve, reject) => {
            wiki.getRandomWiki(player.lang).then((value) => {
                var id = player.id + nb
                var page = { id: id, page: value };
                this.pages.set(id, page);
                this.playerPage.set(player.id, id)
                emitLog(player.socket, 101, page, 'pagechoice');
                resolve();
            },
                (err) => {
                    emitLog(player.socket, 307);
                    reject()
                })
        });
    }

    sendImages() {
        this.images.forEach((img, key) => {
            this.sendGameLog(106, img, "image");
        })
    }

    sendScoreboard() {
        this.sendLog(103, this.getScoreboard(), [], "scoreboard")
    }

    sendChatMsg(msg, source) {
        this.sendLog(112, { id: source.id, name: source.name, message: msg }, [], "chatmsg")
    }

    /////////////////////////////////////////////////
    //  Receiver functions
    /////////////////////////////////////////////////

    collectImage(player) {
        return new Promise((resolve, reject) => {
            emitLog(player.socket, 111, null, 'waitimage');
            var timeleft = this.options.imageUploadTime.valueOf();
            var collectInterval = setInterval(() => {
                if (this.images.has(player.id)) {
                    clearInterval(collectInterval);
                    resolve();
                }
                if (timeleft <= 0) {
                    clearInterval(collectInterval);
                    emitLog(player.socket, 314);
                    resolve();
                }
                timeleft--;
            }, 1000);
        });
    }

    /////////////////////////////////////////////////
    //  Update functions
    /////////////////////////////////////////////////

    updatePlayerState(player, id) {
        emitLog(player.socket, 107, state(id), 'state');
    }

    updateState(id, inGame = true) {
        this.players.forEach((player) => {
            if ((player.inGame == inGame) || !inGame)
                this.updatePlayerState(player, id)
        });
    }

    updateScore() {
        var votesBoard = this.getVotes();
        var max = 0;
        var playercount = 0;
        votesBoard.forEach((value) => {
            if (value.vote > max) { max = value.vote; playercount = 1 }
            else if (value.vote == max) playercount++;
        })

        if (max == 0 || playercount == 0) return
        votesBoard.forEach((value) => {
            if (value.vote == max) {
                this.scoreboard.set(value.id, this.scoreboard.get(value.id) + (playercount > 1 ? this.options.pointsEqual : this.options.pointsPerWin));
            }
        })

    }

    updatePage() {
        if (this.pageVotes.size == 0 && this.leader) {
            this.page = this.pages.get(this.playerPage.get(this.leader.id))
            return
        }

        var votes = new Map();
        this.pageVotes.forEach((pageId) => {
            if (votes.has(pageId)) {
                votes.set(pageId, votes.get(pageId) + 1)
            } else {
                votes.set(pageId, 1)
            }
        })

        var max = 0;
        var bestpage = "";
        votes.forEach((nb, pageId) => {
            if (nb > max) bestpage = pageId;
        })

        this.page = this.pages.get(bestpage);
    }

    /////////////////////////////////////////////////
    //  Player functions
    /////////////////////////////////////////////////

    playerVote(fromId, toId) {
        return new Promise((resolve, reject) => {
            if (!this.votes) {
                reject(308)
                return
            }

            var isInFrom, isInTo = false;
            this.players.forEach((player) => {
                if (player.id == fromId) isInFrom = true;
                if (player.id == toId) isInTo = true;
            });
            if (!isInFrom) { reject(309); return; };
            if (!isInTo) { reject(310); return; };

            this.votes.set(fromId, toId);
            this.sendLog(102, this.getVotes(), [], "votes")
            resolve(210);
        });
    }

    playerAddImage(player, image) {
        return new Promise((resolve, reject) => {
            if (!this.onGame) reject(315);
            this.images.set(player.id, { id: player.id, name: player.name, page: this.page.page.title, image: image });
            resolve(213);
        });
    }

    /////////////////////////////////////////////////
    //  Getter functions
    /////////////////////////////////////////////////


    getVotes() {
        var votesBoard = [];

        this.players.forEach((player) => {
            if (player.inGame)
                votesBoard.push({ id: player.id, name: player.name, vote: 0 })
        })

        this.votes.forEach((value, key) => {

            votesBoard.forEach((vote) => {
                if (value == vote.id) vote.vote++;
            })
        })

        return votesBoard;
    }

    getPageVotes() {
        var votesBoard = [];

        var votes = new Map();
        this.pageVotes.forEach((id) => {
            if (votes.has(id)) {
                votes.set(id, votes.get(id) + 1)
            } else {
                votes.set(id, 1)
            }
        })

        this.votes.forEach((nbvote, pageid) => {
            votesBoard.push({ id: pageid, nb: nbvote })
        })

        return votesBoard;
    }

    getScoreboard() {
        var scoreboard = [];

        this.players.forEach((player) => {
            scoreboard.push({ id: player.id, name: player.name, score: this.scoreboard.get(player.id), isLeader: this.leader == player })
        })

        return scoreboard;
    }

}

module.exports.Room = Room;