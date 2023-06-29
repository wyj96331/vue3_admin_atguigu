export interface ResponesData {
  code: number
  message: string
  ok: boolean
}

// 角色数据的类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: string
}
// 获取角色分页列表接口返回数据的类型
export interface RoleResponesData extends ResponesData {
  data: {
    records: RoleData[]
    total: number
    size: number
    current: number
    orders?: []
    optimizeCountSql?: boolean
    hitCount?: boolean
    countId?: string
    maxLimit?: string
    searchCount?: boolean
    pages: number
  }
}
export interface ChildrenData {
  id: number
  createTime?: string
  updateTime?: string
  pid?: number
  name: string
  code?: string
  toCode?: string
  type?: number
  status?: string
  level?: number
  children?: MenuList
  select?: boolean
}
export type MenuList = ChildrenData[]
// 根据角色获取菜单接口返回数据的类型
export interface MenuListResponesData extends ResponesData {
  data: MenuList
}
