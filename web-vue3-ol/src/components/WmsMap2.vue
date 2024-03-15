<template>
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
  new TileLayer({
    //extent: [-13884991, 2870341, -7455066, 6338219],
    extent: [12569656.479167424, 2583648.905525375, 12628310.762202643, 2640928.8622640437],
    source: new TileWMS({
      //url: 'https://ahocevar.com/geoserver/wms',
      url:'http://192.168.0.107:8010/geoserver/zzmserver/wms',
      //url:'http://192.168.0.107:8010/geoserver/zzmserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fjpeg&TRANSPARENT=true&STYLES&LAYERS=zzmserver%3Ashunde&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A3857&WIDTH=769&HEIGHT=750',
      params: { 
        'SERVICE': 'WMS',
        'VERSION': '1.1.1',
        'REQUEST': 'GetMap',
        'FORMAT': 'image/jpeg',
        'TRANSPARENT': true,
        'tiled': true,
        'STYLES': '',
        'LAYERS': 'zzmserver:shunde',
        'exceptions': 'application/vnd.ogc.se_inimage',
        'tilesOrigin': '12580154.2119166,2592251.9360635905',
        'WIDTH': 256,
        'HEIGHT': 256,
        'SRS': 'EPSG:3857',
        'BBOX': '12590050.499757469,2606944.281630356,12592493.746506888,2609387.528379775',
      },
      ratio: 1,
      serverType: 'geoserver',
    }),
  }),
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
 