<template>
  <!-- 顶部工具栏 ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ -->
  <div class="toptools" style="height: 120px;">
    <el-button type="primary" @click="drawPolygon">
      <el-icon><EditPen /></el-icon>绘制多边形
    </el-button>

    <el-button type="primary" @click="cancelDraw">结束绘制</el-button>

    <el-button type="primary" @click="removeDrawLayer">
      <el-icon><Delete /></el-icon>清除绘制
    </el-button>

    <el-button type="primary" @click="getPolygon">获取多边形数据</el-button>

    <el-upload
      class="shapefile-upload"
      ref="upload"
      action="string"
      :file-list="uploadFiles"
      :auto-upload="true"
      :on-progress="importSubmit"
      multiple="multiple"
      accept=".zip"
    >
      <div class="upfile">
        <el-button
          type="success"
          class="chaxuns fontSizes"><el-icon><Upload /></el-icon>上传文件
        </el-button>
      </div>
    </el-upload>
  </div>
  <!-- 顶部工具栏 ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ -->

  <!-- 页面内容 ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ -->
  <div class="vue-split-container" style="margin-top: 8px;">

    <!-- 分为15%左侧图层列表、65%地图展示+表格、20%分析结果 ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ -->
    <SplitWrapper :sizes="[15, 65, 20]" :minSize="0" class="vue-split horizontal">
      <!-- 15%左侧图层列表 -->
      <SplitItem class="vue-split-item">
        <div class="vue-split-content nested-content-1" id="layerControl">
          <div class="title"><label>图层列表</label></div>
          <ul id="layerTree" class="layerTree"></ul>
        </div>
      </SplitItem>

      <!-- 65%:地图展示70%+表格30% ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ -->
      <SplitItem class="vue-split-item map-container" >
        <SplitWrapper :sizes="[60, 40]" :minSize="0" direction="vertical" class="vue-split vertical map-container">
          <!-- 地图展示70% -->
          <SplitItem class="vue-split-item map-container" >
            <div class="vue-split-content nested-content-2 map-container">
              <!-- this.$refs.map -->
              <ol-map
                ref="map" 
                id="map"
                :loadTilesWhileAnimating="true"
                :loadTilesWhileInteracting="true"
                :style="mapstyle"
                @click="mapclick"
                class="map-border"
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
    
                <!-- 点击按钮来放大或缩小地图的视图 -->
                <ol-zoom-control />
                <!-- 用于显示地图的版权信息 -->
                <ol-attribution-control />

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

                <!-- 图层 -->
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

                  <!-- 排水管线 -->
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

                  <!-- 污染源地块 -->
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
                      <ol-style-fill color="rgba(255,255,0,0.8)"></ol-style-fill>
                      <ol-style-circle :radius="7">
                        <ol-style-fill color="blue"></ol-style-fill>
                      </ol-style-circle>
                    </ol-style>
                  </ol-vector-layer>
                </ol-layer-group>

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
            </div>
          </SplitItem>

          <!-- 表格30% -->
          <SplitItem class="vue-split-item">
            <div class="vue-split-content nested-content-2 table-container">
              <PlantInfoList ref="childRef" :selData="mapClickData.list" :msg="zone_name"/>

              <!-- 表格的开关 -->
              <!-- <div id="e" class="split content" v-show="modelSatus.status">
              <el-button type="primary" v-show="!modelSatus.status" @click="modelSatus.status=true">
                <el-icon><DArrowRight /></el-icon>
              </el-button>

                <div class="map-bottom" v-show="modelSatus.status" style="position: relative;">
                  <el-button type="primary" @click="modelSatus.status=false" style="position: absolute; bottom: 0; left: 0;">
                    <el-icon><DArrowLeft /></el-icon>
                  </el-button>
                </div>
              </div> -->

            </div>
          </SplitItem>
        </SplitWrapper>
      </SplitItem>
      <!-- 65%:地图展示70%+表格30% ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ -->

      <!-- 20%分析结果 -->
      <SplitItem class="vue-split-item">
        <div class="vue-split-content nested-content-1 analysis">
          <RightInfoList ref="rightChildRef" :selData="mapRightData.list"/>
        </div>
      </SplitItem>
    </SplitWrapper>
  </div>
  <!-- 页面内容 ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ -->
