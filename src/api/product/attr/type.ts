export interface ResponesData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
  category3Id?: number
}
// 接口返回数据类型
export interface CategoryResponseData extends ResponesData {
  data: CategoryObj[]
}

// 属性值对象
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  editing?: boolean
}

// 存储属性值的数组类型
export type AttrValueList = AttrValue[]

// 属性对象
export interface Attr {
  attrIdAndValueId?: number | string
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}

//存储属性对象的数组类型
export type AttrList = Attr[]

// 属性接口返回的数据类型
export interface AttrResponseData extends ResponesData {
  data: Attr[]
}
