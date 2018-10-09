import Vue from 'vue'
import store from './store'
import { sync } from 'vuex-router-sync'
import { http, router } from './http'
import auth from './auth'
import Vuetify from 'vuetify'
import URLSearchParams from 'url-search-params'
import App from './app'
import Loading from './components/loading'
import Appbar from './components/app-bar'
import Appfooter from './components/app-footer'

Vue.config.productionTip = false

// Polyfills
global.URLSearchParams = URLSearchParams

// Sync router to store, as `store.state.route`.
sync(store, router)

// Http and Auth plugins
Vue.use(http)
Vue.use(auth)

// Vuetify
Vue.use(Vuetify, {
  theme: {
    primary: '#9575CD',
    secondary: '#9575CD',
    accent: '#7E57C2',
    error: '#F44336',
    warning: '#FFEB3B',
    info: '#2196F3',
    success: '#4CAF50'
  }
})

// Styles
require('./styles/scss/main.scss')
require('./styles/stylus/main.styl')

// Global Components
Vue.component('loading', Loading)
Vue.component('Appbar', Appbar)
Vue.component('Appfooter', Appfooter)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