</template>


<script setup lang="ts"> 
import 'ol/ol.css';
import { ref, reactive, inject, onMounted  } from "vue";
import { getCurrentInstance } from "vue";
import { ElMessage } from 'element-plus';
import markerIcon from "@/assets/marker.png";
import PlantInfoList from '@/components/plantInfoList.vue';
import RightInfoList from '@/components/rightInfoList.vue';
import { Feature, Map, View }from 'ol';
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
import * as shp from 'shpjs';
//import DBF from 'dbffile';
import Draw from 'ol/interaction/Draw.js';
import {  OSM, Vector as VectorSource2} from 'ol/source.js';
import { Tile as TileLayer2, Vector as VectorLayer2 } from 'ol/layer.js';
import { Get, Post,Put ,PostFile} from "../axios/api"; 
import { DArrowRight, DArrowLeft, Download, Upload, Delete, EditPen, Refresh, DataAnalysis } from '@element-plus/icons-vue';
import { open } from 'shapefile'
// const Split = require('split.js');
import Split from 'split.js';
import { SplitWrapper, SplitItem } from 'vue3-split';
import DbfABC from 'dbf-js';
import iconv from 'iconv-lite'
//import {DBFFile} from 'dbffile';



const config = reactive({
  max: 3,
})
const {proxy} = getCurrentInstance()
console.log(proxy.$baseUrl)
//console.log(proxy.$getFullUrl('/geoserver/zzmserver/wms')) 
//const wmsUrl=proxy.$getFullUrl('/geoserver/zzmserver/wms')

//const screenWidth = ref(window.innerWidth);
//const screenHeight = ref(window.innerHeight);
const screenWidth = ref(document.documentElement.clientWidth);//实时屏幕宽度
const screenHeight = ref(document.documentElement.clientHeight);//实时屏幕高度


const mapstyle=ref("width: "+(screenWidth.value-204)+"px;height: "+(screenHeight.value-350)+"px")

