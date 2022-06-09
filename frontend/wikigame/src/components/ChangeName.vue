<template>
    <v-container mx-auto style="max-width: 240px;">
        <div v-if="!editing">
            <v-form>
                <v-card class="d-flex justify-end" flat tile >
                    <v-card class="ma-auto" flat tile >
                        <span>{{ getUsername }}</span>
                    </v-card>
                    <v-card class="pa-auto" flat tile >
                        <v-btn @click="edit" elevation="2" class="py-2 my-auto"><v-icon icon="mdi-pencil-circle" /></v-btn>
                    </v-card>
                </v-card>
            </v-form>
        </div>
        <div v-else>
            <v-form v-model="valid" @submit.prevent="modify">
                <v-card class="d-flex justify-end align-center" flat tile  >
                    <v-card class="pa-auto"  flat tile >
                        <v-text-field class="pa-2 align-center" v-model="newUsername" :rules="usernameRules" label="Username"
                            density="compact" variant="outlined" style="width: 150px;" single-line hide-details required></v-text-field>
                    </v-card>
                    <v-card class="pa-auto align-center" flat tile >
                        <v-btn @click="modify" :disabled="!valid" elevation="2" class="py-2 my-auto"><v-icon icon="mdi-check-circle" /></v-btn>
                    </v-card>
                    <v-card class="pa-auto align-center" flat tile >
                        <v-btn @click="cancel" elevation="2" class="py-2 my-auto"><v-icon icon="mdi-close-circle" /></v-btn>
                    </v-card>
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
