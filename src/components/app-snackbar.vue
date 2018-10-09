<template lang="pug">
.my-snackbar
  v-snackbar(
    :timeout='$store.state.common.snackbar.timeout'
    :color='$store.state.common.snackbar.color'
    bottom=true
    v-model='snackbarActive')
    | {{ $store.state.common.snackbar.text }}
    v-btn(color='pink' dark='' flat='' @click.native='snackbarActive = false') Close
</template>

<script>
export default {
  name: 'DefaultSnackbar',

  data () {
    return {
    }
  },

  computed: {
    snackbarActive: {
      get () {
        return this.$store.state.common.snackbar.visible
      },
      set (val) {
        this.$store.dispatch('common/updateSnackbar', { visible: val })
      }
    }
  }
}
</script>

<style lang="stylus">

</style>
