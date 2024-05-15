<template>
  <div>
    <TopCom class="zoomStyle" />
  </div>
  <!-- 顶部工具栏 ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ -->
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="编辑" name="first">

    <el-button type="primary" text='primary' @click="drawPolygon" class="AllButton">
      <el-icon><Edit /></el-icon>绘制多边形
    </el-button>
    <el-button type="primary" text='primary' @click="cancelDraw" class="AllButton">
      <el-icon><SwitchButton /></el-icon>结束绘制
    </el-button>
    <el-button type="primary" text='primary' @click="removeDrawLayer" class="AllButton">
      <el-icon><Delete /></el-icon>清除绘制
    </el-button>
    <el-button type="primary" text='primary' @click="getPolygon" class="AllButton">
      <el-icon><Connection /></el-icon>获取多边形数据
    </el-button>
  </el-tab-pane>

  <el-tab-pane label="共享" name="second">

    <el-button type="primary" text='primary' @click="exportMapAsImage" class="AllButton">
      <el-icon><TopRight /></el-icon>地图导出
    </el-button>
    
    <el-button type="primary" text='primary' @click="toggleFullScreen" class="AllButton">
      <el-icon><TopRight /></el-icon>切换全屏
    </el-button>
    <el-button type="primary" text='primary' @click="reloadPage" class="AllButton">
      <el-icon><TopRight /></el-icon>刷新
    </el-button>
   
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
      <div>
        <el-button
          type="primary" text='primary'
          slot='trigger'
          class="chaxuns fontSizes AllButton">
          <el-icon><Upload /></el-icon>
          上传文件
        </el-button>
      </div>
    </el-upload>

    <el-upload
        class="shapefile-upload"
        ref="upload"
        action="string"
        :file-list="uploadFiles"
        :auto-upload="true"
        :on-progress="importSubmitXLSX"
        multiple="multiple"
        accept=".xlsx,.zip"
      >
        <div>
          <el-button
            type="primary" text='primary'
            slot='trigger'
            class="chaxuns fontSizes AllButton">
            <el-icon><Upload /></el-icon>
            上传EXCEL
          </el-button>
        </div>
      </el-upload>

  </el-tab-pane>
  </el-tabs>
  <!-- 顶部工具栏 ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ -->

  <!-- 页面内容 ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ -->
  <div class="vue-split-container" style="margin-top: 8px;">

    <!-- 分为15%左侧图层列表、65%地图展示+表格、20%分析结果 ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ -->
    <SplitWrapper :sizes="[10, 65, 25]" :minSize="0" class="vue-split horizontal">
      <!-- 15%左侧图层列表 -->
      <SplitItem class="vue-split-item">
        <div class="vue-split-content nested-content-1" id="layerControl">
          <div class="title layersItem">
            图层列表
          </div>
          <el-divider />
          <ul id="layerTree" class="layerTree"></ul>
        </div>
      </SplitItem>

      <!-- 65%:地图展示70%+表格30% ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ -->
      <SplitItem class="vue-split-item map-container" >
        <SplitWrapper :sizes="[60, 40]" :minSize="0" direction="vertical" class="vue-split vertical map-container">
          <!-- 地图展示70% -->
          <SplitItem class="vue-split-item map-container" >
            <div class="vue-split-content nested-content-2 map-container">
              <!-- map ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ -->
              <div id="popup" class="ol-popup">
                <div id="popup-closer" class="ol-popup-closer">X</div>
                <div id="popup-detail" class="ol-popup-detail">查看详情</div>
                <div id="popup-content" class="popup-content">
                </div>
              </div>
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
                  <ol-tile-layer title="BaseMap">
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

                  <!--河流wfs-->
                  <!-- <ol-vector-layer title="河流">
                    <ol-source-vector
                      ref="cities"
                      :url="proxy.$getFullUrl('/geoserver/zzmserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zzmserver%3ARiver&maxFeatures=50&outputFormat=application%2Fjson')"
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
                  </ol-vector-layer> -->


                  <ol-tile-layer title="河流">
                    <ol-source-tile-wms
                      :url="proxy.$getFullUrl('/geoserver/zzmserver/wms')"
                      layers="zzmserver:river"
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




                  <!-- 边界 -->
                  <ol-tile-layer title="边界">
                    <ol-source-tile-wms
                      :url="proxy.$getFullUrl('/geoserver/zzmserver/wms')"
                      layers="zzmserver:RiverBoundary"
                      serverType="geoserver"
                      :transition="0"
                      :params="{
                      SERVICE: 'WMS',
                      VERSION: '1.1.0',
                      REQUEST: 'GetMap',
                      FORMAT: 'image/png',
                      TRANSPARENT: true,
                      tiled: true,
                      STYLES: '',
                      exceptions: 'application/vnd.ogc.se_inimage',
                      CRS: 'EPSG:3857',
                      WIDTH: 768,
                      HEIGHT: 371,
                      BBOX: '726703.59375,2524902.890625,727783.59375,2525573.671875'
                      }"
                    />
                  </ol-tile-layer>

                  <!-- 排口 -->
                  <ol-tile-layer title="排口">
                    <ol-source-tile-wms
                      :url="proxy.$getFullUrl('/geoserver/zzmserver/wms')"
                      layers="zzmserver:River_outlet"
                      serverType="geoserver"
                      :transition="0"
                      :params="{
                      SERVICE: 'WMS',
                      VERSION: '1.1.0',
                      REQUEST: 'GetMap',
                      FORMAT: 'image/png',
                      TRANSPARENT: true,
                      tiled: true,
                      STYLES: '',
                      exceptions: 'application/vnd.ogc.se_inimage',
                      CRS: 'EPSG:3857',
                      WIDTH: 768,
                      HEIGHT: 374,
                      BBOX: '726703.59375,2524902.890625,727783.59375,2525573.671875'
                      }"
                    />
                  </ol-tile-layer>

                  <!-- 底泥监测 -->
                  <ol-tile-layer title="底泥监测">
                    <ol-source-tile-wms
                      :url="proxy.$getFullUrl('/geoserver/zzmserver/wms')"
                      layers="zzmserver:Sediment_Monitoring"
                      serverType="geoserver"
                      :transition="0"
                      :params="{
                      SERVICE: 'WMS',
                      VERSION: '1.1.0',
                      REQUEST: 'GetMap',
                      FORMAT: 'image/png',
                      TRANSPARENT: true,
                      tiled: true,
                      STYLES: '',
                      exceptions: 'application/vnd.ogc.se_inimage',
                      CRS: 'EPSG:3857',
                      WIDTH: 768,
                      HEIGHT: 374,
                      BBOX: '726703.59375,2524902.890625,727783.59375,2525573.671875'
                      }"
                    />
                  </ol-tile-layer>                  

                  <!-- 排水管线 -->
                  <ol-tile-layer title="排水管线">
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
                  <ol-vector-layer title="污染源地块">
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
              <!-- map ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ -->


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

            <!-- <ag-grid-vue
              :rowData="rowData"
              :columnDefs="colDefs"
              style="height: 500px"
              class="ag-theme-quartz"
            >
            </ag-grid-vue> -->
            
          </SplitItem>
          

        <!-- Echarts -->
        <div class="chart-container" ref="chartRef" style="height: 400px; width: 100%"></div>
        <!-- Echarts -->


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
import * as XLSX from 'xlsx';
import TopCom from "@/components/TopCom.vue";
import {Circle as CircleStyle, } from 'ol/style.js';
import 'ol/ol.css';
import { defaults as defaultControls, FullScreen } from "ol/control";
import { ref, reactive, inject, onMounted  } from "vue";
import { getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus';
import markerIcon from "@/assets/marker.png";
import PlantInfoList from '@/components/plantInfoList.vue';
import RightInfoList from '@/components/rightInfoList.vue';
import { Feature, Map, View, Overlay }from 'ol';
import { GeoJSON } from "ol/format";
import { Polygon, MultiPolygon } from 'ol/geom';
import { XYZ } from "ol/source";
import { Fill } from "ol/style";
import { Stroke } from "ol/style";
import { Style } from "ol/style";
import { Circle } from "ol/geom";
import { Text } from "ol/style";
import { Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import JSZip from 'jszip';
import { createApp } from "vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";
import * as shp from 'shpjs';
import Draw from 'ol/interaction/Draw.js';
import { OSM, Vector as VectorSource2} from 'ol/source.js';
import { Tile as TileLayer2, Vector as VectorLayer2 } from 'ol/layer.js';
import { Get, Post,Put ,PostFile} from "../axios/api"; 
import {Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { 
  DArrowRight,
  Connection,
  DArrowLeft, 
  Download, 
  Upload, 
  Delete, 
  EditPen, 
  Refresh, 
  DataAnalysis,
  Search,
  SwitchButton,
  Edit,TopRight,
  } from '@element-plus/icons-vue';
import { open } from 'shapefile'
import Split from 'split.js';
import { SplitWrapper, SplitItem } from 'vue3-split';
import DbfABC from 'dbf-js';
import iconv from 'iconv-lite'
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import LayerSwitcher from 'ol-layerswitcher';
import { onUnmounted } from 'vue'
import * as echarts from 'echarts';


const layerSwitcher = new LayerSwitcher();
const {proxy} = getCurrentInstance()
console.log(proxy.$baseUrl)
const screenWidth = ref(document.documentElement.clientWidth);//实时屏幕宽度
const screenHeight = ref(document.documentElement.clientHeight);//实时屏幕高度
const mapstyle=ref("width: "+(screenWidth.value-204)+"px;height: "+(screenHeight.value-350)+"px")
const selectedCityName = ref("");
const selectedCityPosition = ref([]);
const drawEnable = ref(false);
const format = inject("ol-format");
const geoJson = new format.GeoJSON();
const selectConditions = inject("ol-selectconditions");
const selectCondition = selectConditions.pointerMove;
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
const projection = ref("EPSG:3857");
const zoom = ref(12);
const rotation = ref(0);
//const size = ref([1024, 968]);
//const center = ref([size.value[0] / 2, size.value[1] / 2]);
const center =ref([12605523,2613832]);
//const size = ref([12605523*2, 2613832*2]);
//const extent = ref([0, 0, ...size.value]);
const extent = inject("ol-extent");
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

const uploadFiles = ref([]);
const map = ref(null);
onMounted(() => {
  map.value.map.addLayer(vectorDraw);
  // const mapvalue = map.value;
  map.value.map.addControl(new FullScreen());
  /*console.log("onMounted map value:"+map.value); // 在组件挂载后也可以访问
  console.log("mapvalue map:"+mapvalue.map); 
  console.log("onMounted map:"+map.map); 
  console.log("onMounted map:"+map.id); 
  console.log("layers:"+mapvalue.layers);*/
  showTreeLayers();

  console.log("onMounted end"); 
  setTimeout(function() {
    console.log('这段代码将在1秒后执行。');
    var allElements = document.getElementsByTagName('div');
    // var elements = [];
    for(var i = 0; i < allElements.length; i++) {
      if (allElements[i].classList.contains('gutter')) {
        // 添加到结果数组中
        // elements.push(allElements[i]);
        allElements[i].setAttribute("style", "background-color: #ebebeb; font-size: 12px;width: 10px;");
        console.log("onMounted end"+i+" - "+allElements[i]); 
      }
    }
  }, 1000);

  addPopup(); //弹窗
});


// 河流断面json ↓ ↓ ↓ ↓ ↓ ↓ 
const image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({color: 'red', width: 1}),
});
const styles = {
  'Point': new Style({
    image: image,
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  'MultiPoint': new Style({
    image: image,
  }),
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)',
    }),
  }),
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
  'GeometryCollection': new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2,
    }),
    fill: new Fill({
      color: 'magenta',
    }),
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: 'magenta',
      }),
    }),
  }),
  'Circle': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)',
    }),
  }),
};

