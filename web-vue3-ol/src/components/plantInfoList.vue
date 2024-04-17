<template>
  <!--{{ msg }}-
    <h1 v-if="selData.hasOwnProperty('OBJECTID')">Vue is awesome! {{ selData }}</h1>
    <h1 v-else>Oh no 😢</h1>-->
    <!--<h3>{{ msg }}</h3>
      <div class="text">信息列表</div>
      <div class="flexbox">-->
        <!--<el-input v-model="form.input" placeholder="请输入username" clearable style="width:150px;margin-right:15px;" />-->
    <div>
    <el-button type="primary" @click="calculation"><el-icon><DataAnalysis /></el-icon>计算</el-button>
    <el-button type="primary" @click="UpdateWry"><el-icon><Refresh /></el-icon>更新</el-button>
    <el-button type="primary" @click="downloadFile(proxy.$getFullUrl('/geoserver/zzmserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zzmserver%3Asource_nonepoint_3857&maxFeatures=50&outputFormat=csv'))">
      <el-icon><Download /></el-icon>csv下载
    </el-button>
    <!-- <el-input type="file" @change="handleFileUpload" accept=".zip" ref="fileInput" /> -->
    <el-button type="primary" @click="downloadFile(proxy.$getFullUrl('/geoserver/zzmserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=zzmserver%3Asource_nonepoint_3857&maxFeatures=50&outputFormat=SHAPE-ZIP'))">
      <el-icon><Download /></el-icon>shp下载
    </el-button>

    <el-select v-model="selValue" placeholder="Select" style="width: 140px">
      <el-option
        v-for="item in showColumnNames"
        :key="item.name"
        :label="item.label"
        :value="item.name"
      />
    </el-select>

    <!-- 查询功能 -->
    <el-input v-model="searchValue" placeholder="查询值" style="width: 100px"/>
    <el-button type="primary" @click="query"> 
      <el-icon><Search /></el-icon>查询
    </el-button>
  
    <!-- </div>
    <el-card>
      <div class="query-input">
        <el-input v-model="username" placeholder="请输入用户名"/>
        <el-input v-model="email" placeholder="请输入邮箱"/>
        <el-button type="primary" @click="query"> 
          <el-icon><Search /></el-icon>查询
        </el-button>
        <el-button type="danger" @click="query2">
          <el-icon><Refresh /></el-icon>重置
        </el-button>
      </div> 
    </el-card>-->
  
    <!--
    <el-card>
      <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180" />
      <el-table-column prop="sex" label="性别" width="180" />
      <el-table-column prop="age" label="年龄" width="180" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="phone" label="电话" width="180" />
      <el-table-column prop="address" label="地址"  />
      <el-table-column fixed="right" label="操作" width="180">
        <template #default>
          <el-button type="primary" size="small" >编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
  
    </el-table>
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[100, 200, 300, 400]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    </el-card>-->
    <!-- </div> -->
    <!--@sort-change="sortChange"-->
    <!-- <el-card style="margin-top:-15px; height: 600px"> -->
    <el-card style="margin-top:-15px; height: 550px">
        <el-table 
          :data="showrows"
          stripe
          style="width: 100%"
          row-key="id"
          :has-n-o="false"
          height="400"
          :cell-class-name="tableCellClassName"
          @row-dblclick="dbclick"
          @sort-change="handleSortChange"
          ref="multipleTableRef"
          @selection-change="handleSelectionChange"
          fit="true"
          :row-style="{height: '0'}"
          :cell-style="{padding: '0'}"
          >
          <!-- v-loading="loading" -->
        <el-table-column type="selection" width="40" />
        <el-table-column prop="OBJECTID" label="OBJECTID" width="80" sortable="custom"/>
        <el-table-column prop="id" label="id" width="80" sortable="custom"/>
        <el-table-column prop="nextsurveyno3" label="下游编号" width="80" sortable="custom"/>
        <el-table-column prop="draintype" label="面源类型" width="80" sortable="custom"/>
        <el-table-column prop="drainsubtype" label="面源子类" width="80" sortable="custom"/>
        <el-table-column prop="agriculturetype" label="农业类型" width="80" sortable="custom"/>
        <el-table-column prop="username" label="对象名称" width="180" sortable="custom"/>
        <el-table-column prop="useraddress" label="排水户地图地址" width="180" sortable="custom"/>
        <el-table-column prop="codinflow" label="cod入流量" width="80" sortable="custom"/>
        <el-table-column prop="codstandard" label="cod标准" width="80" editable sortable="custom">
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
        <el-table-column prop="nh3standard" label="nh3标准" width="80" editable sortable="custom">
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
        <el-table-column prop="tpstandard" label="tp标准" width="180" editable sortable="custom">
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
        <el-table-column prop="inflowcoefficient" label="入流系数" width="80" editable sortable="custom">
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
        <el-table-column prop="coddischarge" label="cod排放量" width="180" sortable="custom"/>
        <el-table-column prop="nh3discharge" label="nh3排放量" width="180" sortable="custom"/>
        <el-table-column prop="tpdischarge" label="tp排放量" width="180" sortable="custom"/>
        <el-table-column prop="nh3inflow" label="nh3入流量" width="180" sortable="custom"/>
        <el-table-column prop="tpinflow" label="tp入流量" width="180" sortable="custom"/>
        </el-table>

         <!-- <div style="margin-top: 20px">
         <el-button @click="toggleSelection()">Clear selection</el-button>
        </div> -->
      <!-- 分页功能组件 -->
      <div class="demo-pagination-block">

        <!-- 清除当前选择 -->
        <div style="margin-top: 0px; margin-right: 25px">
         <el-button @click="toggleSelection()">清除选择</el-button>
        </div>

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
  import { ElTable } from 'element-plus'
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
  interface User {
  date: string
  name: string
  address: string
}
  const showrows=ref([])
  const showtotal = ref(0);
  const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const toggleSelection = (rows?: User[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}
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
  const loading = ref(true)
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
  
  /*const query = () => {
    GetAll();   
  }*/
  // const query2 = () => {
  //   //console.log('2222:')
  //   console.log(username.value)
  // }
  
  
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

  const selValue = ref('')
  const selOptions = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

const showColumnNames=ref([])
function getColumnName() {
  //Pollution/GetAll
  //plantInfo/list
    // axios接口
    Get('/Pollution/getcolumnname',{}).then((response) => {
      const { code, msg, data: res } = response.data;
      if (code === 200) {
        showColumnNames.value=res;
        
        console.log("showColumnNames:"+showColumnNames.value);
        // GetAll();  
        // ElMessage.success(msg ?? "Submitted!");
      } else {
        ElMessage.error(msg);
      }
    });
  }
  getColumnName() ;

  const searchValue=ref('');
  function MutiSearch(){
    const seljson= {pageNum: currentPage4.value,pageSize: pageSize4.value,[selValue.value]:searchValue.value};
    console.log("MutiSearch:"+seljson);
    Post('/Pollution/MutiSearch',seljson).then((response) => {
      const { code, msg, rows,total,data: res } = response.data;
      if (code === 200) {
        console.log("条件查询");
        showrows.value=rows;
        //showrows.value=data;
        showtotal.value = total;
        console.log(showrows.value);
        ElMessage.success(msg ?? "Submitted!");
        // GetAll();   
  
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
  function query(){
    MutiSearch();
  }
  </script>
  
  
  <style scoped>
  .el-input {
    margin-right: 5px;
    width: 300px;
  }
  .query-input{
    display: flex;
    justify-content:center
  }
  .el-card{
    margin-bottom: 10px;
  }
  .demo-pagination-block{
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .example-showcase .el-loading-mask {
  z-index: 9;
}
  </style>