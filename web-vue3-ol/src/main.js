import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import splitPane from 'vue3-splitpane'
import App from './App.vue'
import router from './router'

const app = createApp(App)
// const shapefile = require("shapefile");
app.use(createPinia())
app.use(router)

app.mount('#app')
app.component('split-pane', splitPane);


// components:{
//     splitPane
// }
const { Splitpanes, Pane } = splitpanes
new Vue({
    el: '#app',
    components: { Splitpanes, Pane }
  })