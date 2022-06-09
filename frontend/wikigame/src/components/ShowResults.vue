<template>
    <v-card class="mb-4">
        <v-container>
            <v-row v-for="image in getImages" :key="image">
                <v-col>
                    <v-card class="justify-center">
                        <v-card-title>{{ image.name }} drew {{ image.page }}</v-card-title>
                        <v-img :src="image.image"></v-img>
                        <v-card-actions>
                            <v-btn @click="exportImg(image.image, image.name, image.page)">Download</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
export default {
    name: 'ShowResults',
    computed: {
        getImages() {
            return this.$store.state.images
        },

    },
    methods: {
        exportImg: function (image, name, page) {
            fetch(image)
            .then(res => res.blob())
            .then(res =>{
                const a = document.createElement('a');
                a.download = name.replace(/\s+/g, '') + '-' + page.replace(/\s+/g, '') + '.png';
                a.href = URL.createObjectURL(res);
                a.click();
                URL.revokeObjectURL(a.href);
                a.remove();
            })

        },
    },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
