var logList = []

/**
 * Info 0xx
 */



/**
 * Game Status 1xx
 */

 logList[100] = 'timer'


 /**
 * Game Info 2xx
 */

logList[200] = 'Room created'
logList[201] = 'Room joined'
logList[202] = 'Room left'
logList[203] = 'Round start'
logList[204] = 'Round over'
logList[205] = 'Votes start'
logList[206] = 'Votes over'
logList[207] = 'Room joined by'
logList[208] = 'Room left by'



/**
 * Game Error 3xx
 */
logList[300] = 'Already in room'
logList[301] = 'Not in a Room'
logList[302] = 'Room does not exist'
logList[303] = 'Access denied on room'
logList[304] = 'Room not found'
logList[305] = 'Cannot create a room'

/**
 * Game Unexpected Error 4xx
 */


class GameLog {
    constructor(id, data = null) {
        this.id = id;
        this.message = '';
        this.data = data;

        if (logList[id] == undefined) this.message = 'Unknown Error';
        else this.message = logList[id];
    }
    export() {return {id: this.id, message: this.message, data: this.data}}
}

module.exports = {

    emitLog: (socket, id, data = null, tag = 'log') => {
        socket.emit(tag, new GameLog(id, data).export())
    }
}