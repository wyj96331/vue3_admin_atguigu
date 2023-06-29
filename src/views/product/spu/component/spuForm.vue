<template>
  <div>
    <el-card style="margin: 10px 0">
      <el-form label-width="100px">
        <el-form-item label="SPU名称">
          <el-input placeholder="请输入SPU名称" v-model="spuParams.spuName" />
        </el-form-item>
        <el-form-item label="SPU品牌">
          <el-select
            v-loading="loading"
            style="margin-right: 10px"
            v-model="spuParams.tmId"
            @visible-change="changeSelete"
            no-data-text="loading....."
          >
            <el-option
              v-for="item in tradeMark"
              :key="item.id"
              :label="item.tmName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            placeholder="请输入SPU的描述"
            v-model="spuParams.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            v-model:file-list="spuImage"
            action="/api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
          <el-select
            v-model="unSelAttr"
            style="margin-right: 10px"
            :placeholder="
              unSelSaleAttr.length > 0
                ? `还有${unSelSaleAttr.length}个未选择`
                : '无'
            "
          >
            <el-option
              v-for="item in unSelSaleAttr"
              :key="item.id"
              :label="item.name"
              :value="`${item.id}:${item.name}`"
            ></el-option>
          </el-select>
          <el-button
            :disabled="unSelAttr ? false : true"
            type="primary"
            icon="Plus"
            @click="addSelAttr"
          >
            添加销售属性
          </el-button>
          <!-- 展示销售属性与属性值 -->
          <el-table border style="margin: 10px 0" :data="hasSpuData">
            <el-table-column
              label="序号"
              type="index"
              align="center"
              width="80px"
            ></el-table-column>
            <el-table-column
              label="销售属性名字"
              width="150px"
              prop="saleAttrName"
            ></el-table-column>
            <el-table-column label="销售属性值">
              <template #="{ row }">
                <el-tag
                  @close="row.spuSaleAttrValueList.splice(index, 1)"
                  closable
                  class="mx-1"
                  v-for="(item, index) in row.spuSaleAttrValueList"
                  :key="item.id"
                  style="margin: 0 10px"
                >
                  {{ item.saleAttrValueName }}
                </el-tag>
                <el-input
                  v-model="row.saleAttrValue"
                  v-if="row.flage === true"
                  placeholder="请输入属性值"
                  size="small"
                  style="width: 120px"
                  ref="inputField"
                  @blur="handleInputBlur(row)"
                ></el-input>
                <el-button
                  @click="toEdit(row)"
                  v-else
                  type="primary"
                  size="small"
                  icon="Plus"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
              <template #="{ $index }">
                <el-button
                  type="danger"
                  icon="Delete"
                  @click="hasSpuData.splice($index, 1)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  getTradeMarkListAPI,
  getSpuImageListAPI,
  getSpuSaleAttrListAPI,
  getBaseSaleAttrListAPI,
  addOrUpdateSpuInfoAPI,
} from '@/api/product/spu/index'
import type {
  HasSaleAttrResponseData,
  SaleAttrResponseData,
  SpuImageData,
  AllTradeMark,
  TradeMark,
  // SpuImage,
  SaleAttr,
  HasSaleAttr,
} from '@/api/product/spu/type'
import type { SpuData } from '@/api/product/spu/type'
import { ElMessage, UploadProps } from 'element-plus'
import { ref, computed, nextTick } from 'vue'
defineProps(['scene'])
// 1.添加属性值输入框实例
const inputField = ref()
// 2.收集未被选择的属性的id和name
const unSelAttr = ref('')
// 3.控制图片预览框是显示与隐藏
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
// 4.控制加载动画
const loading = ref(false)
const emit = defineEmits(['changeScene', 'update:scene'])
// 5.点击取消
const cancel = () => {
  emit('changeScene', 0)
}
// 6.存储获取来的spu的数据
const tradeMark = ref<TradeMark[]>([])
const spuImage = ref<any>([])
const hasSpuData = ref<SaleAttr[]>([])
const saleData = ref<HasSaleAttr[]>([])
// 7.存储已有是spu对象
const spuParams = ref<SpuData>({
  spuName: '',
  description: '',
  category3Id: '',
  tmId: 0,
  spuSaleAttrList: [],
  spuImageList: [],
})
// 8.子组件对外暴露的方法
const initHasSpuData = async (spu: SpuData) => {
  spuParams.value = spu
  // 8.1获取某个品牌下全部售卖商品的图片
  const resSpuImage: SpuImageData = await getSpuImageListAPI(spu.id as number)
  spuImage.value = resSpuImage.data.map((item) => {
    return { name: item.imgName, url: item.imgUrl }
  })
  // 8.2获取已有spu销售属性的数据
  const resHasSpuData: SaleAttrResponseData = await getSpuSaleAttrListAPI(
    spu.id as number,
  )
  hasSpuData.value = resHasSpuData.data
  // 8.3获取整个项目的销售数据
  const reqSaleData: HasSaleAttrResponseData = await getBaseSaleAttrListAPI()
  saleData.value = reqSaleData.data
}
// 9.下拉框出现时的回调
const changeSelete = async (val: boolean) => {
  if (val && tradeMark.value.length === 0) {
    // 9.1设置加载状态为true
    loading.value = true
    // 9.2获取全部品牌属性
    const resTradeMark: AllTradeMark = await getTradeMarkListAPI()
    tradeMark.value = resTradeMark.data
    // 9.3数据返回后，设置加载状态为false
    loading.value = false
  }
}
// 10.删除照片的的钩子
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
// 11.点击照片墙预览按钮时的回调
const handlePictureCardPreview = (uploadFile: any) => {
  dialogVisible.value = true
  dialogImageUrl.value = uploadFile.url
}
// 12.获取为被选择的销售属性
const unSelSaleAttr = computed(() => {
  const unSelAttr = saleData.value.filter((item) => {
    return hasSpuData.value.every((item1) => {
      return item.name !== item1.saleAttrName
    })
  })
  return unSelAttr
})
// 13.添加销售属性的方法
const addSelAttr = () => {
  // baseSaleAttrId: number
  // saleAttrName: string
  // spuSaleAttrValueList: SpuSaleAttrValueList
  const [baseSaleAttrIdString, saleAttrName] = unSelAttr.value.split(':')
  const baseSaleAttrId = +baseSaleAttrIdString
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  hasSpuData.value.push(newSaleAttr)
}
// 14.添加属性值按钮的回调
const toEdit = (row: SaleAttr) => {
  row.flage = true
  row.saleAttrValue = ''
  // 14.自动聚焦
  nextTick(() => inputField.value.focus())
}
// 15.添加属性值的输入框失去焦点时
const handleInputBlur = (row: SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row
  const newSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  // 15.1属性值不能为空
  if ((saleAttrValue as string).trim() === '')
    return ElMessage.warning('属性值不能为空')
  // 15.2属性值不能重复
  const repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === saleAttrValue
  })
  if (repeat) return ElMessage.warning('属性值不能相同')
  // 15.3添加属性值
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flage = false
}
// 16.更新或添加spu
const save = async () => {
  spuParams.value.spuImageList = spuImage.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  spuParams.value.spuSaleAttrList = hasSpuData.value
  const res = await addOrUpdateSpuInfoAPI(spuParams.value)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功',
    })
    emit('changeScene', 0)
  } else
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '更新失败' : '添加失败',
    })
}
// 17.添加一个新的spu的初始化方法
const initAddSpu = async (category3Id: number | string) => {
  // 17.1清空数据
  Object.assign(spuParams.value, {
    spuName: '',
    description: '',
    category3Id: '',
    tmId: 0,
    spuSaleAttrList: [],
    spuImageList: [],
  })
  spuImage.value = []
  hasSpuData.value = []
  unSelAttr.value = ''
  spuParams.value.category3Id = category3Id
  // 17.2获取整个项目的销售数据
  const reqSaleData: HasSaleAttrResponseData = await getBaseSaleAttrListAPI()
  saleData.value = reqSaleData.data
}
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
