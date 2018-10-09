<template lang="pug">
.my-messages

  Appbar

  v-tabs.elevation-0(dark v-model="active" color="primary")
    v-tab(ripple) My Messages
    v-tab-item
      v-layout(row wrap)
        v-flex(d-flex xs12 sm12 md6)
          v-card(v-if="!messages")
          v-card(v-else-if="messages.length == 0")
            v-list
              v-list-tile No Messages
          v-card(v-else)
            v-list(v-for="n in messages.length" :key="n")
              v-list-tile {{ 'No.' + n + ' ' + messages[n-1].content }}
              v-list-tile Send Time: {{ messages[n-1].send_time | formateDate }}
              v-list-tile Liked Count: {{ messages[n-1].liked_count }}
    v-tab(ripple) Thumbs Up
    v-tab-item
      v-layout(row wrap)
        v-flex(d-flex xs12 sm12 md6)
          v-card(v-if="!thumbUps")
          v-card(v-else-if="thumbUps.length == 0")
            v-list
              v-list-tile No Thumb-Ups
          v-card(v-else)
            v-list(v-for="n in thumbUps.length" :key="n")
              v-list-tile Thumb Time: {{ thumbUps[n-1].thumb_time | formateDate }}
              v-list-tile {{ 'No.' + n + ' ' + thumbUps[n-1].content }}
              v-list-tile Send Time: {{ thumbUps[n-1].send_time | formateDate }}
              v-list-tile Liked Count: {{ thumbUps[n-1].liked_count }}
              v-list-tile -------------------- By: {{ thumbUps[n-1].name }}
              v-list-tile avatar:
                img(
                  :src='avatarLink(thumbUps[n-1].avatar,thumbUps[n-1].gender)'
                  @click="openDialogFull('EnterRoom', thumbUps[n-1].guest_id)"
                  height='100'
                  width='100'
                )
    v-tab(ripple) Thumbs Down
    v-tab-item
      v-layout(row wrap)
        v-flex(d-flex xs12 sm12 md6)
          v-card(v-if="!thumbDowns")
          v-card(v-else-if="thumbDowns.length == 0")
            v-list
              v-list-tile No Thumb-Downs
          v-card(v-else)
            v-list(v-for="n in thumbDowns.length" :key="n")
              v-list-tile Thumb Time: {{ thumbDowns[n-1].thumb_time | formateDate }}
              v-list-tile {{ 'No.' + n + ' ' + thumbDowns[n-1].content }}
              v-list-tile Send Time: {{ thumbDowns[n-1].send_time | formateDate }}
              v-list-tile Liked Count: {{ thumbDowns[n-1].liked_count }}
              v-list-tile -------------------- By: {{ thumbDowns[n-1].name }}
              v-list-tile avatar:
                img(
                  :src='avatarLink(thumbDowns[n-1].avatar,thumbDowns[n-1].gender)'
                  @click="openDialogFull('EnterRoom', thumbDowns[n-1].guest_id)"
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
  name: 'Messages',

  filters: {
    formateDate: (timestamp) => {
      return api.formateDate(timestamp)
    }
  },

  data () {
    return {
      messages: null,
      thumbUps: null,
      thumbDowns: null,
      active: null,
      dialogFullActive: false,
      dialogFullComp: null
    }
  },

  created () {
    this.showMessages()
    this.showThumbUps()
    this.showThumbDowns()
  },

  methods: {
    showMessages () {
      var form = {}
      const header = ['show-messages', null]
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

    showThumbUps () {
      var form = {}
      const header = ['show-thumbups', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.thumbUps = res.data.result
          })
          .catch((error) => {
            api.showMessage(error)
          })
      }
    },

    showThumbDowns () {
      var form = {}
      const header = ['show-thumbdowns', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.thumbDowns = res.data.result
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
.my-messages
  height 100%

</style>
