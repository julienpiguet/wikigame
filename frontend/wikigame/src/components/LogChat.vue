<template>
    <v-card class="mb-4">
        <v-row>
            <v-col>
                <v-table height="300px">
                    <tbody>
                        <tr v-for="item in getLogs" :key="item.msg">
                            <td>
                                <div v-if="item.type == 'error'"><span class="text-red">
                                        <v-icon icon="mdi-alert-circle" />
                                    </span>{{ item.data.msg }}</div>
                                <div v-if="item.type == 'log'"> <span class="text-blue">
                                        <v-icon icon="mdi-information" />
                                    </span>{{ item.data.msg }}</div>
                                <div v-if="item.type == 'chat'"><strong>{{ item.data.name }}</strong>: {{
                                        item.data.message
                                }}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-form v-model="valid" @submit.prevent="send" class="mx-1">
                <div class="d-flex justify-space-around align-center flex-column flex-md-row">
                    <v-text-field class="align-center" v-model="msg" :rules="msgRules" label="Message"
                        density="compact" variant="outlined" style="width: auto" single-line hide-details required>
                    </v-text-field>
                    <v-btn class="ml-1" @click="send" size="small" :disabled="!valid" elevation="0"  icon plain><v-icon :color="(valid ? 'blue' : '')" icon="mdi-send"/></v-btn>
                </div>
                </v-form>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
export default {
    name: 'LogChat',
    data: () => ({
        valid: false,
        msg: '',
        msgRules: [
            v => !!v || 'Message is required',
            v => (v && v.length <= 40) || 'Message must be less than 40 characters',
            v => !(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/).test(v) || 'Username must not contains special characters',
        ],
    }),

    computed: {
        getLogs() {
            return this.$store.state.logs
        },
    },

    methods: {
        send: function () {
            this.$socket.emit('chatmsg', this.msg);
            this.msg = '';
        },
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
