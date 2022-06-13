var states = []

states[0] = 'idle'
states[1] = 'init'
states[2] = 'getpages'
states[3] = 'choosepage'
states[4] = 'votepage'
states[5] = 'drawing'
states[6] = 'waitdraw'
states[7] = 'voting'
states[8] = 'result'
states[9] = 'waitnewgame'
states[10] = 'gamedone'



module.exports = {
    state: (id) => {
        if (states[id] == undefined) return "unknown"
        return states[id]
    }
}