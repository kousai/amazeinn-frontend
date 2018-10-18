<template lang="pug">
  v-footer.my-appfooter(:class="{ 'my-appfooter__sidebar-open': sidebarVisibility }")
    .grey--text © 2018 Clauren Capsella
</template>

<script>
export default {
  name: 'AppFooter',

  computed: {
    sidebarVisibility () {
      return this.$store.state.common.sidebar.visible && this.$vuetify.breakpoint.mdAndUp
    }
  }
}
</script>

<style lang="stylus">
.my-appfooter
  justify-content: center

  &__sidebar-open
    padding-left: 300px

</style>
