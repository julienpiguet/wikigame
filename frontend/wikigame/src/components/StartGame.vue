<template>
    <v-card class="mb-4" color="secondary">
        <div v-if="isOwner">
            <v-container align-center>
                 <v-row>
                     <v-col class="d-flex justify-center">
                          <span text-h4>Start the round!</span>
                     </v-col>
                </v-row>
                <v-row>
                     <v-col class="d-flex justify-center">
                          <v-btn @click="start" elevation="2">Start</v-btn>
                     </v-col>
                </v-row>
                
            </v-container>
           
        </div>
        <div v-else>
            <v-container text-center>
                <span text-h2>Wait for owner to start!</span>
            </v-container>
        </div>
    </v-card>
</template>

<script>
export default {
    name: 'StartGame',

    computed: {
        isOwner() {
            return this.$store.state.isOwner
        }
    },

    methods: {
        start: function () {
            this.$socket.emit('start')
        },
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
