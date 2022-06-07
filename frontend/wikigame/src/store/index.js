import { createStore } from 'vuex'

export default createStore({
  state: {
    isConnected: false,
    gameState: "idle"
  },
  getters: {
  },
  mutations: {
    SOCKET_CONNECT(state) {
      state.isConnected = true;
      state.gameState = "idle";
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
      state.gameState = "idle";
    },
    SetState(state, stateName){
      state.gameState = stateName;
    }
  },
  actions: {
  },
  modules: {
  }
})
