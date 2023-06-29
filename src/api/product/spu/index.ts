import request from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTradeMark,
  SpuImageData,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'

/**
 * 获取spu信息
 * @param page
 * @param limit
 * @param category3Id
 * @returns
 */
export const getSpuInfoAPI = (
  page: number,
  limit: number,
  category3Id: number | string,
) => {
  return request<any, HasSpuResponseData>({
    url: `/admin/product/${page}/${limit}?category3Id=${category3Id}`,
  })
}

/**
 * 获取全部品牌数据
 * @returns
 */
export const getTradeMarkListAPI = () => {
  return request<any, AllTradeMark>({
    url: '/admin/product/baseTrademark/getTrademarkList',
  })
}

/**
 * 获取spu下的商品图片
 * @param spuId
 * @returns
 */
export const getSpuImageListAPI = (spuId: string | number) => {
  return request<any, SpuImageData>({
    url: `/admin/product/spuImageList/${spuId}`,
  })
}

/**
 * 获取某个spu下的销售属性对象
 * @param spuId
 * @returns
 */
export const getSpuSaleAttrListAPI = (spuId: string | number) => {
  return request<any, SaleAttrResponseData>({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
  })
}

/**
 * 获取整个项目的全部销售属性
 * @returns
 */
export const getBaseSaleAttrListAPI = () => {
  return request<any, HasSaleAttrResponseData>({
    url: '/admin/product/baseSaleAttrList',
  })
}
/**
 * 更新或添加spu
 * @param data
 * @returns
 */
export const addOrUpdateSpuInfoAPI = (data: SpuData) => {
  // 有id则更新spu
  if (data.id)
    return request<any, any>({
      url: '/admin/product/updateSpuInfo',
      method: 'POST',
      data,
    })
  // 无id为添加spu
  else
    return request<any, any>({
      url: '/admin/product/saveSpuInfo',
      method: 'POST',
      data,
    })
}

/**
 * 给spu添加sku属性
 * @param data
 * @returns
 */
export const saveSkuInfoAPI = (data: SkuData) => {
  return request<any, any>({
    url: '/admin/product/saveSkuInfo',
    method: 'POST',
    data,
  })
}

/**
 * 根据spuid获取sku的信息
 * @param spuId
 * @returns
 */
export const getSkuInfoAPI = (spuId: number | string) => {
  return request<any, SkuInfoData>({
    url: `/admin/product/findBySpuId/${spuId}`,
  })
}

/**
 * 删除spu
 * @param spuId
 * @returns
 */
export const delSkuAPI = (spuId: number | string) => {
  return request<any, any>({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'DELETE',
  })
}
