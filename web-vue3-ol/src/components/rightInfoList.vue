<template>
<el-card>
      <el-table 
        :data="showrows" stripe style="width: 100%" row-key="id"
        :has-n-o="false"
        height="100"
        :cell-class-name="tableCellClassName"
        @sort-change="handleSortChange"
        >

      <!--<el-table-column prop="id" label="id" width="40"/>-->
      <el-table-column prop="codsum" label="codsum" width="100" />
      <el-table-column prop="nh3sum" label="nh3sum" width="100" />
      <el-table-column prop="tpsum" label="tpsum" width="100"/>
    </el-table>
        <!--
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
    </div>-->
  </el-card>
 <div class="select-el-form">
  <div class="raw">
  <el-form-item label="污染源" prop="segment1" class="item">
    <el-select
      clear-icon="close"
      clearable
      v-model="segment1"
      filterable
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="请选择类别"
      :style="{ width: '100%' }"
      @change="handleSegment1Change"
    >
      <el-option
        v-for="(item, index) in segment1Options"
        :key="item.key"
        :label="item.label"
        :value="item.key"
      >
        <span
          ><el-checkbox v-model="checkSegment1[index]" /><span
            class="select-text"
            >{{ item.label }}</span
          ></span
        >
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="点面源" prop="segment2"  class="item">
    <el-select
      clear-icon="close"
      clearable
      v-model="segment2"
      filterable
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="请选择类别"
      :style="{ width: '100%' }"
      @change="handleSegment2Change"
    >
      <el-option
        v-for="(item, index) in segment2Options"
        :key="item.key"
        :label="item.label"
        :value="item.key"
      >
        <span
          ><el-checkbox v-model="checkSegment2[index]" /><span
            class="select-text"
            >{{ item.label }}</span
          ></span
        >
      </el-option>
    </el-select>
  </el-form-item>
 </div>

 <div class="raw">
  <el-form-item label="污染大类" prop="segment3" class="item">
    <el-select
      clear-icon="close"
      clearable
      v-model="segment3"
      filterable
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="请选择类别"
      :style="{ width: '100%' }"
      @change="draintypeArrayChange"
    >
      <el-option
        v-for="(item, index) in draintypeArray"
        :key="item.key"
        :label="item.label"
        :value="item.key"
      >
        <span
          ><el-checkbox v-model="checkSegment3[index]" /><span
            class="select-text"
            >{{ item.label }}</span
          ></span
        >
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="污染小类" prop="segment4"  class="item">
    <el-select
      clear-icon="close"
      clearable
      v-model="segment4"
      filterable
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="请选择类别"
      :style="{ width: '100%' }"
      @change="drainsubtypeArrayChange"
    >
      <el-option
        v-for="(item, index) in drainsubtypeArray"
        :key="item.key"
        :label="item.label"
        :value="item.key"
      >
        <span
          ><el-checkbox v-model="checkSegment4[index]" /><span
            class="select-text"
            >{{ item.label }}</span
          ></span
        >
      </el-option>
    </el-select>
  </el-form-item>
 </div>

 <div class="raw">
  <el-button type="primary" @click="calculation"><el-icon><DataAnalysis /></el-icon>统计</el-button>
 </div>

<!-- 为 ECharts 准备一个定义了宽高的 DOM -->
<div ref="pieChart" class="pieChart"></div>

</div>
</template>

<!-- ------------------------------------------------------------------------------- -->
<script setup lang="ts">
import { ref,reactive,watch } from 'vue'
import { Search } from '@element-plus/icons-vue';
import { Refresh } from '@element-plus/icons-vue';
import axios from 'axios';
import * as echarts from 'echarts';

// 通过getCurrentInstance 获取
import { getCurrentInstance, onMounted,nextTick } from 'vue'
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

 

const props2 = defineProps<{ msg: string ,selData:{} }>()
/*var selList = [];//定义一个空数组
if(props2.selData.hasOwnProperty("OBJECTID")){
  selList.push(props2.selData);
  showrows.value=selList;
  console.log("push:"+showrows.value);
}*/
const childSelMethod = (childSelDataList: []) => {

  console.log('childSelData method called:'+childSelDataList);

    showrows.value=childSelDataList.results;
    showtotal.value = childSelDataList.results.length;
    console.log("right list length:"+showtotal.value);
/*
  var selList = [];//定义一个空数组
  if(childSelDataList.hasOwnProperty("codsum")){
    selList.push(childSelData);
    showrows.value=selList;
    showtotal.value = 1;
    console.log("push:"+showrows.value);
  } else {
    console.log("push:"+"no OBJECTID");
  }*/


  /*for(let i = 0; i < childSelDataList.length; i++) { 
    console.log(childSelDataList[i]);
    draintypeArray.push('{"key":"'+childSelDataList[i].draintype+'","label":"'+childSelDataList[i].draintype+'"}');
    drainsubtypeArray.push('{"key":"'+childSelDataList[i].drainsubtype+'","label":"'+childSelDataList[i].drainsubtype+'"}');
    console.log("draintypeArray"+draintypeArray.length);
    console.log("drainsubtypeArray"+draintypeArray.length);
  }*/
  
  for(let i = 0; i < childSelDataList.uniqueDraintypes.length; i++) { 
    const selItem = ref({key:"",label:""});
    selItem.value.key = childSelDataList.uniqueDraintypes[i];
    selItem.value.label = childSelDataList.uniqueDraintypes[i];
    draintypeArray.value.push(selItem.value);
  }
  //segment3Options=draintypeArray;
  console.log("draintypeArray:"+draintypeArray);
  /*for(let i = 0; i < childSelDataList.uniqueDrainSubtypes.length; i++) { 
    drainsubtypeArray.push('{"key":"'+childSelDataList.uniqueDrainSubtypes[i]+'","label":"'+childSelDataList.uniqueDrainSubtypes[i]+'"}');
  }
  */
  for(let i = 0; i < childSelDataList.uniqueDrainSubtypes.length; i++) { 
    const selItem = ref({key:"",label:""});
    selItem.value.key = childSelDataList.uniqueDrainSubtypes[i];
    selItem.value.label = childSelDataList.uniqueDrainSubtypes[i];
    drainsubtypeArray.value.push(selItem.value);
  }
  //segment4Options=drainsubtypeArray;
  console.log("drainsubtypeArray:"+drainsubtypeArray);
};
let draintypeArray = ref([]);
let drainsubtypeArray = ref([]);
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

