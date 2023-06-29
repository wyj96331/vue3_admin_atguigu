// ?用户相关接口
import request from '@/utils/request'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from './type'
// enum API {
//   LOGIN_API = '/admin/acl/index/login',
// }

/**
 * 登录
 * @param data
 * @returns
 */
export const loginAPI = (data: loginFormData) => {
  return request<any, loginResponseData>({
    url: '/admin/acl/index/login',
    method: 'POST',
    data,
  })
}
/**
 *获取用户信息
 * @returns
 */
export const getUserInfoAPI = () => {
  return request<any, userInfoResponseData>({
    url: '/admin/acl/index/info',
  })
}

/**
 * 退出登录
 * @returns
 */
export const logoutAPI = () => {
  return request<any, any>({
    url: '/admin/acl/index/logout',
    method: 'post',
  })
}
