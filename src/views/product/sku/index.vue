<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column
        type="index"
        width="80px"
        label="序号"
        align="center"
      ></el-table-column>
      <el-table-column
        width="150px"
        label="名称"
        show-overflow-tooltip
        align="center"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        width="200px"
        label="描述"
        show-overflow-tooltip
        align="center"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column width="200px" label="图片" align="center">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        width="150px"
        label="重量"
        align="center"
        prop="weight"
      ></el-table-column>
      <el-table-column
        width="150px"
        label="价格"
        align="center"
        prop="price"
      ></el-table-column>
      <el-table-column width="300px" label="操作" align="center" fixed="right">
        <template #="{ row }">
          <el-button
            :type="row.isSale === 1 ? 'info' : 'success'"
            size="small"
            :icon="row.isSale === 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button type="warning" size="small" icon="Edit"></el-button>
          <el-button
            type="primary"
            size="small"
            icon="InfoFilled"
            @click="showDetail(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${row.skuName}?`"
            @confirm="delSku(row)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 抽屉组件 -->
    <el-drawer v-model="drawer">
      <template #header><h4>查看商品详情</h4></template>
      <template #default>
        <el-row style="margin: 20px 0">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuDetailInfo?.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 20px 0">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuDetailInfo?.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 20px 0">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuDetailInfo?.price }}</el-col>
        </el-row>
        <el-row style="margin: 20px 0">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuDetailInfo?.skuAttrValueList"
              :key="item.attrId"
              style="margin: 0 5px"
            >
              {{ item.attrName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 0">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuDetailInfo?.skuSaleAttrValueList"
              :key="item.id"
              style="margin: 0 5px"
            >
              {{ item.saleAttrName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 0">
          <el-col :span="6">图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuDetailInfo?.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" style="width: 150px; height: 200px" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import type {
  SkuData,
  SkuResponesData,
  SkuDetailInfoData,
} from '@/api/product/sku/type'
import {
  getSkuInfoAPI,
  getOnSaleAPI,
  getCancelSaleAPI,
  getSkuDetailInfoAPI,
  delSkuAPI,
} from '@/api/product/sku/index'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// 存储某个sku的详细数据
const skuDetailInfo = ref<SkuData>()
// 控制抽屉组件的显示和隐藏
const drawer = ref(false)
// 当前页码数
const currentPage = ref(1)
// 每页展示条数
const pageSize = ref(5)
// 总条数
const total = ref(0)
// 存储sku数据
const skuArr = ref<SkuData[]>([])
// 每页显示条数发生变化时
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
// 当前页码数改变时
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getSkuInfo()
}
// 获取sku列表信息
const getSkuInfo = async () => {
  const res: SkuResponesData = await getSkuInfoAPI(
    currentPage.value,
    pageSize.value,
  )
  if (res.code === 200) {
    skuArr.value = res.data.records
    total.value = res.data.total
  }
}
// 商品的上架与下架
const updateSale = async (row: SkuData) => {
  // row.isSale === 1 商品处于上架状态
  if (row.isSale === 1) {
    await getCancelSaleAPI(row.id as number)
    ElMessage.warning('商品下架成功')
    getSkuInfo()
  } else {
    await getOnSaleAPI(row.id as number)
    ElMessage.success('商品上架成功')
    getSkuInfo()
  }
}
// 显示详细信息的回调
const showDetail = async (row: SkuData) => {
  const res: SkuDetailInfoData = await getSkuDetailInfoAPI(row.id as number)
  skuDetailInfo.value = res.data
  drawer.value = true
}
// 删除sku
const delSku = async (row: SkuData) => {
  const res: any = await delSkuAPI(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getSkuInfo()
  } else ElMessage.error('无法删除系统数据')
}
onMounted(() => getSkuInfo())
</script>

<style scoped></style>
