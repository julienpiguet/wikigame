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
            <span class="text-h5">{{ getRoomId }}</span>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn @click="leave" elevation="2" class="pa-2 ma-2">Leave</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
</template>

<script>
export default {
    name: 'RoomStatus',
    methods: {
        leave: function () {
            this.$socket.emit('leave');
            this.$store.commit('RESET');
        },
    },
    computed: {
        getRoomId() {
            return this.$store.state.roomId
        }
    },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
