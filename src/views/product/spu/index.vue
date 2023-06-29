<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />
    <!-- SPU数据展示 -->
    <el-card style="margin: 10px 0" v-show="scene === 0">
      <el-button
        @click="addSpu"
        type="primary"
        icon="Plus"
        :disabled="useCategory.category3Id ? false : true"
      >
        添加SPU
      </el-button>
      <el-table :data="records" border style="margin: 10px 0">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column
          label="SPU描述"
          prop="description"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="280px" align="center">
          <template #="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              icon="Plus"
              @click="addSku(row)"
            >
              Add
            </el-button>
            <el-button
              link
              type="warning"
              size="small"
              icon="Edit"
              @click="updateSpu(row)"
            >
              Edit
            </el-button>
            <el-button
              link
              type="info"
              size="small"
              icon="InfoFilled"
              @click="showSkuInfo(row)"
            >
              Detail
            </el-button>
            <el-popconfirm
              :title="`确认删除${row.spuName}?`"
              @confirm="delSpu(row)"
            >
              <template #reference>
                <el-button link type="danger" size="small" icon="Delete">
                  Delete
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        background
        layout=" prev, pager, next, jumper, -> ,sizes, total"
        :total="total"
        class="mt-4"
        @current-change="getSpuInfo"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!-- 添加 | 修改 SPU子组件 -->
    <SpuForm
      ref="spu"
      v-show="scene === 1"
      @changeScene="changeScene"
      v-model:scene="scene"
    />
    <!-- 添加SKU子组件 -->
    <SkuForm ref="sku" v-show="scene === 2" @changeScene="changeScene" />
    <!-- dialog弹窗组件 -->
    <el-dialog title="SKU列表" v-model="show">
      <el-table border :data="skuInfo">
        <el-table-column label="SKU名字" prop="skuName"></el-table-column>
        <el-table-column label="SKU价格" prop="price"></el-table-column>
        <el-table-column label="SKU重量" prop="weight"></el-table-column>
        <el-table-column label="SKU图片">
          <template #="{ row }">
            <img
              :src="row.skuDefaultImg"
              style="widows: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import SkuForm from './component/skuForm.vue'
import SpuForm from './component/spuForm.vue'
import { ref, watch, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category'
import {
  getSpuInfoAPI,
  getSkuInfoAPI,
  delSkuAPI,
} from '@/api/product/spu/index'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
// 接收sku列表信息
const skuInfo = ref<SkuData[]>([])
// 控制dialog弹窗
const show = ref(false)
const useCategory = useCategoryStore()
// 子组件spu实例
const spu = ref<any>()
// 子组件sku实例
const sku = ref<any>()
/**
 * 场景数据
 * 0:显示spu，1:添加或修改已有的spu，2:添加sku (默认为0展示spu数据)
 */
const scene = ref(0)
// 当前页码数
const currentPage = ref(1)
// 每页显示条数
const pageSize = ref(5)
// 总条数
const total = ref()
// 存储已有的SPU数据
const records = ref<Records>([])
// 每页显示数据发生变化时
const handleSizeChange = () => {
  currentPage.value = 1
  getSpuInfo()
}
// 获取spu数据 封装可以多次捞数据
const getSpuInfo = async () => {
  const res: HasSpuResponseData = await getSpuInfoAPI(
    currentPage.value,
    pageSize.value,
    useCategory.category3Id,
  )
  if (res.code === 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}
// 添加spu
const addSpu = () => {
  currentPage.value = 1
  scene.value = 1
  spu.value.initAddSpu(useCategory.category3Id)
}
// 修改spu
const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 调用子组件对外暴露的方法
  spu.value.initHasSpuData(row)
}
// spu自定义事件回调
const changeScene = (value: number) => {
  scene.value = value
  getSpuInfo()
}
// 添加一个sku
const addSku = (row: SpuData) => {
  scene.value = 2
  sku.value.initSkuData(useCategory, row)
}
// 查看sku列表信息
const showSkuInfo = async (row: SpuData) => {
  const res: SkuInfoData = await getSkuInfoAPI(row.id as number)
  if (res.code === 200) {
    skuInfo.value = res.data
    show.value = true
  }
}
// 删除spu
const delSpu = async (row: SpuData) => {
  const res: any = await delSkuAPI(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getSpuInfo()
  } else ElMessage.error('删除失败')
}
watch(
  () => useCategory.category3Id,
  () => {
    if (!useCategory.category3Id) return
    getSpuInfo()
  },
)
// 组件销毁前清空仓库的数据
onBeforeUnmount(() => useCategory.$reset())
</script>

<style scoped></style>
