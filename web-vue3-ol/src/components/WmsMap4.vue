<template>22222
  <div class="map_container">
     <!--<input type="text" v-model="input" placeholder="请输入内容" />

    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="textarea"></el-input>
    <el-input type="textarea" autosize placeholder="请输入内容" v-model="textarea2"></el-input>
    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="textarea3"></el-input>
   -->
    <el-input v-model="input1" placeholder="Please input">
      <template #prepend>Http://</template>
    </el-input>

    <div id="map3"></div>
      <div id="map2"  style="width: 800px;height: 400px;"></div>
    </div>

</template>
<script setup lang="ts">
 
//import {  reactive, ref ,onMounted ,watch} from 'vue';
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

import ImageWMS from 'ol/source/ImageWMS.js';
import TileWMS from 'ol/source/TileWMS.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer.js';
 
const input1 = ref('111')

const layers = [

new ImageLayer({
    //extent: [-13884991, 2870341, -7455066, 6338219],
    //extent: [12569656.479167424, 2583648.905525375, 12628310.762202643, 2640928.8622640437],
    source: new ImageWMS({
      //url: 'https://ahocevar.com/geoserver/wms',
      //url:'http://192.168.0.107:8010/geoserver/zzmserver/wms',
      //url:'http://192.168.0.107:8010/geoserver/zzmserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fjpeg&TRANSPARENT=true&STYLES&LAYERS=zzmserver%3Ashunde&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A3857&WIDTH=769&HEIGHT=750',
      //http://192.168.0.107:8010/geoserver/zzmserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=zzmserver%3Amidriverline3857&bbox=717579.6226196289%2C2520933.898010254%2C734061.9595947264%2C2529205.377441406&width=768&height=385&srs=EPSG%3A3857&styles=&format=application/openlayers
      //http://192.168.0.107:8010/geoserver/zzmserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=zzmserver%3Ashunde&bbox=1.25801542119166E7%2C2592251.9360635905%2C1.2622352228844285E7%2C2633463.4375949698&width=768&height=750&srs=EPSG%3A3857&styles=&format=application/openlayers#toggle
     //http://192.168.0.107:8010/geoserver/zzmserver/wms?service=WMS&version=1.1.0&request=GetMap&layers=zzmserver%3ADefault%20%E2%80%94%20source_nonepoint&bbox=184047.24844732514%2C2103881.962779923%2C815952.7515526749%2C5714206.250336334&width=330&height=768&srs=EPSG%3A3857&styles=&format=application/openlayers#toggle
      url:'http://192.168.0.107:8010/geoserver/zzmserver/wms',
      params: { 
        SERVICE: 'WMS',
        VERSION: '1.3.0',
        //VERSION: '1.1.1',
        REQUEST: 'GetMap',
        //FORMAT: 'image/jpeg',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        //tiled: true,
        STYLES: '',
        exceptions: 'application/vnd.ogc.se_inimage',
        WIDTH: 256,
        HEIGHT: 256,
        CRS: 'EPSG:3857',
        LAYERS: 'zzmserver:shunde',
        //tilesOrigin: '2592251.9360635905,12580154.2119166',
        BBOX: '12607153.227003403,2628933.5023751296,12616926.21400108,2638706.4893728066',
      },
      ratio: 1,
      serverType: 'geoserver',
    }),
  }),


new ImageLayer({
    //extent: [-13884991, 2870341, -7455066, 6338219],
    //extent: [12569656.479167424, 2583648.905525375, 12628310.762202643, 2640928.8622640437],
    source: new ImageWMS({
      url:'http://192.168.0.107:8010/geoserver/zzmserver/wms',
      params: { 
        SERVICE: 'WMS',
        VERSION: '1.3.0',
        //VERSION: '1.1.1',
        REQUEST: 'GetMap',
        //FORMAT: 'image/jpeg',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        //tiled: true,
        STYLES: '',
        exceptions: 'application/vnd.ogc.se_inimage',
        CRS: 'EPSG:3857',
        //WIDTH: 769,
        //HEIGHT: 386,
        //LAYERS: 'zzmserver:midriverline3857',
        //tilesOrigin: '2520933.898010254,717579.6226196289',
        //BBOX: '712202.3371934269,2518391.584566848,741529.4787110353,2533097.4213184',
        WIDTH: 769,
        HEIGHT: 597,
        LAYERS: 'zzmserver:test',
        BBOX: '12582186.299282774,2606848.8423042055,12611505.260275807,2629639.753388632',
        //LAYERS: 'zzmserver:shunde',
        //tilesOrigin: '2592251.9360635905,12580154.2119166',
        //BBOX: '12607153.227003403,2628933.5023751296,12616926.21400108,2638706.4893728066',
        //LAYERS: 'zzmserver:Default — source_nonepoint',
        //tilesOrigin: '2103881.962779923,184047.24844732514',
        //BBOX: '732974.0248257779,2521430.6454006806,735417.2715751971,2523873.8921501',
      },
      ratio: 1,
      serverType: 'geoserver',
    }),
  }),

  new ImageLayer({
    //extent: [-13884991, 2870341, -7455066, 6338219],
    //extent: [12569656.479167424, 2583648.905525375, 12628310.762202643, 2640928.8622640437],
    source: new ImageWMS({
      url:'http://192.168.0.107:8010/geoserver/zzmserver/wms',
      params: { 
        SERVICE: 'WMS',
        VERSION: '1.3.0',
        //VERSION: '1.1.1',
        REQUEST: 'GetMap',
        //FORMAT: 'image/jpeg',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        //tiled: true,
        STYLES: '',
        exceptions: 'application/vnd.ogc.se_inimage',
        CRS: 'EPSG:3857',
        //WIDTH: 769,
        //HEIGHT: 386,
        //LAYERS: 'zzmserver:midriverline3857',
        //tilesOrigin: '2520933.898010254,717579.6226196289',
        //BBOX: '712202.3371934269,2518391.584566848,741529.4787110353,2533097.4213184',
        WIDTH: 768,
        HEIGHT: 477,
        LAYERS: 'zzmserver:SOURCE_NONEPOINT-3857',
        BBOX: '726703.59375,2524902.890625,727783.59375,2525573.671875',
        /*LAYERS: 'zzmserver:shunde',
        tilesOrigin: '2592251.9360635905,12580154.2119166',
        BBOX: '12607153.227003403,2628933.5023751296,12616926.21400108,2638706.4893728066',*/
        /*LAYERS: 'zzmserver:Default — source_nonepoint',
        tilesOrigin: '2103881.962779923,184047.24844732514',
        BBOX: '732974.0248257779,2521430.6454006806,735417.2715751971,2523873.8921501',*/
      },
      ratio: 1,
      serverType: 'geoserver',
    }),
  }),
  
  new ImageLayer({
    //extent: [-13884991, 2870341, -7455066, 6338219],
    //extent: [12569656.479167424, 2583648.905525375, 12628310.762202643, 2640928.8622640437],
    source: new ImageWMS({
      url:'http://192.168.0.107:8010/geoserver/zzmserver/wms',
      params: { 
        SERVICE: 'WMS',
        VERSION: '1.3.0',
        //VERSION: '1.1.1',
        REQUEST: 'GetMap',
        //FORMAT: 'image/jpeg',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        tiled: true,
        STYLES: '',
        exceptions: 'application/vnd.ogc.se_inimage',
        CRS: 'EPSG:3857',
        WIDTH: 256,
        HEIGHT: 256,
        LAYERS: 'zzmserver:PS_LINE-3857',
        BBOX: '12602266.733504564,2609387.5283797756,12604709.980253983,2611830.775129195',
        tilesOrigin: '2606242,12601660'
      },
      ratio: 1,
      serverType: 'geoserver',
    }),
  }),

/*
  new ImageLayer({
    //extent: [-13884991, 2870341, -7455066, 6338219],
    //extent: [12569656.479167424, 2583648.905525375, 12628310.762202643, 2640928.8622640437],
    source: new ImageWMS({
      url:'http://192.168.0.107:8010/geoserver/zzmserver/wms',
      params: { 
        SERVICE: 'WMS',
        VERSION: '1.3.0',
        //VERSION: '1.1.1',
        REQUEST: 'GetMap',
        //FORMAT: 'image/jpeg',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        //tiled: true,
        STYLES: '',
        exceptions: 'application/vnd.ogc.se_inimage',
        WIDTH: 256,
        HEIGHT: 256,
        CRS: 'EPSG:3857',
        LAYERS: 'zzmserver:Default — source_nonepoint',
        tilesOrigin: '2103881.962779923,184047.24844732514',
        BBOX: '732974.0248257779,2521430.6454006806,735417.2715751971,2523873.8921501',
      },
      ratio: 1,
      serverType: 'geoserver',
    }),
  }),*/
   

];
const map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    //center: [-10997148, 4569099],
    center: [12605523,2613832],
    zoom: 10,
  }),
});

</script>
 