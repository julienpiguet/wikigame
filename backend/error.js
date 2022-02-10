var errorList = [
    'Fatal Error',
    ]

errorList[10] = 'Already in room'


module.exports =  class GameError {
    constructor(id) {
        this.id = id;
        this.message = '';

        if (errorList[id] == undefined) this.message = 'Unknown Error';
        else this.message = errorList[id];
    }
    export() {return {id: this.id, message: this.message}}
}

/*module.exports = function gameError(id){
    message = '';
    if (errorList[id] == undefined) message = 'Unknown Error';
    else message = errorList[id];
    return JSON.stringify({id: id, message: message})
}*/