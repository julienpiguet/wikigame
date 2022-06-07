<template>
  <v-footer padless>
    <v-col
      class="text-center"
      cols="12"
    >
      {{ new Date().getFullYear() }} — <strong>NagFox</strong> — <strong>Piguaro</strong> — {{ connected ? 'Connected' : 'Disconnected' }}
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: 'FootBar',
  computed: {
    connected () {
      return this.$store.state.isConnected
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
