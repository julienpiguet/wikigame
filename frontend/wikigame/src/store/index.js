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
    choicePages: [],
    choice: "",
    votePages: [],
    votePage: "",
    images: [],
    scoreboard: [],
    logs: [],
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
      state.roomId = "";
      state.isOwner = false;
      state.scoreboard = [];
      state.logs = [];
      state.page = null;
      state.image = "";
      state.images = [];
      state.vote = "";
      state.choice = "";
      state.votePage = "";
      state.choicePages = [];
      state.votePages = [];
    },
    RESET(state){
      state.gameState = "idle";
      state.roomId = "";
      state.isOwner = false;
      state.scoreboard = [];
      state.logs = [];
      state.page = null;
      state.image = "";
      state.images = [];
      state.vote = "";
      state.choice = "";
      state.votePage = "";
      state.choicePages = [];
      state.votePages = [];
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
    ADD_CHOICE_PAGE(state, page){
      state.choicePages.push(page);
    },
    ADD_VOTE_PAGE(state, page){
      state.votePages.push(page);
    },
    SET_TIMER(state, timer){
      state.timer = timer;
    },
    SET_VOTE(state, vote){
      state.vote = vote;
    },
    SET_PAGE_CHOICE(state, choice){
      state.choice = choice;
    },
    SET_PAGE_VOTE(state, vote){
      state.votePage = vote;
    },
    RESET_GAME_DATA(state){
      state.page = null;
      state.image = "";
      state.images = [];
      state.vote = "";
      state.choice = "";
      state.votePage = "";
      state.choicePages = [];
      state.votePages = [];
    },
  },
  actions: {
  },
  modules: {
  }
})
