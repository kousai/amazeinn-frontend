<template lang="pug">
  v-card.my-room(tile)
    v-toolbar(card dark color="primary")
      v-btn(icon @click.native="exit()" dark)
        v-icon close
      v-toolbar-title {{ data.name }}'s Room

    v-card-text
      loading(:loading="loading" :oops="oops")
      v-layout(v-show="showPage" row)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-layout(column)
            v-flex(d-flex)
              v-card
                v-card-media(:src="bgImgLink" width="600px" height="150px")
            v-flex(d-flex)
              v-card
                v-card-text
                  v-layout
                    v-flex
                      v-avatar(tile size='100')
                        img.my-room__avatar(
                          :src='avatarLink'
                        )
                    v-flex.px-2
                      h2 {{ data.name }}
                      v-btn(
                        v-if='followLabel'
                        @click="followGuest()"
                        block
                        dark
                        :color='followColor'
                      ) {{followText}}
            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Nickname
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span {{ data.nickname || 'No Nickname' }}
            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Gender
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span {{ data.gender }}
            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Email
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span {{ data.email || 'No Email' }}
            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Country
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span {{ data.country || 'In Secret'}}
            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Introduction
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span {{ data.intro || 'No Introduction' }}
            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Recent Message
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span(v-if="!data.message") No Message
                      v-card(
                        v-if="data.message_num > 0"
                      )
                        v-list
                          v-list-tile(avatar)
                            v-list-tile-avatar(
                              size='30'
                              :color="genderColor(data.gender)"
                            )
                              span.my-messages__count(v-text='likeCount(data.message.liked_count)')
                            v-list-tile-content
                              v-list-tile-title {{data.message.content}}
                              v-list-tile-sub-title {{ data.message.send_time | formateDate }}
                            v-list-tile-action.text-xs-right(v-if='followLabel')
                              v-btn(
                                @click="thumbUp()"
                                block
                                dark
                                :depressed='data.message.label===0'
                                color='success'
                              ) Thumb-Up
                              v-btn(
                                @click="thumbDown()"
                                block
                                dark
                                :depressed='data.message.label===1'
                                color='error'
                              ) Thumb-Down
            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Popular Degree
                v-card-text
                  v-layout(row wrap)
                    v-flex(xs3)
                      .sub-title Follows
                    v-flex(xs3)
                      .sub-title Followers
                    v-flex(xs3)
                      .sub-title Liked
                    v-flex(xs3)
                      .sub-title Messages
                    v-flex(d-flex xs3)
                      v-progress-circular(
                        :size="100"
                        :width="15"
                        :rotate="360"
                        :value="numberArc(data.follow_num)"
                        color="error"
                      )
                        | {{ data.follow_num }}

                    v-flex(d-flex xs3)
                      v-progress-circular(
                        :size="100"
                        :width="15"
                        :rotate="360"
                        :value="numberArc(data.follower_num)"
                        color="success"
                      )
                        | {{ data.follower_num }}

                    v-flex(d-flex xs3)
                      v-progress-circular(
                        :size="100"
                        :width="15"
                        :rotate="360"
                        :value="numberArc(data.liked_num)"
                        color="primary"
                      )
                        | {{ data.liked_num }}
                    v-flex(d-flex xs3)
                      v-progress-circular(
                        :size="100"
                        :width="15"
                        :rotate="360"
                        :value="numberArc(data.message_num)"
                        color="info"
                      )
                        | {{ data.message_num }}
      audio(
        ref='roomAudio'
        :src='bgmLink'
        autoplay
        loop
      )
</template>

<script>
import api from '@/auth/helpers'
import auth from '@/auth/index'
import store from './store'

