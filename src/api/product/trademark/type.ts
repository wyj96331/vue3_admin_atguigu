export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 已有品牌的数据类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
}

export type Records = TradeMark[]

export interface TradeMarkResponseData extends ResponseData {
  data: {
    searchCount: boolean
    orders: []
    optimizeCountSql: boolean
    maxLimit: null
    hitCount: boolean
    countId: null
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}
