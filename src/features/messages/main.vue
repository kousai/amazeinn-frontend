<template lang="pug">
.my-messages

  Appbar

  v-tabs.elevation-0(dark v-model="active" color="primary")
    v-tab(ripple) My Messages
    v-tab-item
      v-layout(v-show="showMessagesPage" row)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-card(v-if="messages.length == 0")
            v-list(subheader)
              v-subheader No Messages
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Recent 6
              template(
                v-for="message in messages"
              )
                v-list-tile(avatar)
                  v-list-tile-avatar(
                    size='30'
                    :color="genderColor(message.gender)"
                  )
                    span.my-messages__count(v-text='likeCount(message.liked_count)')
                  v-list-tile-content
                    v-list-tile-title {{message.content}}
                    v-list-tile-sub-title {{ message.send_time | formateDate }}
                v-divider

    v-tab(ripple) Thumbs Up
    v-tab-item
      v-layout(v-show="showThumbUpsPage" row)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-card(v-if="thumbUps.length == 0")
            v-list(subheader)
              v-subheader No Thumb-Ups
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Recent 6
              template(
                v-for="thumbUp in thumbUps"
              )
                v-list-tile(avatar)
                  v-list-tile-avatar(
                    size='30'
                    :color="genderColor(thumbUp.gender)"
                  )
                    span.my-messages__count(v-text='likeCount(thumbUp.liked_count)')
                  v-list-tile-content
                    v-list-tile-title {{thumbUp.content}}
                    v-list-tile-sub-title {{ thumbUp.send_time | formateDate }} ---- by. {{ thumbUp.name }}
                    v-list-tile-sub-title Thumb Time: {{ thumbUp.thumb_time | formateDate }}
                  v-list-tile-action
                    v-icon(
                      color='primary'
                      @click="openDialogFull('EnterRoom', thumbUp.guest_id)"
                    ) arrow_forward_ios
                v-divider
    v-tab(ripple) Thumbs Down
    v-tab-item
      v-layout(v-show="showThumbDownsPage" row)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-card(v-if="thumbDowns.length == 0")
            v-list(subheader)
              v-subheader No Thumb-Downs
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Recent 6
              template(
                v-for="thumbDown in thumbDowns"
              )
                v-list-tile(avatar)
                  v-list-tile-avatar(
                    size='30'
                    :color="genderColor(thumbDown.gender)"
                  )
                    span.my-messages__count(v-text='likeCount(thumbDown.liked_count)')
                  v-list-tile-content
                    v-list-tile-title {{thumbDown.content}}
                    v-list-tile-sub-title {{ thumbDown.send_time | formateDate }} ---- by. {{ thumbDown.name }}
                    v-list-tile-sub-title Thumb Time: {{ thumbDown.thumb_time | formateDate }}
                  v-list-tile-action
                    v-icon(
                      color='primary'
                      @click="openDialogFull('EnterRoom', thumbDown.guest_id)"
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
  name: 'Messages',

  filters: {
    formateDate: (timestamp) => {
      return api.formateDate(timestamp)
    }
  },

  data () {
    return {
      messages: [],
      thumbUps: [],
      thumbDowns: [],
      active: null,
      showMessagesPage: false,
      showThumbUpsPage: false,
      showThumbDownsPage: false,
      dialogFullActive: false,
      dialogFullComp: null
    }
  },

  computed: {
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
            this.showMessagesPage = true
          })
          .catch((error) => {
            this.showMessagesPage = false && error
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
            this.showThumbUpsPage = true
          })
          .catch((error) => {
            this.showThumbUpsPage = false && error
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
            this.showThumbDownsPage = true
          })
          .catch((error) => {
            this.showThumbDownsPage = false && error
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
    },

    likeCount (liked) {
      return api.likeCount(liked)
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-messages
  height 100%

  &__count
    color: white

</style>
