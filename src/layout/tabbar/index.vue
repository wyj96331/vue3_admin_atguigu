<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb />
    </div>
    <div class="tabbar_right">
      <Settingvc />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '@/layout/tabbar/breadcrumb/index.vue'
import Settingvc from '@/layout/tabbar/settingvc/index.vue'
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .tabbar_left {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
  /* 添加卡片效果 */
  border-radius: 6px;
  // background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 10px;
}
</style>