const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

const vectorLayer = new VectorLayer({
  source: new VectorSource({
      format: new GeoJSON(),
      url: '../assets/1.geojson' 
    }),
    style: styleFunction,
})
onMounted(() => {
map.value.map.addLayer(vectorLayer)
})

// 河流断面json ↑ ↑ ↑ ↑ ↑ ↑ 


// 自由绘制 ↓ ↓ ↓ ↓ ↓ ↓
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

// 自由绘制 ↑ ↑ ↑ ↑ ↑ ↑ 

// 图层控制 ↓ ↓ ↓ ↓ ↓ ↓ 
function showTreeLayers(){
  // 图层控制
  var layersContent = document.getElementById('layerTree');    
  var layers = map.value.map.getLayers();    //获取地图中所有图层
  var layer = [];                   //map中的图层数组
  var layerName = [];               //图层名称数组
  var layerVisibility = [];         //图层可见属性数组
  for (var i = 0; i < layers.getLength()-2 ; i++) {
      layer[i] = layers.item(i);
      layerName[i] = layer[i].get('title');
      layerVisibility[i] = layer[i].getVisible();

      let eleLi = document.createElement('li');           //新增li元素，用来承载图层项
      eleLi.setAttribute('style', 'font-size: 12px; margin-top: 4px;');
      var eleInput = document.createElement('input');     //创建复选框元素，用来控制图层开启关闭
      eleInput.setAttribute('style', 'font-size: 12px; margin-right: 8px;');
      eleInput.type = "checkbox";
      eleInput.name = "layers"; 
      eleLi.appendChild(eleInput);                        //将复选框添加到li元素中

      // layersContent.appendChild(eleLi);                   //将li元素作为子节点放入到图层目录中
      layersContent.insertBefore(eleLi,layersContent.childNodes[1]); //将li元素作为子节点放入到图层目录中（按图层加载倒序0,顺序1）
      var eleLable = document.createElement('label');     //创建label元素
      // eleLable.className = "layer";
      // eleLable.htmlFor = "layer";
      setInnerText(eleLable, layerName[i]);                //在label中设置图层名称
      eleLi.appendChild(eleLable);                         //将label加入到li中


      // 设置复选框状态与图层实际状态一致，但默认都设为不显示
      eleInput.checked = false;
      layer[i].setVisible(false); // 确保图层默认是不可见的

      // if (layerVisibility[i]) {                            //设置图层默认显示状态
      //     eleInput.checked = true;
      // }

      addChangeEvent(eleInput, layer[i]);              //为checkbox添加变更事件
  };
}

