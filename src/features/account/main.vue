<template lang="pug">
v-container(fluid fill-height style="padding: 0;")
  v-layout.my-account(column)

    v-tabs.my-account__tabs(
      :color="$vuetify.breakpoint.smAndDown ? 'primary' : ''"
      :dark="$vuetify.breakpoint.smAndDown"
      v-model="currentTab"
      align-with-title
      :class="{ 'my-account__mobile-tabs': $vuetify.breakpoint.mdAndUp }"
      style="position: fixed; width: 100%; z-index: 1; background: #F4F4F4;"
    )

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
                      | Name
                    v-flex(dflex xs12 sm12 md6)
                      v-layout(style="align-items: center;")
                        v-flex.text-xs-left(md6) {{ $store.state.auth.user.name }}
                        v-flex.text-xs-right(md6)
                    v-flex(d-flex xs12 sm12 md6)
                      | Password
                    v-flex(dflex xs12 sm12 md6)
                      v-layout(style="align-items: center;")
                        v-flex.text-xs-left(md6) *********
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
      currentTab: '/acount',
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

    &__oops
      width: 100px
      padding-bottom: 15px

    .tabs__bar
      background: #F4F4F4

    &__mobile-tabs
      .tabs__item--active
        color: $app-primary
</style>
