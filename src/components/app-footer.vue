<template lang="pug">
  v-footer.my-appfooter(:class="{ 'my-appfooter__sidebar-open': sidebarVisibility }")
    a.grey--text.my-appfooter__about-me(
      href="https://kousai.github.io/resume"
      target="_blank"
    ) © 2018 calberoc/kousai
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

  &__about-me
    text-decoration: none
    &:hover
      text-decoration: underline

</style>
