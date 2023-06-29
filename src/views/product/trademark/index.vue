<template>
  <el-card class="box-card">
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="Plus"
      @click="addTradeMark"
      v-has="`btn.Trademark.add`"
    >
      添加商品
    </el-button>
    <!-- 表格组件 展示品牌 -->
    <el-table style="margin: 10px" border :data="tradeMarkList">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" align="center">
        <template #="{ row }">
          {{ row.tmName }}
        </template>
      </el-table-column>
      <el-table-column label="品牌LOGO" align="center">
        <template #="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row }">
          <el-button type="warning" icon="Edit" @click="updateTradeMark(row)" />
          <el-popconfirm
            :title="`确认删除${row.tmName}?`"
            width="250px"
            icon="Delete"
            @confirm="delTradeMark(row.id)"
          >
            <template #reference>
              <el-button type="danger" icon="Delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 40]"
      background
      layout=" prev, pager, next, jumper, -> ,sizes, total"
      :total="total"
      class="mt-4"
      @size-change="handleSizeChange"
      @current-change="getTradeMarkInfo"
    />
  </el-card>
  <!-- dialog弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="tradeMarkParams.id ? '修改品牌' : '添加品牌'"
    width="30%"
  >
    <el-form ref="ruleFormRef" :model="tradeMarkParams" :rules="rules">
      <el-form-item
        prop="tmName"
        width="80px"
        label="品牌信息"
        style="margin-left: 20px"
      >
        <el-input v-model="tradeMarkParams.tmName"></el-input>
      </el-form-item>
      <el-form-item prop="logoUrl" label="品牌logo" style="margin-left: 20px">
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="tradeMarkParams.logoUrl"
            :src="tradeMarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cencle">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  getTradeMarkInfoAPI,
  addOrUpdataTradeMarkAPI,
  delTradeMarkAPI,
} from '@/api/product/trademark/index'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
const ruleFormRef = ref()
// 控制弹窗
const dialogVisible = ref(false)
// 当前页码
const currentPage = ref(1)
// 每页展示条数
const pageSize = ref(3)
// 总条数
const total = ref(0)
// 品牌数据
const tradeMarkList = ref<Records>([])
// 新增接口的参数
const tradeMarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// page-size 每页展示条数改变时触发
const handleSizeChange = () => {
  currentPage.value = 1
  getTradeMarkInfo()
}
// 在顶部或合适的位置定义一个函数，例如：
const handleFormSubmitSuccess = () => {
  dialogVisible.value = false
  ElMessage.success('提交成功')
  getTradeMarkInfo()
}
// 获取品牌信息
const getTradeMarkInfo = async () => {
  const res: TradeMarkResponseData = await getTradeMarkInfoAPI(
    currentPage.value,
    pageSize.value,
  )
  if (res.code === 200) {
    total.value = res.data.total
    tradeMarkList.value = res.data.records
  }
}
// 修改品牌信息
const updateTradeMark = (row: TradeMark) => {
  // 清空检验规则提示错误信息
  nextTick(() => {
    ruleFormRef.value.clearValidate('tmName')
    ruleFormRef.value.clearValidate('logoUrl')
  })
  Object.assign(tradeMarkParams, row)
  dialogVisible.value = true
}
// 添加品牌信息
const addTradeMark = () => {
  tradeMarkParams.id = 0
  tradeMarkParams.tmName = ''
  tradeMarkParams.logoUrl = ''
  dialogVisible.value = true
  // ruleFormRef.value?.clearValidate('tmName')
  nextTick(() => {
    ruleFormRef.value.clearValidate('tmName')
    ruleFormRef.value.clearValidate('logoUrl')
  })
}
// 删除品牌
const delTradeMark = async (id: number) => {
  const res = await delTradeMarkAPI(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getTradeMarkInfo()
  } else ElMessage.error('删除失败')
}
// 上传成功时的回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  tradeMarkParams.logoUrl = response.data
  // 图片上传成功,清除logoUrl字段的校验信息
  ruleFormRef.value.clearValidate('logoUrl')
}
// 上传前的回调
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (['image/png', 'image/jpeg', 'image/gif'].includes(rawFile.type)) {
    ElMessage.error('文件的格式务必为 JPG|GIF|PNG!!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('文件的大小不能超过 2MB!')
    return false
  }
  return true
}
// 取消弹窗
const cencle = () => {
  dialogVisible.value = false
}
// 弹窗确认
const confirm = async () => {
  await ruleFormRef.value.validate()
  const res: any = await addOrUpdataTradeMarkAPI(tradeMarkParams)
  if (res.code === 200) {
    handleFormSubmitSuccess()
  } else {
    dialogVisible.value = false
    ElMessage.error(res.message)
  }
}
// 品牌检验自定义校验规则
const validatorTmName = (rule: any, value: any, callback: any) => {
  console.log(rule, value)
  if (value.trim().length >= 2) callback()
  else callback(new Error('品牌名称大于等于2为'))
}
// 图片校验自定义规则
const validatorlogoUrl = (rule: any, value: any, callback: any) => {
  console.log(rule, value)
  if (value) callback()
  else callback(new Error('请上传图片'))
}
// 表单检验
const rules = reactive<FormRules>({
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorlogoUrl }],
})
onMounted(() => getTradeMarkInfo())
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