function setInnerText(element, text) {
    if (typeof element.textContent == "string") {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}
    
    /*
  * 为checkbox元素绑定变更事件
  */
function addChangeEvent(element, layer) {
    element.onclick = function () {
        if (element.checked) {
            //显示图层
            layer.setVisible(true);
        }
        else {
            //不显示图层
            layer.setVisible(false);
        }
    };
}


// 图层控制 ↑ ↑ ↑ ↑ ↑ ↑ 


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

// 上传zip ↓ ↓ ↓ ↓ ↓ ↓ 
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
                        ElMessage({
                          showClose: true,
                          message: '坐标系正确!',
                          type: 'success',
                          duration:1000,
                        });

                      } else {
                        ElMessageBox.alert('该文件投影坐标系错误!请重新上传3857坐标文件', '错误', {
                        // if you want to disable its autofocus
                        // autofocus: false,
                        confirmButtonText: 'OK',
                        callback: (action: Action) => {
                          ElMessage({
                            type: 'info',
                            message: `action: ${action}`,
                          })
                        },
                      })
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

                                }
                            })
                        } 

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

// function getGeometryJson(geometryArray) {
//   let polygonStr = "";
//   let polygonArray = [];
//   for(let i = 0; i < geometryArray.length; i++) { 
//     console.log(geometryArray[i]);
//     polygonArray.push('{"type":"Polygon","coordinates":'+getPointStr(geometryArray[i].coordinates)+'}');
//   }
//   polygonStr=polygonArray.join('');
//   //console.log("polygonStr:"+polygonStr);
//   return polygonStr;
// }
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

