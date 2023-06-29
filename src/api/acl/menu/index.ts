import request from '@/utils/request'
import type { PermissionResponesData, MenuParams } from './type.ts'
/**
 * 获取权限菜单
 * @returns
 */
export const getPermissionAPI = () => {
  return request<any, PermissionResponesData>({
    url: '/admin/acl/permission',
  })
}

/**
 * 更新或新增菜单权限
 * @param data
 * @returns
 */
export const addOrUpdateMenuAPI = (data: MenuParams) => {
  // 更新
  if (data.id)
    return request<any, any>({
      url: '/admin/acl/permission/update',
      method: 'PUT',
      data,
    })
  //新增
  else
    return request<any, any>({
      url: '/admin/acl/permission/save',
      method: 'POST',
      data,
    })
}

/**
 * 删除菜单
 * @param id
 * @returns
 */
export const delMenuAPI = (id: number) => {
  return request<any, any>({
    url: `/admin/acl/permission/remove/${id}`,
    method: 'DELETE',
  })
}
