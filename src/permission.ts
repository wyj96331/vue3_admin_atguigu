import router from './router'
import NProgress from 'nprogress' // 导入 nprogress模块
import 'nprogress/nprogress.css' // 导入样式，否则看不到效果
import useUserStore from '@/store/modules/user'
import pinia from './store'
NProgress.configure({ showSpinner: false }) // 显示右上角螺旋加载提示
const userStore = useUserStore(pinia)
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title as string
  console.log(from)
  NProgress.start()
  const token = userStore.token
  const username = userStore.username
  // if (token) {
  //   if (to.path === '/login') {
  //     next('/')
  //   } else {
  //     if (username) {
  //       next()
  //     } else {
  //       try {
  //         await userStore.getUserInfo()
  //         next()
  //       } catch (err) {
  //         console.log(err)
  //         userStore.userLogOut()
  //         next({ path: '/login' })
  //       }
  //     }
  //   }
  // } else {
  //   if (to.path === '/login') {
  //     next()
  //   } else {
  //     next({ path: '/login', query: { redirect: to.path } })
  //   }
  // }
  // if (token) {
  //   if (to.path === '/login') next('/')
  //   else if (username) next()
  //   else {
  //     try {
  //       await userStore.getUserInfo()
  //       next()
  //     } catch (err) {
  //       await userStore.userLogOut()
  //       next({ path: '/login', query: { redirect: to.path } })
  //     }
  //   }
  // } else {
  //   if (to.path === '/login') next()
  //   else next({ path: '/login', query: { redirect: to.path } })
  // }
  if (token && to.path !== '/login' && username) next()
  if (token && to.path !== '/login' && !username) {
    try {
      await userStore.getUserInfo()
      next({ ...to })
    } catch {
      userStore.userLogOut()
      next({ path: '/login' })
    }
  }
  if (token && to.path === '/login') next('/')
  if (!token && to.path !== '/login')
    next({ path: '/login', query: { redirect: to.path } })
  if (!token && to.path === '/login') next()
})

router.afterEach(() => {
  NProgress.done()
})
