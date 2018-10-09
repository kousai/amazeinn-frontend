<template lang="pug">
v-container.my-porch(
  fluid
  fill-height
  text-xs-center
  v-bind:grid-list-sm="$vuetify.breakpoint.smAndDown"
  v-bind:grid-list-lg="$vuetify.breakpoint.mdAndUp"
)
  v-layout(row wrap)
    v-flex(
      d-flex
      xs12
      sm12
      md6)
      v-card
        img(
          src='static/images/room.png'
          @click="openDialogFull('EnterRoom', $store.state.auth.user.id)"
        )
        span My Room
        v-btn(
          outline
          color="info"
          @click="messageDialogActive=true"
        ) Write a Message
    v-btn(
      color='info'
      :loading="liftLoading"
      @click='useLift()'
    ) Use Lift
    v-btn(
      color='success'
      :loading="firstLoading"
      @click='toFloor1()'
    ) To Floor#1
    span Floor# {{ data.game_floor }}
    v-spacer
    v-flex(
      v-for="n in data.members.length"
      :key="n"
      d-flex
      xs12
      sm12
      md6)
      v-card
        img(
          :src='data.members[n-1].isempty ? "static/images/empty.png" : "static/images/door.png"'
          @click="openDialogFull('EnterRoom', data.members[n-1].id)"
        )
        span {{data.members[n-1].isempty ? "Empty Room" : data.members[n-1].name + "'s Room"}}

    v-dialog(
      v-model='messageDialogActive'
      max-width='500px'
      persistent
    )
      v-card
        v-card-title
          span Write a Message
        v-card-text
          v-form
            v-textarea(
              label='Message'
              v-model='newMessage'
              :rules='[rules.checkMessage]'
              clearable
              autofocus
              solo
              outline
              counter
            )
            v-btn(
              @click="sendMessage()"
              block
              dark
              color='success'
            ) Send
              v-icon(dark right) edit
        v-card-actions
          v-spacer
          v-btn(color='primary' flat='' @click.stop='exit()') Close
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
  name: 'Porch',

  components: {
  },

  data () {
    return {
      data: {
        game_floor: null,
        members: [{id: null, name: null, gender: null, avatar: null, isempty: true},
          {id: null, name: null, gender: null, avatar: null, isempty: true},
          {id: null, name: null, gender: null, avatar: null, isempty: true},
          {id: null, name: null, gender: null, avatar: null, isempty: true},
          {id: null, name: null, gender: null, avatar: null, isempty: true},
          {id: null, name: null, gender: null, avatar: null, isempty: true}]
      },
      newMessage: '',
      messageValid: false,
      messageDialogActive: false,
      dialogFullActive: false,
      dialogFullComp: null,
      liftLoading: false,
      firstLoading: false,
      rules: {
        checkMessage: value => {
          if (!value || value === '') {
            this.messageValid = false
            return 'Required.'
          } else if (value.length > 200) {
            this.messageValid = false
            return 'Max 200 characters'
          } else {
            this.messageValid = true
            return true
          }
        }
      }
    }
  },

  mounted () {
    this.enterIndex()
  },

  methods: {

    enterIndex () {
      var form = {}
      const header = ['enter-index', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.data = res.data.result
          })
          .catch((error) => {
            api.showMessage(error)
          })
      }
    },

    sendMessage () {
      var form = {
        message: this.newMessage
      }
      var data = {
        instruction: JSON.stringify(form)
      }
      const header = ['send-message', null]
      if (this.messageValid) {
        if (!auth.isValidLogin()) {
          auth.expiredLogin()
        } else {
          api.fullRequest(api.infoConfig(JSON.stringify(data), header))
            .then(res => {
              api.showMessage('Send Message Successful.')
              this.newMessage = ''
            })
            .catch((error) => {
              api.showMessage(error)
            })
        }
      }
    },

    exit () {
      this.messageDialogActive = false
      this.newMessage = ''
    },

    useLift () {
      var form = {}
      const header = ['use-lift', null]
      this.liftLoading = true
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.enterIndex()
            this.liftLoading = false
          })
          .catch((error) => {
            this.liftLoading = false
            api.showMessage(error)
          })
      }
    },

    toFloor1 () {
      var form = {}
      const header = ['to-floor1', null]
      this.firstLoading = true
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(form), header))
          .then(res => {
            this.enterIndex()
            this.firstLoading = false
          })
          .catch((error) => {
            this.firstLoading = false
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
    }
  }
}
</script>

<style lang="stylus">
.my-porch

  &__media
    height: 100%
    margin: 0

  .picker__title
    display: none !important

</style>
