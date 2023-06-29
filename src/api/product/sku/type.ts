export interface ResponesData {
  code: number
  message: string
  ok: boolean
}
// sku对象类型
export interface SkuAttrValue {
  id?: number | string
  attrName?: string
  attrId: string | number
  valueId: string | number
}
export interface skuSaleAttrValue {
  id?: number | string
  saleAttrName?: string
  saleAttrId: string | number
  saleAttrValueId: string | number
}
export interface SkuData {
  category3Id: string | number
  spuId: string | number
  tmId: string | number
  skuName: string
  price: string | number
  weight: string | number
  skuDesc: string
  skuAttrValueList: SkuAttrValue[]
  skuSaleAttrValueList: skuSaleAttrValue[]
  skuDefaultImg: string
  isSale?: number
  id?: number
  skuImageList?: SkuIgmData[]
}

// 获取sku列表接口返回的数据的类型
export interface SkuResponesData extends ResponesData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 获取某个sku详细信息接口返回数据的类型
export interface SkuDetailInfoData extends ResponesData {
  data: SkuData
}

export interface SkuIgmData {
  id?: number
  createTime?: string
  updateTime?: string
  skuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
  isDefault?: number | string
  spuImgId?: number
}
