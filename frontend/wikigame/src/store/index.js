import { createStore } from 'vuex'

export default createStore({
  state: {
    isConnected: false,
    username: "",
    gameState: "idle",
    roomId: "",
    isOwner: false,
    page: null,
    image: "",
    timer: 0,
    vote: "",
    images: [],
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
    },
    SET_IMAGE(state, image){
      state.image = image;
    },
    ADD_IMAGE(state, image){
      state.images.push(image);
    },
    SET_TIMER(state, timer){
      state.timer = timer;
    },
    SET_VOTE(state, vote){
      state.vote = vote;
    },
    RESET_GAME_DATA(state){
      state.page = null;
      state.image = "";
      state.images = [];
      state.vote = "";
    },
  },
  actions: {
  },
  modules: {
  }
})
