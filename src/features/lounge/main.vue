<template lang="pug">
.my-lounge

  Appbar

  v-tabs.elevation-0(dark v-model="active" color="primary")
    v-tab(ripple) Popular Guests
    v-tab-item
      v-layout(row wrap)
        v-flex(d-flex xs12 sm12 md6)
          v-card(v-if="!guests")
          v-card(v-else-if="guests.length == 0")
            v-list
              v-list-tile No Guests
          v-card(v-else)
            v-list(v-for="n in guests.length" :key="n")
              v-list-tile Name: {{ guests[n-1].name }}
              v-list-tile Gender: {{ guests[n-1].gender }}
              v-list-tile avatar:
                img(
                  :src='avatarLink(guests[n-1].avatar,guests[n-1].gender)'
                  @click="openDialogFull('EnterRoom', guests[n-1].id)"
                  height='100'
                  width='100'
                )
              v-list-tile Followers num: {{ guests[n-1].follower_num }}
    v-tab(ripple) Popular Messages
    v-tab-item
      v-layout(row wrap)
        v-flex(d-flex xs12 sm12 md6)
          v-card(v-if="!messages")
          v-card(v-else-if="messages.length == 0")
            v-list
              v-list-tile No Messages
          v-card(v-else)
            v-list(v-for='n in messages.length' :key='n')
              v-list-tile {{ 'No.' + n + ' ' + messages[n-1].content }}
              v-list-tile -------------------- By: {{ messages[n-1].name }}
              v-list-tile Send Time: {{ messages[n-1].send_time | formateDate }}
              v-list-tile {{ messages[n-1].liked_count }}
              v-list-tile avatar:
                img(
                  :src='avatarLink(messages[n-1].avatar,messages[n-1].gender)'
                  @click="openDialogFull('EnterRoom', messages[n-1].guest_id)"
                  height='100'
                  width='100'
                )
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
      guests: null,
      messages: null,
      active: null,
      dialogFullActive: false,
      dialogFullComp: null
    }
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
          })
          .catch((error) => {
            api.showMessage(error)
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
          })
          .catch((error) => {
            api.showMessage(error)
          })
      }
    },

    openDialogFull (comp, id) {
      if (comp === 'EnterRoom') this.dialogFullComp = EnterRoom
      if (id) {
        this.updateOwner(id)
        this.dialogFullActive = true
      }
    },

    updateOwner (id) {
      store.dispatch('room/updateOwner', id)
    },

    avatarLink (avatar, gender) {
      return avatar || api.defaultAvatar(gender)
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-lounge
  height 100%

</style>
