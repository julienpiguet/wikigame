var states = []

states[0] = 'idle'
states[1] = 'init'
states[2] = 'getpage'
states[3] = 'drawing'
states[4] = 'waitdraw'
states[5] = 'voting'
states[6] = 'result'
states[7] = 'waitnewgame'


module.exports = {
    state: (id) => {
        if (states[id] == undefined) return "unknown"
        return states[id]
    }
}