import request from '@/utils/request'
import type {
  UserResponesData,
  UserData,
  UserRoleResponesData,
  SetUserRoleData,
} from './type'
/**
 * 获取管理用户分页列表
 * @param page
 * @param limit
 * @returns
 */
export const getUserInfoAPI = (
  page: number,
  limit: number,
  username: string,
) => {
  return request<any, UserResponesData>({
    url: `/admin/acl/user/${page}/${limit}/?username=${username}`,
  })
}
/**
 * 添加或修改用户信息
 * @param data
 * @returns
 */
export const addOrUpdateUserInfoAPI = (data: UserData) => {
  if (data.id)
    return request<any, any>({
      url: '/admin/acl/user/update',
      method: 'PUT',
      data,
    })
  else
    return request<any, any>({
      url: '/admin/acl/user/save',
      method: 'POSt',
      data,
    })
}

/**
 * 根据用户获取角色数据
 * @param adminId
 * @returns
 */
export const getUserRoleAPI = (adminId: number) => {
  return request<any, UserRoleResponesData>({
    url: `/admin/acl/user/toAssign/${adminId}`,
  })
}

/**
 * 根据用户分配角色
 * @param data
 * @returns
 */
export const setUserRoleAPI = (data: SetUserRoleData) => {
  return request<any, any>({
    url: '/admin/acl/user/doAssignRole',
    method: 'POST',
    data,
  })
}
/**
 * 删除某个用户的信息
 * @param id
 * @returns
 */
export const delUserAPI = (id: number) => {
  return request<any, any>({
    url: `/admin/acl/user/remove/${id}`,
    method: 'DELETE',
  })
}

export const delUserListAPI = (idList: number[]) => {
  return request<any, any>({
    url: '/admin/acl/user/batchRemove',
    method: 'DELETE',
    data: idList,
  })
}
