<template lang="pug">
v-container.my-porch(
  fluid
  fill-height
  text-xs-center
  v-bind:grid-list-sm="$vuetify.breakpoint.smAndDown"
  v-bind:grid-list-lg="$vuetify.breakpoint.mdAndUp"
)
  v-layout(v-show="showPage" row wrap)
    v-flex(d-flex xs8 offset-xs2)
      v-card(flat)
        v-card-text
          span(:style="floorStyle") Floor# {{ data.game_floor }}
    v-flex(d-flex xs2)
      v-card(flat)
    v-flex(d-flex v-for="i in 20" :key="i" xs3)
      v-card.my-porch__wall(
        v-if='!roomLabel[i-1]'
        height='75px'
        flat
      )
      v-card.my-porch__wall(
        v-else-if="roomLabel[i-1]=='my-room'"
        height='75px'
      )
        v-layout(column align-center justify-center)
          span(:style="styles[6]") My Room
          img(
            src='static/images/room.png'
            width='60px'
            @click="openDialogFull('EnterRoom', $store.state.auth.user.id)"
          )
      v-card.my-porch__wall(
        v-else-if="roomLabel[i-1]=='message'"
        height='75px'
        flat
      )
        v-btn(
          fab
          dark
          color="info"
          @click="openMessageDialog('SendMessage')"
        )
          v-icon(dark) email
      v-card.my-porch__wall(
        v-else-if="roomLabel[i-1]=='lift'"
        height='75px'
        flat
      )
        v-btn(
          fab
          dark
          color='error'
          :loading="liftLoading"
          @click='useLift()'
        ) Lift
      v-card.my-porch__wall(
        v-else-if="roomLabel[i-1]=='floor1'"
        height='75px'
        flat
      )
        v-btn(
          fab
          dark
          color='success'
          :loading="firstLoading"
          @click='toFloor1()'
        ) Fl-1
      v-card.my-porch__wall(
        v-else-if="roomLabel[i-1].slice(0,5)=='room-'"
        height='75px'
      )
        v-layout(column align-center justify-center)
          span(:style="styles[parseInt(roomLabel[i-1].charAt(5))]") {{data.members[parseInt(roomLabel[i-1].charAt(5))].isempty ? "Empty" : data.members[parseInt(roomLabel[i-1].charAt(5))].name}}
          img(
            :src='doors[parseInt(roomLabel[i-1].charAt(5))]'
            width='60px'
            @click="openDialogFull('EnterRoom', data.members[parseInt(roomLabel[i-1].charAt(5))].id)"
          )

    v-dialog(
      v-model='messageDialogActive'
      max-width='500px'
      persistent
    )
      component(:is="messageDialogComp" :active.sync="messageDialogActive")

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
import SendMessage from './components/send-message'
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
      roomLabel: [null, null, null, null,
        null, null, null, null,
        null, 'my-room', 'lift', null,
        null, 'message', 'floor1', null,
        null, null, null, null],
      showPage: false,
      floorColor: '',
      messageDialogActive: false,
      messageDialogComp: null,
      dialogFullActive: false,
      dialogFullComp: null,
      liftLoading: false,
      firstLoading: false
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
        fontSize: '20px',
        display: 'inline-block',
        width: '100%',
        textAlign: 'center',
        background: api.randomColor(),
        border: '1px solid white',
        borderRadius: '4px',
        padding: '4px 12px',
        overflow: 'hidden'
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
            this.randRoom()
            this.showPage = true
          })
          .catch((error) => {
            this.showPage = false && error
          })
      }
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
            this.randRoom()
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
            this.randRoom()
          })
          .catch((error) => {
            this.firstLoading = false && error
          })
      }
    },

    randRoom () {
      let rooms = [0, 1, 2, 3, 4, 5, 6, 7,
        8, 11, 12, 15, 16, 17, 18, 19]
      for (var a = 0; a < 16; a++) {
        this.roomLabel[rooms[a]] = null
      }
      for (var i = 0; i < 6; i++) {
        var rand = api.randomNum(0, 16 - i)
        this.roomLabel[rooms[rand]] = 'room-' + i
        rooms.splice(rand, 1)
      }
    },

    randStyle (flag) {
      let style = {
        color: flag ? 'black' : api.randomColor(),
        fontWeight: 'bold',
        fontSize: '15px',
        textAlign: 'center',
        background: flag ? 'white' : api.randomColor()
      }
      return style
    },

    changeFloorStyle (newVal, oldVal) {
      this.floorColor = api.randomColor()
    },

    openDialogFull (comp, id) {
      if (id) {
        if (comp === 'EnterRoom') this.dialogFullComp = EnterRoom
        this.updateOwner(id)
        this.dialogFullActive = true
      }
    },

    openMessageDialog (comp) {
      if (comp === 'SendMessage') this.messageDialogComp = SendMessage

      this.messageDialogActive = true
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

  &__wall
    background-image: $app-wall-image
    background-size: 100% 100%

</style>
