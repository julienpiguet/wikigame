<template>
  <v-container style="max-width: 960px; margin-top: 20px;">
    <v-card class="d-flex justify-center" color="primary">
      <v-container mt-4>

        <v-row>
          <v-col>
            <v-btn @click="create" block elevation="2" class="pa-2 ma-2">Create Game</v-btn>
          </v-col>
        </v-row>

        <v-form v-model="valid">
          <v-row>
            <v-col>
              <v-text-field class="pa-2 ma-2" v-model="roomId" :rules="idRules" label="Room Id" density="compact"
                variant="outlined" single-line required></v-text-field>
            </v-col>
            <v-col>
              <v-btn @click="join(roomId)" :disabled="!valid" block elevation="2" class="pa-2 mt-4">Join Game</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-container>


</template>

<script>
export default {
  name: 'IdleActions',

  data: () => ({
    valid: false,
    roomId: '',
    idRules: [
      v => !!v || 'ID is required',
      v => (v && v.length == 10) || 'ID must be have 10 characters',
    ],
  }),

  methods: {
    create: function () {
      this.$socket.emit('create')
    },
    join: function (id) {
      this.$socket.emit('join', id)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
