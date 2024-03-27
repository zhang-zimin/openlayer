import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {                
    //host: '0.0.0.0'
    // 配置https代理与证书
    //https: {
    //  key: fs.readFileSync('cert/8982715__nsfocus.com.key'),
    //  cert: fs.readFileSync('cert/8982715__nsfocus.com.pem')
    //},// 是否开启 https
    open: false, // 是否自动在浏览器打开
    //port: 8889, // 端口号
    host: "0.0.0.0",
    //这里的ip和端口是前端项目的;下面为需要跨域访问后端项目
    proxy: {
      '/api': {   // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
        target: 'http://192.168.0.102:9602',//这里填入你要请求的接口的前缀
        //ws: false,//代理websocked
        changeOrigin: true,  //是否跨域
        //secure: true,  //是否https接口
        // pathRewrite:{  // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
        //   "^/": "/"
        // },
      //   headers: {
      //     referer: 'https://uat.nsfocus.com/api/input_suggest', //这里后端做了拒绝策略限制，请求头必须携带referer，否则无法访问后台
      //   }
      // 路径重写规则，这里将 /api 开头的请求路径替换为空字符串，即去掉 /api 前缀
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  } 
})
