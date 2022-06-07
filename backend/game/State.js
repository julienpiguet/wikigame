var States = []

logList[0] = 'idle'
logList[1] = 'init'
logList[2] = 'getpage'
logList[3] = 'drawing'
logList[4] = 'waitdraw'
logList[5] = 'voting'
logList[6] = 'result'
logList[7] = 'waitnewgame'




module.exports = {

    state: (id) => {
        if (logList[id] == undefined) return "unknown"
        return States[id]
    }
}