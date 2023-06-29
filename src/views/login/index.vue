<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          ref="ruleFormRef"
          class="login_form"
          :model="loginForm"
          :rules="rules"
        >
          <h1>Hellow</h1>
          <h2>你好！！！！！！！</h2>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              size="default"
              @click="Login"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { getTime } from '@/utils/time'
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loginForm = reactive({
  username: 'admin',
  password: 'atguigu123',
})
// 点击登录
const Login = async () => {
  // ?校验通过再发请求
  await ruleFormRef.value?.validate()
  loading.value = true
  try {
    await userStore.userLogin(loginForm)
    const redirect: any = route.query.redirect
    loading.value = false
    router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
      duration: 2500,
    })
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  } finally {
    loading.value = false
  }
}
// 自定义校验规则
const validateUserName = (rule: any, value: any, callback: any) => {
  console.log(rule)
  if (value.length >= 5 && value.length <= 10) callback()
  else callback(new Error('账号长度w为5到10为'))
}

// 表单校验
const rules = reactive<FormRules>({
  username: [
    {
      validator: validateUserName,
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      min: 6,
      max: 15,
      message: '密码长度为6到15位',
      trigger: 'blur',
    },
  ],
})
</script>
<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}
.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px 60px;
  h1 {
    color: white;
    font-size: 40px;
  }
  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0px;
  }
  .login_btn {
    width: 100%;
  }
}
</style>
