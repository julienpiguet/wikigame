<template>
    <v-card class="mb-4">
        <v-table height="300px">
            <tbody>
                <tr v-for="item in getLogs" :key="item.msg">
                    <td>
                        <div v-if="item.isError" ><span class="text-red"><v-icon icon="mdi-alert-circle" /></span>{{ item.msg }}</div>
                        <div v-else> <span class="text-blue"><v-icon icon="mdi-information" /></span>{{ item.msg }}</div>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>

<script>
export default {
    name: 'LogChat',
    computed: {
        getLogs() {
            return this.$store.state.logs
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
