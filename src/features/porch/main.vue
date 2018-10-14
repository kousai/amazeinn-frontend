<template lang="pug">
v-container.my-porch(
  fluid
  fill-height
  text-xs-center
  v-bind:grid-list-sm="$vuetify.breakpoint.smAndDown"
  v-bind:grid-list-lg="$vuetify.breakpoint.mdAndUp"
)
  v-layout(v-show="showPage" row wrap)
    v-flex(d-flex xs3 offset-xs2)
      v-card
        v-card-text
          span(:style="randStyle(data.members[0].isempty)") {{data.members[0].isempty ? "Empty Room" : data.members[0].name + "'s Room"}}
        img(
          :src='doorPic(data.members[0].isempty)'
          @click="openDialogFull('EnterRoom', data.members[0].id)"
        )
    v-flex(d-flex xs2)
      v-card(flat)
        v-card-text
          span(:style="floorStyle()") Floor# {{ data.game_floor }}
    v-flex(d-flex xs3)
      v-card
        v-card-text
          span(:style="randStyle(data.members[1].isempty)") {{data.members[1].isempty ? "Empty Room" : data.members[1].name + "'s Room"}}
        img(
          :src='doorPic(data.members[1].isempty)'
          @click="openDialogFull('EnterRoom', data.members[1].id)"
        )
    v-flex(d-flex xs3)
      v-card
        v-card-text
          span(:style="randStyle(data.members[2].isempty)") {{data.members[2].isempty ? "Empty Room" : data.members[2].name + "'s Room"}}
        img(
          :src='doorPic(data.members[2].isempty)'
          @click="openDialogFull('EnterRoom', data.members[2].id)"
        )
    v-flex(d-flex xs2)
      v-card(flat)
        v-btn(
          color='success'
          :loading="firstLoading"
          @click='toFloor1()'
        ) To Floor#1
    v-flex(d-flex xs2)
      v-card
        v-card-text
          span(:style="randStyle(false)") My Room
        img(
          src='static/images/room.png'
          @click="openDialogFull('EnterRoom', $store.state.auth.user.id)"
        )
    v-flex(d-flex xs2)
      v-card(flat)
        v-btn(
          color='info'
          :loading="liftLoading"
          @click='useLift()'
        ) Use Lift
    v-flex(d-flex xs3)
      v-card
        v-card-text
          span(:style="randStyle(data.members[3].isempty)") {{data.members[3].isempty ? "Empty Room" : data.members[3].name + "'s Room"}}
        img(
          :src='doorPic(data.members[3].isempty)'
          @click="openDialogFull('EnterRoom', data.members[3].id)"
        )
    v-flex(d-flex xs3 offset-xs2)
      v-card
        v-card-text
          span(:style="randStyle(data.members[4].isempty)") {{data.members[4].isempty ? "Empty Room" : data.members[4].name + "'s Room"}}
        img(
          :src='doorPic(data.members[4].isempty)'
          @click="openDialogFull('EnterRoom', data.members[4].id)"
        )
    v-flex(d-flex xs2)
      v-card(flat)
        v-btn(
          outline
          color="info"
          @click="messageDialogActive=true"
        ) Write a Message
    v-flex(d-flex xs3)
      v-card
        v-card-text
          span(:style="randStyle(data.members[5].isempty)") {{data.members[5].isempty ? "Empty Room" : data.members[5].name + "'s Room"}}
        img(
          :src='doorPic(data.members[5].isempty)'
          @click="openDialogFull('EnterRoom', data.members[5].id)"
        )

    v-dialog(
      v-model='messageDialogActive'
      max-width='500px'
      persistent
    )
      v-card
        v-card-title
          span(class="headline") Write a Message
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
          v-btn(color='primary' flat='' @click.native='exit()') Close
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
      showPage: false,
      newMessage: '',
      messageValid: false,
      messageDialogActive: false,
      messageError: false,
      dialogFullActive: false,
      dialogFullComp: null,
      liftLoading: false,
      firstLoading: false,
      rules: {
        checkMessage: value => {
          if (!value || value.trim() === '') {
            this.messageValid = false
            // return 'Required.'
            return true
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
            this.showPage = true
          })
          .catch((error) => {
            this.showPage = false && error
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
              this.messageDialogActive = true || error
            })
        }
      } else {
        api.showMessage('Message Content required.')
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
            this.liftLoading = false && error
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
            this.firstLoading = false && error
          })
      }
    },

    doorPic (state) {
      return api.doorPic(state)
    },

    randStyle (flag) {
      let style = {
        color: flag ? 'black' : api.randomColor(),
        fontWeight: 'bold',
        fontSize: '15px'
      }
      return style
    },

    floorStyle () {
      let style = {
        color: api.randomColor(),
        fontWeight: 'bold',
        fontSize: '20px'
      }
      return style
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

  &__empty
    color: black

  &__occupied
    color: red

</style>