// console.log(mapstyle.value)

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
const mapRightData = reactive({
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

const zone_name=ref("");
const childRef = ref(null);

function featureClicked(event) {
  console.log("featureClicked");
  console.log(event);
  console.log(event.target.value)
}

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
const uploadFiles = ref([]);
const map = ref(null);
onMounted(() => {
  map.value.map.addLayer(vectorDraw);
  const mapvalue = map.value;
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
    console.log("lastFeature:"+lastFeature);
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

function doDownload (data, name) {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', name)

        document.body.appendChild(link)
        link.click()
      }
 
//import { readFileSync } from 'fs'
//import fs from "fs"

function importSubmit (e,filerow,fileList) {
 //const inputEl = fileInput.value!;
 //const file = (event.target as HTMLInputElement).files?.[0];
  const file=filerow.raw;
   uploadZip(file);
   
   //return;
  if (file && (file.type === 'application/zip'|| file.type === 'application/x-zip-compressed')){
          // 读取zip压缩文件里面的文件内容
          JSZip.loadAsync(file).then((zip) => {
                // for (let key in zip.files) {
                  // 压缩包里的内容file.files
          const fileList = Object.keys(zip.files)
          const pattern = new RegExp(/\S\.shp$/)
          let shpFile = fileList.find(i => pattern.test(i))
       
          console.log("that.shpFile:"+ shpFile)
                  
                  // const filename = zip.files[key].name; 
                  const filename = shpFile;
                  if (filename.endsWith('.shp')) {
                  let prj=filename.split('.')[0]+".prj";
                  let prjBlob =  zip.file(prj).async('string');
                  prjBlob.then(function(data) {
                      console.log(data);
                      if(data.includes("WGS_1984_Web_Mercator")){
                        ElMessage.success("此文件是3857编码格式文件");
                      } else {
                        ElMessage.error("此文件不是3857编码格式文件");
                        return;
                      }
                  });

                  let dbfFileName = filename.split('.')[0]+".dbf";
                  // let dbfBlob =  zip.file(dbfFileName).async('arraybuffer');
                  
                  if (dbfFileName) {
                              zip.files[dbfFileName].async("blob").then((blob) => {
                                  // 读取文件内容
                                  const reader = new FileReader();
                                  reader.readAsArrayBuffer(blob);
                                  reader.onload = (e) => {
                                      // 获取文件内容
                                      const data = new Uint8Array(e.target.result);
                                      console.log("Uint8Array:"+data);
                                      // const dbf=new DbfABC(data);
                                      // const records=dbf.records;
                                      //let buffer = readFileSync(dbfFileName);
                                      /*DbfABC.parse(dbfFileName, (err, dbf) => {
                                        if (err) {
                                          console.log(err);
                                        } else {
                                          console.log(dbf);
                                          // console.log(dbf.records);
                                        }
                                      });*/
                                      // const Accessor = require('../dist');

                                      // let {header, data2} = Accessor.read('./table-foxpro.dbf');

                                      // console.log(header);
                                      // console.log(data2);

                                      // console.log('----');

                                      // header = Accessor.header('./table-dbase4.dbf');

                                      // console.log(header);
                                     
                                      // readDbf(e.target.result);
                                      //readDbf(data);
                                    // 创建一个shapefile对象
                                }
                            })
                        } 

                  // dbfBlob.then(res => {
                  //     console.log("res:"+res);
                  //     // const resBlob=new Blob([res]);
                  //     const resBlob = { hello: "world" };
                  //     const blob = new Blob([JSON.stringify(obj, null, 2)], {
                  //       type: "application/json",
                  //     });
                  //     // readDbf(resBlob);
                  //     const dbfReader = new FileReader();
                       
                  //     dbfReader.readAsArrayBuffer(resBlob);
                  //     dbfReader.onload = function(event) {
                  //       // event.target相当于reader
                  //       console.log(event.target.result);
                  //       readDbf(event.target.result);
                  //     }
                  // });
                
                  //  let dbf = DBFFile.open(dbfFileName);
                  // console.log("bdf:"+dbf);
                 /*const dbf=new Dbf(dbfFileName);
                  const records=dbf.records;
                  const fields=dbf.fields;
                  const data=[];
                  for(let i=0;i<records.length;i++){
                      let record=records[i];
                      let obj={};
                      for(let j=0;j<fields.length;j++){
                          let field=fields[j];
                          obj[field.name]=record[j];
                      }
                      data.push(obj);
                  }
                  console.log(fields);
                  console.log(data);
*/

/*
获取 .dbf 文件内容： 你提供的代码片段展示了如何从一个 ZIP 文件中提取名为 dbfFileName 的 .dbf 文件内容。这里使用了某种 ZIP 解压缩库（未指定具体库名称），通过 zip.file() 方法获取文件对象，然后调用其 async('arraybuffer') 方法异步获取文件内容为 ArrayBuffer 类型。这一步骤确保了 .dbf 文件以二进制形式存储在内存中，为后续解析做好准备。

解析 .dbf 文件： 要从 ArrayBuffer 中读取并解析 .dbf 文件数据，你需要使用专门支持 DBF 文件格式解析的库。常见的库有：

dbf（npm 包名：@felixge/node-dbf）
dbf-file（npm 包名：dbf-file）
simple-dbf-reader（npm 包名：simple-dbf-reader）

npm install dbf-file
import { read } from 'dbf-file';

   // ... 在获取到 dbfBlob 后
   dbfBlob.then((arrayBuffer) => {
     read(arrayBuffer)
       .then((data) => {
         // data 是解析后的 DBF 数据，可以在此处进行进一步处理或传递给 Vue 组件状态
         console.log(data);
       })
       .catch((error) => {
         console.error('Error parsing DBF file:', error);
       });
   });
    <!-- 显示数据行，假设 data.records 存储了记录数组 -->
           <tr v-for="record in data.records" :key="record.id">
             <td v-for="value in record.values" :key="value.fieldName">{{ value }}</td>
           </tr>
*/
                    let shpBlob =  zip.file(filename).async('arraybuffer');
                    shpBlob.then(res => {
                      //console.log(res);
                      const resBlob=new Blob([res]);
                      const shpReader = new FileReader();
                       
                      shpReader.readAsArrayBuffer(resBlob);
                      shpReader.onload = function(e){
                        let geometryArray = [];
                        let featuresArray = [];
                        const id=ref(0);
                        open(this.result).then(source => source.read()
                                .then(function log(result) {
                                    if (result.done) {
                                      if(geometryArray.length>0){
                                        showFeaturesMap(featuresArray);
                                        uploadShpGeoJSON(geometryArray);
                                      }
                                      return;
                                    }
                                    if(result.value.id){
                                      console.log("have id:"+result.value.id);
                                    }else{
                                      id.value++;
                                      result.value.id=id.value;
                                      console.log("no id:"+id.value);
                                    }

                                    //console.log(result.value);
                                    console.log(result.value.geometry);
                                    geometryArray.push(result.value.geometry);
                                    const geometry=new Polygon(result.value.geometry.coordinates);
                                    const feature=new Feature(geometry); 
                                    // const feature=new Feature(result.value.geometry); 
                                    featuresArray.push(feature);
                                    return source.read().then(log);
                                }))
                            .catch(error => console.error(error.stack));
                    }

                  })
                  }

                // }end for zip files
              })
            

  } else {
    console.error('请选择类型为ZIP的文件进行上传。');
  }
};




const rightChildRef = ref(null);
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
      stringsArray.push(""+coordinates[i]+",");
    else
      stringsArray.push(""+coordinates[i]+"");
    console.log("stringsArray:"+stringsArray);
  }
  pointArray=stringsArray.join('');
  console.log("pointArray:"+pointArray);
  let stringsArray1 = [];


  Post('/Pollution/storeGeoJSON',{"type":"Polygon","coordinates":pointArray}).then((response) => {
    console.log("response.data:"+response.data);
    const { code, msg,data: res } = response.data;
    if (code === 200) {
      console.log("计算结束:"+res);
      mapRightData.list=res;
      rightChildRef.value.childSelMethod(mapRightData.list);
      ElMessage.success(msg ?? "Submitted!");
        
    } else {
      //ElMessage.error(msg);
      ElMessage.error("提交失败");
    }
  });
}

function showFeaturesMap(features) {
  const vectorSource = new VectorSource({ features: features});
  // vectorSource.addFeatures(features);
         // 创建矢量图层并添加到地图
          const vectorLayer = new VectorLayer({
            source: vectorSource,
            // 设置样式
          });

          if (map) {
            map.value.map.addLayer(vectorLayer);
          }
       
}

function uploadShpGeoJSON(geometryArray) {
   let shpArray=geometryArray.join('');
  //let shpArray=getGeometryJson(geometryArray);
  console.log("shpArray:"+shpArray);
Post('/Pollution/acceptShp',geometryArray).then((response) => {
    console.log("response.data:"+response.data);
    const { code, msg,data: res } = response.data;
    if (code === 200) {
      console.log("上传结束:"+res);
      mapRightData.list=res;
      rightChildRef.value.childSelMethod(mapRightData.list);
      ElMessage.success(msg ?? "Submitted!");
        
    } else {
      //ElMessage.error(msg);
      ElMessage.error("提交失败");
    }
  });
}

function getGeometryJson(geometryArray) {
  let polygonStr = "";
  let polygonArray = [];
  for(let i = 0; i < geometryArray.length; i++) { 
    console.log(geometryArray[i]);
    polygonArray.push('{"type":"Polygon","coordinates":'+getPointStr(geometryArray[i].coordinates)+'}');
  }
  polygonStr=polygonArray.join('');
  //console.log("polygonStr:"+polygonStr);
  return polygonStr;
}
//解析一个coordinates为字符串 {type: 'Polygon', coordinates: Array(1)}
function getPointStr(coordinates){
  let pointArray = "";
  let stringsArray = [];
  for(let i = 0; i < coordinates.length; i++) { 
    //console.log(coordinates[i]); 
    //pointArray=pointArray+"["+coordinates[i]+"]";
    if(i!=coordinates.length-1)
      stringsArray.push(""+coordinates[i]+",");
    else
      stringsArray.push(""+coordinates[i]+"");
    //console.log("stringsArray:"+stringsArray);
  }
  pointArray=stringsArray.join('');
  //console.log("pointArray:"+pointArray);
  return pointArray;
}

function readDbf(dbffile){
  console.log("readDbf dbffile:"+dbffile);
  Post('/Pollution/readDbf',{"file":dbffile}).then((response) => {
    console.log("readDbf response.data:"+response.data);
    const { code, msg,data: res } = response.data;
    if (code === 200) {
      console.log("success:"+msg+"readDbf 结束:"+res);
      
      ElMessage.success(msg ?? "Submitted!");
        
    } else {
      console.log("fail:"+msg);
      //ElMessage.error(msg);
      ElMessage.error("readDbf 失败");
    }
  });
}

function uploadZip(zipFile){
  console.log("zipFile dbffile:"+zipFile);
  const formData=new FormData();
  formData.append("file",zipFile);
  PostFile('/Pollution2/upload-shapefile',formData).then((response) => {
    console.log("zipFile response.data:"+response.data);
    const { code, msg,data: res } = response.data;
    if (code === 200) {
      console.log("success:"+msg+"zipFile 结束:"+res);
      ElMessage.success(msg ?? "Submitted!"); 
    } else {
      console.log("fail:"+msg);
      //ElMessage.error(msg);
      ElMessage.error("zipFile 失败");
    }
  });
}
</script>


<style scoped lang="scss">
#map {
  width: 100%;
  height: 100%;
}

.map-container {
  position: relative; /* 或者其它需要的定位方式 */
  width: 100%; /* 保证宽度填满父容器 */
  height: 100px; /* 或者其它适应性高度，如vh单位、Flexbox的flex-grow等 */
}

// .table-container {
//   position: relative; /* 或者其它需要的定位方式 */
//   width: 100%; /* 保证宽度填满父容器 */
//   height: 100px; /* 或者其它适应性高度，如vh单位、Flexbox的flex-grow等 */
// }

.vue-split-container {
  height: 100%;
  // border: 4px dashed rgba(229, 231, 235, 0.4);
  // border-radius: 0.5rem;
}

.vue-split {
  height: 100%;
}

.vue-split.horizontal {
  display: flex;
  flex-direction: row;
}

.vue-split.horizontal .vue-split-content {
  height: 100%;
}

.gutter {
  background-color: #ffffff;
  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-horizontal {
  // background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
  cursor: col-resize;
}

.gutter.gutter-vertical {
  // background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  cursor: row-resize;
}

.vue-split-item {
  height: 100%;
  overflow: hidden;
}

.vue-split-content {
  padding: 8px;
  height: 100%;
  // display: flex;
  align-items: center;
  // justify-content: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.nested-content-1,
.nested-content-2,
.toptools {
  // height:100%;
  background: rgba(247,248,248, .9);
  border: 1px solid rgb(4,124,195);
}

// .nested-content-2 {
//   background: rgba(247,248,248, .9);
//   border-color: rgb(156,220,252);
// }

// .toptools {
//   background: rgba(247,248,248, .9);
//   border-color: rgb(156,220,252);
// }
// .map-border {
//   // width: 100%;
//   // height: 100%;
//   border: 1px solid #333; /* 根据需要调整边框宽度、颜色和样式 */
//   border-radius: 4px; /* 可选：添加圆角以实现边框圆角化 */
// }
</style>