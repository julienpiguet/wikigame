var logList = []

/**
 * Info 0xx
 */



/**
 * Game Action 1xx
 */

 logList[100] = 'timer'
 logList[101] = 'page'
 logList[102] = 'votes'
 logList[103] = 'scoreboard'
 logList[104] = 'start'
 logList[105] = 'stop'
 logList[106] = 'image'
 logList[107] = 'state'
 logList[108] = 'username'
 logList[109] = 'owner'
 logList[110] = 'room'
 logList[111] = 'waitimage'
 logList[112] = 'chatmsg'
 logList[113] = 'pagevotes'





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
logList[209] = 'Draw page'
logList[210] = 'Vote changed'
logList[211] = 'Lang changed to'
logList[212] = 'Name set to'
logList[213] = 'Image uploaded'
logList[214] = 'Wait all images'
logList[215] = 'All images receive'
logList[216] = ' change name to '
logList[217] = 'Choose Page'
logList[218] = 'Choose Page Over'
logList[219] = 'Vote Page'
logList[220] = 'Vote Page Over'


/**
 * Game Error 3xx
 */
logList[300] = 'Already in room'
logList[301] = 'Not in a Room'
logList[302] = 'Room does not exist'
logList[303] = 'Access denied on room'
logList[304] = 'Room not found'
logList[305] = 'Cannot create a room'
logList[306] = 'Room already started'
logList[307] = 'Get wiki error'
logList[308] = 'Not on voting phase'
logList[309] = 'Cannot vote'
logList[310] = 'Player not found'
logList[311] = 'Not a valid lang'
logList[312] = 'String is too long'
logList[313] = 'String contains special char'
logList[314] = 'No image provided'
logList[315] = 'Game not started'

/**
 * Game Unexpected Error 4xx
 */


class GameLog {
    constructor(id, data = null, prefix = '') {
        this.id = id;
        this.message = '';
        this.data = data;

        if (logList[id] == undefined) this.message = 'Unknown Error';
        else this.message = logList[id];
        this.message = prefix + this.message
    }
    export() {return {id: this.id, message: this.message, data: this.data}}
}

module.exports = {

    emitLog: (socket, id, data = null, tag = 'log', prefix = '') => {
        socket.emit(tag, new GameLog(id, data, prefix).export())
    }
}