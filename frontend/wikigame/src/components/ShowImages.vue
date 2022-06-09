<template>
    <v-card class="mb-4">
        <v-container>
            <v-row v-for="image in getImages" :key="image">
                <v-col >
                    <v-card class="justify-center">
                        <v-card-title>{{image.name}} drew {{image.page}}</v-card-title>
                        <v-img :src="image.image"></v-img>
                        <v-card-actions>
                            <v-btn @click="voteFor(image.id)" :disabled="image.id==getVote">Vote</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
export default {
    name: 'ShowImages',
    computed: {
        getImages() {
            return this.$store.state.images
        },
        getVote() {
            return this.$store.state.vote
        }
    },
    methods: {
        voteFor: function (id) {
            this.$store.commit("SET_VOTE", id);
            this.$socket.emit('vote', id);
        },
    },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
