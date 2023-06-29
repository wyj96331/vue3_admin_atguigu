<template>
  <el-button icon="Refresh" circle @click="onRefresh"></el-button>
  <el-button icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover placement="bottom" title="设置主题" :width="300" trigger="click">
    <el-form>
      <el-form-item label="主题颜色" class="item">
        <el-color-picker @change="serColor" v-model="color" />
      </el-form-item>
      <el-form-item label="黑夜模式" class="item">
        <el-switch v-model="dark" @change="changeModel" />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <router-link to="/home">
    <img
      :src="userStore.avatar"
      style="height: 24px; width: 24px; margin: 0 15px; border-radius: 50%"
    />
  </router-link>

  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
const dark = ref(true)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const settingStore = useSettingStore()
const color = ref('#409EFF')
// 点击刷新的回调
const onRefresh = () => {
  settingStore.refresh = !settingStore.refresh
}
// 全屏的回调
const fullScreen = () => {
  let full = document.fullscreenElement
  // 实现全屏
  if (!full) document.documentElement.requestFullscreen()
  // 退出全屏
  else document.exitFullscreen()
}
// 退出登录
const logout = async () => {
  // 清除用户数据
  await userStore.userLogOut()
  // 跳转路由
  router.push({ path: '/login', query: { redirect: route.path } })
}
// switch开关change事件的回调
const changeModel = () => {
  // 获取根节点
  const html = document.documentElement
  // 判断根节点是否有dark类名
  dark.value ? (html.className = 'dark') : (html.className = '')
}
// 颜色选择器的change事件
const serColor = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style scoped>
.item {
  justify-content: space-between;
}
::v-deep .el-form-item__content {
  flex: unset;
}
</style>
