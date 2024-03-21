<script setup lang="ts">
import { ref,reactive } from 'vue'
import { Search } from '@element-plus/icons-vue';
import { Refresh } from '@element-plus/icons-vue';

import axios from 'axios';

// 通过getCurrentInstance 获取
import { getCurrentInstance, onMounted } from 'vue'
const { baseURL } = getCurrentInstance().appContext.config.globalProperties
onMounted(() => {
  console.log(baseURL) // baseURL
})

import { Get, Post } from "../axios/api"; 
const url=ref('/plantInfo/list')
const loginForm = ref({
  username: 'admin',
  password: '123456',
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

function GetAll() {
//Pollution/GetAll
//plantInfo/list
 // axios接口
 Get('/Pollution/GetAll',{}).then((response) => {
        const { code, msg, data,rows,total: res } = response.data;
        if (code === 200) {
          //showrows.value=rows;
          showrows.value=data;
          showtotal.value = 100;
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

defineProps<{ msg: string }>()

const currentPage4 = ref(4)
const pageSize4 = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
currentPage4.value=Math.floor(showrows.value/pageSize4.value);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

let username = ref('')
let email = ref('')

const query = () => {}
const query2 = () => {
  //console.log('2222:')
  console.log(username.value)
}

const tableData = [
  { username:"李莲花",
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

  },

]

function calculation() {
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

</script>

<template>
    <!--<h3>{{ msg }}</h3>
    <div class="text">信息列表</div>
      <div class="flexbox">-->
        <!--<el-input v-model="form.input" placeholder="请输入username" clearable style="width:150px;margin-right:15px;" />-->
        <el-button type="primary" @click="calculation">计算</el-button>
      <!-- </div>
 <el-card>
    <div class="query-input">
      <el-input v-model="username" placeholder="请输入用户名"/>
      <el-input v-model="email" placeholder="请输入邮箱"/>
      <el-button type="primary" @click="query"> 
        <el-icon><Search /></el-icon>
        查询
      </el-button>
      <el-button type="danger" @click="query2">
        <el-icon><Refresh /></el-icon>
        重置
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
    el-table-column fixed="right" label="操作" width="180">
      <template #default>
        <el-button  type="primary" size="small" 
          >编辑</el-button
        >
        <el-button  type="danger" size="small">删除</el-button>
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
  <el-card>
    <el-table :data="showrows" stripe style="width: 100%">
   
      <el-table-column prop="id" label="id" width="80" />
      <el-table-column prop="nextsurveyno3" label="nextsurveyno3" width="80" />
      <el-table-column prop="draintype" label="draintype" width="80" />
      <el-table-column prop="drainsubtype" label="drainsubtype" width="80" />
      <el-table-column prop="agriculturetype" label="agriculturetype" width="80" />
      <el-table-column prop="username" label="username" width="80" />
      <el-table-column prop="useraddress" label="useraddress" width="80" />
      <el-table-column prop="codinflow" label="codinflow" width="80" />
      <el-table-column prop="codstandard" label="codstandard" width="80" />
      <el-table-column prop="nh3standard" label="nh3standard" width="80" />
      <el-table-column prop="tpstandard" label="tpstandard" width="80" />
      <el-table-column prop="coddischarge" label="coddischarge" width="80" />
      <el-table-column prop="nh3discharge" label="nh3discharge" width="80" />
      <el-table-column prop="tpdischarge" label="tpdischarge" width="80" />
      <el-table-column prop="nh3inflow" label="nh3inflow" width="80" />
      <el-table-column prop="tpinflow" label="tpinflow" width="80" />
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

</template>

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