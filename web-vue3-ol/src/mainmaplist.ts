//import './assets/main.css'

//import "//unpkg.com/element-plus/dist/index.css" 
//import "//unpkg.com/element-plus"
import { createSticky } from '@/utils/sticky'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'

//import App from './components/MapWmsList.vue'
 import App from './components/MapWmsListTest.vue'
// import App from './components/MapWmsListTest2.vue'

//import App from './components/MapWms.vue'
//import App from './components/HeNanMap.vue'
//import App from './components/WmsEplus.vue'
//import App from './components/MapDemo.vue'
//import App from './App.vue'
import router from './router'

//import OpenLayersMap from "vue3-openlayers";
/**/import OpenLayersMap, {
    type Vue3OpenlayersGlobalOptions,
  } from "vue3-openlayers";
import "vue3-openlayers/styles.css"; // vue3-openlayers version < 1.0.0-*

const app = createApp(App)
createSticky(app)
app.use(createPinia())
//app.use(router)

//app.use(OpenLayersMap /* options */);
/**/const options: Vue3OpenlayersGlobalOptions = {
    debug: true,
  };
  app.use(OpenLayersMap, options);

//app.config.globalProperties.baseURL = 'http://192.168.0.103:8010'// 自定义添加
const baseUrl = 'http://192.168.0.107:8010'// 自定义添加
// const baseUrl = 'http://1.1.1.250:8010'// 自定义添加
app.config.globalProperties.$baseUrl = baseUrl
app.config.globalProperties.$getFullUrl = (params) => {
  return baseUrl + params
}

app.use(ElementPlus);
app.mount('#app')
