import { createStore } from 'vuex'

export default createStore({
  state: {
    isConnected: false,
    username: "",
    gameState: "idle",
    roomId: "",
    isOwner: false,
    page: null,
    scoreboard: [],
    logs: []
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
      state.roomId = "",
      state.isOwner = false,
      state.scoreboard = [],
      state.logs = []
    },
    RESET(state){
      state.gameState = "idle",
      state.roomId = "",
      state.isOwner = false,
      state.scoreboard = [],
      state.logs = []
    },
    SET_STATE(state, stateName){
      state.gameState = stateName;
    },
    SET_SCOREBOARD(state, scoreboard){
      state.scoreboard = scoreboard;
    },
    ADD_LOG(state, log){
      state.logs.push(log);
    },
    SET_USERNAME(state, username){
      state.username = username;
    },
    SET_IS_OWNWER(state, isOwner){
      state.isOwner = isOwner;
    },
    SET_ROOM(state, room){
      state.roomId = room;
    },
    SET_PAGE(state, page){
      state.page = page;
    }
  },
  actions: {
  },
  modules: {
  }
})
