<template>
    <v-main>
        <v-container style="max-width: 960px;">
            <div v-if="getGameState === 'idle'">
                <IdleActions/>
            </div>
            <div v-else-if="getGameState === 'init'">
            init
            </div>
            <div v-else-if="getGameState === 'C'">
            C
            </div>
            <div v-else>
                Unknown game state
            </div>
        </v-container>
        <LogChat/>
    </v-main>
</template>

<script>
import IdleActions from './IdleActions.vue'
import LogChat from './LogChat.vue'

export default {
    name: 'MainApp',

    components: {
        IdleActions,
        LogChat
    },

    sockets: {
        state: function (msg) {
            this.$store.commit('SetState', msg.data)
        },
        log: function (msg) {
            console.log('log: '+ msg.message + (msg.data != null ? ' ' + msg.data : ''))
        }
    },

  computed: {
        getGameState () {
            return this.$store.state.gameState
        }
    }
  
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
