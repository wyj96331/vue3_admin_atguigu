import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'
/**
 * 获取品牌信息
 * @param page
 * @param limit
 * @returns
 */
export const getTradeMarkInfoAPI = (page: number, limit: number) => {
  return request<any, TradeMarkResponseData>({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
  })
}
/**
 * 添加或新增一个品牌
 * @param data
 * @returns
 */
export const addOrUpdataTradeMarkAPI = (data: TradeMark) => {
  if (data.id) {
    return request<any, any>({
      url: '/admin/product/baseTrademark/update',
      method: 'PUT',
      data,
    })
  } else {
    return request<any, any>({
      url: '/admin/product/baseTrademark/save',
      method: 'POST',
      data,
    })
  }
}
/**
 * 删除
 * @param id
 * @returns
 */
export const delTradeMarkAPI = (id: number) => {
  return request<any, any>({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'DELETE',
  })
}
