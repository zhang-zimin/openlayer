<template>
   <div class="MonitoringData">
  <ol-map
    id="map"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="width: 1200px;
    height: 600px;"
    
  >
  <ol-view
      ref="view"
      :center="center"
      :rotation="rotation"
      :zoom="zoom"
      :projection="projection"
    />
    <!--
      :rotation="rotation" 
      <ol-view ref="view" :center="center" :zoom="zoom" />-->

    <ol-zoom-control />
    <ol-attribution-control />

    <!--
    <ol-interaction-clusterselect @select="featureSelected" :pointRadius="20">
      <ol-style>
        <ol-style-stroke color="green" :width="5"></ol-style-stroke>
        <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill>
        <ol-style-icon :src="markerIcon" :scale="0.05"></ol-style-icon>
      </ol-style>
    </ol-interaction-clusterselect>
-->

    <!--@select="featureSelected"-->
    <ol-interaction-select
          @select="featureSelected"
          :condition="selectCondition"
          :filter="selectInteactionFilter"
        >
      <ol-style>
        <ol-style-stroke color="green" :width="10"></ol-style-stroke>
        <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill>
        <ol-style-icon :src="markerIcon" :scale="0.05"></ol-style-icon>
      </ol-style>
    </ol-interaction-select>

    <!---->
    <ol-layer-group :opacity="0.4">
      <ol-tile-layer>
        <ol-source-tile-wms
          url="http://192.168.0.107:8010/geoserver/zzmserver/wms"
           
          layers="zzmserver:PS_LINE-3857"
          serverType="geoserver"
          :transition="0"
          :params="{
            SERVICE: 'WMS',
        VERSION: '1.3.0',
        
        REQUEST: 'GetMap',
       
        FORMAT: 'image/png',
        TRANSPARENT: true,
        tiled: true,
        STYLES: '',
        exceptions: 'application/vnd.ogc.se_inimage',
        CRS: 'EPSG:3857',
         
        WIDTH: 769,
        HEIGHT: 470,
        BBOX: '726703.59375,2524902.890625,727783.59375,2525573.671875'
        }"
        />
      </ol-tile-layer>
      <!--<ol-tile-layer>
        <ol-source-tile-json
          url="http://192.168.0.107:8010/geoserver/zzmserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zzmserver%3APS_LINE-3857&maxFeatures=50&outputFormat=application%2Fjson"
          crossOrigin="anonymous"
        />
      </ol-tile-layer>-->
      <ol-vector-layer title="AIRPORTS">
        <ol-source-vector
          ref="cities"
          url="http://192.168.0.107:8010/geoserver/zzmserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zzmserver%3APS_LINE-3857&maxFeatures=50&outputFormat=application%2Fjson"
          :format="geoJson"
          :projection="projection"
        >
        </ol-source-vector>

        <ol-style>
        <ol-style-stroke color="red" :width="2"></ol-style-stroke>
        <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
        <ol-style-circle :radius="7">
          <ol-style-fill color="blue"></ol-style-fill>
        </ol-style-circle>
      </ol-style>

      </ol-vector-layer>
      
    </ol-layer-group>
    <!--<ol-image-layer id="xkcd">
      <ol-source-image-static
        :url="imgUrl"
        :imageSize="size"
        :imageExtent="extent"
        :projection="projection"
        :attributions="imgCopyright"
      ></ol-source-image-static>
    </ol-image-layer>-->

    <ol-overlay
      :position="selectedCityPosition"
      v-if="selectedCityName != ''"
    >
      <template v-slot="slotProps">
        <div class="overlay-content">
          {{ selectedCityName }} {{ slotProps }}
        </div>
      </template>
    </ol-overlay>


  </ol-map>
<!--
  <div id="popup" class="ol-popup">
      <div id="popup-closer" class="ol-popup-closer">X</div>
      <div id="popup-detail" class="ol-popup-detail">查看详情</div>
      <div id="popup-content" class="popup-content">
      </div>
    </div>-->
     
    <el-button type="primary" v-show="!modelSatus.status" @click="modelSatus.status=true"><<</el-button>
    <div class="map-left" v-show="modelSatus.status"><el-button type="primary" @click="modelSatus.status=false">X</el-button>
     
      <PlantInfoList msg="计算结果展示"/>
      <!--<div class="text"> 信息展示</div>
      <div class="flexbox">
        <el-input v-model="form.input" placeholder="请输入username" clearable style="width:150px;margin-right:15px;" />
        <el-button type="primary" @click="look">查询</el-button>
      </div>
      <div class="list">
        <li v-for="(item,index) in form.list " :key='index'>
          <div class="fx-space-between-center li">
            <div>{{item.name}}</div>
            <div>{{item.record}}</div>
          </div>
          <div class="text-li">{{item.text}}</div>
        </li>
      </div>-->
    </div>
   <!--<div class="model fx-center" v-show="modelSatus.status">
      <div class="">
        <div>我是无情的白色弹窗</div>
        <el-button type="primary" @click="modelSatus.status=false">关闭</el-button>
      </div>
    </div>--> 
   
