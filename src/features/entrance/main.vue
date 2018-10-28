<template lang="pug">
  v-container.my-entrance(fluid fill-height)
    v-toolbar(
      color="primary"
      flat
      dark
      fixed
      app
      dense
    )
      v-btn(icon)
        img.my-entrance__logo(src='~/@/assets/images/logo.png' alt='VueAMazeInn Logo')
      v-spacer
      v-btn(flat @click="openResume()")
        span About Me

    v-layout(justify-center align-center)
      v-flex.text-xs-center(xs12 lg6)
        v-layout(row wrap)
          v-flex(xs12)
            .my-entrance__logo-name
              img(src='~/@/assets/images/logo-name.svg' alt='AMazeInn')
          v-flex(xs12)
            .my-entrance__subheading.subheading
              div.my-entrance__welcome Welcome to AMazeInn!
          v-flex(xs12)
            v-card.my-entrance__card
              v-card-title.my-entrance__card-title(primary-title)
                v-avatar(:size="100")
                  img(:src='avatarLink' alt='Avatar')

              v-card-text
                v-form
                  v-text-field(
                    label='Name'
                    v-model='credentials.username'
                    :rules='[nameCheck]'
                    counter
                  )
                  v-text-field(
                    label='Password'
                    v-model='credentials.password'
                    :rules='[passwordCheck]'
                    counter
                    :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
                    @click:append='() => (passwordHidden = !passwordHidden)'
                    :type="passwordHidden ? 'password' : 'text'"
                  )

              v-card-actions.my-entrance__card-actions
                v-btn(
                  :loading="isEnterAction ?  enterLoading : checkinLoading"
                  @click="isEnterAction ? guestEnter() : guestCheckin()"
                  block
                  color='accent'
                  dark
                ) {{isEnterAction ? "Enter" : "Check-in"}}
              span Or
              v-spacer
              a(
                @click="isEnterAction=!isEnterAction"
              ) {{isEnterAction ? "Check-in" : "Enter"}}
</template>

<script>
import api from '@/auth/helpers'
import auth from '@/auth/index'

export default {
  name: 'Entrance',

  data () {
    return {
      credentials: {
        username: '',
        password: ''
      },
      nameInvalid: false,
      passwordInvalid: false,
      passwordHidden: true,
      isEnterAction: true,
      checkinLoading: false,
      enterLoading: false
    }
  },

  computed: {
    avatarLink () {
      return this.$store.state.auth.user.avatar || api.defaultAvatar(this.$store.state.auth.user.gender)
    }
  },

  methods: {

    nameCheck (val, oldVal) {
      const label = api.checkName(val)
      if (label) {
        this.nameInvalid = true
        return label
      } else {
        this.nameInvalid = false
        return true
      }
    },

    passwordCheck (val, oldVal) {
      const label = api.checkPassword(val)
      if (label) {
        this.passwordInvalid = true
        return label
      } else {
        this.passwordInvalid = false
        return true
      }
    },

    oldPath () {
      const url = new URL(document.location.href)
      const params = new URLSearchParams(url.search)
      let redirect = params.get('redirect')
      if (redirect) {
        redirect = redirect.slice(1)
      }
      return redirect
    },

    openResume () {
      window.open('https://kousai.github.io/resume')
    },

    guestCheckin () {
      const credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }
      if (!this.nameInvalid && !this.passwordInvalid) {
        this.checkinLoading = true
        api.publicRequest(api.checkinConfig(JSON.stringify(credentials)))
          .then(res => {
            this.checkinLoading = false
            this.isEnterAction = true
            api.showMessage(`Checkin OK, ${this.credentials.username}. Please enter your Room.`)
          })
          .catch((error) => {
            this.checkinLoading = false && error
          })
      } else {
        api.showMessage('Please check your input.')
      }
    },

    guestEnter () {
      const credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }
      if (!this.nameInvalid && !this.passwordInvalid) {
        this.enterLoading = true
        const redirect = this.oldPath()
        api.publicRequest(api.enterConfig(JSON.stringify(credentials)))
          .then(res => {
            auth.storeToken(res)
            if (redirect) {
              auth.redirectPath(redirect)
            } else {
              auth.redirectPath('home')
            }
            this.$store.dispatch('common/updateSidebar', { visible: true })
            api.showMessage(`Welcome, ${this.$store.state.auth.user.name}`)
          })
          .catch((error) => {
            this.enterLoading = false && error
          })
      } else {
        api.showMessage('Please check your input.')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @keyframes typing {
    from {
      width: 0
    }
  }

   @keyframes caret {
    50% {
      border-right-color: transparent
    }
  }

  .my-entrance
    background-image: $app-enter-image
    background-size: 100% 100%

    &__logo
      max-width: 46px
      padding-left: 12px
      padding-top: 4px

    &__logo-name

      img
        max-width: 200px
        width: 100%
        margin-top: 30px

    &__welcome
      color: green
      font: bold 15px Consolas, Monaco, monospace
      margin: auto
      width: 20ch
      white-space: nowrap
      overflow: hidden
      border-right: .05em solid
      animation: typing 8s steps(20),
                 caret 1s steps(1) infinite

    &__subheading
      color: white
      padding-top: 10px
      padding-bottom: 20px

    &__card
      // border: 10px solid hsla(0,0%,100%,.5)
      background: rgba(255,255,255,0.8)
      // background-clip: padding-box
      max-width: 370px
      margin: 0 auto

    &__card-title
      justify-content: center

    &__card-actions
      justify-content: center

</style>
