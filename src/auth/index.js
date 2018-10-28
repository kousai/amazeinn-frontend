import Vue from 'vue'
import { router } from '@/http'
import store from '@/store'
import axios from 'axios'
import * as constants from '@/constants'

const REFRESH_TOKEN_URL = constants.API_BASE_URL + '/refresh'

export default {

  install (Vue, options) {
    Vue.prototype.$auth = Vue.auth = axios.create()

    this.setDefaults()
    this.addInterceptors()
  },

  setDefaults () {
    Vue.auth.defaults.baseURL = constants.API_BASE_URL
  },

  addInterceptors () {
    // Watch for accessToken changes and update our common Auth header.
    store.watch((state) => {
      return state.auth
    }, (auth) => {
      if (!constants.DEBUG) {
        // Vue.auth.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
        // Vue.auth.defaults.transformRequest = [(data, headers) => {
        //   data.access_token = accessToken
        //   return data
        // }]
      }

      if (constants.DEBUG) {
        console.log('token set')
      }
    }, {
      deep: true
    })

    // Intercept the response and refresh (one retry) if invalid token.
  },

  isValidLogin () {
    if (store.state.auth.isLoggedIn) {
      const d = new Date()
      const n = d.getTime()
      return n - store.state.auth.loginTime < 604800000
    } else {
      return false
    }
  },

  isInvalidToken (res) {
    const status = res.response.status
    return status === 401
  },

  expiredLogin () {
    store.dispatch('common/clear')
    router.push({ name: 'entrance' })
  },

  redirectPath (redirect) {
    router.push({ name: redirect })
  },

  refreshConfig () {
    return {
      method: 'post',
      url: REFRESH_TOKEN_URL,
      headers: {
        'Content-Type': 'application/json',
        'CLIENT_ID': store.state.auth.user.id,
        'REFRESH_TOKEN': store.state.auth.refreshToken
      }
    }
  },

  refreshToken (request) {
    return axios(this.refreshConfig())
      .then((response) => {
        const auth = store.state.auth
        auth.accessToken = response.data.result.access_token
        store.dispatch('auth/update', auth)
        let newRequest = request
        newRequest.headers['ACCESS_TOKEN'] = store.state.auth.accessToken
        return this.retry(newRequest)
      })
      .catch((errorResponse) => {
        if (this.isInvalidToken(errorResponse)) {
          this.expiredLogin()
        }
        return errorResponse
      })
  },

  retry (request) {
    return Vue.auth(request)
      .then((response) => { return response })
      .catch((response) => { return response })
  },

  storeToken (response) {
    const auth = store.state.auth
    const d = new Date()
    const n = d.getTime()
    auth.isLoggedIn = true
    auth.accessToken = response.data.result.access_token
    auth.refreshToken = response.data.result.refresh_token
    auth.loginTime = n
    auth.user.name = response.data.result.name
    auth.user.id = response.data.result.client_id
    auth.user.gender = response.data.result.gender
    auth.user.avatar = response.data.result.avatar

    store.dispatch('auth/update', auth)
  }

}
