import request from '@/utils/request'
import type { SkuResponesData, SkuDetailInfoData } from './type'
/**
 *获取sku列表信息
 * @param page 当前页码数
 * @param limit 每页显示条数
 * @returns
 */
export const getSkuInfoAPI = (page: number, limit: number) => {
  return request<any, SkuResponesData>({
    url: `/admin/product/list/${page}/${limit}`,
  })
}
/**
 * 商品上架
 * @param skuId
 * @returns
 */
export const getOnSaleAPI = (skuId: number) => {
  return request<any, any>({
    url: `/admin/product/onSale/${skuId}`,
  })
}

/**
 * 商品下架
 * @param skuId
 * @returns
 */
export const getCancelSaleAPI = (skuId: number) => {
  return request<any, any>({
    url: `/admin/product/cancelSale/${skuId}`,
  })
}

/**
 * 获取某个sku的详细信息
 * @param skuId
 * @returns
 */
export const getSkuDetailInfoAPI = (skuId: number) => {
  return request<any, SkuDetailInfoData>({
    url: `/admin/product/getSkuInfo/${skuId}`,
  })
}
/**
 * 删除sku
 * @param skuId
 * @returns
 */
export const delSkuAPI = (skuId: number) => {
  return request<any, any>({
    url: `/admin/product/deleteSku/${skuId}`,
    method: 'DELETE',
  })
}
