<template lang="pug">
v-container.my-support(
  fluid
  fill-height
  text-xs-center
  v-bind:grid-list-sm="$vuetify.breakpoint.smAndDown"
  v-bind:grid-list-lg="$vuetify.breakpoint.mdAndUp"
)
  v-layout(row wrap)
    v-flex(d-flex xs12 sm12 md6 offset-md3)
      v-card
        v-card-media(src="static/images/afternoon.jpg" height="300px")
          v-layout.my-support__media(column)
            v-card-title(class="white--text pl-5 pt-5")
              .display-1.pl-5.pt-5 Contact Me
        v-list(two-line)
          v-list-tile(@click="")
            v-list-tile-action
              v-icon email
            v-list-tile-content
              v-list-tile-title calberoc@foxmail.com
              v-list-tile-sub-title Email
          v-list-tile(@click="openResume()")
            v-list-tile-action
              v-icon account_box
            v-list-tile-content
              v-list-tile-title About Me
              v-list-tile-sub-title Resume
</template>

<script>
export default {
  name: 'Support',

  methods: {
    openResume () {
      window.open('https://kousai.github.io/resume')
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-support

  &__media
    height: 100%
    margin: 0

  .picker__title
    display: none !important

</style>
