<template>
    <v-card contained-text title="Scoreboard" class="mb-4">
        <v-table>
            <tbody>
                <tr v-for="item in getScoreboard" :key="item.score">
                    <td><span v-if="item.isLeader" class="text-yellow">
                            <v-icon icon="mdi-crown" />
                        </span>{{ item.name }}</td>
                    <td>{{ item.score }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>

<script>
export default {
    name: 'ScoreBoard',
    computed: {
        getScoreboard() {
            return [...this.$store.state.scoreboard].sort((a, b) => b.score - a.score)
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
