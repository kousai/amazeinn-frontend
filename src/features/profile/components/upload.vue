<template lang="pug">
  v-card
    v-card-title
      span Update {{uploadLabel[0]}}
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
        input(
          ref='uploadLocal'
          v-if='uploadInput'
          type="file"
          accept="image/gif, image/jpeg, image/png"
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
      var res = []
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
    },

    exit () {
      this.isActive = false
      this.initDialog()
    },

    urlCheck () {
      var patt = /^(http[s]?:\/\/|ftp:\/\/|).*?\/.*?\.(jpg|png|gif)$/i
      if (patt.test(this.urlLink)) {
        return true
      } else {
        return 'Invalid image url'
      }
    },

    changeUpload () {
      this.urlText = true
      this.urlChange = true
      this.urlClick = false
      this.uploadInput = false
      this.uploadFlag = true
    },

    chooseUpload () {
      this.urlText = false
      this.urlChange = false
      this.urlClick = true
      this.uploadInput = true
      this.uploadFlag = false
    },

    changeUrl () {
      this.isSuccess = false
      var url = this.$refs.urlNet.value
      var str = '{"' + this.label + '":"' + url + '"}'
      var data = {
        instruction: str
      }
      var header = ['edit-profile', null]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.infoConfig(JSON.stringify(data), header))
          .then(res => {
            api.showMessage('Change ' + this.uploadLabel[0] + ' OK')
            this.isSuccess = true
          })
          .catch((error) => {
            api.showMessage(error)
          })
      }
    },

    uploadFile () {
      this.isSuccess = false
      let inputDOM = this.$refs.uploadLocal
      let files = inputDOM.files
      if (files.length === 0) {
        api.showMessage('Please choose a image file.')
        return
      }
      let file = files[0]
      var data = new FormData()
      data.append('file', file)
      const header = ['upload-file', this.label]
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        this.uploadLoading = true
        api.fullRequest(api.infoConfig(data, header))
          .then(res => {
            this.uploadLoading = false
            api.showMessage('Upload ' + this.uploadLabel[0] + ' OK')
            this.isSuccess = true
          })
          .catch((error) => {
            this.uploadLoading = false
            api.showMessage(error)
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-room
  height: 100%
</style>
