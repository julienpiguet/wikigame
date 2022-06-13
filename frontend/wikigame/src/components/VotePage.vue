<template>
    <v-row v-for="page in votePages" :key="page.id" class="justify-center">
        <v-card class="mb-4">
            <ShowPage :page="page.page" :elevation="0" />
            <v-card-actions>
                <v-btn @click="vote(page.id)" :disabled="page.id==getChoice">Vote</v-btn>
            </v-card-actions>
        </v-card>
    </v-row>
    
</template>

<script>
import ShowPage from './ShowPage.vue'

export default {
    name: 'VotePage',
    components: {
        ShowPage
    },

    computed: {
        votePages() {
            return this.$store.state.votePages
        },
        getChoice() {
            return this.$store.state.votePage
        }
    },

    methods: {
        vote: function (id) {
            this.$socket.emit('votepage', id);
            this.$store.commit("SET_PAGE_VOTE", id);
        }, 
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
