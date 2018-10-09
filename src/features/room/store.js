import store from '@/store'

store.registerModule('room', {
  namespaced: true,

  // State loaded when this component is first loaded.
  state: {
    id: null
  },

  mutations: {
    updateOwner (state, newVal) {
      state.id = newVal
    }
  },

  actions: {
    updateOwner ({ state, commit, rootState, dispatch }, newVal) {
      commit('updateOwner', newVal)
    }
  }
})

export default store
