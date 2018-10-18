<template lang="pug">
.my-dialog
  v-dialog(v-model='dialogActive' max-width='500px')
    v-card
      v-card-title
        span {{ $store.state.common.dialog.text }}
      v-card-text
        v-form
          v-text-field(
            label='Enter your Password'
            v-model='password'
            :rules='[passwordCheck]'
            counter
            :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
            @click:append='() => (passwordHidden = !passwordHidden)'
            :type="passwordHidden ? 'password' : 'text'"
          )
      v-card-actions
        v-spacer
        v-btn(color='primary' flat='' @click.stop='exit()') Quit
        v-btn(color='primary' flat='' @click='guestCheckout()') Checkout
</template>

<script>
import api from '@/auth/helpers'
import auth from '@/auth/index'

export default {
  name: 'DefaultDialog',

  data () {
    return {
      dialog: false,
      password: '',
      passwordInvalid: false,
      passwordHidden: true
    }
  },

  computed: {
    dialogActive: {
      get () {
        return this.$store.state.common.dialog.visible
      },
      set (val) {
        this.$store.dispatch('common/updateDialog', { visible: val })
      }
    }
  },

  methods: {
    exit () {
      this.dialogActive = false
      this.$store.dispatch('common/updateDialog', { text: '' })
    },

    passwordCheck (val, oldVal) {
      var label = api.checkPassword(val)
      if (label) {
        this.passwordInvalid = true
        return label
      } else {
        this.passwordInvalid = false
        return true
      }
    },

    guestCheckout () {
      const form = {
        password: this.password
      }
      if (!auth.isValidLogin()) {
        auth.expiredLogin()
      } else {
        api.fullRequest(api.checkoutConfig(JSON.stringify(form)))
          .then(res => {
            auth.expiredLogin()
            this.exit()
            api.showMessage('Checkout OK. Bye.')
          })
      }
    }
  }
}
</script>

<style lang="stylus">
.my-dialog
  z-index: 99

</style>