// function readDbf(dbffile){
//   console.log("readDbf dbffile:"+dbffile);
//   Post('/Pollution/readDbf',{"file":dbffile}).then((response) => {
//     console.log("readDbf response.data:"+response.data);
//     const { code, msg,data: res } = response.data;
//     if (code === 200) {
//       console.log("success:"+msg+"readDbf 结束:"+res);
      
//       ElMessage.success(msg ?? "Submitted!");
        
//     } else {
//       console.log("fail:"+msg);
//       //ElMessage.error(msg);
//       ElMessage.error("readDbf 失败");
//     }
//   });
// }

function uploadZip(zipFile){
  console.log("zipFile dbffile:"+zipFile);
  const formData=new FormData();
  formData.append("file",zipFile);
  PostFile('/Pollution/upload-shapefile',formData).then((response) => {
    console.log("zipFile response.data:"+response.data);
    const { code, msg,data: res } = response.data;
    if (code === 200) {
      console.log("success:"+msg+"zipFile 结束:"+res);
      // rightChildRef.value.fenquSelMethod(res.geojson.list);
      rightChildRef.value.fenquMapMethod(res.fenquMap.fenquList);
      ElMessage.success(msg ?? "Submitted!"); 
    } else {
      console.log("fail:"+msg);
      //ElMessage.error(msg);
      ElMessage.error("zipFile 失败");
    }
  });
}

