<template>
    <v-card class="mb-4">
        <div v-if="getPage">
            <v-container>
                <v-row class="align-center">
                    <v-col>
                        <v-container>
                            <v-row>
                                <v-col class="d-flex justify-center">
                                    <span class="text-h4"> {{ getPage.title }}</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="d-flex justify-center">
                                    <span class="font-italic">{{ getPage.description }}</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="d-flex">
                                    <span> {{ getPage.extract }}</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="d-flex justify-center">
                                    <v-btn @click="openPage" elevation="2" class="pa-2 ma-2">Wiki Page</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                    <template v-if="getPage.originalimage">
                        <v-col cols="4">
                            <v-card class="d-flex align-center" flat tile>
                                <v-img :src="getPage.originalimage.source" class="my-auto"></v-img>
                            </v-card>
                        </v-col>
                    </template>
                </v-row>

            </v-container>

        </div>
        <div v-else>
            <v-container text-center>
                <span text-h2>No Page!!</span>
            </v-container>
        </div>
    </v-card>
</template>

<script>
export default {
    name: 'ShowPage',

    computed: {
        getPage() {
            return this.$store.state.page
        }
    },

    methods: {
        openPage() {
            window.open(this.$store.state.page.content_urls.desktop.page, '_blank').focus();
        }
    },



}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
