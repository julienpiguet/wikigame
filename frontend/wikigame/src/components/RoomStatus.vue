<template>
  <v-card class="mb-4">
    <v-container>

      <v-row>
        <v-col class="d-flex justify-center">
          <span class="text-h5">Room</span>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="d-flex justify-center">
          <v-hover v-slot="{ isHovering, props }">
            <v-card :elevation="isHovering ? 8 : 0" v-bind="props" class="px-2" @mouseleave="reset">
              <span v-bind="props" class="text-h6" @click="copyId">{{ getRoomId }}</span>
              <v-tooltip location="top" activator="parent">
                <span>{{ cliptext }}</span>
              </v-tooltip>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <template v-if="getState == 'drawing' || getState == 'voting'">
        <v-row>
          <v-col class="d-flex justify-center">
            <span class="text-h6">Time left: <span v-if="timer < 10" class="text-red">{{ timer }}</span><span v-else>{{ timer }}</span>s</span>
          </v-col>
        </v-row>
      </template>

      <template v-if="getState == 'result' && isOwner">
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn @click="restart" elevation="2" class="pa-2 ma-2" color="success" plain>Restart</v-btn>
          </v-col>
        </v-row>
      </template>

      <v-row>
        <v-col class="d-flex justify-center">
          <v-btn @click="leave" elevation="2" class="pa-2 ma-2" color="error" plain>Leave</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'RoomStatus',
  data: () => ({
    cliptext: "Copy to clipboard",
    clipdefault: "Copy to clipboard",
    clipcopy: "ID Copied!",

  }),
  methods: {
    leave: function () {
      this.$socket.emit('leave');
      this.$store.commit('RESET');
    },
    restart: function () {
      this.$socket.emit('start');
    },
    copyId: function () {
      navigator.clipboard.writeText(this.$store.state.roomId);
      this.cliptext = this.clipcopy;
    },
    reset: function(){
      this.cliptext = this.clipdefault;
    }
  },
  computed: {
    getRoomId() {
      return this.$store.state.roomId
    },
    getState() {
      return this.$store.state.gameState
    },
    isOwner() {
      return this.$store.state.isOwner
    },
    timer() {
      return this.$store.state.timer
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