export default {
  name: 'Room',

  filters: {
    formateDate: (timestamp) => {
      return api.formateDate(timestamp)
    }
  },

  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      data: {
        name: null,
        created_on: null,
        last_login: null,
        nickname: null,
        gender: null,
        email: null,
        country: null,
        intro: null,
        avatar: null,
        bg_music: null,
        bg_image: null,
        follow_num: 0,
        follower_num: 0,
        message_num: 0,
        liked_num: 0,
        like_times: 0,
        message: null,
        follows_label: false,
        followed_label: false
      },
      label: false,
      loading: false,
      showPage: false,
      oops: false
    }
  },

  computed: {
    isActive: {
      get () {
        return this.active
      },
      set (val) {
        this.$emit('update:active', val)
      }
    },
    avatarLink () {
      return this.data.avatar || api.defaultAvatar(this.data.gender)
    },
    bgmLink () {
      return this.data.bg_music || 'static/music/0.mp3'
    },
    bgImgLink () {
      return this.data.bg_image || 'static/images/bg0.jpg'
    },
    followLabel () {
      return store.state.room.id !== store.state.auth.user.id
    },
    followColor () {
      return this.data.follows_label ? 'error' : 'success'
    },
    followText () {
      return this.data.follows_label ? 'Unfollow' : 'Follow'
    }
  },

  watch: {
    'isActive': 'createRoom'
  },

  created () {
    this.enterRoom()
  },

  methods: {

    createRoom (newValue, oldValue) {
      if (newValue) {
        this.enterRoom()
      }
    },

    enterRoom () {
      this.loading = true
      this.oops = false
      var form = {
        id: store.state.room.id
      }
      var data = {}
      var header = []
      if (store.state.room.id === store.state.auth.user.id) {
        header = ['enter-room', null]
        this.label = true
      } else {
        data = {
          instruction: JSON.stringify(form)
        }
        header = ['knock-door', null]
      }
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(data), header))
          .then(res => {
            this.data = res.data.result
            this.showPage = true
            this.loading = false
            var audio = this.$refs.roomAudio
            audio.play()
          })
          .catch((error) => {
            this.oops = true
            this.loading = false && error
          })
      }
    },

    exit () {
      var audio = this.$refs.roomAudio
      audio.pause()
      audio.currentTime = 0
      this.isActive = false
    },

    genderColor (gender) {
      return api.genderColor(gender)
    },

    likeCount (liked) {
      return api.likeCount(liked)
    },

    numberArc (num) {
      return num * 5
    },

    followGuest () {
      var form = {
        id: store.state.room.id
      }
      var data = {
        instruction: JSON.stringify(form)
      }
      var header = []
      var flag = ''
      if (this.data.follows_label) {
        header = ['unfollow-guest', null]
        flag = 'Unfollow'
      } else {
        header = ['follow-guest', null]
        flag = 'Follow'
      }
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(data), header))
          .then(res => {
            api.showMessage(`${flag} Successful.`)
            this.data.follows_label = !this.data.follows_label
          })
          .catch((error) => {
            api.showMessage(error)
          })
      }
    },

    thumbUp () {
      var form = {
        message_id: this.data.message.message_id
      }
      var data = {
        instruction: JSON.stringify(form)
      }
      const header = ['like-message', null]
      if (!this.data.message.label) {
        if (!auth.isValidLogin()) {
          auth.expiredLogin()
        } else {
          api.fullRequest(api.infoConfig(JSON.stringify(data), header))
            .then(res => {
              api.showMessage('Thumb-Up Successful.')
              this.data.message.liked_count += 1
              this.data.message.label = 0
            })
            .catch((error) => {
              api.showMessage(error)
            })
        }
      } else {
        api.showMessage('You have already thumbed it.')
      }
    },

    thumbDown () {
      var form = {
        message_id: this.data.message.message_id
      }
      var data = {
        instruction: JSON.stringify(form)
      }
      const header = ['dislike-message', null]
      if (!this.data.message.label) {
        if (!auth.isValidLogin()) {
          auth.expiredLogin()
        } else {
          api.fullRequest(api.infoConfig(JSON.stringify(data), header))
            .then(res => {
              api.showMessage('Thumb-Down Successful.')
              this.data.message.liked_count -= 1
              this.data.message.label = 1
            })
            .catch((error) => {
              api.showMessage(error)
            })
        }
      } else {
        api.showMessage('You have already thumbed it.')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-room
  height: 100%

  &__avatar
    border-style: solid
    border-color: gray
    position: relative

  &__count
    color: white

</style>
