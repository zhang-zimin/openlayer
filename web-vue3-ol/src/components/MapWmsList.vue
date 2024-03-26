<template>
  <div class="MonitoringData">
   <!-- style="width: 1200px;height: 600px;"-->
<!--@click="mapclick"-->
 <ol-map
   ref="map" 
   id="map"
   :loadTilesWhileAnimating="true"
   :loadTilesWhileInteracting="true"
   :style="mapstyle"
   
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

   <!--url="http://192.168.0.107:8010/geoserver/zzmserver/wms"-->
   <!--url="proxy.$getFullUrl('/geoserver/zzmserver/wms')"-->
   <ol-layer-group :opacity="0.4">

     <!-- 佛山顺德底图 -->
     <ol-tile-layer>
       <ol-source-tile-wms
         :url="proxy.$getFullUrl('/geoserver/zzmserver/wms')"
         layers="zzmserver:shunde"
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
       WIDTH: 256,
       HEIGHT: 256,
       BBOX: '12590050.499757469,2606944.281630356,12592493.746506888,2609387.528379775'
       }"
       />
     </ol-tile-layer>
     
     <!-- 管线 -->
     <ol-tile-layer>
       <ol-source-tile-wms
         :url="proxy.$getFullUrl('/geoserver/zzmserver/wms')"
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
     <!--url="http://192.168.0.107:8010/geoserver/zzmserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zzmserver%3APS_LINE-3857&maxFeatures=50&outputFormat=application%2Fjson"-->
     <ol-vector-layer title="AIRPORTS">
       <ol-source-vector
         ref="cities"
         :url="proxy.$getFullUrl('/geoserver/zzmserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zzmserver%3Asource_nonepoint_3857&maxFeatures=50&outputFormat=application%2Fjson')"
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
    
   <el-button type="primary" v-show="!modelSatus.status" @click="modelSatus.status=true">
  </el-button>
  <div class="map-left">

    <el-button type="primary" @click="drawPolygon">绘制多边形</el-button>
    <el-button type="primary" @click="cancelDraw">结束绘制</el-button>
    <el-button type="primary" @click="removeDrawLayer">清除</el-button>
    <el-button type="primary" @click="getPolygon">获取多边形数据</el-button>
 
    <el-upload
   class="upload"
   ref="upload"
   action="string"
   :file-list="uploadFiles"
   :auto-upload="true"
   :on-progress="importSubmit" 
   multiple="multiple"
 >
  <div class="upfile">
   <el-button
     size="small"
     type="success"
     class="chaxuns fontSizes"
   >上传文件</el-button>
  </div>
 </el-upload>  

    <!--<el-button type="primary" @click="leftmodelSatus.status=false">left</el-button>-->
       <!-- 文件上传区域 -->
   <!--<input type="file" @change="handleFileUpload" accept=".zip" ref="fileInput" >上传SHP文件</input>  -->
   
   <!-- 文件上传组件 -->
   <!-- <input type="file" @change="handleFileUpload" accept=".zip"> -->
   <!-- <el-button type="promary" size="mini" @click="addFile()">加载SHP文件</el-button> -->
    </div>
   <div class="map-bottom" v-show="modelSatus.status"><el-button type="primary" @click="modelSatus.status=false">关闭</el-button>
    <!--msg="计算结果展示"-->
     <PlantInfoList ref="childRef" :selData="mapClickData.list" :msg="zone_name"/>
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

<script setup lang="ts"> 

import { ref, reactive, inject, onMounted  } from "vue";
import markerIcon from "@/assets/marker.png";
import PlantInfoList from '@/components/plantInfoList.vue';
import {getCurrentInstance} from "vue";

