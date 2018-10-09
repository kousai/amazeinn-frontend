<template lang="pug">
  v-app
    transition(name="slide" mode="out-in")
      router-view
    app-snackbar
</template>

<script>
import AppSnackbar from '@/components/app-snackbar'

export default {
  name: 'PublicLayout',

  components: { AppSnackbar },

  methods: {

  }
}
</script>

<style lang="stylus">

</style>
