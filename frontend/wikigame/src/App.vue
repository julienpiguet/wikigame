<template>
  <v-app>
    <v-main>
      <HelloWorld/>
    </v-main>
    <FootBar/>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import FootBar from './components/FootBar.vue'

export default {
  name: 'App',

  components: {
    HelloWorld,
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
