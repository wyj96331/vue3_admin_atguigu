el-menu-item
<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: useSetting.fold }">
      <Logo />
      <!-- 菜单组件 -->
      <el-scrollbar class="scrollbar">
        <el-menu
          :collapse="useSetting.fold ? true : false"
          :default-active="routes.path"
          background-color="#001529"
          text-color="white"
          style="width: 100%"
        >
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 导航栏 -->
    <div
      class="layout_tabbar"
      :class="{ fold: useSetting.fold ? true : false }"
    >
      <Tabbar />
    </div>
    <!-- 内容展示区 -->
    <div class="layout_main" :class="{ fold: useSetting.fold ? true : false }">
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/layout/logo/index.vue'
import Menu from '@/layout/menu/index.vue'
import useUserStore from '@/store/modules/user'
import Main from '@/layout/main/index.vue'
import { useRoute } from 'vue-router'
import Tabbar from '@/layout/tabbar/index.vue'
import useSettingStore from '@/store/modules/setting'
const useSetting = useSettingStore()
const routes = useRoute()
const userStore = useUserStore()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.5s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
    &.fold {
      width: $base-menu-min-width; /* 折叠状态下的宽度 */
    }

    &:not(.fold) {
      width: $base-menu-width; /* 展开状态下的宽度 */
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.5s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.5s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