import 'ol/ol.css';
import {Map, View }from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from "ol/format";
import { Polygon, MultiPolygon } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from "ol/source";
import { Fill } from "ol/style";
import { Stroke } from "ol/style";
import { Style } from "ol/style";
import { Circle } from "ol/geom";
import { Text } from "ol/style";
import { Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import JSZip from 'jszip';
import Draw from 'ol/interaction/Draw.js';
import {OSM, Vector as VectorSource2} from 'ol/source.js';
import {Tile as TileLayer2, Vector as VectorLayer2} from 'ol/layer.js';
import { Get, Post,Put } from "../axios/api"; 

const {proxy} = getCurrentInstance()
console.log(proxy.$baseUrl)
//console.log(proxy.$getFullUrl('/geoserver/zzmserver/wms')) 
//const wmsUrl=proxy.$getFullUrl('/geoserver/zzmserver/wms')

//const screenWidth = ref(window.innerWidth);
//const screenHeight = ref(window.innerHeight);
const screenWidth = ref(document.documentElement.clientWidth);//实时屏幕宽度
const screenHeight = ref(document.documentElement.clientHeight);//实时屏幕高度

const mapstyle=ref("width: "+(screenWidth.value-16)+"px;height: "+(screenHeight.value-50)+"px")  
console.log(mapstyle.value)

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
   const mapClickData = reactive({
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
//const imgUrl=ref("http://192.168.0.107:8010/geoserver/zzmserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=zzmserver%3APS_LINE-3857&exceptions=application%2Fvnd.ogc.se_inimage&CRS=EPSG%3A3857&WIDTH=769&HEIGHT=470&BBOX=12594707.938873548%2C2600912.5162177263%2C12624026.899866581%2C2618855.1095337737");
//const imgUrl = ref("https://imgs.xkcd.com/comics/online_communities.png");
//const imgCopyright = ref('© <a href="http://xkcd.com/license.html">xkcd</a>');

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
const zone_name=ref("");
const childRef = ref(null);
function mapclick(event){
   console.log("mapclick");
   console.log(event);
   var feature = event.map.forEachFeatureAtPixel(event.pixel, function (feature) {
     return feature;
       });
   console.log(feature);
   if(feature){
       console.log(feature.values_.burytype);
       //mapClickData.input=feature.values_.burytype;
       mapClickData.list=feature.values_;
       console.log(mapClickData.list);
       //console.log(mapClickData.list.zone_name);
       zone_name.value=feature.values_.zone_name;
       //if (childRef.value) {
         childRef.value.childMethod(zone_name.value);
         childRef.value.childSelMethod(mapClickData.list);
       //}
   } 
}

// const shapefile = require("shapefile");

const map = ref(null);
onMounted(() => {
  map.value.map.addLayer(vectorDraw);
  const mapvalue=map.value;
 /*console.log("onMounted map value:"+map.value); // 在组件挂载后也可以访问
 console.log("mapvalue map:"+mapvalue.map); 
 console.log("onMounted map:"+map.map); 
 console.log("onMounted map:"+map.id); 
 console.log("layers:"+mapvalue.layers);*/
});

const source = new VectorSource2({wrapX: false});

const vectorDraw = new VectorLayer2({
  source: source,
});

let draw; // global so we can remove it later
function addInteraction() {
  
  //const value = typeSelect.value;
  //if (value !== 'None') {
    draw = new Draw({
      source: source,
      type: 'Polygon',
      /*style: new Style({
					fill: new Fill({               //填充样式
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new Stroke({           //线样式
						color: '#ffcc33',
						width: 2
					}),
					image: new Circle({            //点样式
						radius: 7, 
						fill: new Fill({
							color: '#2d98da'
						})
					}),
					text: new Text({
						font: '16px Calibri,sans-serif',
						text: "未保存地块",
						fill: new Fill({
						  color: "#c0392b"
						}),
						backgroundFill: new Fill({      // 填充背景
							color: 'rgba(0,0,0,1)',
						}),
					})
        })*/
    });
    
    map.value.map.addInteraction(draw);
    const maptemp=map.value.map;
    const mapValues=map.value.map.values_;
    const mapLyaerGruop=mapValues.layergroup;
    console.log("layers:"+mapLyaerGruop);
    const mapLayers=mapValues.layergroup.values_.layers;
    console.log("layers:"+mapLayers);
    const layersArray=mapLayers.array_;
    console.log("layers:"+mapLayers.array_);
     
  //}
  draw.on('drawend', ()  => {
    console.log('绘制完成');

    const sketchCoords_=draw.sketchCoords_;
    console.log("sketchCoords_:"+sketchCoords_);

    const coordinates = draw.coordinates;
    console.log("coordinates:"+coordinates);

  });

}

function drawPolygon(){
  addInteraction();
}
function cancelDraw(){
  map.value.map.removeInteraction(draw);
  //addInteraction();
}
function removeDrawLayer(){
  const source = vectorDraw.getSource();
  const lastFeature = source.getFeatures().pop(); // 获取最后一个特征
  if (lastFeature) {
    source.removeFeature(lastFeature); // 将其删除
  }

  //draw.abortDrawing();
  //map.value.map.removeLayer(vectorDraw);
}


function getPolygon(){
  //console.log("getPolygon:"+draw);
  //const geojson= {"type":"Polygon","coordinates":draw.sketchCoords_[0]}
  //console.log("geojson:"+geojson);
  storeGeoJSON(draw.sketchCoords_[0]);
}
//console.log("end map:"+map);

onMounted(async () => {
 // const [MapModule, OSMModule] = await loadModules([
 //   'ol/Map',
 //   'ol/source/OSM',

 // ]);
});


function importSubmit (e,filerow,fileList) {
//  const inputEl = fileInput.value!;
 //const file = (event.target as HTMLInputElement).files?.[0];
   const file=filerow.raw;
 if (file && file.type === 'application/zip') {

   const zip =  JSZip.loadAsync(file);
   const zipfiles=zip.files;
   for (const filename of Object.keys(zip.files)) {
     if (filename.endsWith('.shp')) {
       const shpBlob =  zip.file(filename).async('arraybuffer');
       
       const shpReader = new FileReader();
       shpReader.onloadend = async () => {
         const shpSource = new ShpFormat().readFeatures(shpReader.result as ArrayBuffer);
         const vectorSource = new VectorSource({ features: shpSource });

         // 创建矢量图层并添加到地图
         const vectorLayer = new VectorLayer({
           source: vectorSource,
           // 设置样式
         });

         if (map) {
          map.value.map.addLayer(vectorLayer);
         }
       };

       shpReader.readAsArrayBuffer(shpBlob);
       break; // 如果有多个SHP文件，此处决定是否只解析第一个
     }
   }
 } else {
   console.error('请选择类型为ZIP的文件进行上传。');
 }
};

const handleFileUpload = async (event: Event) => {
//  const inputEl = fileInput.value!;
 const file = (event.target as HTMLInputElement).files?.[0];

 if (file && file.type === 'application/zip') {
   const zip = await JSZip.loadAsync(file);
   
   for (const filename of Object.keys(zip.files)) {
     if (filename.endsWith('.shp')) {
       const shpBlob = await zip.file(filename).async('arraybuffer');
       
       const shpReader = new FileReader();
       shpReader.onloadend = async () => {
         const shpSource = new ShpFormat().readFeatures(shpReader.result as ArrayBuffer);
         const vectorSource = new VectorSource({ features: shpSource });

         // 创建矢量图层并添加到地图
         const vectorLayer = new VectorLayer({
           source: vectorSource,
           // 设置样式
         });

         if (map) {
          map.value.map.addLayer(vectorLayer);
         }
       };

       shpReader.readAsArrayBuffer(shpBlob);
       break; // 如果有多个SHP文件，此处决定是否只解析第一个
     }
   }
 } else {
   console.error('请选择类型为ZIP的文件进行上传。');
 }
};

/*const raster = new TileLayer({
  source: new OSM(),
});
*/

/*const currentInstance = ref()
    onMounted(() => {
        currentInstance.value = getCurrentInstance()
        const ctx=getCurrentInstance().ctx;
        console.log("ctx:"+ctx);
        const props=getCurrentInstance().ctx.$props;
        console.log("props:"+props);
        console.log("currentInstance.olmap:"+props);
    });
*/

//http://192.168.0.102:9602/Pollution/storeGeoJSON
function storeGeoJSON(coordinates) {
    console.log("storeGeoJSON:"+coordinates);
    // const geojson= {"type":"Polygon","coordinates":draw.sketchCoords_[0]}
    let pointArray = "";
    let stringsArray = [];
    for(let i = 0; i < coordinates.length; i++) { 
      console.log(coordinates[i]); 
      //pointArray=pointArray+"["+coordinates[i]+"]";
      if(i!=coordinates.length-1)
       stringsArray.push("["+coordinates[i]+"],");
      else
        stringsArray.push("["+coordinates[i]+"]");
      console.log("stringsArray:"+stringsArray);
    }
     pointArray=stringsArray.join('');
    console.log("pointArray:"+pointArray);
    let stringsArray1 = [];
    /*stringsArray1.push(pointArray);
    let stringsArray2 = [stringsArray1];
    console.log("stringsArray2:"+stringsArray2);*/
    //stringsArray1.push("[["+pointArray+"]]");

    Post('/Pollution/storeGeoJSON',{"type":"Polygon","coordinates":"[["+pointArray+"]]"}).then((response) => {
        const { code, msg: res } = response.data;
        if (code === 200) {
           console.log("计算结束");
          ElMessage.success(msg ?? "Submitted!");
           
        } else {
          ElMessage.error(msg);
        }
      });
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
   width: 10%;
   height: 60%;
   position: absolute;
   background: #fff;
   box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
   position: absolute;
   top: 6px;
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
   button{
    margin-top: 2px;
    margin-bottom: 2px;
    margin-left: 0px;
   }
 }
 .map-bottom {
   width: 98%;
   height: 40%;
   position: absolute;
   background: #fff;
   box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
   position: absolute;
   bottom: 0px;
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