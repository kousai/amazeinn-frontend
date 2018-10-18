<template lang="pug">
v-container(fluid fill-height style="padding: 0;")
  v-layout.my-account(column)
    v-container(
      fluid
      fill-height
      v-bind:grid-list-sm="$vuetify.breakpoint.smAndDown"
      v-bind:grid-list-lg="$vuetify.breakpoint.mdAndUp"
      style="position: relative; margin-top: 40px;"
    )
      v-layout(row wrap)
        v-flex(d-flex xs12 sm12 md6 offset-md3)
          v-layout(column)
            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Credentials
                v-card-text
                  v-layout(row wrap style="align-items: center;")
                    v-flex(d-flex xs12 sm12 md6)
                      span Name:
                    v-flex(d-flex xs12 sm12 md6)
                      v-layout(style="align-items: center;")
                        v-flex.my-account__name.text-xs-left(md6) {{ $store.state.auth.user.name }}
                        v-flex.text-xs-right(md6)
                          v-card(flat)
                    v-flex(d-flex xs12 sm12 md6)
                      span Password:
                    v-flex(d-flex xs12 sm12 md6)
                      v-layout(style="align-items: center;")
                        v-flex.my-account__password.text-xs-left(md6) *********
                        v-flex.text-xs-right(md6)
                          v-btn(flat icon color="primary" @click="openDialogFull('PasswordEdit')")
                            v-icon edit
            v-flex(d-flex)
              v-card(flat)
                v-card-title
                  .title Account Options
                v-card-text
                  v-layout

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
import PasswordEdit from './components/password-edit'

export default {
  name: 'Account',

  components: {

  },

  data () {
    return {
      dialogFullActive: false,
      dialogFullComp: null
    }
  },

  methods: {

    openDialogFull (comp) {
      if (comp === 'PasswordEdit') this.dialogFullComp = PasswordEdit

      this.dialogFullActive = true
    }
  }
}
</script>

<style lang="stylus">
  .my-account

    &__avatar-link
      padding-left: 10px

    &__name
      color: green
      font-size: 20px
      font-weight: bold
      text-indent: 20px
      margin-bottom: 20px

    &__password
      text-indent: 20px

    &__oops
      width: 100px
      padding-bottom: 15px

</style>
