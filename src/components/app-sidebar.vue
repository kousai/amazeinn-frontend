<template lang="pug">
  v-navigation-drawer.my-sidebar(
    v-model="isActive"
    fixed
    :mobile-break-point="1904"
    app
    touchless
    dark
  )
    v-layout(justify-center wrap)
      .my-sidebar__hero-pattern

    v-divider

    v-avatar.my-sidebar__avatar(:size="70")
      img(
        ref='avatar'
        :src='avatarLink'
        alt='Avatar'
      )

    v-list(dark)
      v-list-group(prepend-icon='person')
        v-list-tile(slot="activator" ripple)
          v-list-tile-content
            v-list-tile-title {{ $store.state.auth.user.name }}
        v-list-tile(ripple :to="{ name: 'account' }")
          v-list-tile-action
            v-icon account_box
          v-list-tile-content
            v-list-tile-title Account
        v-list-tile(@click="openDialog()" ripple)
          v-list-tile-action
            v-icon power_settings_new
          v-list-tile-content
            v-list-tile-title Check-Out

    v-divider
    v-list(dark)
      v-list-tile(ripple :to="{ name: 'lounge' }")
        v-list-tile-action
          v-icon account_balance
        v-list-tile-content
          v-list-tile-title Lounge

      v-list-tile(ripple :to="{ name: 'porch' }")
        v-list-tile-action
          v-icon home
        v-list-tile-content
          v-list-tile-title Porch

      v-list-tile(ripple :to="{ name: 'profile' }")
        v-list-tile-action
          v-icon portrait
        v-list-tile-content
          v-list-tile-title Profile

      v-list-tile(ripple :to="{ name: 'contacts' }")
        v-list-tile-action
          v-icon people
        v-list-tile-content
          v-list-tile-title Contacts

      v-list-tile(ripple :to="{ name: 'messages' }")
        v-list-tile-action
          v-icon message
        v-list-tile-content
          v-list-tile-title Messages

      v-list-tile(ripple :to="{ name: 'support' }")
        v-list-tile-action
          v-icon contact_support
        v-list-tile-content
          v-list-tile-title Support

      v-list-tile(@click="guestLeave()" ripple)
        v-list-tile-action
          v-icon exit_to_app
        v-list-tile-content
          v-list-tile-title Leave

</template>

<script>
import api from '@/auth/helpers'
import auth from '@/auth/index'

export default {
  name: 'AppSidebar',

  data () {
    return {
      credentials: {
        password: '111111111'
      }
    }
  },

  computed: {
    isActive: {
      get () {
        return this.$store.state.common.sidebar.visible
      },
      set (val) {
        this.$store.dispatch('common/updateSidebar', { visible: val })
      }
    },

    avatarLink () {
      return this.$store.state.auth.user.avatar || api.defaultAvatar(this.$store.state.auth.user.gender)
    }
  },

  methods: {
    openDialog () {
      this.$store.dispatch('common/updateDialog', { text: 'Are you sure to Checkout? Your account will be removed.', visible: true })
    },

    guestLeave () {
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.leaveConfig())
          .then(res => {
            auth.expiredLogin()
            api.showMessage('Leave OK. See you again.')
          })
      }
    }
  }
}
</script>

<style lang="stylus">
  .my-sidebar
    z-index: 8

    &__logo
      padding-right: 10px
      padding-top: 14px
      padding-bottom: 14px
      height: 60px

    &__hero-pattern
      height: 145px
      width: 300px
      position: absolute
      background-color: #B39DDB
      background-image: url("../assets/images/buildings.png")
      background-repeat: no-repeat
      background-attachment: fixed
      background-position: 95.5% 50%

    &__avatar
      margin-top: 15px
      margin-left: 15px
</style>
