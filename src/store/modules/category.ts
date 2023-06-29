import { defineStore } from 'pinia'
import {
  getCategory1API,
  getCategory2API,
  getCategory3API,
} from '@/api/product/attr/index'
import { ref } from 'vue'
import { CategoryObj, CategoryResponseData } from '@/api/product/attr/type'
const useCategoryStore = defineStore('category', () => {
  // 存储一级分类数据
  const category1List = ref<CategoryObj[]>([])
  // 存储一级分类id
  const category1Id = ref<string | number>('')
  // 存储二级分类数据
  const category2List = ref<CategoryObj[]>([])
  // 存储二级分类id
  const category2Id = ref<string | number>('')
  // 存储三级分类数据
  const category3List = ref<CategoryObj[]>([])
  // 存储三级分类id
  const category3Id = ref<string | number>('')
  // 获取一级分类方法
  const getCategory1 = async () => {
    const res: CategoryResponseData = await getCategory1API()
    if (res.code === 200) category1List.value = res.data
  }
  // 获取二级分类方法
  const getCategory2 = async () => {
    const res: CategoryResponseData = await getCategory2API(category1Id.value)
    if (res.code === 200) category2List.value = res.data
  }
  // 获取三级分类方法
  const getCategory3 = async () => {
    const res: CategoryResponseData = await getCategory3API(category2Id.value)
    if (res.code === 200) category3List.value = res.data
  }
  return {
    category1List,
    category1Id,
    category2List,
    category2Id,
    category3List,
    category3Id,
    getCategory1,
    getCategory2,
    getCategory3,
  }
})
export default useCategoryStore