</div>
</template>

<script setup>
import { ref, reactive, inject, onMounted  } from "vue";

import markerIcon from "@/assets/marker.png";
import PlantInfoList from '@/components/plantInfoList.vue';

const selectedCityName = ref("");
const selectedCityPosition = ref([]);
const drawEnable = ref(false);

const format = inject("ol-format");
const geoJson = new format.GeoJSON();

const selectConditions = inject("ol-selectconditions");
const selectCondition = selectConditions.pointerMove;

//const selectConditions = inject("ol-events-conditions");
//const selectCondition = selectConditions.singleClick;

const selectInteactionFilter = (feature) => {
  console.log(feature);
  return feature.values_.burytype != undefined;
};

const modelSatus = reactive({
      status: true,
    });
const form = reactive({
      input: "",
      list: {},
    });
   
   
//const center = ref([40, 40]);
const projection = ref("EPSG:3857");
const zoom = ref(12);
const rotation = ref(0);
//const size = ref([1024, 968]);
//const center = ref([size.value[0] / 2, size.value[1] / 2]);
const center =ref([12605523,2613832]);
//const size = ref([12605523*2, 2613832*2]);
//const extent = ref([0, 0, ...size.value]);
const extent = inject("ol-extent");
/*const projection = reactive({
  code: "xkcd-image",
  units: "pixels",
  extent: extent,
});*/
const imgUrl=ref("http://192.168.0.107:8010/geoserver/zzmserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=zzmserver%3APS_LINE-3857&exceptions=application%2Fvnd.ogc.se_inimage&CRS=EPSG%3A3857&WIDTH=769&HEIGHT=470&BBOX=12594707.938873548%2C2600912.5162177263%2C12624026.899866581%2C2618855.1095337737");
//const imgUrl = ref("https://imgs.xkcd.com/comics/online_communities.png");
const imgCopyright = ref('© <a href="http://xkcd.com/license.html">xkcd</a>');

const featureSelected = (event) => {
  console.log(event);
  console.log(event.selected);
  if (event.selected.length == 1) {
    selectedCityPosition.value = extent.getCenter(
      event.selected[0].getGeometry().extent_,
    );
    //selectedCityName.value = event.selected[0].values_.name;
    selectedCityName.value = event.selected[0].values_.burytype;
  } else {
    selectedCityName.value = "";
  }
};
function featureClicked(event) {
    console.log("featureClicked");
    console.log(event);
    console.log(event.target.value)
}


</script>

<style scoped lang="scss">
.MonitoringData {
  height: 100%;
  position: relative;
  .model {
    position: absolute;
    height: 100%;
    width: 100%;
    background: #fff;
    bottom: 0;
    left: 0;
    text-align: center;
  }
  .map-left {
    width: 100%;
    height: 40%;
    position: absolute;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    position: absolute;
    bottom: 20px;
    overflow: auto;
    padding: 10px;
    .text {
      font-size: 12px;
      color: #cccccc;
      padding-bottom: 10px;
    }
    .list {
      width: 100%;
      margin-top: 15px;
      li {
        border-bottom: 1px solid #e3e3e3;
        padding: 5px 0;
      }
      .li {
        width: 100%;
        font-size: 16px;
        color: #868585;
        padding-bottom: 5px;
      }
      .text-li {
        background: linear-gradient(red, green, blue);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    }
  }
}
#Map {
  width: 100%;
  height: 100%;
 
  .ol-popup {
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
  }
  .ol-popup:after,
  .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
    cursor: pointer;
  }
  .ol-popup-detail {
    text-decoration: none;
    position: absolute;
    top: 4px;
    left: 8px;
    cursor: pointer;
  }
  .popup-content {
    width: 400px;
  }
}
</style>