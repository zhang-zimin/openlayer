<template>
  <div>
    <!-- <div>
      <TopCom class="zoomStyle" />
    </div> -->
    <MenuAux/>
  </div>
</template>

<script setup>
//   import TopCom from "@/components/home/TopCom.vue"
import MenuAux from "@/components/River.vue"
import { onMounted } from "vue";
onMounted(() => {
  (function (doc, win) {
    var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      //orientationchange :检测屏幕发生反转时，就是是横屏还是竖屏时
      recalc = function () {
        var clientWidth = docEl.clientWidth;
        //clientWidth :就是设备的宽度
        if (!clientWidth) return;
        // 这里的375 取决于设计稿的宽度,1rem=100px  1024以上为PC
        if (clientWidth >= 1024) {
          docEl.style.fontSize = '16px';
          var zoomStyle = doc.querySelectorAll('.zoomStyle')
          for (let i = 0; i < zoomStyle.length; i++) {
            const element = zoomStyle[i];
            element.style.cssText = 'zoom:' + (clientWidth / 1920).toFixed(4);
          }
        }
      };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    recalc();
  })(document, window)
})
</script>

<style scoped>
.zoomStyle{
  position: fixed;
  top: 0;
}
</style>