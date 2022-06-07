<template>
  <v-footer padless>
    <v-col class="text-center" cols="12">
      {{ new Date().getFullYear() }} — <strong>Piguaro</strong> — Status
      <span v-if="connected">
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="text-green">
              <v-icon icon="mdi-circle-medium" />
            </span>
          </template>
          <span>Connected</span>
        </v-tooltip>
      </span>
      <span v-else>
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="text-red">
              <v-icon icon="mdi-circle-medium" />
            </span>
          </template>
          <span>Disonnected</span>
        </v-tooltip>
      </span>
    </v-col>
  </v-footer>
</template>

<script>

export default {
  name: 'FootBar',
  computed: {
    connected() {
      return this.$store.state.isConnected
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
