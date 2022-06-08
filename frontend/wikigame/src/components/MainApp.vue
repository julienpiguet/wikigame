<template>
    <v-main>
        <v-container style="max-width: 960px;">
            <div v-if="getGameState === 'idle'">
                <IdleActions />
            </div>
            <div v-else>
                <v-container>
                    <v-row>
                        <v-col>
                             <div v-if="getGameState === 'init'">
                                <StartGame/>
                            </div>
                            <div v-else-if="getGameState === 'getpage'">
                                getpage
                            </div>
                            <div v-else-if="getGameState === 'drawing'">
                                <ShowPage/>
                            </div>
                            <div v-else-if="getGameState === 'waitdraw'">
                                waitdraw
                            </div>
                            <div v-else-if="getGameState === 'voting'">
                                voting
                            </div>
                            <div v-else-if="getGameState === 'result'">
                                result
                            </div>
                            <div v-else-if="getGameState === 'waitnewgame'">
                                waitnewgame
                            </div>
                            <div v-else>
                                Unknow state
                            </div>
                        </v-col>
                        <v-col cols="3">
                            <RoomStatus />
                            <LogChat />
                            <ScoreBoard />
                        </v-col>
                    </v-row>
                </v-container>
            </div>
        </v-container>
        
    </v-main>
</template>

<script>
import IdleActions from './IdleActions.vue'
import LogChat from './LogChat.vue'
import ScoreBoard from './ScoreBoard.vue'
import StartGame from './StartGame.vue'
import RoomStatus from './RoomStatus.vue'
import ShowPage from './ShowPage.vue'

export default {
    name: 'MainApp',

    components: {
        IdleActions,
        LogChat,
        ScoreBoard,
        StartGame,
        RoomStatus,
        ShowPage
    },

    sockets: {
        state: function (msg) {
            this.$store.commit('SET_STATE', msg.data)
        },
        log: function (msg) {
            this.$store.commit('ADD_LOG', {isError: (msg.id >= 300), msg: (msg.message + (msg.data != null ? ' ' + msg.data : ''))});
        },
        scoreboard: function (msg) {
            this.$store.commit('SET_SCOREBOARD', msg.data);
        },
        owner: function (msg) {
            this.$store.commit('SET_IS_OWNWER', msg.data);
        },
        room: function (msg) {
            this.$store.commit('SET_ROOM', msg.data);
        },
        page: function (msg) {
            this.$store.commit("SET_PAGE", msg.data);
        }

    },

    computed: {
        getGameState() {
            return this.$store.state.gameState
        }
    }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
