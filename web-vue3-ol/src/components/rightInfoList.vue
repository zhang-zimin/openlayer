<template>
<el-card>
    <el-table :data="showrows" stripe style="width: 100%" row-key="id"
      :has-n-o="false"
      :cell-class-name="tableCellClassName"
      @sort-change="handleSortChange"
      v-sticky="{ top: '50px', parent: '.table-box', zIndex: 996 }">
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

 

const props2 = defineProps<{ msg: string ,selData:{} }>()
/*var selList = [];//定义一个空数组
if(props2.selData.hasOwnProperty("OBJECTID")){
  selList.push(props2.selData);
  showrows.value=selList;
  console.log("push:"+showrows.value);
}*/
const childSelMethod = (childSelDataList: []) => {

  console.log('childSelData method called:'+childSelDataList);

    showrows.value=childSelDataList;
    showtotal.value = childSelDataList.length;
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
</style>