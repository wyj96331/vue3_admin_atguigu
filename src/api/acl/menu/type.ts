export interface ResponesData {
  code: number
  message: string
  ok: boolean
}

// 菜单数据和按钮数据的类型
export interface Permission {
  id?: number
  createTime?: string
  updateTime?: string
  pid?: number
  name: string
  code?: string
  toCode?: string
  type?: number
  status?: string
  level: 1
  children?: Permission[]
  select: boolean
}

// 菜单接口返回数据的类型
export interface PermissionResponesData extends ResponesData {
  data: Permission[]
}

// 更新或新增接口参数的类型
export interface MenuParams {
  id?: number
  code: string // 权限值
  name: string // 菜单名字
  level: number // 几级菜单
  pid: number
}
