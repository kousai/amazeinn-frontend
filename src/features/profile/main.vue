<template lang="pug">
v-container(fluid fill-height style="padding: 0;")
  v-layout.my-profile(column)

    v-tabs.my-profile__tabs(
      :color="$vuetify.breakpoint.smAndDown ? 'primary' : ''"
      :dark="$vuetify.breakpoint.smAndDown"
      v-model="active"
      align-with-title
      :class="{ 'my-profile__mobile-tabs': $vuetify.breakpoint.mdAndUp }"
      style="position: fixed; width: 100%; z-index: 1; background: #F4F4F4;"
    )

    v-container(
      fluid
      fill-height
      v-bind:grid-list-sm="$vuetify.breakpoint.smAndDown"
      v-bind:grid-list-lg="$vuetify.breakpoint.mdAndUp"
      style="position: relative; margin-top: 40px;"
    )

      v-layout(v-show="showPage" row wrap)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-layout(column)
            v-flex(d-flex)
              v-card
                v-card-text
                  v-layout
                    v-flex
                      v-avatar(size='150')
                        img(:src='avatarLink')
                      br
                      v-btn(
                        outline
                        color="success"
                        @click="openUploadDialog('Upload', 'avatar')"
                      ) Update Avatar

                    v-flex.px-2
                      h2.my-profile__name {{ profile.name }}
                      br
                      v-divider
                      v-list(two-line)
                        v-list-tile
                          v-list-tile-content
                            v-list-tile-title Joined:
                            v-list-tile-sub-title {{profile.created_on | formateDate}}
                        v-list-tile
                          v-list-tile-content
                            v-list-tile-title Last login:
                            v-list-tile-sub-title {{profile.last_login | formateDate}}

            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Nickname
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span(
                        v-if='nicknameLabel'
                      ) {{ profile.nickname || 'No Nickname' }}
                      v-text-field(
                        v-else
                        label="Nickname"
                        v-model='nickname'
                        :rules="[rules.checkNickname]"
                        counter
                        solo
                        autofocus
                        clearable
                      )
                    v-flex.text-xs-right
                      v-btn(
                        flat
                        icon
                        color="primary"
                        @click='nicknameEdit'
                      )
                        v-icon(v-if='nicknameLabel') edit
                        v-icon(v-else) check_circle
                      v-btn(
                        v-if='!nicknameLabel'
                        flat
                        icon
                        color="error"
                        @click='nicknameLabel=!nicknameLabel'
                      )
                        v-icon clear

            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Gender
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span(
                        v-if='genderLabel'
                      ) {{ profile.gender || 'No Gender' }}
                      v-select(
                        v-else
                        :items="genders"
                        label="Gender"
                        v-model='gender'
                        outline
                        solo
                        autofocus
                      )
                    v-flex.text-xs-right
                      v-btn(
                        flat
                        icon
                        color="primary"
                        @click='genderEdit'
                      )
                        v-icon(v-if='genderLabel') edit
                        v-icon(v-else) check_circle
                      v-btn(
                        v-if='!genderLabel'
                        flat
                        icon
                        color="error"
                        @click='genderLabel=!genderLabel'
                      )
                        v-icon clear

            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Email
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span(
                        v-if='emailLabel'
                      ) {{ profile.email || 'No Email' }}
                      v-text-field(
                        v-else
                        label="Email"
                        v-model='email'
                        :rules="[rules.checkEmail]"
                        solo
                        autofocus
                        clearable
                      )
                    v-flex.text-xs-right
                      v-btn(
                        flat
                        icon
                        color="primary"
                        @click='emailEdit'
                      )
                        v-icon(v-if='emailLabel') edit
                        v-icon(v-else) check_circle
                      v-btn(
                        v-if='!emailLabel'
                        flat
                        icon
                        color="error"
                        @click='emailLabel=!emailLabel'
                      )
                        v-icon clear

            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Country
                v-card-text
                  v-layout
                    v-flex
                      span(
                        v-if='countryLabel'
                      ) {{ profile.country || 'No Country' }}
                      v-select(
                        v-else
                        label="Country"
                        v-model="country"
                        v-bind:items="countries"
                        item-value="name"
                        item-text="name"
                        :rules="[rules.checkCountry]"
                        required
                        autofocus
                        solo
                      )
                    v-flex.text-xs-right
                      v-btn(
                        flat
                        icon
                        color="primary"
                        @click='countryEdit'
                      )
                        v-icon(v-if='countryLabel') edit
                        v-icon(v-else) check_circle
                      v-btn(
                        v-if='!countryLabel'
                        flat
                        icon
                        color="error"
                        @click='countryLabel=!countryLabel'
                      )
                        v-icon clear

            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Introduction
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      span(
                        v-if='introLabel'
                      ) {{ profile.intro || 'No Introduction' }}
                      v-textarea(
                        v-else
                        label="Intro"
                        v-model='intro'
                        :rules="[rules.checkIntro]"
                        counter
                        solo
                        autofocus
                        clearable
                      )
                    v-flex.text-xs-right
                      v-btn(
                        flat
                        icon
                        color="primary"
                        @click='introEdit'
                      )
                        v-icon(v-if='introLabel') edit
                        v-icon(v-else) check_circle
                      v-btn(
                        v-if='!introLabel'
                        flat
                        icon
                        color="error"
                        @click='introLabel=!introLabel'
                      )
                        v-icon clear

            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Your Room's Background Settings
                v-card-text
                  v-layout(style="align-items: center;")
                    v-flex
                      | {{ profile.bg_music || 'No Background Music' }}
                    v-flex.text-xs-right
                      v-btn(
                        flat
                        icon
                        color="primary"
                        @click="openUploadDialog('Upload', 'bg_music')"
                      )
                        v-icon edit
                  v-layout(style="align-items: center;")
                    v-flex
                      | {{ profile.bg_image || 'No Background Image' }}
                    v-flex.text-xs-right
                      v-btn(
                        flat
                        icon
                        color="primary"
                        @click="openUploadDialog('Upload', 'bg_image')"
                      )
                        v-icon edit

    v-dialog(
      v-model='uploadDialogActive'
      max-width='500px'
      persistent
    )
      component(
        :is="uploadDialogComp"
        :active.sync="uploadDialogActive"
        :success.sync="isUploadSuccess"
        :label.sync="label"
      )

