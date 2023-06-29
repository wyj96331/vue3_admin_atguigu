export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImage[]
}

export type Records = SpuData[]

export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
// 品牌数据的ts类型
export interface TradeMark {
  id: number
  tmName: string
  logoUrl: string
}

// 品牌接口返回的数据类型
export interface AllTradeMark extends ResponseData {
  data: TradeMark[]
}

// 商品图片的ts类型
export interface SpuImage {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}
// 获取spu图片接口的返回的数据类型
export interface SpuImageData extends ResponseData {
  data: SpuImage[]
}

// 已有的销售属性值的对象数据类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象
export interface SaleAttr {
  saleIdAndValueId?: number | string
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flage?: boolean
  saleAttrValue?: string
}

// 获取销售属性对象接口的返回数据类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

export interface HasSaleAttr {
  id: number
  name: string
}

// 获取整个项目销售属性接口的返回的数据类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
export interface SkuAttrValue {
  attrId: string | number
  valueId: string | number
}
export interface skuSaleAttrValue {
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
}

export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
