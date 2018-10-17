<template lang="pug">
.my-messages

  Appbar

  v-tabs.elevation-0(dark v-model="active" color="primary")
    v-tab(ripple @click='pageInit("messages")') My Messages
    v-tab-item
      v-layout(v-show="showMessagesPage" row)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-card(v-if="messages.length == 0")
            v-list(subheader)
              v-subheader No Messages
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Messages List
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
            v-layout(align-center justify-center)
              paginate(
                v-model="messagePage"
                :page-count="totalPage(messages)"
                :no-li-surround="true"
                :click-handler="clickCallback"
                :container-class="'pagination'"
              )

    v-tab(ripple @click='pageInit("thumbUps")') Thumbs Up
    v-tab-item
      v-layout(v-show="showThumbUpsPage" row)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-card(v-if="thumbUps.length == 0")
            v-list(subheader)
              v-subheader No Thumb-Ups
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Thumb-Ups List
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
            v-layout(align-center justify-center)
              paginate(
                v-model="thumbUpPage"
                :page-count="totalPage(thumbUps)"
                :no-li-surround="true"
                :click-handler="clickCallback"
                :container-class="'pagination'"
              )
    v-tab(ripple @click='pageInit("thumbDowns")') Thumbs Down
    v-tab-item
      v-layout(v-show="showThumbDownsPage" row)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-card(v-if="thumbDowns.length == 0")
            v-list(subheader)
              v-subheader No Thumb-Downs
          v-card(v-else)
            v-list(subheader three-line)
              v-subheader Thumb-Downs List
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
            v-layout(align-center justify-center)
              paginate(
                v-model="thumbDownPage"
                :page-count="totalPage(thumbDowns)"
                :no-li-surround="true"
                :click-handler="clickCallback"
                :container-class="'pagination'"
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
import Paginate from 'vuejs-paginate'

export default {
  name: 'Messages',

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
      messages: [],
      thumbUps: [],
      thumbDowns: [],
      messageLists: [],
      thumbUpLists: [],
      thumbDownLists: [],
      messagePage: 1,
      thumbUpPage: 1,
      thumbDownPage: 1,
      limit: 6,
      active: null,
      showMessagesPage: false,
      showThumbUpsPage: false,
      showThumbDownsPage: false,
      loading: false,
      oops: false,
      dialogFullActive: false,
      dialogFullComp: null
    }
  },

  computed: {
    loadingState () {
      return this.showMessagesPage && this.showThumbUprsPage && this.showThumbDownsPage
    }
  },

  watch: {
    'loadingState': 'loadingChange'
  },

  created () {
    this.showMessages()
    this.showThumbUps()
    this.showThumbDowns()
    this.pageInit('messages')
  },

  methods: {
    loadingChange (newValue, oldValue) {
      if (newValue) {
        this.loading = false
      }
    },

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
        case 'messages':
          this.messageLists = this.pegination(this.messages, PageNum)
          break
        case 'thumbUps':
          this.thumbUpLists = this.pegination(this.thumbUps, PageNum)
          break
        case 'thumbDowns':
          this.thumbDownLists = this.pegination(this.thumbDowns, PageNum)
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
    },

    likeCount (liked) {
      return api.likeCount(liked)
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-messages
  height: 100%

  &__count
    color: white

.pagination
  margin: 0em
  display: inline-block
  vertical-align: middle
  font-size: 30px

</style>
