<template>
    <v-main>
        <v-container style="max-width: 960px;">
            <div v-if="getGameState === 'idle'">
                <IdleActions />
            </div>
            <div v-else>
                <v-container>
                    <v-row>
                        <v-col class="fill-height">
                             <div v-if="getGameState === 'init'">
                                <StartGame/>
                            </div>
                            <div v-else-if="getGameState === 'getpage'">
                                <WaitPage waitingText='Wait wiki page...'/>
                            </div>
                            <div v-else-if="getGameState === 'drawing'">
                                <ShowPage/>
                                <DrawingCanvas/>
                            </div>
                            <div v-else-if="getGameState === 'waitdraw'">
                                <WaitPage waitingText='Wait for everyone images...'/>
                            </div>
                            <div v-else-if="getGameState === 'voting'">
                                <ShowImages/>
                            </div>
                            <div v-else-if="getGameState === 'result'">
                                <ShowResults/>
                            </div>
                            <div v-else-if="getGameState === 'waitnewgame'">
                                <WaitNewGame/>
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
import WaitPage from './WaitPage.vue'
import DrawingCanvas from './DrawingCanvas.vue'
import ShowImages from './ShowImages.vue'
import ShowResults from './ShowResults.vue'
import WaitNewGame from './WaitNewGame.vue'

export default {
    name: 'MainApp',

    components: {
        IdleActions,
        LogChat,
        ScoreBoard,
        StartGame,
        RoomStatus,
        ShowPage,
        WaitPage,
        DrawingCanvas,
        ShowImages,
        ShowResults,
        WaitNewGame
    },

    sockets: {
        state: function (msg) {
            this.$store.commit('SET_STATE', msg.data)
            if (msg.data=="getpage") this.$store.commit('RESET_GAME_DATA');
        },
        log: function (msg) {
            if (msg.id >= 300)
                this.$store.commit('ADD_LOG', {type: 'error', data: { msg: (msg.message + (msg.data != null ? ' ' + msg.data : ''))}});
            else
                this.$store.commit('ADD_LOG', {type: 'log', data: { msg: (msg.message + (msg.data != null ? ' ' + msg.data : ''))}});
        },
        chatmsg: function (msg) {
            this.$store.commit('ADD_LOG', {type: 'chat', data: msg.data});
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
        },
        waitimage: function () {
            this.$socket.emit('image', this.$store.state.image);
        },
        image: function (msg) {
            this.$store.commit("ADD_IMAGE", msg.data);
        },
        timer: function (msg) {
            this.$store.commit("SET_TIMER", msg.data);
        },
        username: function (msg) {
            this.$store.commit("SET_USERNAME", msg.data);
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
