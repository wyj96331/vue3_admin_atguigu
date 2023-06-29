<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名" v-model="keywords"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="search"
          :disabled="keywords ? false : true"
        >
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
    <!-- 展示用户信息 -->
    <el-table style="margin: 10px 0" border :data="roleInfoList">
      <el-table-column
        label="#"
        align="center"
        type="index"
        width="180"
      ></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column
        label="角色名称"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            icon="User"
            size="small"
            @click="setRole(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.roleName}吗？`"
            width="200px"
            @confirm="delRole(row)"
          >
            <template #reference>
              <el-button type="primary" icon="Delete" size="small">
                删除
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
      :page-sizes="[1, 2, 5, 10]"
      :background="true"
      :small="true"
      layout=" prev, pager, next,
    jumper,->,sizes,total,"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </el-card>
  <!-- 弹窗组件 -->
  <Dialog ref="dialog" @getRoleInfo="getRoleInfo" v-model:idForm="idForm" />
  <!-- 抽屉组件 -->
  <Drawer v-model="showDrawer" ref="drawer" @getRoleInfo="getRoleInfo" />
</template>

<script setup lang="ts">
import Drawer from './components/drawer.vue'
import Dialog from './components/dialog.vue'
import { getRoleInfoAPI, delRoleInfoAPI } from '@/api/acl/role/index'
import { ref, onMounted, reactive } from 'vue'
import type { RoleData, RoleResponesData } from '@/api/acl/role/type'
import useSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'
const idForm: RoleData = reactive({
  roleName: '',
  id: 0,
})
// 获取抽屉组件的实例
const drawer = ref()
// 控制抽屉组件的显示与隐藏
const showDrawer = ref(false)
// 获取弹窗实例
const dialog = ref()
// 使用setting仓库
const settingStore = useSettingStore()
// 当前页码
const currentPage = ref(1)
// 每页显示条数
const pageSize = ref(3)
// 总条数
const total = ref(0)
// 角色职位信息
const roleInfoList = ref<RoleData[]>([])
// 搜索栏关键字
const keywords = ref('')
// 当前页码发生变化时执行的回调
const handleCurrentChange = () => {
  getRoleInfo()
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getRoleInfo()
}
// 获取角色分页列表
const getRoleInfo = async () => {
  const res: RoleResponesData = await getRoleInfoAPI(
    currentPage.value,
    pageSize.value,
    keywords.value,
  )
  if (res.code === 200) {
    roleInfoList.value = res.data.records
    currentPage.value = res.data.current
    pageSize.value = res.data.size
    total.value = res.data.total
  }
}
// 搜索按钮的回调
const search = () => {
  getRoleInfo()
}
// 重置按钮的回调
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
// 添加职位按钮回调
const addRole = () => {
  Object.assign(idForm, { roleName: '', id: 0 })
  dialog.value.dialogVisible = true
}
// 更新职位按钮回调
const updateRole = (row: RoleData) => {
  Object.assign(idForm, row)
  dialog.value.dialogVisible = true
}
// 分配角色权限按钮
const setRole = (row: RoleData) => {
  showDrawer.value = true
  drawer.value.getMenuList(row)
}
// 删除按钮的回调
const delRole = async (row: RoleData) => {
  const res: any = await delRoleInfoAPI(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getRoleInfo()
  } else ElMessage.error('删除失败')
}
onMounted(() => getRoleInfo())
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
