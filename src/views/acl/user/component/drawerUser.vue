<template>
  <el-drawer
    :model-value="showDrawer"
    :with-header="true"
    @closed="drawerClose"
  >
    <template #header>
      <h4>{{ userInfoParams.id ? '更新用户信息' : '添加用户信息' }}</h4>
    </template>
    <template #default>
      <el-form :model="userInfoParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请输入用户的姓名"
            v-model="userInfoParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请输入用户的昵称"
            v-model="userInfoParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户密码"
          prop="password"
          v-if="!userInfoParams.id"
        >
          <el-input
            placeholder="请输入用户的密码"
            v-model="userInfoParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="cancelClick">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { UserData } from '@/api/acl/user/type'
import { addOrUpdateUserInfoAPI } from '@/api/acl/user/index'
import { ElMessage } from 'element-plus'
const prop = defineProps<{
  showDrawer: boolean
  // userData?: UserData
  userData: UserData | undefined
}>()
const emit = defineEmits([
  'update:showDrawer',
  'update:userData',
  'getUserInfo',
])
// 获取表单实例
const formRef = ref<any>()
// 校验用户姓名的回调
const validatorUsername = (rule: any, value: any, callBack: any) => {
  console.log(rule)
  const trimmedValue = value.trim() // 去除字符串两端的空格
  if (trimmedValue.length < 5 || trimmedValue.length > 10)
    callBack(new Error('用户名长度必须在5到10位之间'))
  else if (trimmedValue.includes(' ')) callBack(new Error('用户名不能包含空格'))
  else callBack() // 校验通过，不传递任何参数
}
// 校验姓名的回调
const validatorName = (rule: any, value: any, callBack: any) => {
  console.log(rule)
  const trimmedValue = value.trim() // 去除字符串两端的空格
  if (trimmedValue.length < 5 || trimmedValue.length > 10)
    callBack(new Error('用户昵称长度必须在5到10位之间'))
  else if (trimmedValue.includes(' '))
    callBack(new Error('用户昵称不能包含空格'))
  else callBack() // 校验通过，不传递任何参数
}
// 校验密码的回调
const validatorPassword = (rule: any, value: any, callBack: any) => {
  console.log(rule)
  const trimmedValue = value.trim() // 去除字符串两端的空格
  if (trimmedValue.length < 5 || trimmedValue.length > 16)
    callBack(new Error('密码长度必须在5到16位之间'))
  else if (trimmedValue.includes(' ')) callBack(new Error('密码不能包含空格'))
  else callBack() // 校验通过，不传递任何参数
}
// 表单验证的规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
// 收集用户信息参数
const userInfoParams = reactive<UserData>({
  username: '',
  name: '',
  password: '',
})
// 抽屉关闭后的回调
const drawerClose = () => {
  emit('update:showDrawer', false)
  emit('update:userData', false)
  Object.assign(userInfoParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 抽屉关闭时清除错误的提示信息
  formRef.value.clearValidate('username')
  formRef.value.clearValidate('name')
  formRef.value.clearValidate('password')
}
// 确定按钮的回调
const save = async () => {
  await formRef.value.validate()
  const res: any = await addOrUpdateUserInfoAPI(userInfoParams)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: userInfoParams.id ? '更新成功' : '添加成功',
    })
    emit('update:showDrawer', false)
    emit('getUserInfo')
    // 浏览器自动刷新
    // window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: userInfoParams.id ? '更新失败' : '添加失败',
    })
    emit('update:showDrawer', false)
  }
}
// 取消按钮的回调
const cancelClick = () => {
  emit('update:showDrawer', false)
}
watch(
  () => prop.userData,
  (newUserData) => {
    if (newUserData) Object.assign(userInfoParams, newUserData)
  },
)
</script>
