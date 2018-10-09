<template lang="pug">
.my-contacts

  Appbar

  v-tabs.elevation-0(dark v-model="active" color="primary")
    v-tab(ripple) I Followed
    v-tab-item
      v-layout(row wrap)
        v-flex(d-flex xs12 sm12 md6)
          v-card(v-if="!follows")
          v-card(v-else-if="follows.length == 0")
            v-list
              v-list-tile No Guests
          v-card(v-else)
            v-list(v-for="n in follows.length" :key="n")
              v-list-tile Name: {{ follows[n-1].name }}
              v-list-tile Gender: {{ follows[n-1].gender }}
              v-list-tile Follow Time: {{ follows[n-1].follow_time | formateDate }}
              v-list-tile avatar:
                img(
                  :src='avatarLink(follows[n-1].avatar,follows[n-1].gender)'
                  @click="openDialogFull('EnterRoom', follows[n-1].id)"
                  height='100'
                  width='100'
                )
    v-tab(ripple) My Followers
    v-tab-item
      v-layout(row wrap)
        v-flex(d-flex xs12 sm12 md6)
          v-card(v-if="!followers")
          v-card(v-else-if="followers.length == 0")
            v-list
              v-list-tile No Guests
          v-card(v-else)
            v-list(v-for="n in followers.length" :key="n")
              v-list-tile Name: {{ followers[n-1].name }}
              v-list-tile Gender: {{ followers[n-1].gender }}
              v-list-tile Follow Time: {{ followers[n-1].follow_time | formateDate }}
              v-list-tile avatar:
                img(
                  :src='avatarLink(followers[n-1].avatar,followers[n-1].gender)'
                  @click="openDialogFull('EnterRoom', followers[n-1].id)"
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
  name: 'Contacts',

  filters: {
    formateDate: (timestamp) => {
      return api.formateDate(timestamp)
    }
  },

  data () {
    return {
      follows: null,
      followers: null,
      active: null,
      dialogFullActive: false,
      dialogFullComp: null
    }
  },

  created () {
    this.showFollows()
    this.showFollowers()
  },

  methods: {
    showFollows () {
      var form = {}
      const header = ['show-follows', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.follows = res.data.result
          })
          .catch((error) => {
            api.showMessage(error)
          })
      }
    },

    showFollowers () {
      var form = {}
      const header = ['show-followers', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.followers = res.data.result
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
.my-contacts
  height 100%

</style>
