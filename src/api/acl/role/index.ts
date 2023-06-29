import request from '@/utils/request'
import type { RoleResponesData, RoleData, MenuListResponesData } from './type'
/**
 * GET 获取角色分页列表
 * @param page
 * @param limit
 * @returns
 */
export const getRoleInfoAPI = (
  page: number,
  limit: number,
  roleName: string,
) => {
  return request<any, RoleResponesData>({
    url: `/admin/acl/role/${page}/${limit}/?roleName=${roleName}`,
  })
}
/**
 * 新增角色或添加
 * @param data
 * @returns
 */
export const addOrUpdateRoleInfoAPI = (data: RoleData) => {
  // 更新
  if (data.id)
    return request<any, any>({
      url: '/admin/acl/role/update',
      method: 'PUT',
      data,
    })
  // 添加
  else
    return request<any, any>({
      url: '/admin/acl/role/save',
      method: 'POST',
      data,
    })
}

/**
 * 根据角色获取菜单
 * @param roleId
 * @returns
 */
export const getAllMenuListAPI = (roleId: number) => {
  return request<any, MenuListResponesData>({
    url: `/admin/acl/permission/toAssign/${roleId}`,
  })
}
/**
 * 给角色分配权限
 * @param roleId
 * @param permissionId
 * @returns
 */
export const setPermisstionAPI = (roleId: number, permissionId: number[]) => {
  return request<any, any>({
    url: `/admin/acl/permission/doAssign/?roleId=${roleId}&permissionId=${permissionId}`,
    method: 'POST',
  })
}
/**
 * 删除角色
 * @param roleId
 * @returns
 */
export const delRoleInfoAPI = (roleId: number) => {
  return request<any, any>({
    url: `/admin/acl/role/remove/${roleId}`,
    method: 'DELETE',
  })
}
