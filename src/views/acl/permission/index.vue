<template>
  <el-table
    :data="permission"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column prop="name" label="名称" align="left" />
    <el-table-column prop="code" label="权限值" align="center" />
    <el-table-column prop="updateTime" label="修改时间" align="center" />
    <el-table-column label="操作" align="center">
      <template #="{ row }">
        <el-button
          type="primary"
          size="small"
          icon="Plus"
          :disabled="row.level === 4 ? true : false"
          @click="addPermission(row)"
        >
          {{ row.level === 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="warning"
          size="small"
          icon="Edit"
          :disabled="row.level === 1 ? true : false"
          @click="updatePermission(row)"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`Are you sure to delete${row.name}?`"
          width="200px"
          @confirm="delMenu(row.id)"
        >
          <template #reference>
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              :disabled="row.level === 1 ? true : false"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 弹窗组件 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuParams.id ? '更新菜单权限' : '添加菜单权限'"
    width="30%"
  >
    <el-form label-width="100px" label-position="right">
      <el-form-item label="名称">
        <el-input
          placeholder="请输入菜单名称"
          v-model="menuParams.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input
          placeholder="请输入权限值"
          v-model="menuParams.code"
        ></el-input>
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
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive } from 'vue'
import {
  getPermissionAPI,
  addOrUpdateMenuAPI,
  delMenuAPI,
} from '@/api/acl/menu/index'
import type {
  PermissionResponesData,
  Permission,
  MenuParams,
} from '@/api/acl/menu/type'
// 新增或更新功能所需要携带的参数
const menuParams = reactive<MenuParams>({
  code: '', // 权限值
  name: '', // 菜单名字
  level: 0, // 几级菜单
  pid: 0,
})
// 控制弹窗的显示和隐藏
const dialogVisible = ref(false)
// 菜单信息
const permission = ref<Permission[]>([])
// 获取菜单信息
const getPermission = async () => {
  const res: PermissionResponesData = await getPermissionAPI()
  if (res.code === 200) permission.value = res.data
}
// 添加菜单的回调
const addPermission = (row: Permission) => {
  Object.assign(menuParams, {
    code: '',
    name: '',
    level: 0,
    pid: 0,
  })
  // 清空菜单数据
  // 收集新增菜单的level
  menuParams.level = row.level + 1
  menuParams.pid = row.id as number
  dialogVisible.value = true
}
// 更新菜单的回调
const updatePermission = (row: Permission) => {
  Object.assign(menuParams, row)
  dialogVisible.value = true
}
// dialog确定按钮的回调
const save = async () => {
  const res: any = await addOrUpdateMenuAPI(menuParams)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: menuParams.id ? '更新成功' : '添加成功',
    })
    dialogVisible.value = false
    getPermission()
  } else
    ElMessage({
      type: 'error',
      message: menuParams.id ? '更新失败' : '添加失败',
    })
}
// 删除菜单按钮的回调
const delMenu = async (id: number) => {
  const res: any = await delMenuAPI(id)
  if (res.code === 200) {
    ElMessage.warning('删除成功')
    getPermission()
  } else ElMessage.error('删除失败')
}
onMounted(() => getPermission())
</script>

<style scoped></style>