// 导出地图为PNG图片
function exportMapAsImage() {
  const mapCanvas = document.createElement('canvas');
  // var canvas =   map.value.map.getCanvas();
  var canvas =   mapCanvas;
  var dataURL = canvas.toDataURL('image/png');
  const ctx = canvas.getContext('2d');
 
 // 绘制一些图形
 ctx.fillStyle = 'red';
 ctx.fillRect(0, 0, 100, 100);
 
  // 创建一个a元素用于下载
  var a = document.createElement('a');
  a.href = dataURL;
  a.download = 'map.png';
  a.click();
}

function reloadPage() {
    window.location.reload();
  }
  
function toggleFullScreen() {
      if (!document.fullscreenElement) {
        enterFullScreen();
      } else {
        exitFullScreen();
      }
    }
    function enterFullScreen() {
      let element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      }
    }
    function exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    }
  
    let overlay=ref(null);
/**
     * Popup 弹窗
     */
     const addPopup = () => {
      // 使用变量存储弹窗所需的 DOM 对象
      var container = document.getElementById("popup");
      var closer = document.getElementById("popup-closer");
      var content = document.getElementById("popup-content");
      var detail = document.getElementById("popup-detail");
      // 创建一个弹窗 Overlay 对象
       overlay = new Overlay({
        element: container, //绑定 Overlay 对象和 DOM 对象的
        autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          duration: 250, //自动平移效果的动画时间 9毫秒
        },
      });
      // 将弹窗添加到 map 地图中
      map.value.map.addOverlay(overlay);
      /**
       * 添加单击响应函数来处理弹窗动作
       */
       map.value.map.on("click", function (evt) {
        var feature = map.value.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
        if (feature) {
          let value = feature.get("区域");
         // console.log("feature 区域 value :"+value);
            content.innerHTML = `
            区域:${value}
               `;
            overlay.setPosition(evt.coordinate); //把 overlay 显示到指定的 x,y坐标
           
        } else {
          overlay.setPosition(undefined);
        }
      });
      /**
       * 为弹窗添加一个响应关闭的函数
       */
      closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };
      detail.onclick = function () {
        modelSatus.status = true;
        overlay.setPosition(undefined);
      };
    };

    function importSubmitXLSX(e,filerow,fileList) {
    
    const file=filerow.raw;
    uploadXLSX(file);
  }; 

  function uploadXLSX(xlsxFile){
    // console.log("xlsxFile dbffile:"+xlsxFile);
    const formData=new FormData();
    formData.append("file",xlsxFile);
    
    //http://localhost:9300/upload
    PostFile('/River/upload',formData).then((response) => {
      // console.log("xlsxFile response.data: "+response.data);
      const { code, msg, data:res } = response.data;
      const { data: { array } } = response.data;
      const surfaceData = array[0].river.surface;
      console.log("surfaceData: "+surfaceData);
      

      if (code === 200) {
        console.log("success:"+msg+"xlsxFile 结束:"+res);

        //     const seriesDataX = {
        //   name:  [],
        //   data: [],
        // };
        //     const seriesDataY = {
        //   name: [],
        //   data: [],
        // };






const seriesArrayDZ = [];
surfaceData.forEach((innerArray, seriesIndex) => {
  const dataPairs = innerArray.map(item => [parseFloat(item.d).toFixed(2), item.z]);

  // seriesDataX.name.push(`Series ${seriesIndex + 1}`);
  // seriesDataX.data.push(dataPairs.map(pair => pair[0]));

  // seriesDataY.name.push(`Series ${seriesIndex + 1}`);
  // seriesDataY.data.push(dataPairs.map(pair => pair[1]));

  seriesArrayDZ.push({
    type: 'line',
    // name: `Series ${i + 1}`,
    // stack: 'Total', // 如果需要堆叠效果，否则可以删除或替换为其他属性
    // data: seriesDataY.data[i].map((yValue, index) => [seriesDataX.data[i][index], yValue])
    data: dataPairs,
    // areaStyle: {
    //     color: '#ff0',
    //     opacity: 0.5
    //   }
  });
});

// const seriesArray = [];
// for (let i = 0; i < seriesDataY.data.length; i++) {
//   seriesArray.push({
//     type: 'line',
//     // name: `Series ${i + 1}`,
//     stack: 'Total', // 如果需要堆叠效果，否则可以删除或替换为其他属性
//     // data: seriesDataY.data[i].map((yValue, index) => [seriesDataX.data[i][index], yValue])
//     data: seriesDataY.data[i]
//   });
// }


let options = {
    xAxis: {
    type: 'value',
    // boundaryGap: false,
    // data: ["1","2","3","4","5","6","7"]
  //  data:seriesDataX.data[0]
  //  data:uniqueDValues
  //  data:xAxisData
  },

    yAxis: {
      type: 'value'
    },
    
    
    series: seriesArrayDZ,
    // series: [],
    // [
    //   {
    //   type: 'line',
    //   stack: 'Total',
    //   data:seriesDataY.data[0]
    //   // data: [120, 200, 150],
    //   }
    // ],

    tooltip: {
    trigger: 'item', // 触发类型为item，表示在圆点上触发显示
    // formatter: '{b}: {c}', // 显示的格式，{b}表示类目值，{c}表示数值
  },

  // 缩放
  dataZoom: [
    {
      type: 'inside', // 内置缩放组件
      start: 0, // 默认缩放起始位置
      end: 100, // 默认缩放结束位置
    },
    {
      type: 'slider', // 滑动条缩放组件
      start: 0, // 默认缩放起始位置
      end: 100, // 默认缩放结束位置
    },
  ],
  }


  // 根据映射后的数据创建折线
// for (let i = 0; i < seriesDataY.data.length; i++) {
//   options.series.push({
//     type: 'line',
//     name: `Series ${i + 1}`,
//     stack: 'Total',
//     data: seriesDataY.data[i].map((yValue, index) => [
//       xAxisData[index],
//       yValue
//     ])
//   });
// }

          // 设置图表配置项
        chartInstance.setOption(options)
  
    }
  });
}


