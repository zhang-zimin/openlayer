import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { AgGridVue } from '@ag-grid-community/vue3';
import '@ag-grid-community/styles/ag-grid.css';
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
import splitPane from 'vue3-splitpane'
import App from './App.vue'
import router from './router'
import axios from "axios";
Vue.prototype.axios = axios;

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
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



  const CustomButtonComponent = {
    template: `
          <div>        
              <button v-on:click="buttonClicked">Push Me!</button>
          </div>
      `,
    methods: {
      buttonClicked() {
        alert("clicked");
      },
    },
  };
  
  const VueExample = {
      template: `
          <div style="height: 100%">
              <ag-grid-vue
                  style="width: 100%; height: 100%;"
                  :class="themeClass"
                  :columnDefs="columnDefs"
                  @grid-ready="onGridReady"
                  :rowData="rowData"></ag-grid-vue>
          </div>
      `,
      components: {
          'ag-grid-vue': AgGridVue,
          CustomButtonComponent,
      },
      data: function() {
        return {
          columnDefs: [{
            headerName: "Make & Model",
            valueGetter: (p) => p.data.make + ' ' + p.data.model,
            flex: 2
          },
          {
            field: "price",
            valueFormatter: p => '£' + Math.floor(p.value).toLocaleString(),
            flex: 1
          },
          {
            field: "electric",
            flex: 1
          },
          {
            field: "button",
            cellRenderer: 'CustomButtonComponent',
            flex: 1
          }],
          gridApi: null,
          themeClass: "ag-theme-quartz",
          rowData: null
        }
      },
      created() {
        this.rowData = [
          { make: "Tesla", model: "Model Y", price: 64950, electric: true },
          { make: "Ford", model: "F-Series", price: 33850, electric: false },
          { make: "Toyota", model: "Corolla", price: 29600, electric: false },
          { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
          { make: 'Fiat', model: '500', price: 15774, electric: false },
          { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
        ]        
      },
      methods: {
          onGridReady(params) {
          this.gridApi = params.api;
      },
    }
  }
  
  const gridDiv = document.querySelector('#myGrid');
  
  createApp(VueExample)
      .mount("#app")