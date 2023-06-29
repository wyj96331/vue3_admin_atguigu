import { createRouter, createWebHistory } from 'vue-router'
import { constantRoute } from './routes'
// 创建路由实例
const router = createRouter({
  // ?路由模式为哈希模式
  history: createWebHistory(),
  routes: constantRoute,
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})
// 导出路由实例
export default router
