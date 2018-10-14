<template lang="pug">
  v-card.my-password-edit(tile)
    v-toolbar(card dark color="primary")
      v-btn(icon @click.native="isActive = false" dark)
        v-icon close
      v-toolbar-title Edit Password

    v-card-text(style="position: relative; max-width: 500px; margin: auto;")
      v-form
        v-text-field(
          label='Old Password'
          v-model='oldPassword'
          :rules='[oldPasswordCheck]'
          counter
          :append-icon="oldPasswordHidden ? 'visibility' : 'visibility_off'"
          @click:append='() => (oldPasswordHidden = !oldPasswordHidden)'
          :type="oldPasswordHidden ? 'password' : 'text'"
        )
        v-text-field(
          label='New Password'
          v-model='newPassword'
          :rules='[newPasswordCheck]'
          counter
          :append-icon="newPasswordHidden ? 'visibility' : 'visibility_off'"
          @click:append='() => (newPasswordHidden = !newPasswordHidden)'
          :type="newPasswordHidden ? 'password' : 'text'"
        )
        v-text-field(
          label='Repeat'
          v-model='newRepeat'
          :rules='[newRepeatCheck]'
          counter
          :append-icon="newRepeatHidden ? 'visibility' : 'visibility_off'"
          @click:append='() => (newRepeatHidden = !newRepeatHidden)'
          :type="newRepeatHidden ? 'password' : 'text'"
        )
      br
      br
      v-card-actions.my-password-edit__card-actions
        v-btn(
          :loading="btnLoading"
          @click="editPassword()"
          block
          color='accent'
          dark
        ) Change Password

</template>

<script>
import api from '@/auth/helpers'
import auth from '@/auth/index'

export default {
  name: 'PasswordEdit',

  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false,
      oops: false,
      oldPassword: '111111111',
      newPassword: '111111111',
      newRepeat: '111111111',
      oldPasswordHidden: true,
      newPasswordHidden: true,
      newRepeatHidden: true,
      oldPasswordInvalid: false,
      newPasswordInvalid: false,
      newRepeatInvalid: false,
      btnLoading: false
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

    oldPasswordCheck (val, oldVal) {
      var label = api.checkPassword(val)
      if (label) {
        this.oldPasswordInvalid = true
        return label
      } else {
        this.oldPasswordInvalid = false
        return true
      }
    },

    newPasswordCheck (val, oldVal) {
      var label = api.checkPassword(val)
      if (label) {
        this.newPasswordInvalid = true
        return label
      } else {
        this.newPasswordInvalid = false
        return true
      }
    },

    newRepeatCheck (val, oldVal) {
      var label = api.checkPassword(val) || api.checkMatch(this.newPassword, val)
      if (label) {
        this.newRepeatInvalid = true
        return label
      } else {
        this.newRepeatInvalid = false
        return true
      }
    },

    editPassword () {
      this.loading = true
      this.oops = false
      var form = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        newRepeat: this.newRepeat
      }
      var data = {
        instruction: JSON.stringify(form)
      }
      const header = ['edit-password', null]
      if (!this.oldPasswordInvalid && !this.newPasswordInvalid && !this.newRepeatInvalid && (this.newPassword === this.newRepeat)) {
        this.btnLoading = true
        if (!auth.isValidLogin()) {
          auth.expiredLogin()
        } else {
          api.fullRequest(api.infoConfig(JSON.stringify(data), header))
            .then(res => {
              this.btnLoading = false
              this.isActive = false
              api.showMessage('Change Password OK')
            })
            .catch((error) => {
              this.btnLoading = false && error
            })
        }
      } else {
        api.showMessage('Please check your input.')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-password-edit
  height: 100%

  &__card-actions
    justify-content: center
</style>
