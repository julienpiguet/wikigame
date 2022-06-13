<template>
    <v-card class="mb-4" :elevation="elevation">
        <div v-if="page">
            <v-container>
                <v-row class="align-center">
                    <v-col>
                        <v-container>
                            <v-row>
                                <v-col class="d-flex justify-center">
                                    <span class="text-h4"> {{ page.title }}</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="d-flex justify-center">
                                    <span class="font-italic">{{ page.description }}</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="d-flex">
                                    <span> {{ page.extract }}</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="d-flex justify-center">
                                    <v-btn @click="openPage" elevation="2" class="pa-2 ma-2">Wiki Page</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                    <template v-if="page.originalimage">
                        <v-col cols="4">
                            <v-card class="d-flex align-center" flat tile>
                                <v-img :src="page.originalimage.source" class="my-auto"></v-img>
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
    props: {
      page: {
        type: Object,
        default: null
      },
      elevation: {
        type: Number,
        default: 3
      }
    },

    methods: {
        openPage() {
            window.open(this.page.content_urls.desktop.page, '_blank').focus();
        }
    },



}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
