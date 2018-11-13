import Vue from 'vue'
import store from '@/store'
import auth from './'
import * as constants from '@/constants'

const CHECKIN_URL = constants.API_BASE_URL + '/checkin'
const CHECKOUT_URL = constants.API_BASE_URL + '/checkout'
const ENTER_URL = constants.API_BASE_URL + '/enter'
const LEAVE_URL = constants.API_BASE_URL + '/leave'
const REQUEST_URL = constants.API_BASE_URL + '/info'

const PAGINATE_LIMIT = 6

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
            const data = this.showSuccess(res)
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
            const data = this.showSuccess(res)
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
                  const data = this.showSuccess(res)
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
    const reg = /^[A-Za-z0-9]{1, 9}$/
    if (!reg.test(name)) {
      errorMessage = '1~9 characters, and only numbers and letters.'
    }
    return errorMessage
  },

  checkPassword (password) {
    let errorMessage = null
    const reg = /^[A-Za-z0-9]{8, 24}$/
    if (!reg.test(password)) {
      errorMessage = '8~24 characters, and only numbers and letters.'
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
    switch (gender) {
      case 'Male':
        return 'static/images/male.png'
      case 'Female':
        return 'static/images/female.png'
      case 'Other':
        return 'static/images/other.png'
    }
  },

  doorPic (state) {
    return state ? 'static/images/empty.png' : 'static/images/door.png'
  },

  genderColor (gender) {
    switch (gender) {
      case 'Male':
        return 'blue'
      case 'Female':
        return 'pink'
      case 'Other':
        return 'purple'
    }
  },

  likeCount (liked) {
    if (liked > 0) {
      return `+${liked}`
    } else if (liked < 0) {
      return `-${liked}`
    } else {
      return liked
    }
  },

  formateDate (timestamp) {
    const date = new Date(timestamp * 1000)
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
  },

  limitFileSize (file, limitSize) {
    const arr = ['KB', 'MB', 'GB']
    const limit = limitSize.toUpperCase()
    let limitNum = 0
    for (let i = 0; i < arr.length; i++) {
      const level = limit.indexOf(arr[i])
      if (level > -1) {
        limitNum = Number(limit.substr(0, level)) * Math.pow(1024, (i + 1))
        break
      }
    }
    if (file.size > limitNum) {
      return false
    }
    return true
  },

  randomNum (lower, upper) {
    return Math.floor(Math.random() * (upper - lower)) + lower
  },

  randomColor () {
    const str16 = '0123456789ABCDEF'
    let newColor = '#'
    for (var i = 0; i < 6; i++) {
      newColor += str16[this.randomNum(0, 16)]
    }
    return newColor
  },

  totalPage (arr) {
    return Math.ceil(arr.length / PAGINATE_LIMIT)
  },

  pegination (arr, currentPage) {
    let result
    if (arr.length <= PAGINATE_LIMIT) {
      result = arr
    } else {
      result = arr.slice(PAGINATE_LIMIT * (currentPage - 1), PAGINATE_LIMIT * currentPage)
    }
    return result
  },

  resolveFunc (res) {
    let errorMessage = null
    const has = Object.prototype.hasOwnProperty
    if (has.call(res.data, 'failed')) {
      switch (res.data.failed) {
        case 1:
          errorMessage = 'no empty room'
          break
        case 2:
          errorMessage = 'user already exists'
          break
        case 3:
          errorMessage = 'user does not exist'
          break
        case 4:
          errorMessage = 'wrong password'
          break
        case 5:
          errorMessage = 'no like-time'
          break
        default:
          errorMessage = 'undefined error'
      }
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
    const message = this.resolveFunc(res)
    if (typeof (message) === 'string') {
      this.showMessage(message)
    } else {
      return message
    }
  },

  showError (error) {
    const message = this.rejectFunc(error)
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
