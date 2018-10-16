<template lang="pug">
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
</template>

<script>
import api from '@/auth/helpers'
import auth from '@/auth/index'

export default {
  name: 'SendMessage',

  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      newMessage: '',
      messageValid: false,
      messageError: false,
      loading: false,
      oops: false,
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
    isActive: {
      get () {
        return this.active
      },
      set (val) {
        this.$emit('update:active', val)
      }
    }
  },

  methods: {
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
      this.isActive = false
      this.newMessage = ''
    }
  }
}

</script>

<style lang="stylus" scoped>
.my-send-message
  height: 100%

</style>
