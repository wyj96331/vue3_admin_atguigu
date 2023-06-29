<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flage" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import useSettingStore from '@/store/modules/setting'
const settingStore = useSettingStore()
const flage = ref(true)
watch(
  () => settingStore.refresh,
  () => {
    flage.value = false
    nextTick(() => {
      flage.value = true
    })
  },
)
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: 1s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
