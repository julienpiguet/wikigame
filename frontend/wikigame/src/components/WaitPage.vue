<template>
  <v-card class="mb-4">
    <v-container class="align-center">
      <v-row>
        <v-col class="d-flex justify-center">
          <span text-h4>{{ waitingText }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'WaitPage',
  props: {
    waitingText: String
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
