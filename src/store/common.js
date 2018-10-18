// Common State.
const defaults = {
  sidebar: {
    visible: false
  },
  title: '',
  layout: 'DefaultLayout',
  dialog: {
    visible: false,
    text: ''
  },
  snackbar: {
    visible: false,
    text: '',
    timeout: 3000,
    color: ''
  }
}

// Global module loaded on first app load.
export default {
  namespaced: true,

  state: Object.assign({}, defaults),

  mutations: {
    updateSidebar (state, options) {
      state.sidebar = Object.assign({}, defaults.sidebar, options)
    },

    updateTitle (state, title) {
      state.title = title
    },

    updateLayout (state, layout) {
      state.layout = layout
    },

    updateDialog (state, options) {
      state.dialog = Object.assign({}, defaults.dialog, options)
    },

    updateSnackbar (state, options) {
      state.snackbar = Object.assign({}, defaults.snackbar, options)
    },

    clear (state) {
      state = Object.assign({}, defaults)
    }
  },

  actions: {
    clear ({ state, commit, rootState, dispatch }) {
      commit('clear')
      dispatch('auth/clear', {}, { root: true })
    },

    updateSidebar ({ commit }, options) {
      commit('updateSidebar', options)
    },

    updateTitle ({ commit }, title) {
      commit('updateTitle', title)
    },

    updateLayout ({ commit }, layout) {
      commit('updateLayout', layout)
    },

    updateDialog ({ commit }, options) {
      commit('updateDialog', options)
    },

    updateSnackbar ({ commit }, options) {
      commit('updateSnackbar', options)
    }
  }
}
