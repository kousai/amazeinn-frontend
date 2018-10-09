<template lang="pug">
  v-card.my-room(tile)
    v-toolbar(card dark color="primary")
      v-btn(icon @click.native="isActive = false" dark)
        v-icon close
      v-toolbar-title Room

    v-card-text(style="position: relative; max-width: 500px; margin: auto;")
      loading(:loading="loading" :oops="oops")
      v-layout(row wrap)
        v-flex(d-flex xs12 sm12 md6)
          v-card
            v-list
              v-list-tile Name: {{ data.name }}
              v-list-tile(v-if='followLabel') Follow:
                v-btn(
                  @click="followGuest()"
                  block
                  dark
                  :color='followColor'
                ) {{followText}}
              v-list-tile Nickname: {{ data.nickname || 'No Nickname' }}
              v-list-tile gender: {{ data.gender }}
              v-list-tile email: {{ data.email || 'No Email' }}
              v-list-tile country: {{ data.country || 'In Secret'}}
              v-list-tile intro: {{ data.intro || 'No Introduction' }}
              v-list-tile avatar:
                img(:src='avatarLink')
              v-list-tile bgmusic: {{ data.bg_music }}
                audio(
                  :src='bgmLink'
                  autoplay
                  controls
                  loop
                )
              v-list-tile bgimage: {{ data.bg_image }}
              v-list-tile Follow num: {{ data.follow_num }}
              v-list-tile Follower num: {{ data.follower_num }}
              v-list-tile Liked num: {{ data.liked_num }}
              v-list-tile Like times: {{ data.like_times }}
              v-list-tile Message num: {{ data.message_num }}
              v-list-tile Recent Message:
                v-card(v-if="!data.message")
                  v-list
                    v-list-tile No Message
                v-card(v-else)
                  v-list
                    v-list-tile Content: {{ data.message.content }}
                    v-list-tile(v-if='followLabel') Thumb:
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
                    v-list-tile Send Time: {{ data.message.send_time | formateDate }}
                    v-list-tile Liked Count: {{ data.message.liked_count }}
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
      this.enterRoom()
    },

    enterRoom () {
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
          })
          .catch((error) => {
            api.showMessage(error)
          })
      }
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
            api.showMessage(flag + ' Successful.')
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
</style>
