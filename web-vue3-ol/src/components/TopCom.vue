<template>
  <div class="top">
    <!-- header-bar是最上面的蓝色条条 -->
    <div class="header-bar">
      <!-- nav-box 用盒子装三部分内容 -->
      <div class="nav-box">
        <!-- 分为左中右 -->
        <!-- 左边 -->
        <div style="display: flex; overflow: hidden; max-width: 600px">
          <div class="nav-left">
            
            <!-- <router-link
              class="one"
              to="/home"
              :class="{ active: $route.path === '/home' }">
              首页
              </router-link>
            <router-link
              class="two"
              to="/AuxiliaryView"
              :class="{ active: $route.path === '/AuxiliaryView' }">
              辅助分析
              </router-link>
            <router-link
              class="three"
              to="/CalculateView"
              :class="{ active: $route.path === '/CalculateView' }">总量控制计算
            </router-link> -->
          </div>
        </div>

        <!-- 中间 -->
        <div class="nav-center">
          <div class="sys-logo">水环境信息化排查服务平台</div>
        </div>

        <!-- 右边 -->
        <div class="nav-right">
          <!-- 天气 -->
          <!-- <span id="Weathera"><Weather /></span> -->

          <!-- 时间 -->
          <span id="showTime">{{ nowTime }}</span>
          <!-- 用户 -->
          <span class="bar-title-right-box-first" @click="usernameclick">
            <el-dropdown
              trigger="click"
              placement="bottom"
              :teleported="false"
            >
              <span class="el-dropdown-link">
                <el-icon class="el-icon--right" size="24" color="white"
                  ><Avatar
                /></el-icon>
                <div style="width: 60px; font-size: 10px; color: white">
                  {{ username }}
                </div>
              </span>

              <template #dropdown>
                <el-dropdown-menu>
                  <!-- <el-dropdown-item :icon="Plus">切换用户</el-dropdown-item> -->
                  <el-dropdown-item  @click="user">
                    后台管理
                  </el-dropdown-item>
                  <el-dropdown-item  @click="Nologin">
                    注销登录
                  </el-dropdown-item>
<!-- <download-excel
              class="export-excel-wrapper"
              :data="DetailsForm"
              :fields="json_fields"
              :header="title"
              name="需要导出的表格名字.xls"
            >
              
              <el-button type="success">导出</el-button>
              </download-excel> -->

                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
          <!-- 全屏 -->
          <span @click="SetFullScreen">
            <!-- <el-icon class="bar-title-right-box-two" size="34"><FullScreen /></el-icon> -->
            <el-icon class="bar-title-right-box-two">
              <Rank />
            </el-icon>
          </span>
          <el-button type="primary" text='primary' @click="toggleFullScreen" class="AllButton">
            <el-icon><FullScreen /></el-icon>切换全屏
    </el-button>
    <el-button type="primary" text='primary' @click="reloadPage" class="AllButton">
      <el-icon><Refresh /></el-icon>刷新
    </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";

// import Weather from "../home_detail/WeatherTop.vue";
import { onMounted, ref } from "vue";
import { Search, Refresh, DataAnalysis, Histogram, FullScreen} from '@element-plus/icons-vue';
// import screenfull from "screenfull";
// import { logout, getInfo } from "@/api/login";
// import Cookies from "js-cookie";
let router = useRouter();
const nowTime = ref("");
const username = ref("");
// var json_fields=reactive()
var DetailsForm
 /** */
// title: "xx公司表格",
//  json_fields={
//         "排查日期":'date',
//         "整改隐患内容":'details',
//         "整改措施":'measure',
//         "整改时限":'timeLimit',
//         "应急措施和预案":'plan',
//         "整改责任人":'personInCharge',
//         "填表人":'preparer',
//         "整改资金":'fund',
//         "整改完成情况":'complete',
//         "备注":'remark',
//       },
//     DetailsForm= [
//         {
//           date: "2022-3-10",
//           details: "卸油区过路灯损坏",
//           measure: "更换灯泡",
//           timeLimit: "2022-3-21",
//           plan: "先使用充电灯代替,贴好安全提醒告示",
//           personInCharge: "王xx",
//           preparer: "王xx",
//           fund: "20元",
//           complete: "已完成整改",
//           remark: "重新更换了灯泡",
//         },
       
//       ]

/** */



// 全屏
// const SetFullScreen = () => {
//   //screenfull.isEnabled  此方法返回布尔值，判断当前能不能进入全屏
//   if (!screenfull.isEnabled) {
//     return false;
//   } //screenfull.toggle 此方法是执行全屏化操作。如果已是全屏状态，则退出全屏
//   screenfull.toggle();
// };
// watch(router,(newvalue,old)=>{
//   console.log(newvalue,old);
//   window.location.reload();
// })
// getInfo().then((res) => {
//   // console.log(res,'1111111111111111111111111111111111111');
//   username.value = res.user.remark;
 