function upExcelArray(excelDataArray){
  Post('/Pollution/importData',{"type":"Polygon","test":excelDataArray}).then((response) => {
    console.log("response.data:"+response.data);
    const { code, msg,data: res } = response.data;
    if (code === 200) {
      console.log("upExcelArray结束:"+res);
      ElMessage.success(msg ?? "Submitted!");
        
    } else {
      //ElMessage.error(msg);
      ElMessage.error("提交失败");
    }
  });
}








// Echarts 高亮



// function lineChart(){
  let dValues = ref(null)
  let zValues = ref(null)
  const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)

  // 模拟数据
  // const data = [
  //   { name: 'A', value: 100 },
  //   { name: 'B', value: 200 },
  //   { name: 'C', value: 150 },
  //   { name: 'D', value: 300 },
  //   { name: 'E', value: 88 },
  //   { name: 'F', value: 98 },
  //   { name: 'G', value: 123 },
  //   { name: 'H', value: 219 }
  // ]

  // 配置项
  // const surfaceData = array[0].river.surface;
  //         const data = surfaceData.map((_, index) => [index, _]);
  // const { data: { array } } = this.responseData;
  //     const { code, msg,data:res } = response.data;
  //     const surfaceData = array[0].river.surface;
   

// chartInstance.setOption(options);
chartInstance.on('click', function (params) {// 鼠标单击高亮
     // chartRef.dispatchAction({
     //     type: 'highlight',
     //     seriesName: params.seriesName,
     // })
 
     chartInstance.setOption({// 设置 鼠标单击后想要的样式
         series: {
             name: params.seriesName,
             symbolSize: 4,
            //  color: '#00FFFF', //颜色
             lineStyle: {
                 width: 6
             }
         }
     })
 })
 