//下拉框的多选框
const checkSegment1 = ref({});
//应用领域查询条件
const segment1 = ref([]);
const segment1Options = ref([
  {
    key: "codsum",
    label: "codsum",
  },
  {
    key: "nh3sum",
    label: "nh3sum",
  },
  {
    key: "tpsum",
    label: "tpsum",
  },
]);
//处理下拉框的勾选操作
function handleSegment1Change(val) {
  segment1Options.value.forEach((item, index) => {
    if (val && val.includes(item.key)) {
      checkSegment1.value[index] = true;
    } else {
      checkSegment1.value[index] = false;
    }
  });
}

//下拉框的多选框
const checkSegment2 = ref({});
//应用领域查询条件
const segment2 = ref([]);
const segment2Options = ref([
  {
    key: "点源",
    label: "点源",
  },
  {
    key: "面源",
    label: "面源",
  },
  {
    key: "内源",
    label: "内源",
  },
]);
//处理下拉框的勾选操作
function handleSegment2Change(val) {
  segment2Options.value.forEach((item, index) => {
    if (val && val.includes(item.key)) {
      checkSegment2.value[index] = true;
    } else {
      checkSegment2.value[index] = false;
    }
  });
}

//下拉框的多选框
const checkSegment3 = ref({});
//应用领域查询条件
const segment3 = ref([]);
let segment3Options = ref([
  {
    key: "codsum",
    label: "codsum",
  },
  {
    key: "nh3sum",
    label: "nh3sum",
  },
  {
    key: "tpsum",
    label: "tpsum",
  },
]);
 
//处理下拉框的勾选操作
function handleSegment3Change(val) {
  segment3Options.value.forEach((item, index) => {
    if (val && val.includes(item.key)) {
      checkSegment3.value[index] = true;
    } else {
      checkSegment3.value[index] = false;
    }
  });
}


//处理下拉框的勾选操作
function draintypeArrayChange(val) {
  console.log(draintypeArray);
  console.log(segment3Options);
  draintypeArray.value.forEach((item, index) => {
    if (val && val.includes(item.key)) {
      checkSegment3.value[index] = true;
    } else {
      checkSegment3.value[index] = false;
    }
  });
}

//下拉框的多选框
const checkSegment4 = ref({});
//应用领域查询条件
const segment4 = ref([]);
let segment4Options = ref([
  {
    key: "点源",
    label: "点源",
  },
  {
    key: "面源",
    label: "面源",
  },
  {
    key: "内源",
    label: "内源",
  },
]);

//处理下拉框的勾选操作
function handleSegment4Change(val) {
  segment4Options.value.forEach((item, index) => {
    if (val && val.includes(item.key)) {
      checkSegment4.value[index] = true;
    } else {
      checkSegment4.value[index] = false;
    }
  });
}
//处理下拉框的勾选操作
function drainsubtypeArrayChange(val) {
  console.log(drainsubtypeArray);
  console.log(drainsubtypeArray);
  drainsubtypeArray.value.forEach((item, index) => {
    if (val && val.includes(item.key)) {
      checkSegment4.value[index] = true;
    } else {
      checkSegment4.value[index] = false;
    }
  });
}

function calculation(){
  console.log("calculation");
  Post('/Pollution/calculation',{}).then((response) => {
    const { code, msg, data,rows,total: res } = response.data;
    if (code === 200) {
      console.log("计算后重新获取数据");
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

let pieChart = ref()
onMounted(() => {
		nextTick(() => { //将图表操作放入nextTick中
			initChart()
		})
	})

	const initChart = () => { 
		var myChart = (echarts as any).init(pieChart.value);
		var option = {
        series: [
          {
            type: 'pie',
            data: [
              {
                value: 335,
                name: '直接访问'
              },
              {
                value: 234,
                name: '联盟广告'
              },
              {
                value: 1548,
                name: '搜索引擎'
              }
            ]
          }
        ]
      };
		myChart.setOption(option);
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
.select-el-form  {
    
}
.select-el-form .raw{
  display: flex;
}
.select-el-form .raw .item{
  width:50%;
  margin-bottom: 5px;
}
.pieChart{
  width: 400px;
  height: 400px;
}
</style>