</template>

<script>
import auth from '@/auth/index'
import api from '@/auth/helpers'
import Upload from './components/upload'
import countries from './components/countries'

export default {
  name: 'Profile',

  components: {
  },

  filters: {
    formateDate: (timestamp) => {
      return api.formateDate(timestamp)
    }
  },

  data () {
    return {
      loading: false,
      showPage: false,
      oops: false,
      active: 'profile',
      uploadDialogActive: false,
      uploadDialogComp: null,
      isUploadSuccess: false,
      label: '',
      nickname: '',
      nicknameLabel: true,
      nicknameValid: false,
      gender: '',
      genderLabel: true,
      genders: ['Male', 'Female', 'Other'],
      email: '',
      emailLabel: true,
      emailValid: false,
      country: '',
      countryLabel: true,
      countryValid: false,
      countries: countries,
      intro: '',
      introLabel: true,
      introValid: false,
      profile: {
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
      rules: {
        checkNickname: value => {
          if (!value || value.trim() === '') {
            this.nicknameValid = false
            return 'Required.'
          } else if (value.length > 20) {
            this.nicknameValid = false
            return 'Max 20 characters'
          } else {
            this.nicknameValid = true
            return true
          }
        },
        checkEmail: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if (pattern.test(value)) {
            this.emailValid = true
            return true
          } else {
            this.emailValid = false
            return 'Invalid e-mail.'
          }
        },
        checkCountry: value => {
          if (!value) {
            this.countryValid = false
            return 'Required.'
          } else {
            this.countryValid = true
            return true
          }
        },
        checkIntro: value => {
          if (!value || value.trim() === '') {
            this.introValid = false
            return 'Required.'
          } else if (value.length > 100) {
            this.introValid = false
            return 'Max 100 characters'
          } else {
            this.introValid = true
            return true
          }
        }
      }
    }
  },

  computed: {
    avatarLink () {
      return this.profile.avatar || api.defaultAvatar(this.profile.gender)
    }
  },

  watch: {
    'isUploadSuccess': 'uploadSuccess'
  },

  created () {
    this.enterRoom()
  },

  methods: {
    enterRoom () {
      const form = {}
      const data = {
        instruction: JSON.stringify(form)
      }
      const header = ['enter-room', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(data), header))
          .then(res => {
            this.profile = res.data.result
            this.gender = this.profile.gender
            this.country = this.profile.country
            const user = this.$store.state.auth
            user.user.avatar = this.profile.avatar
            this.$store.dispatch('auth/update', user)
            this.showPage = true
          })
          .catch((error) => {
            this.showPage = false && error
          })
      }
    },

    nicknameEdit () {
      if (this.nicknameLabel) {
        this.nicknameLabel = false
      } else {
        if (this.nicknameValid) {
          this.changeProfile('nickname', this.nickname)
        }
      }
    },

    genderEdit () {
      if (this.genderLabel) {
        this.genderLabel = false
      } else {
        this.changeProfile('gender', this.gender)
      }
    },

    emailEdit () {
      if (this.emailLabel) {
        this.emailLabel = false
      } else {
        if (this.emailValid) {
          this.changeProfile('email', this.email)
        }
      }
    },

    countryEdit () {
      if (this.countryLabel) {
        this.countryLabel = false
      } else {
        if (this.countryValid) {
          this.changeProfile('country', this.country)
        }
      }
    },

    introEdit () {
      if (this.introLabel) {
        this.introLabel = false
      } else {
        if (this.introValid) {
          this.changeProfile('intro', this.intro)
        }
      }
    },

    changeProfile (flag, content) {
      this.isEditSuccess = false
      var str = '{"' + flag + '":"' + content + '"}'
      var data = {
        instruction: str
      }
      var header = ['edit-profile', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(data), header))
          .then(res => {
            api.showMessage('Change ' + flag + ' OK')
            this.isEditSuccess = true
            switch (flag) {
              case 'nickname':
                this.nicknameLabel = true
                this.profile.nickname = this.nickname
                this.nickname = ''
                break
              case 'gender':
                this.genderLabel = true
                this.profile.gender = this.gender
                const user = this.$store.state.auth
                user.user.gender = this.profile.gender
                this.$store.dispatch('auth/update', user)
                break
              case 'email':
                this.emailLabel = true
                this.profile.email = this.email
                this.email = ''
                break
              case 'country':
                this.countryLabel = true
                this.profile.country = this.country
                break
              case 'intro':
                this.introLabel = true
                this.profile.intro = this.intro
                this.intro = ''
                break
            }
          })
          .catch((error) => {
            this.isEditSuccess = false && error
          })
      }
    },

    uploadSuccess (newValue, oldValue) {
      if (newValue) {
        this.enterRoom()
      }
    },

    openUploadDialog (comp, str) {
      if (comp === 'Upload') this.uploadDialogComp = Upload

      this.label = str
      this.uploadDialogActive = true
    }
  }
}
</script>

<style lang="stylus">
  .my-profile
    &__oops
      width: 100px
      padding-bottom: 15px

    .tabs__bar
      background: #F4F4F4

    &__mobile-tabs
      .tabs__item--active
        color: $app-primary

    &__name
      color: green
</style>
