<template>
  <el-icon
    style="margin-right: 10px; cursor: pointer"
    :size="30"
    @click="changeIcon"
    class="active"
  >
    <!-- :style="{ color: isMouseOver ? activeColor : normalColor }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave" -->
    <component :is="SettingStore.fold ? 'Expand' : 'Fold'" />
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon>
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import useSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'
// const isMouseOver = ref(false)
// const normalColor = '#000000' // 原始颜色
// const activeColor = '#409EFF' // 激活颜色
const route = useRoute()
const SettingStore = useSettingStore()
const changeIcon = () => {
  SettingStore.fold = !SettingStore.fold
}
// const handleMouseEnter = () => {
//   isMouseOver.value = true
// }
// const handleMouseLeave = () => {
//   isMouseOver.value = false
// }
</script>

<style scoped>
.active:hover {
  color: #409eff; /* 设置激活状态下的图标颜色 */
}
</style>
