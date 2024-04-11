<template>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="污染源负荷结构分析" name="first">
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

    </el-card>




      <div class="select-el-form">

        <div class="m-4">
    分区
    <el-cascader :options="fenquTypeArray" :props="propswry" clearable />
  </div>


  <div class="m-4">
    污染源
    <!-- <el-cascader :options="fenquTypeArray" :props="propswry" clearable /> -->
    <el-cascader :options="WryOptions" :props="WryProps" clearable />
  </div>


  <div class="m-4">
    污染指标
    <el-select
      v-model="valueindex"
      multiple
      placeholder="Select"
      style="width: 240px"
    >
      <el-option
        v-for="item in optionindex"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>


   <div class="raw">
    <el-button type="primary" @click="calculation"><el-icon><DataAnalysis /></el-icon>统计</el-button>
   </div>
  
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div ref="pieChart" class="pieChart"></div>
  
  </div>



    </el-tab-pane>

    <el-tab-pane label="污染源负荷空间分析" name="second">
    
    </el-tab-pane>

  </el-tabs>

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
  
const valueindex = ref([])



const optionindex = [
  {
    value: 'codsum',
    label: 'codsum',
  },
  {
    value: 'nh3sum',
    label: 'nh3sum',
  },
  {
    value: 'tpsum',
    label: 'tpsum',
  }
]


// const value = ref([])

const props = {
  expandTrigger: 'hover' as const,
}

const handleChange = (value) => {
  console.log(value)
}


const WryProps = { multiple: true }

const WryOptions = [
  {
    value: 1,
    label: '点源',
    children: [
      {
        value: 2,
        label: '工业',
      },
      {
        value: 6,
        label: '城镇生活源',
      },
    ],
  },
  {
    value: 14,
    label: '面源',
    children: [
      {
        value: 15,
        label: '农业面源',
      },
      {
        value: 19,
        label: '地表径流',
      },
    ],
  },
  {
    value: 23,
    label: '内源',
    children: [
      {
        value: 24,
        label: '内源',
      },
    ],
  },
]

const propswry = { multiple: true }

const optionswry = [
  {
    value: 1,
    label: 'Asia',
    children: [
      {
        value: 2,
        label: 'China',
        children: [
          { value: 3, label: 'Beijing' },
          { value: 4, label: 'Shanghai' },
          { value: 5, label: 'Hangzhou' },
        ],
      },
      {
        value: 6,
        label: 'Japan',
        children: [
          { value: 7, label: 'Tokyo' },
          { value: 8, label: 'Osaka' },
          { value: 9, label: 'Kyoto' },
        ],
      },
      {
        value: 10,
        label: 'Korea',
        children: [
          { value: 11, label: 'Seoul' },
          { value: 12, label: 'Busan' },
          { value: 13, label: 'Taegu' },
        ],
      },
    ],
  },
  {
    value: 14,
    label: 'Europe',
    children: [
      {
        value: 15,
        label: 'France',
        children: [
          { value: 16, label: 'Paris' },
          { value: 17, label: 'Marseille' },
          { value: 18, label: 'Lyon' },
        ],
      },
      {
        value: 19,
        label: 'UK',
        children: [
          { value: 20, label: 'London' },
          { value: 21, label: 'Birmingham' },
          { value: 22, label: 'Manchester' },
        ],
      },
    ],
  },
  {
    value: 23,
    label: 'North America',
    children: [
      {
        value: 24,
        label: 'US',
        children: [
          { value: 25, label: 'New York' },
          { value: 26, label: 'Los Angeles' },
          { value: 27, label: 'Washington' },
        ],
      },
      {
        value: 28,
        label: 'Canada',
        children: [
          { value: 29, label: 'Toronto' },
          { value: 30, label: 'Montreal' },
          { value: 31, label: 'Ottawa' },
        ],
      },
    ],
  },
]







import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
  
  const props2 = defineProps<{ msg: string ,selData:{} }>()
  /*var selList = [];//定义一个空数组
  if(props2.selData.hasOwnProperty("OBJECTID")){
    selList.push(props2.selData);
    showrows.value=selList;
    console.log("push:"+showrows.value);
  }*/
  const childSelMethod = (childSelDataList: []) => {
  
    console.log('childSelData method called:'+childSelDataList);
  
      // showrows.value=childSelDataList.results;
      // showtotal.value = childSelDataList.results.length;
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

  let fenquTypeArray = ref([]);
  const fenquSelMethod = (fenquSelDataList: []) => {
    console.log('fenquSelDataList method called:'+fenquSelDataList);
    for(let i = 0; i < fenquSelDataList.length; i++) { 
      const selItem = ref({key:"",label:""});
      selItem.value.key = fenquSelDataList[i].properties.FID_1;
      selItem.value.label = fenquSelDataList[i].properties.fenqu;
      fenquTypeArray.value.push(selItem.value);
    }
    console.log("fenquTypeArray:"+fenquTypeArray);
  }

  const fenquMapMethod = (fenquMapData: []) => {
    //console.log('fenquMapData method called:'+fenquMapData);
    console.log('fenquMapData length:'+fenquMapData.length);
    // console.log('fenquMapData.fenquList:'+fenquMapData.fenquList);
    for(let i = 0; i < fenquMapData.length; i++) { 
      const selItem = ref({value:"",label:"",children:[]});
      selItem.value.value = fenquMapData[i].fenqu;
      selItem.value.label = fenquMapData[i].fenqu;
      const childListData = fenquMapData[i].list;
      const childList = ref([]);
      for(let j = 0; j < childListData.length; j++) { 
        const selItemChild = ref({value:"",label:""});
        selItemChild.value.value = childListData[j];
        selItemChild.value.label = childListData[j];
        childList.value.push(selItemChild.value);
      }
      selItem.value.children=childList.value;
      fenquTypeArray.value.push(selItem.value);
    }
    console.log("fenquTypeArray:"+fenquTypeArray);
    // optionswry.value=fenquTypeArray.value;
  }

  let draintypeArray = ref([]);
  let drainsubtypeArray = ref([]);
  const childMethod = (str: string) => {
    console.log('Child method called：'+str);
  };
  defineExpose({
    childMethod,childSelMethod,fenquSelMethod,fenquMapMethod
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
    width: 250px;
    height: 250px;
  }

  .demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 400;
}

  </style>