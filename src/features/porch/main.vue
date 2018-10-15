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
          span(:style="styles[0]") {{data.members[0].isempty ? "Empty Room" : data.members[0].name + "'s Room"}}
        img(
          :src='doors[0]'
          @click="openDialogFull('EnterRoom', data.members[0].id)"
        )
    v-flex(d-flex xs2)
      v-card(flat)
        v-card-text
          span(:style="floorStyle") Floor# {{ data.game_floor }}
    v-flex(d-flex xs3)
      v-card
        v-card-text
          span(:style="styles[1]") {{data.members[1].isempty ? "Empty Room" : data.members[1].name + "'s Room"}}
        img(
          :src='doors[1]'
          @click="openDialogFull('EnterRoom', data.members[1].id)"
        )
    v-flex(d-flex xs3)
      v-card
        v-card-text
          span(:style="styles[2]") {{data.members[2].isempty ? "Empty Room" : data.members[2].name + "'s Room"}}
        img(
          :src='doors[2]'
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
          span(:style="styles[6]") My Room
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
          span(:style="styles[3]") {{data.members[3].isempty ? "Empty Room" : data.members[3].name + "'s Room"}}
        img(
          :src='doors[3]'
          @click="openDialogFull('EnterRoom', data.members[3].id)"
        )
    v-flex(d-flex xs3 offset-xs2)
      v-card
        v-card-text
          span(:style="styles[4]") {{data.members[4].isempty ? "Empty Room" : data.members[4].name + "'s Room"}}
        img(
          :src='doors[4]'
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
          span(:style="styles[5]") {{data.members[5].isempty ? "Empty Room" : data.members[5].name + "'s Room"}}
        img(
          :src='doors[5]'
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
      floorColor: '',
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

  computed: {
    styles () {
      let styles = []
      for (var i = 0; i < 6; i++) {
        styles[i] = this.randStyle(this.data.members[i].isempty)
      }
      styles[6] = this.randStyle(false)
      return styles
    },

    currentFloor () {
      return this.data.game_floor
    },

    floorStyle () {
      let style = {
        color: this.floorColor,
        fontWeight: 'bold',
        fontSize: '20px'
      }
      return style
    },

    doors () {
      let doors = []
      for (var i = 0; i < 6; i++) {
        doors[i] = api.doorPic(this.data.members[i].isempty)
      }
      return doors
    }
  },

  watch: {
    'currentFloor': 'changeFloorStyle'
  },

  created () {
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
            this.floorColor = api.randomColor()
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
            this.data = res.data.result
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
            this.data = res.data.result
            this.firstLoading = false
          })
          .catch((error) => {
            this.firstLoading = false && error
          })
      }
    },

    randStyle (flag) {
      let style = {
        color: flag ? 'black' : api.randomColor(),
        fontWeight: 'bold',
        fontSize: '15px'
      }
      return style
    },

    changeFloorStyle (newVal, oldVal) {
      this.floorColor = api.randomColor()
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

  &__card
    position: relative

  &__btn
    position: absolute
    top: 50%

</style>
