<template lang="pug">
  v-card
    v-card-title
      span(class="headline") Update {{uploadLabel[0]}}
    v-card-text
      v-form
        | You can input a link of {{uploadLabel[1]}}
        v-text-field(
          ref='urlNet'
          v-if='urlText'
          :label='uploadLabel[0]'
          v-model='urlLink'
          :rules='[urlCheck]'
        )
        v-btn(
          v-if='urlClick'
          @click="changeUpload()"
          block
          dark
          color='blue-grey'
        ) Input
          v-icon(dark right) edit
        v-btn(
          v-if='urlChange'
          @click="changeUrl()"
          block
          dark
          color='blue-grey'
        ) Confirm
          v-icon(dark right) edit
        br
        | You can also upload a local {{uploadLabel[2]}}
        br
        br
        span.my-room__input_dom(
          v-if='uploadInput'
        )
          span {{selectHint}}
          input.my-room__input_file(
            ref='uploadLocal'
            type="file"
            :accept="acceptType"
            @change="selectFile()"
          )
        v-btn(
          :loading="uploadLoading"
          @click="uploadFlag ? chooseUpload() : uploadFile()"
          block
          dark
          color='blue-grey'
        ) Upload
          v-icon(dark right) cloud_upload
    v-card-actions
      v-spacer
      v-btn(color='primary' flat='' @click.stop='exit()') Close

</template>

<script>
import api from '@/auth/helpers'
import auth from '@/auth/index'

export default {
  name: 'Upload',

  props: {
    active: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'avatar'
    }
  },

  data () {
    return {
      urlLink: null,
      urlText: false,
      urlClick: true,
      urlChange: false,
      selectHint: 'SELECT FILE',
      uploadLoading: false,
      uploadInput: false,
      uploadFlag: true,
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

    isSuccess: {
      get () {
        return this.success
      },
      set (val) {
        this.$emit('update:success', val)
      }
    },

    uploadLabel () {
      let res
      switch (this.label) {
        case 'avatar':
          res = ['Avatar', 'avatar', 'image file']
          break
        case 'bg_image':
          res = ['Background image', 'background image', 'image file']
          break
        case 'bg_music':
          res = ['Background music', 'background music', 'music file']
          break
      }
      return res
    },

    acceptType () {
      let res
      switch (this.label) {
        case 'avatar':
          res = 'image/gif, image/jpeg, image/png'
          break
        case 'bg_image':
          res = 'image/gif, image/jpeg, image/png'
          break
        case 'bg_music':
          res = 'audio/mpeg, audio/ogg'
          break
      }
      return res
    },

    limitSize () {
      let res
      switch (this.label) {
        case 'avatar':
          res = '100KB'
          break
        case 'bg_image':
          res = '300KB'
          break
        case 'bg_music':
          res = '5MB'
          break
      }
      return res
    }
  },

  watch: {

  },

  methods: {

    initDialog () {
      this.urlLink = null
      this.urlText = false
      this.urlClick = true
      this.urlChange = false
      this.uploadInput = false
      this.uploadFlag = true
      this.uploadLoading = false
      this.isSuccess = false
      this.selectHint = 'SELECT FILE'
    },

    exit () {
      this.isActive = false
      this.initDialog()
    },

    imageCheck () {
      const patt = /^(http[s]?:\/\/|ftp:\/\/|).*?\/.*?\.(jpg|png|gif)$/i
      if (patt.test(this.urlLink)) {
        return true
      } else {
        return 'Invalid image url'
      }
    },

    musicCheck () {
      const patt = /^(http[s]?:\/\/|ftp:\/\/|).*?\/.*?\.(mp3|ogg)$/i
      if (patt.test(this.urlLink)) {
        return true
      } else {
        return 'Invalid Music url'
      }
    },

    urlCheck () {
      switch (this.label) {
        case 'avatar':
          return this.imageCheck()
        case 'bg_image':
          return this.imageCheck()
        case 'bg_music':
          return this.musicCheck()
      }
    },

    changeUpload () {
      this.urlText = true
      this.urlChange = true
      this.urlClick = false
      this.uploadInput = false
      this.uploadFlag = true
      this.selectHint = 'SELECT FILE'
    },

    chooseUpload () {
      this.urlText = false
      this.urlChange = false
      this.urlClick = true
      this.uploadInput = true
      this.uploadFlag = false
      this.selectHint = 'SELECT FILE'
    },

    changeUrl () {
      this.isSuccess = false
      const url = this.$refs.urlNet.value
      const str = `{"${this.label}":"${url}"}`
      const data = {
        instruction: str
      }
      const header = ['edit-profile', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(data), header))
          .then(res => {
            api.showMessage(`Change ${this.uploadLabel[0]} OK`)
            this.isSuccess = true
          })
          .catch((error) => {
            this.isActive = true || error
          })
      }
    },

    selectFile () {
      this.isSuccess = false
      const inputDOM = this.$refs.uploadLocal
      const files = inputDOM.files
      if (files.length === 0) {
        this.selectHint = 'SELECT FILE'
      } else {
        this.selectHint = 'You have Chosen one'
      }
    },

    uploadFile () {
      this.isSuccess = false
      const inputDOM = this.$refs.uploadLocal
      const files = inputDOM.files
      if (files.length === 0) {
        api.showMessage(`Please choose a ${this.uploadLabel[0]}.`)
        return
      }
      const file = files[0]
      if (!api.limitFileSize(file, this.limitSize)) {
        api.showMessage(`Your ${this.uploadLabel[0]}'s size can't be over ${this.limitSize}.`)
        return
      }
      let data = new FormData()
      data.append('file', file)
      const header = ['upload-file', this.label]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        this.uploadLoading = true
        api.fullRequest(api.infoConfig(data, header))
          .then(res => {
            this.uploadLoading = false
            api.showMessage(`Upload ${this.uploadLabel[0]} OK`)
            this.isSuccess = true
          })
          .catch((error) => {
            this.uploadLoading = false && error
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-room
  height: 100%

  &__input_dom
    position: relative
    display: inline-block
    width: 100%
    text-align: center
    background: #00B55F
    border: 1px solid #3CB371
    border-radius: 4px
    padding: 4px 12px
    overflow: hidden
    color: white
    font-weight: bold
    text-decoration: none
    text-indent: 0
    line-height: 30px
    &:hover
      background: gold
      border-color: #D5CF1B
      color: black
      text-decoration: none

  &__input_file
    position: absolute
    font-size: 100px
    right: 0
    top: 0
    opacity: 0

</style>
