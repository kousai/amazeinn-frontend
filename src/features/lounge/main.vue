<template lang="pug">
.my-lounge

  Appbar

  v-tabs.elevation-0(dark v-model="active" color="primary")
    v-tab(ripple) Popular Guests
    v-tab-item
      v-layout(v-show="showGuestsPage" row)
        v-flex(d-flex xs12 sm12 md4 offset-md4)
          v-card(v-if="guests.length == 0")
            v-list(subheader)
              v-subheader No Guests
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Top 6
              template(
                v-for="guest in guests"
              )
                v-list-tile(avatar)
                  v-badge(
                    :color="genderColor(guest.gender)"
                    bottom
                    left
                    overlap
                  )
                    span(slot="badge") {{ guest.follower_num }}
                    v-list-tile-avatar(
                      size='60'
                    )
                      img(:src='avatarLink(guest.avatar, guest.gender)')
                  v-list-tile-content
                    v-list-tile-title {{guest.name}}
                  v-list-tile-action
                    v-icon(
                      v-if='guest.id !== $store.state.auth.user.id'
                      color='primary'
                      @click="openDialogFull('EnterRoom', guest.id)"
                    ) arrow_forward_ios
                v-divider
    v-tab(ripple) Popular Messages
    v-tab-item
      v-layout(v-show="showMessagesPage" row)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-card(v-if="messages.length == 0")
            v-list(subheader)
              v-subheader No Messages
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Top 6
              template(
                v-for="message in messages"
              )
                v-list-tile(avatar)
                  v-badge(
                    :color="genderColor(message.gender)"
                    bottom
                    left
                    overlap
                  )
                    span(slot="badge") {{ message.liked_count }}
                    v-list-tile-avatar(
                      size='60'
                    )
                      img(:src='avatarLink(message.avatar, message.gender)')
                  v-list-tile-content
                    v-list-tile-title {{message.content}}
                    v-list-tile-sub-title {{ message.send_time | formateDate }} ---- by. {{message.name}}
                  v-list-tile-action
                    v-icon(
                      v-if='message.guest_id !== $store.state.auth.user.id'
                      color='primary'
                      @click="openDialogFull('EnterRoom', message.guest_id)"
                    ) arrow_forward_ios
                v-divider
  v-dialog(
    v-model="dialogFullActive"
    fullscreen
    transition="dialog-bottom-transition"
    :overlay=false
    scrollable
  )
    component(:is="dialogFullComp" :active.sync="dialogFullActive")
</template>

<script>
import api from '@/auth/helpers'
import auth from '@/auth/index'
import store from '../room/store'
import EnterRoom from '../room/room.vue'

export default {
  name: 'Lounge',

  filters: {
    formateDate: (timestamp) => {
      return api.formateDate(timestamp)
    }
  },

  data () {
    return {
      guests: [],
      messages: [],
      active: null,
      showGuestsPage: false,
      showMessagesPage: false,
      dialogFullActive: false,
      dialogFullComp: null
    }
  },

  computed: {
  },

  created () {
    this.popularGuests()
    this.popularMessages()
  },

  methods: {
    popularGuests () {
      var form = {}
      const header = ['popular-guests', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.guests = res.data.result
            this.showGuestsPage = true
          })
          .catch((error) => {
            this.showGuestsPage = false && error
          })
      }
    },

    popularMessages () {
      var form = {}
      const header = ['popular-messages', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.messages = res.data.result
            this.showMessagesPage = true
          })
          .catch((error) => {
            this.showMessagesPage = false && error
          })
      }
    },

    openDialogFull (comp, id) {
      if (id) {
        if (comp === 'EnterRoom') this.dialogFullComp = EnterRoom
        this.updateOwner(id)
        this.dialogFullActive = true
      }
    },

    updateOwner (id) {
      store.dispatch('room/updateOwner', id)
    },

    avatarLink (avatar, gender) {
      return avatar || api.defaultAvatar(gender)
    },

    genderColor (gender) {
      return api.genderColor(gender)
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-lounge
  height 100%

</style>
