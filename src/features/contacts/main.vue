<template lang="pug">
.my-contacts
  v-tabs.elevation-0(dark v-model="active" color="primary")
    v-tab(ripple @click="initPage") I Followed
    v-tab-item
      v-layout(v-show="showFollowsPage" row wrap)
        v-flex(d-flex xs12 sm12 md4 offset-md4)
          v-card(v-if="followLists.length === 0")
            v-list(subheader)
              v-subheader No Follows
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader You have {{follows.length}} Follows
              template(
                v-for="follow in followLists"
              )
                v-list-tile(avatar)
                  v-list-tile-avatar(
                    size='60'
                  )
                    img(:src='avatarLink(follow.avatar, follow.gender)')
                  v-list-tile-content
                    v-list-tile-title {{follow.name}}
                    v-list-tile-sub-title Follow Time: {{ follow.follow_time | formateDate }}
                  v-list-tile-action
                    v-icon(
                      color='primary'
                      @click="openDialogFull('EnterRoom', follow.id)"
                    ) arrow_forward_ios
                v-divider
            div.text-xs-center(v-if='totalPage(follows)!==1')
              v-pagination(
                v-model="followPage"
                :length="totalPage(follows)"
                :total-visible="5"
              )

    v-tab(ripple @click="initPage") My Followers
    v-tab-item
      v-layout(v-show="showFollowersPage" row wrap)
        v-flex(d-flex xs12 sm12 md4 offset-md4)
          v-card(v-if="followers.length === 0")
            v-list(subheader)
              v-subheader No Followers
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader You have {{followers.length}} Followers
              template(
                v-for="follower in followers"
              )
                v-list-tile(avatar)
                  v-list-tile-avatar(
                    size='60'
                  )
                    img(:src='avatarLink(follower.avatar, follower.gender)')
                  v-list-tile-content
                    v-list-tile-title {{follower.name}}
                    v-list-tile-sub-title Follow Time: {{ follower.follow_time | formateDate }}
                  v-list-tile-action
                    v-icon(
                      color='primary'
                      @click="openDialogFull('EnterRoom', follower.id)"
                    ) arrow_forward_ios
                v-divider
            div.text-xs-center(v-if='totalPage(followers)!==1')
              v-pagination(
                v-model="followerPage"
                :length="totalPage(followers)"
                :total-visible="5"
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
      follows: [],
      followers: [],
      followLists: [],
      followerLists: [],
      followPage: 1,
      followerPage: 1,
      active: null,
      showFollowsPage: false,
      showFollowersPage: false,
      loading: false,
      oops: false,
      dialogFullActive: false,
      dialogFullComp: null
    }
  },

  computed: {
    loadingState () {
      return this.showFollowsPage && this.showFollowersPage
    }
  },

  watch: {
    'loadingState': 'loadingChange',
    'followPage': 'changeFollowPage',
    'followerPage': 'changeFollowerPage'
  },

  created () {
    this.showFollows()
    this.showFollowers()
  },

  methods: {
    loadingChange (newValue, oldValue) {
      if (newValue) {
        this.loading = false
      }
    },

    showFollows () {
      this.loading = true
      this.oops = false
      var form = {}
      const header = ['show-follows', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.follows = res.data.result
            this.followLists = api.pegination(this.follows, 1)
            this.showFollowsPage = true
          })
          .catch((error) => {
            this.oops = true
            this.loading = false && error
          })
      }
    },

    showFollowers () {
      this.loading = true
      this.oops = false
      var form = {}
      const header = ['show-followers', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.followers = res.data.result
            this.followerLists = api.pegination(this.followers, 1)
            this.showFollowersPage = true
          })
          .catch((error) => {
            this.oops = true
            this.loading = false && error
          })
      }
    },

    totalPage (arr) {
      return api.totalPage(arr)
    },

    changeFollowPage (newValue, oldValue) {
      this.followLists = api.pegination(this.follows, newValue)
    },

    changeFollowerPage (newValue, oldValue) {
      this.followerLists = api.pegination(this.followers, newValue)
    },

    initPage () {
      this.followPage = 1
      this.followerPage = 1
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
.my-contacts
  height: 100%

</style>
