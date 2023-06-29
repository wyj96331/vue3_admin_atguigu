export interface ResponesData {
  code: number
  message: string
  ok: boolean
}
// 用户数据的类型
export interface UserData {
  id?: number
  createTime?: string
  updateTime?: string
  username?: string
  password?: string
  name?: string
  phone?: null
  roleName?: string
}

//获取管理用户分页列表返回数据的类型
export interface UserResponesData extends ResponesData {
  data: {
    records: UserData[]
    total: 10
    size: 2
    current: 1
    pages: 5
  }
}
export interface AssignRolesData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName?: string
  remark?: string
}

//根据用户获取角色回返数据的类型
export interface UserRoleResponesData extends ResponesData {
  data: {
    assignRoles: AssignRolesData[]
    allRolesList: AssignRolesData[]
  }
}
// 给用户分配职位接口参数的类型
export interface SetUserRoleData {
  roleIdList: number[]
  userId: number
}