// });
// 用户点击注销

function Nologin() {
  logout().then(() => {
    Cookies.remove("token");
    //  router.push("/login");
    location.href = "/index";
  });
}
function user() {
  router.push("/index");
}
// 时间
const formatTime = (data, flag) => {
  const date = new Date(data);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  let second = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  if (flag) {
    return y + "-" + m + "-" + d;
  }
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
};
onMounted(() => {
  // 时间
  setInterval(() => {
    nowTime.value = formatTime(new Date());
  });
});



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

    function reloadPage() {
    // 使用Vue Router的reload方法
    // $router.go(0);
 
    // 或者使用原生JavaScript
    window.location.reload();
  }
</script>

<style scoped>
.top {
  width: 100%;
  height: 25px;

  opacity: 0.8;
  z-index: 999;
  /* background-image: radial-gradient(#2f6e68, #111a1f); */
  /* background: url("../assets/nav.png") no-repeat; */
}
.el-icon--right {
  margin-top: 10px;
}
/* 导航栏左边按钮 */
.one,
.two,
.three {
  width: 150px;
  height: 40px;
  font-weight: 700;
  color: #fff;
  line-height: 40px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
}


/*  */
.active {
  width: 150px;
  height: 40px;
  font-weight: 700;
  border-radius: 0 80px 0 80px;
  margin: 0px 30px 10px 10px;
  color: rgb(6, 249, 224);
  list-style: none;
  font-size: 16px;
  line-height: 35px;
  border: 3px solid #09f9e5;
  /* background-color: rgb(18, 133, 87); */
}
.bar-title-right-box-first {
  width: 40px;
  height: 60px;
  /* margin-right: 10px; */
  line-height: 60px;
  color: #ccc;
  /* margin-top: 10px; */
  cursor: pointer;
  text-align: center;
}
.bar-title-right-box-two {
  width: 60px;
  height: 60px;
  /* margin-right: 10px; */
  font-size: 30px;
  line-height: 50px;
  color: #ccc;
  /* margin-top: 10px; */
  cursor: pointer;
}

#showTime {
  width: 200px;
  height: 25px;
  color: white;
  /* margin-right: 20px; */
  /* background-color: azure; */
  /* padding-top: 25px; */
  text-align:left;
  /* float: right; */
  font-size: 14px;
}
.nav-right {
  width: 500px;
  height: 60px;
  /* background-color: #09f9e5 !important; */
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#Weathera {
  width: 100px;
  height: 70px;

  /* background-color: red; */
}
* {
  padding: 0;
  margin: 0;
}

.home {
  height: 100%;
  min-width: 1920px;
}

a {
  text-decoration: none;
}

.header-bar {
  position: absolute;
  height: 40px;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background: url("../assets/head1.png") no-repeat;
  background-size: 100% 160%;
  /* min-width: 1920px; */
  z-index: 999;
}

.header-bar .nav-box {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-bar .nav-box .nav-left {
  width: 28.95833vw !important;
  display: flex;
  overflow: hidden;
  text-align: center;
  justify-content: space-around;
}

.header-bar .nav-box .nav-left .nav {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  line-height: 35px;
  width: 6.04167vw !important;
  height: 1.71875vw !important;
  color: #f6f6f6;
  font-size: 0.83333vw;
  font-family: Microsoft YaHei, Microsoft YaHei-Regulars;
  cursor: pointer;
  text-decoration: none;
  flex-grow: 1;
}
.header-bar .nav-box .nav-menu .nav .iconfont {
  margin-right: 6px;
}

.header-bar .nav-box .nav-left .nrrte {
  color: #f6f6f6;
  border-radius: 0 100px 0 100px;
  border: 2px solid #10e9fe;
  line-height: 20px;
  padding: 0 30px;
}

.header-bar .nav-box .nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  white-space: nowrap;
  align-items: center;
  overflow: hidden;
}

.header-bar .nav-box .nav-center .sys-logo {
  height: 65px;
  width: 100%;
  text-align: center;
  color: #f6f6f6;
  font-size: 27px;
  font-weight: 600;
  letter-spacing: 5px;
  padding-top: 20px;
}

.home {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1002;
  /* background: url(../imgs/fig.png) no-repeat; */
  background-size: 100% 100%;
  min-width: 1920px;
}

.main .main-left .box {
  position: absolute;
  height: 100%;
  width: 356px;
  top: 0;
  left: 0;
  z-index: 1002;
  /* background: url(../imgs/left.png) no-repeat; */
  background-size: 100% 100%;
}

.main .main-right .box {
  position: absolute;
  height: 100%;
  width: 356px;
  top: 0;
  right: 0;
  z-index: 1002;
  /* background: url(../imgs/right.png) no-repeat; */
  background-size: 100% 100%;
}
.el-dropdown-link > img {
  width: 50px;
  /* background-color: #10e9fe; */
}
</style>

  