chartInstance.on('dblclick', function (params){// 鼠标双击还原
    // chartRef.dispatchAction({
    //     type: 'downplay',
    //     seriesName: params.seriesName,
    // })
 
    chartInstance.setOption({// 将样式复原
        series: {
            name: params.seriesName,
            symbolSize: 2,
            // color: '#ff0000',
            lineStyle: {
                width: 2
            }
        }
    })
})



  // 设置图表配置项
  // chartInstance.setOption(options)
})

// onUnmounted(() => {
//   if (chartInstance) {
//     chartInstance.dispose()
//     chartInstance = null
//   }
// })
// }


// Echarts 高亮 ↑ ↑ ↑ ↑ ↑ ↑ 


</script>


<style scoped lang="scss">
*{
    padding: 0;
    margin: 0;
    list-style: none;
}
#map{
    // position: absolute;
    width: 100%;
    height: 100%;
}
#layerControl {
    // position: absolute;
    // z-index: 999;
    // width: 200px;
    // height: 300px;
    // background-color: rgba(78, 70, 109, 0.596);
    // left: 50px;
    // top: 200px;
    // padding: 5px;
    // border-radius: 10px;
    // -webkit-border-radius: 10px;
    // -moz-border-radius: 10px;
    // -ms-border-radius: 10px;
    // -o-border-radius: 10px;
}

#layerControl .title {
    color: rgb(0, 0, 0);
    text-align: center;
    font-size: 12px;
    margin: 0px 0px;
}

#layerControl li {
    color: ivory;
}

#layerControl input {
    margin-right: 10px;
}

#layerlistbtn {
    position: fixed;
    right: 15px;
    top: 50px;
}

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
/**/
.gutter {
  // background-color: #ffffff;
  background-color: #030303;
  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-horizontal {
   background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
  cursor: col-resize;
}

.gutter.gutter-vertical {
   background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  cursor: row-resize;
}

/*
.gutter {  background-color: #eee;  background-repeat: no-repeat;  background-position: 50%;
  cursor: move;  cursor: grab;  cursor: -moz-grab;  cursor: -webkit-grab;
}.gutter.gutter-horizontal {  background-image: url('grips/vertical.png');
}.gutter.gutter-vertical {  background-image: url('grips/horizontal.png');
}
*/
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
  background: rgba(247,248,248, .9);
  // border: 1px solid rgb(4,124,195);
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
.shapefile-upload{
  display: inline-block;
  margin-left: 12px;
  // display: inline;
  text-align: center;
  cursor: pointer;
  outline: 0;
  // margin-top: 10px;
}
.AllButton{
  font-size: 12px;
  padding: 10px;
}

// 图层列表标题
#layerControl .title{
  font:700 12px/1.5 "Microsoft Yahei",Arial,Helvetica,sans-serif;
  border-color: #79bbff;
  background-color: #79bbff;
  // border-style: solid;
  // border-width: 1px;
  // border-radius: 4px;
  // background-color: #f4f4f5;
  // color: #409EFF;
  color: #ffffff;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 9px;
  text-align: left;
  // box-shadow: 10px 10px 5px -4px rgba(129, 129, 129, 0.603);
  // boxShadow: Dark Shadow;
  // box-shadow: 0 0 5px 0 #d9ecff;
};
  

ul#layerTree.layerTree{
  text-indent: -10px;
  // background-color: aqua;
  font-size: 12px;
  margin-left: 16px;
  margin-top: 14px;
  color: #73767a;
  
}

.demo-tabs{
  height: 80px;
  width: 100%;
}

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
</style>