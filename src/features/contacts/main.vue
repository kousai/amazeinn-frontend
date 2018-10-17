<template lang="pug">
.my-contacts

  Appbar
  v-tabs.elevation-0(dark v-model="active" color="primary")
    v-tab(ripple @click='pageInit("follows")') I Followed
    v-tab-item
      v-layout(v-show="showFollowsPage" row wrap)
        v-flex(d-flex xs12 sm12 md4 offset-md4)
          v-card(v-if="followLists.length == 0")
            v-list(subheader)
              v-subheader No Follows
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Follows List
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
            v-layout(align-center justify-center)
              paginate(
                v-model="followPage"
                :page-count="totalPage(follows)"
                :no-li-surround="true"
                :click-handler="clickCallback"
                :container-class="'pagination'"
              )

    v-tab(ripple @click='pageInit("followers")') My Followers
    v-tab-item
      v-layout(v-show="showFollowersPage" row wrap)
        v-flex(d-flex xs12 sm12 md4 offset-md4)
          v-card(v-if="followers.length == 0")
            v-list(subheader)
              v-subheader No Followers
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Followers List
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
import Paginate from 'vuejs-paginate'

export default {
  name: 'Contacts',

  components: {
    Paginate
  },

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
      limit: 6,
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
    'loadingState': 'loadingChange'
  },

  created () {
    this.showFollows()
    this.showFollowers()
    this.pageInit('follows')
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
            this.followLists = this.pegination(this.follows, 1)
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
            this.followerLists = this.pegination(this.followers, 1)
            this.showFollowersPage = true
          })
          .catch((error) => {
            this.oops = true
            this.loading = false && error
          })
      }
    },

    totalPage (arr) {
      return Math.ceil(arr.length / this.limit)
    },

    pegination (arr, currentPage) {
      let result = []
      if (arr.length <= this.limit) {
        result = arr
      } else {
        result = arr.slice(this.limit * (currentPage - 1), this.limit * currentPage)
      }
      return result
    },

    pageInit (str) {
      const user = store.state.auth
      user.user.paginate = str
      store.dispatch('auth/update', user)
    },

    clickCallback (PageNum) {
      const paginateType = store.state.auth.user.paginate
      switch (paginateType) {
        case 'follows':
          this.followLists = this.pegination(this.follows, PageNum)
          break
        case 'followers':
          this.followerLists = this.pegination(this.followers, PageNum)
          break
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
.my-contacts
  height: 100%

.pagination
  margin: 0em
  display: inline-block
  vertical-align: middle
  font-size: 30px

</style>
