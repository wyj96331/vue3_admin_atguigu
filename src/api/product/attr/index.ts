import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'
/**
 * 获取一级分类
 * @returns
 */
export const getCategory1API = () => {
  return request<any, CategoryResponseData>({
    url: '/admin/product/getCategory1',
  })
}
/**
 * 获取二级分类
 * @param category1Id
 * @returns
 */
export const getCategory2API = (category1Id: number | string) => {
  return request<any, CategoryResponseData>({
    url: `/admin/product/getCategory2/${category1Id}`,
  })
}
/**
 * 获取三级分类
 * @param category2Id
 * @returns
 */
export const getCategory3API = (category2Id: number | string) => {
  return request<any, CategoryResponseData>({
    url: `/admin/product/getCategory3/${category2Id}`,
  })
}

/**
 * 获取分类的属性及属性值
 */
export const getAttrInfoAPI = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) => {
  return request<any, AttrResponseData>({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  })
}
/**
 * 添加或更新属性及属性值
 * @param data
 * @returns
 */
export const addOrUpdateAttrAPI = (data: Attr) => {
  return request<any, any>({
    url: '/admin/product/saveAttrInfo',
    method: 'POST',
    data,
  })
}

/**
 * 删除属性
 * @param attrId
 * @returns
 */
export const delAttrAPI = (attrId: number) => {
  return request<any, any>({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'DELETE',
  })
}
