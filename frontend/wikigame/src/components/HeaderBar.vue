<template>
    <v-app-bar elevation="4">    
            <v-app-bar-title>WikiGame</v-app-bar-title>
            <ChangeName />
    </v-app-bar>
</template>

<script>
import ChangeName from './ChangeName.vue'

export default {
    name: 'HeaderBar',
    components: {
        ChangeName,
    },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
