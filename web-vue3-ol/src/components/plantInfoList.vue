<template>
  <div class="bottom-table">
    <!-- 表格上面那一排按钮 -->
    <div class="bottom-button">
      <el-button type="primary" @click="calculation"><el-icon><DataAnalysis /></el-icon>计算</el-button>
      <el-button type="primary" @click="UpdateWry"><el-icon><Refresh /></el-icon>更新</el-button>
      <el-button type="primary" @click="downloadFile(proxy.$getFullUrl('/geoserver/zzmserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zzmserver%3Asource_nonepoint_3857&maxFeatures=50&outputFormat=csv'))">
        <el-icon><Download /></el-icon>csv下载
      </el-button>
      <el-button type="primary" @click="downloadFile(proxy.$getFullUrl('/geoserver/zzmserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zzmserver%3Asource_nonepoint_3857&maxFeatures=50&outputFormat=SHAPE-ZIP'))">
        <el-icon><Download /></el-icon>shp下载
      </el-button>
      <el-input v-model="username" placeholder="填写查询信息"/>
      <el-button type="primary" @click="query"> 
        <el-icon><Search /></el-icon>查询
      </el-button>
    </div>

    <el-card style="margin-top:-15px; height: 600px">
      <el-table 
        :data="showrows" stripe style="width: 100%" row-key="id"
        :has-n-o="false"
        height="450"
        :cell-class-name="tableCellClassName"
        @row-dblclick="dbclick"
        @sort-change="handleSortChange"
        >
        <ecnpm install v-fit-columns --save prop="OBJECTID" label="OBJECTID" width="120" sortable="custom"/>
        <el-table-column prop="id" label="id" width="70" sortable="custom"/>
        <el-table-column prop="nextsurveyno3" label="nextsurveyno3" width="160" sortable="custom"/>
        <el-table-column prop="draintype" label="draintype" width="120" sortable="custom"/>
        <el-table-column prop="drainsubtype" label="drainsubtype" width="80" sortable="custom"/>
        <el-table-column prop="agriculturetype" label="agriculturetype" width="80" sortable="custom"/>
        <el-table-column prop="username" label="username" width="80" sortable="custom"/>
        <el-table-column prop="useraddress" label="useraddress" width="110" sortable="custom"/>
        <el-table-column prop="codinflow" label="codinflow" width="80" sortable="custom"/>
        <el-table-column prop="codstandard" label="codstandard" width="80" editable sortable="custom">
          <template v-slot="scope">
            <el-input
              v-if="scope.row.index + ',' + scope.column.index == currentCell"
              :ref="scope.row.index + ',' + scope.column.index"
              v-model="scope.row.codstandard"
              @blur="hideInput(scope.row)"
              @change="alterTableData(scope.row.id, scope.row.codstandard,scope.row.nh3standard,scope.row.tpstandard,scope.row.inflowcoefficient)"
            />
              <span v-else>{{ scope.row.codstandard }}</span>
          </template>
        </el-table-column>
          <el-table-column prop="nh3standard" label="nh3standard" width="80" editable sortable="custom">
            <template v-slot="scope">
              <el-input
                v-if="scope.row.index + ',' + scope.column.index == currentCell"
                :ref="scope.row.index + ',' + scope.column.index"
                v-model="scope.row.nh3standard"
                @blur="hideInput(scope.row)"
                @change="alterTableData(scope.row.id, scope.row.codstandard,scope.row.nh3standard,scope.row.tpstandard,scope.row.inflowcoefficient)"
              />
              <span v-else>{{ scope.row.nh3standard }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tpstandard" label="tpstandard" width="80" editable sortable="custom">
            <template v-slot="scope">
              <el-input
                v-if="scope.row.index + ',' + scope.column.index == currentCell"
                :ref="scope.row.index + ',' + scope.column.index"
                v-model="scope.row.tpstandard"
                @blur="hideInput(scope.row)"
                @change="alterTableData(scope.row.id, scope.row.codstandard,scope.row.nh3standard,scope.row.tpstandard,scope.row.inflowcoefficient)"
              />
              <span v-else>{{ scope.row.tpstandard }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inflowcoefficient" label="inflowcoefficient" width="80" editable sortable="custom">
            <template v-slot="scope">
              <el-input
                v-if="scope.row.index + ',' + scope.column.index == currentCell"
                :ref="scope.row.index + ',' + scope.column.index"
                v-model="scope.row.inflowcoefficient"
                @blur="hideInput(scope.row)"
                @change="alterTableData(scope.row.id, scope.row.codstandard,scope.row.nh3standard,scope.row.tpstandard,scope.row.inflowcoefficient)"
              />
              <span v-else>{{ scope.row.inflowcoefficient }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coddischarge" label="coddischarge" width="80" sortable="custom"/>
          <el-table-column prop="nh3discharge" label="nh3discharge" width="80" sortable="custom"/>
          <el-table-column prop="tpdischarge" label="tpdischarge" width="80" sortable="custom"/>
          <el-table-column prop="nh3inflow" label="nh3inflow" width="80" sortable="custom"/>
          <el-table-column prop="tpinflow" label="tpinflow" width="80" sortable="custom"/>
      </el-table>
          
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[10, 20, 50, 100]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="showtotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<!-- ------------------------------------------------------------------------------- -->
<script setup lang="ts">
import { ref,reactive,watch } from 'vue'
import { Search } from '@element-plus/icons-vue';
import { Refresh } from '@element-plus/icons-vue';
import axios from 'axios';

// 通过getCurrentInstance 获取
import { getCurrentInstance, onMounted } from 'vue'
const { baseURL } = getCurrentInstance().appContext.config.globalProperties
onMounted(() => {
  console.log(baseURL) // baseURL
})

const {proxy} = getCurrentInstance()
console.log(proxy.$baseUrl)


import { Get, Post,Put } from "../axios/api"; 
const url=ref('/plantInfo/list')
const loginForm = ref({
  username: 'admin',
  password: '123456',
})
const pageInfo = ref({
  pageNum: 1,
  pageSize: 10
})
const modelSatus = reactive({
  status: false,
});
const form = reactive({
  input: "",
  list: {},
});

const showrows=ref([])
const showtotal = ref(0);

//defineProps<{ msg: string ,selData:{} }>()
/*const props2 = defineProps({
  config: Object,
  msg: string
});
console.log("child")
console.log(props2.config)
if(props2.config){
  console.log("1")
  //showrows.value=props.config
}else{
  console.log("0")
}
*/

const props2 = defineProps<{ msg: string ,selData:{} }>()
/*var selList = [];//定义一个空数组
if(props2.selData.hasOwnProperty("OBJECTID")){
  selList.push(props2.selData);
  showrows.value=selList;
  console.log("push:"+showrows.value);
}*/
const childSelMethod = (childSelData: {}) => {
  console.log('childSelData method called:'+childSelData);
  var selList = [];//定义一个空数组
  if(childSelData.hasOwnProperty("OBJECTID")){
    selList.push(childSelData);
    showrows.value=selList;
    showtotal.value = 1;
    console.log("push:"+showrows.value);
  } else {
    console.log("push:"+"no OBJECTID");
  }
};
const childMethod = (str: string) => {
  console.log('Child method called：'+str);
};
defineExpose({
  childMethod,childSelMethod
});
watch(props2.selData, (newData) => {
  console.log(`new newData is: ${newData}`)
})

const currentPage4 = ref(1)
const pageSize4 = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
currentPage4.value=Math.floor(showrows.value/pageSize4.value);

const handleSizeChange = (val: number) => {
  pageSize4.value=val;
  console.log(`${val} items per page`)
  GetAll();
}
const handleCurrentChange = (val: number) => {
  currentPage4.value=val;
  console.log(`current page: ${val}`)
  GetAll();
}

let username = ref('')
let email = ref('')

function GetAll() {
//Pollution/GetAll
//plantInfo/list
  // axios接口
  Get('/Pollution/GetAll',{  pageNum: currentPage4.value,pageSize: pageSize4.value}).then((response) => {
    const { code, msg, rows,total,data: res } = response.data;
    if (code === 200) {
      showrows.value=rows;
      //showrows.value=data;
      showtotal.value = total;
      console.log(showrows.value);
      //console.log(total);
      ElMessage.success(msg ?? "Submitted!");
      
      /*localStorage.setItem("token", res.token);
      ElMessage.success(msg ?? "Submitted!");
      router.push({
        path: "/", // HelloWorld.vue在路由配置文件中定义的路径
        params: {
          isLogged: true,
        },
      });*/
    } else {
      ElMessage.error(msg);
    }
  });
}
  GetAll();     

const query = () => {
  GetAll();   
}
const query2 = () => {
  //console.log('2222:')
  console.log(username.value)
}

const tableData = [{
  username:"李莲花",
  sex:"男",
  age:38,
  email:"123456@qq.com",
  phone:12345678901,
  address:"莲花楼",
},
{
  username:"方多病",
  sex:"男",
  age:23,
  email:"fdb@qq.com",
  phone:1589999999,
  address:"天机堂",
},
{
  username:"笛飞声",
  sex:"男",
  age:39,
  email:"dfs@153.com",
  phone:13266666666,
  address:"金鸳盟",
},
{
  username:"乔婉娩",
  sex:"女",
  age:32,
  email:"qwm@163.com",
  phone:12345678901,
  address:"四顾门",
},
{
  username:"角丽谯",
  sex:"女",
  age:32,
  email:"jlq@163.com",
  phone:1258888888,
  address:"金鸳盟",
},]

function calculation(){
  console.log("calculation");
  Post('/Pollution/calculation',{}).then((response) => {
    const { code, msg, data,rows,total: res } = response.data;
    if (code === 200) {
      console.log("计算后重新获取数据");
      ElMessage.success(msg ?? "Submitted!");
      GetAll();   

      /*localStorage.setItem("token", res.token);
      ElMessage.success(msg ?? "Submitted!");
      router.push({
        path: "/", // HelloWorld.vue在路由配置文件中定义的路径
        params: {
          isLogged: true,
        },
      });*/
    } else {
      ElMessage.error(msg);
    }
  });
}
 
function UpdateWry() {
  console.log("UpdateWry");
  Post('/Pollution/UpdateWry',{}).then((response) => {
    const { code, msg, data,rows,total: res } = response.data;
    if (code === 200) {
      console.log("更新后重新获取数据");
      ElMessage.success(msg ?? "Submitted!");
      GetAll();   

      /*localStorage.setItem("token", res.token);
      ElMessage.success(msg ?? "Submitted!");
      router.push({
        path: "/", // HelloWorld.vue在路由配置文件中定义的路径
        params: {
          isLogged: true,
        },
      });*/
    } else {
      ElMessage.error(msg);
    }
  });
}


function alterTableData(id,codstandard,nh3standard,tpstandard,inflowcoefficient) {
  console.log("alterTableData"+id+"-"+codstandard);
  if(id!=""){
    Put('/Pollution/alterTableData',{"id":id,"codstandard":codstandard,"nh3standard":nh3standard,"tpstandard":tpstandard,"inflowcoefficient":inflowcoefficient}).then((response) => {
      const { code, msg, data,rows,total: res } = response.data;
      if (code === 200) {
        //console.log("修改后重新获取数据");
        ElMessage.success(msg ?? "Submitted!");
        //GetAll();   
        /*localStorage.setItem("token", res.token);
        ElMessage.success(msg ?? "Submitted!");
        router.push({
          path: "/", // HelloWorld.vue在路由配置文件中定义的路径
          params: {
            isLogged: true,
          },
        });*/
      } else {
        ElMessage.error(msg);
      }
    });
  }
}

function alterTableData2(id,nh3standard) {
  console.log("alterTableData"+id+"-"+nh3standard);
  if(id!=""){
    Put('/Pollution/alterTableData',{"id":id,"nh3standard":nh3standard}).then((response) => {
      const { code, msg, data,rows,total: res } = response.data;
      if (code === 200) {
          //console.log("修改后重新获取数据");
        ElMessage.success(msg ?? "Submitted!");
        
        //GetAll();   

      } else {
        ElMessage.error(msg);
      }
    });
  }
}

function alterTableData3(id,tpstandard) {
  console.log("alterTableData"+id+"-"+tpstandard);
  if(id!=""){
    Put('/Pollution/alterTableData',{"id":id,"tpstandard":tpstandard}).then((response) => {
      const { code, msg, data,rows,total: res } = response.data;
      if (code === 200) {
        //console.log("修改后重新获取数据");
        ElMessage.success(msg ?? "Submitted!");
        //GetAll();   
      } else {
        ElMessage.error(msg);
      }
    });
  }
}

function alterTableData4(id,inflowcoefficient) {
  console.log("alterTableData"+id+"-"+inflowcoefficient);
  if(id!=""){
    Put('/Pollution/alterTableData',{"id":id,"inflowcoefficient":inflowcoefficient}).then((response) => {
      const { code, msg, data,rows,total: res } = response.data;
      if (code === 200) {
        //console.log("修改后重新获取数据");
        ElMessage.success(msg ?? "Submitted!");
        //GetAll();   
      } else {
        ElMessage.error(msg);
      }
    });
  }
}
const currentCell = ref(null)
// 给单元格绑定横向和竖向的index，这样就能确定是哪一个单元格
function tableCellClassName({ row, column, rowIndex, columnIndex }) {
  row.index = rowIndex
  column.index = columnIndex
  //console.log(rowIndex, columnIndex)
}
// 获得当前双击的单元格的横竖index，然后拼接成一个唯一字符串用于判断，并赋给currentCell
// 拼接后类似这样："1,0","1,1",
function dbclick(row, column) {
  console.log(row, column)
  currentCell.value = row.index + ',' + column.index
  console.log(currentCell)
  // input 自动获取焦点
  if (column.property === 'processid_name' || column.property === 'processmoudel_name') {
    // 双击后自动获得焦点
    this.$nextTick(() => {
      this.$refs[row.index + ',' + column.index].focus()
    })
  }
}
// 关闭编辑状态
function hideInput(row) {
  this.currentCell = null
}

function sortChange(){
  console.log('sortChange');  
}

function downloadFile(fileUrl) {
  const link = document.createElement('a');
  link.href = fileUrl;
  //link.setAttribute('download', fileName);
  link.click();
}

const handleSortChange = ({ column, prop, order }) => {
  showrows.value.sort((a, b) => {
    if (order === 'ascending') {
      return a[prop] > b[prop] ? 1 : -1;
    } else if (order === 'descending') {
      return a[prop] < b[prop] ? 1 : -1;
    }
    return 0;
  });
};
 

/*const typeSelect = document.getElementById('typeSelect');
console.log("typeSelect:"+typeSelect);
*/
const typeSelect = ref(null);
onMounted(() => {
  console.log(typeSelect.value); // 在组件挂载后也可以访问
});
console.log("end typeSelect:"+typeSelect);
typeSelect.onchange = function () {
  console.log(typeSelect.value+":onchange:"+this.value);
  //map.removeInteraction(draw);
  //addInteraction();
};
function typeSelectChange() {
  console.log(typeSelect.value+":onchange:");
}
</script>


<style scoped>
.el-input {
  margin-right: 5px;
  width: 300px;
}
.bottom-button {
  margin-top: 10px;
}
.query-input{
  display: flex;
  justify-content:center
}
.el-card{
  margin-bottom: 0px;
}
.demo-pagination-block{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>