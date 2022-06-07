import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueSocketIO from 'vue-3-socket.io'
import SocketIO from 'socket.io-client'

loadFonts()

var vsocket = new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:3000'),
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
})

createApp(App)
  .use(vsocket)
  .use(store)
  .use(vuetify)
  .mount('#app')
