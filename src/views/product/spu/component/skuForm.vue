<template>
  <el-card style="margin-top: 10px">
    <el-form label-width="100px">
      <el-form-item label="sku名称">
        <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="skuParams.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(克)">
        <el-input placeholder="重量(克)" v-model="skuParams.weight"></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input
          type="textarea"
          placeholder="sku描述"
          v-model="skuParams.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            style="margin: 10px 0"
            v-for="item in attrAttr"
            :key="item.id"
            :label="item.attrName"
          >
            <el-select v-model="item.attrIdAndValueId">
              <el-option
                v-for="subItem in item.attrValueList"
                :key="subItem.id"
                :value="`${item.id}:${subItem.id}`"
                :label="subItem.valueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item
            v-for="item in saleArr"
            :key="item.id"
            :label="item.saleAttrName"
          >
            <el-select v-model="item.saleIdAndValueId">
              <el-option
                v-for="subItem in item.spuSaleAttrValueList"
                :key="subItem.id"
                :label="subItem.saleAttrValueName"
                :value="`${item.id}:${subItem.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table :data="imgArr" border ref="table">
          <el-table-column
            type="selection"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="图片" align="center">
            <template #="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            prop="imgName"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template #="{ row }">
              <el-button type="primary" @click="settingImg(row)">
                设置默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import type {
  SpuData,
  SaleAttrResponseData,
  SpuImageData,
  SaleAttr,
  SpuImage,
  SkuData,
} from '@/api/product/spu/type'
import type { AttrResponseData, Attr } from '@/api/product/attr/type'
import { getAttrInfoAPI } from '@/api/product/attr/index'
import { ElMessage } from 'element-plus'
import {
  getSpuImageListAPI,
  getSpuSaleAttrListAPI,
  saveSkuInfoAPI,
} from '@/api/product/spu/index'
import { ref, reactive } from 'vue'

/**
 *  收集sku参数
 */
const skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})
// 获取table实例
const table = ref()
// 平台属性
const attrAttr = ref<Attr[]>([])
// 销售属性
const saleArr = ref<SaleAttr[]>([])
// 照片的数据
const imgArr = ref<SpuImage[]>([])
const emit = defineEmits(['changeScene'])
const cancel = () => {
  emit('changeScene', 0)
}
const initSkuData = async (val: any, row: SpuData) => {
  // 收集参数
  skuParams.category3Id = val.category3Id
  skuParams.spuId = row.id as string | number
  skuParams.tmId = row.tmId
  const { category1Id, category2Id, category3Id } = val
  // 获取平台属性
  const res: AttrResponseData = await getAttrInfoAPI(
    category1Id,
    category2Id,
    category3Id,
  )
  attrAttr.value = res.data
  // 获取对应spu的销售属性
  const res1: SaleAttrResponseData = await getSpuSaleAttrListAPI(
    row.id as number,
  )
  saleArr.value = res1.data
  // 获取对应spu的照片
  const res2: SpuImageData = await getSpuImageListAPI(row.id as number)
  imgArr.value = res2.data
}
/**
 * 设置默认图片的回调
 */
const settingImg = (row: any) => {
  imgArr.value.forEach((img: any) => {
    table.value.toggleRowSelection(img, false)
  })
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}
/**
 * 添加spu的保存按钮的回调
 */
const save = async () => {
  // 整理平台属性
  skuParams.skuAttrValueList = attrAttr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  // 整理销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )
  // 调接口添加数据
  const res: any = await saveSkuInfoAPI(skuParams)
  if (res.code === 200) {
    ElMessage.success('添加成功')
    emit('changeScene', 0)
  } else ElMessage.error('添加失败')
}
defineExpose({
  initSkuData,
})
</script>

<style lang="scss" scoped></style>
