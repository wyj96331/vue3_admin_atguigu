import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI, getUserInfoAPI, logoutAPI } from '@/api/user'
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cloneDeep from 'lodash/cloneDeep'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import router from '@/router'
// 使用map方法过滤异步路由
const filterAsyncRoute = (asyncRoute: any, routes: any) => {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}
const useUserStore = defineStore('user', () => {
  // 按钮权限
  const buttons = ref<string[]>([])
  // 定义token
  const token = ref(localStorage.getItem('token'))
  // 路由信息
  const menuRoutes = ref(constantRoute)
  // 用户信息
  const username = ref('')
  const avatar = ref('')
  // 用户登录，获取token
  const userLogin = async (data: loginFormData) => {
    const result: loginResponseData = await loginAPI(data)
    console.log(result)
    if (result.code === 200) {
      token.value = result.data as string
      localStorage.setItem('token', token.value)
      return true
    } else {
      return Promise.reject(new Error(result.data))
    }
  }
  // 获取用户信息
  const getUserInfo = async () => {
    const res: userInfoResponseData = await getUserInfoAPI()
    if (res.code === 200) {
      username.value = res.data.name
      avatar.value = res.data.avatar
      buttons.value = res.data.buttons
      // 获取用户异步路由
      const userAsyncRoute = filterAsyncRoute(
        cloneDeep(asyncRoute),
        res.data.routes,
      )
      // 菜单数据
      menuRoutes.value = [...constantRoute, ...userAsyncRoute, ...anyRoute]
      const arr1 = [...userAsyncRoute, ...anyRoute]
      arr1.forEach((item: any) => router.addRoute(item))
      return true
    } else return Promise.reject(new Error(res.message))
  }
  // 退出登录 清除用户数据
  const userLogOut = async () => {
    const res: any = await logoutAPI()
    if (res.code === 200) {
      token.value = ''
      username.value = ''
      avatar.value = ''
      localStorage.removeItem('token')
      return 'ok'
    } else {
      return Promise.reject(new Error(res.message))
    }
  }
  return {
    token,
    username,
    avatar,
    menuRoutes,
    buttons,
    userLogin,
    getUserInfo,
    userLogOut,
  }
})
export default useUserStore
