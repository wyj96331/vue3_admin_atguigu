export interface loginFormData {
  username: string
  password: string
}

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 登录返回的数据类型
export interface loginResponseData extends ResponseData {
  data: string
}

// 获取用户数据返回的数据类型
export interface userInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
