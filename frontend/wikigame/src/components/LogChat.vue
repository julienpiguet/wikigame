<template>
    <v-card color="secondary">
        <v-table height="300px">
            <tbody>
                <tr v-for="item in logs" :key="item.msg">
                    <td>
                        <div v-if="item.isError" > <span class="text-red"> <v-icon icon="mdi-alert-circle" /> </span>{{ item.msg }} </div>
                        <div v-else> <span class="text-blue"> <v-icon icon="mdi-information" /> </span>{{ item.msg }} </div>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>

<script>
export default {
    name: 'LogChat',
   data: () => ({
        logs: [
        ]
    }),
    sockets: {
        log: function (msg) {
            console.log('log: ' + msg.message + (msg.data != null ? ' ' + msg.data : ''))
            this.logs.push({isError: (msg.id >= 300), msg: (msg.message + (msg.data != null ? ' ' + msg.data : ''))})
        }
    },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
