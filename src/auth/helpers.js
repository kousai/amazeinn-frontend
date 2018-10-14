import Vue from 'vue'
import store from '@/store'
import auth from './'
import * as constants from '@/constants'

const CHECKIN_URL = constants.API_BASE_URL + '/checkin'
const CHECKOUT_URL = constants.API_BASE_URL + '/checkout'
const ENTER_URL = constants.API_BASE_URL + '/enter'
const LEAVE_URL = constants.API_BASE_URL + '/leave'
const REQUEST_URL = constants.API_BASE_URL + '/info'

export default {

  checkinConfig (data) {
    return {
      method: 'post',
      url: CHECKIN_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
  },

  enterConfig (data) {
    return {
      method: 'post',
      url: ENTER_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
  },

  leaveConfig () {
    return {
      method: 'post',
      url: LEAVE_URL,
      headers: {
        'ACCESS_TOKEN': store.state.auth.accessToken,
        'CLIENT_ID': store.state.auth.user.id
      }
    }
  },

  checkoutConfig (data) {
    return {
      method: 'post',
      url: CHECKOUT_URL,
      headers: {
        'Content-Type': 'application/json',
        'ACCESS_TOKEN': store.state.auth.accessToken,
        'CLIENT_ID': store.state.auth.user.id
      },
      data: data
    }
  },

  infoConfig (data, header) {
    return {
      method: 'post',
      url: REQUEST_URL,
      headers: {
        'ACCESS_TOKEN': store.state.auth.accessToken,
        'CLIENT_ID': store.state.auth.user.id,
        'REQUEST': header[0],
        'ACTION': header[1],
        'Content-Type': data['file'] ? 'multipart/form-data' : 'application/json'
      },
      data: data
    }
  },

  newRequest (config) {
    return Vue.http(config)
  },

  publicRequest (config) {
    return new Promise((resolve, reject) => {
      this.newRequest(config)
        .then(
          res => {
            var data = this.showSuccess(res)
            if (data) {
              resolve(data)
            } else {
              reject(data)
            }
          },
          error => {
            this.showError(error)
            reject(error)
          })
    })
  },

  fullRequest (config) {
    return new Promise((resolve, reject) => {
      this.newRequest(config)
        .then(
          res => {
            var data = this.showSuccess(res)
            if (data) {
              resolve(data)
            } else {
              reject(data)
            }
          },
          error => {
            if (this.showError(error)) {
              auth.refreshToken(config)
                .then(res => {
                  var data = this.showSuccess(res)
                  if (data) {
                    resolve(data)
                  } else {
                    reject(data)
                  }
                },
                error => {
                  this.showError(error)
                  reject(error)
                })
            }
          })
    })
  },

  checkName (name) {
    let errorMessage = null
    if (!name || name === '') {
      errorMessage = 'Name required.'
    } else if (name.length > 9) {
      errorMessage = 'Name has too many characters(at most 9).'
    } else if (/^[A-Za-z0-9]+$/.test(name) === false) {
      errorMessage = 'Please input a name with only numbers and letters.'
    }
    return errorMessage
  },

  checkPassword (password) {
    let errorMessage = null
    if (!password || password === '') {
      errorMessage = 'Password required.'
    } else if (password.length < 8 || password.length > 24) {
      errorMessage = 'Password only can have 8~24 characters.'
    } else if (/^[A-Za-z0-9]+$/.test(password) === false) {
      errorMessage = 'Please input a password with only numbers and letters.'
    }
    return errorMessage
  },

  checkMatch (old, nova) {
    let errorMessage = null
    if (old !== nova) {
      errorMessage = 'The two passwords you entered did not match.'
    }
    return errorMessage
  },

  defaultAvatar (gender) {
    if (gender === 'Male') {
      return 'static/images/male.png'
    } else if (gender === 'Female') {
      return 'static/images/female.png'
    } else {
      return 'static/images/other.png'
    }
  },

  doorPic (state) {
    return state ? 'static/images/empty.png' : 'static/images/door.png'
  },

  genderColor (gender) {
    if (gender === 'Male') return 'blue'
    else if (gender === 'Female') return 'pink'
    else return 'purple'
  },

  likeCount (liked) {
    if (liked > 0) {
      return '+' + liked
    } else if (liked < 0) {
      return '-' + liked
    } else {
      return liked
    }
  },

  formateDate (timestamp) {
    var date = new Date(timestamp * 1000)
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
  },

  resolveFunc (res) {
    let errorMessage = null
    if (!res.data.hasOwnProperty('failed')) {
    } else if (res.data.failed === 1) {
      errorMessage = 'no empty room'
    } else if (res.data.failed === 2) {
      errorMessage = 'user already exists'
    } else if (res.data.failed === 3) {
      errorMessage = 'user does not exist'
    } else if (res.data.failed === 4) {
      errorMessage = 'wrong password'
    } else if (res.data.failed === 5) {
      errorMessage = 'no like-time'
    } else {
      errorMessage = 'undefined error'
    }
    return errorMessage || res
  },

  rejectFunc (error) {
    let errorMessage = null
    if (error.response) errorMessage = error.response.status
    else if (error.request) errorMessage = 'no response from server'
    else errorMessage = error.message
    return errorMessage
  },

  showSuccess (res) {
    var message = this.resolveFunc(res)
    if (typeof (message) === 'string') {
      this.showMessage(message)
    } else {
      return message
    }
  },

  showError (error) {
    var message = this.rejectFunc(error)
    if (message === 401) {
      return true
    } else {
      this.showMessage(message)
    }
  },

  showMessage (message) {
    store.dispatch('common/updateSnackbar', { text: message, visible: true })
  }

}
