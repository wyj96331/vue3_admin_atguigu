<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          v-model="useCategory.category1Id"
          @change="handelGetc2"
        >
          <el-option
            v-for="item in useCategory.category1List"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          v-model="useCategory.category2Id"
          @change="handelGetc3"
        >
          <el-option
            v-for="item in useCategory.category2List"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          v-model="useCategory.category3Id"
        >
          <el-option
            v-for="item in useCategory.category3List"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { onMounted } from 'vue'
const useCategory = useCategoryStore()
// 一级分类发生变化时 获取二级分类数据
const handelGetc2 = () => {
  // 清空二级分类id 和 三级分类数据和id
  useCategory.category2Id = ''
  useCategory.category3List = []
  useCategory.category3Id = ''
  useCategory.getCategory2()
}
// 二级分类发生变化时 获取三级分类数据
const handelGetc3 = () => {
  useCategory.category3Id = ''
  useCategory.getCategory3()
}
defineProps(['scene'])
onMounted(() => useCategory.getCategory1())
</script>

<style lang="scss" scoped></style>
