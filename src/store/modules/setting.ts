import { defineStore } from 'pinia'
import { ref } from 'vue'
const useSettingStore = defineStore('setting', () => {
  const fold = ref(false)
  const refresh = ref(false)
  return { fold, refresh }
})
export default useSettingStore
