import { createStore } from 'vuex'

export default createStore({
  state: {
    isConnected: false
  },
  getters: {
  },
  mutations: {
    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    }
  },
  actions: {
  },
  modules: {
  }
})
