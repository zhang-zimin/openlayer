import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 空白
    {
      path: '/',
      name: 'index',
      component: () => import('../views/IndexView.vue')
    },

    // 首页
    {
      path: '/home',
      name: 'home',
      // component: HomeView,
      component: () => import('../views/HomeView.vue')
    },

    // 总量分析
    {
      path: '/analysis',
      name: 'analysis',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AnalysisView.vue')
    },

    // 总量控制计算
    {
      path: '/river',
      name: 'river',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RiverView.vue')
    },
  ]
})

export default router
