<template>
    <v-row v-for="page in choicePages" :key="page.id" class="justify-center">
        <v-card class="mb-4">
            <ShowPage :page="page.page" :elevation="0" />
            <v-card-actions>
                <v-btn @click="choose(page.id)" :disabled="page.id==getChoice">Choose</v-btn>
            </v-card-actions>
        </v-card>
    </v-row>
    
</template>

<script>
import ShowPage from './ShowPage.vue'

export default {
    name: 'ChoicePage',
    components: {
        ShowPage
    },

    computed: {
        choicePages() {
            return this.$store.state.choicePages
        },
        getChoice() {
            return this.$store.state.choice
        }
    },

    methods: {
        choose: function (id) {
            this.$socket.emit('pagechoice', id);
            this.$store.commit("SET_PAGE_CHOICE", id);
        }, 
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
