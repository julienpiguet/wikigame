<template>
    <v-container mx-auto style="max-width: 240px;">
        <div v-if="!editing">
            <v-form>
                <v-card class="d-flex justify-end align-center" flat tile>
                    <v-card class="pa-auto align-center" flat tile>
                        <span>{{ getUsername }}</span>
                    </v-card>
                    <v-card class="pa-auto" flat tile>
                        <v-btn @click="edit" elevation="0" class="ml-2 py-2 my-auto" icon="mdi-pencil-circle"></v-btn>
                    </v-card>
                </v-card>
            </v-form>
        </div>
        <div v-else>
            <v-form v-model="valid" @submit.prevent="modify">
                <v-card class="d-flex justify-end align-center" flat tile>
                    <div class="d-flex justify-space-around align-center flex-column flex-md-row">
                        <v-text-field class="align-center" v-model="newUsername" :rules="usernameRules"
                            label="Username" density="compact" variant="outlined" style="width: 150px;" single-line
                            hide-details required></v-text-field>
                        <v-btn class="ml-2" @click="modify" :disabled="!valid" elevation="0" :color="(valid ? 'success': '' )" icon plain ><v-icon icon="mdi-check-circle" /></v-btn>
                        <v-btn class="ml-2" @click="cancel" elevation="0" color="error" icon plain ><v-icon icon="mdi-close-circle" /></v-btn>
                    </div>
                </v-card>
            </v-form>
        </div>

    </v-container>
</template>

<script>
export default {
    name: 'ChangeName',
    data: () => ({
        editing: false,
        valid: false,
        newUsername: '',
        usernameRules: [
            v => !!v || 'Username is required',
            v => (v && v.length <= 15) || 'Username must be less than 15 characters',
            v => !(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/).test(v) || 'Username must not contains special characters',
        ],
    }),

    created: function () {
        this.$socket.emit('getname');
    },

    methods: {
        edit: function () {
            this.editing = true;
            this.newUsername = this.$store.state.username
        },
        modify: function () {
            if (!this.valid) return;
            this.editing = false;
            this.$socket.emit('setname', this.newUsername);
        },
        cancel: function () {
            this.editing = false;
        }
    },

    computed: {
        getUsername() {
            return this.$store.state.username
        }
    },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
