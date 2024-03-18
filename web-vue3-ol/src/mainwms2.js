//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

//import App from './components/WmsMap2.vue'
//import App from './components/WmsMap3.vue'
import App from './components/WmsMap4.vue'
//import App from './App.vue'
//import router from './router'

import OpenLayersMap from "vue3-openlayers";
/*import OpenLayersMap, {
    type Vue3OpenlayersGlobalOptions,
  } from "vue3-openlayers";*/
import "vue3-openlayers/styles.css"; // vue3-openlayers version < 1.0.0-*

const app = createApp(App)

app.use(createPinia())
//app.use(router)

app.use(OpenLayersMap /* options */);
/*const options: Vue3OpenlayersGlobalOptions = {
    debug: true,
  };
  app.use(OpenLayersMap, options);
*/
//app.use(ElementPlus);
app.mount('#map')
