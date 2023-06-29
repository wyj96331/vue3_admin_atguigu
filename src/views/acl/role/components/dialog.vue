<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.idForm.id ? '更新职位' : '添加职位'"
  >
    <el-form :model="props.idForm">
      <el-form-item label="角色名称">
        <el-input
          v-model="props.idForm.roleName"
          placeholder="请输入职位名称"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { RoleData } from '@/api/acl/role/type'
import { addOrUpdateRoleInfoAPI } from '@/api/acl/role/index'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['getRoleInfo'])
// 控制dialog组件的显示与隐藏
const dialogVisible = ref(false)
const props = defineProps<{
  idForm: RoleData
}>()
// 添加或更新角色职位
const save = async () => {
  const res: any = await addOrUpdateRoleInfoAPI(props.idForm)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: props.idForm.id ? '更新成功' : '添加成功',
    })
    dialogVisible.value = false
    emit('getRoleInfo')
  } else
    ElMessage({
      type: 'success',
      message: props.idForm.id ? '更新失败' : '添加失败',
    })
}
// 对外暴露组件属性和方法
defineExpose({
  dialogVisible,
})
</script>

<style lang="scss" scoped></style>
