<template>
  <v-app>
    <HeaderBar/>
    <MainApp/>
    <FootBar/>
  </v-app>
</template>

<script>
import MainApp from './components/MainApp.vue'
import FootBar from './components/FootBar.vue'
import HeaderBar from './components/HeaderBar.vue'

export default {
  name: 'App',

  components: {
    MainApp,
    HeaderBar,
    FootBar
  },

  sockets: {
    connect: function () {
        console.log('socket connected')
        this.$store.commit("SOCKET_CONNECT")
    },
    disconnect: function () {
        console.log('socket disconnected')
        this.$store.commit("SOCKET_DISCONNECT")
    }
  },

  data: () => ({
    //
  }),
}
</script>
