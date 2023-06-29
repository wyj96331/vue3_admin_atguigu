<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名">
        <el-input
          v-model="keywords"
          placeholder="请输入你需要搜索的用户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="keywords ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addUser" icon="Plus">添加用户</el-button>
    <el-button type="danger" icon="Delete" @click="delUserList">
      批量删除
    </el-button>
    <!-- 展示用户信息 -->
    <el-table
      style="margin: 10px 0"
      border
      :data="userInfo"
      @selection-change="selChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
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
            分配角色
          </el-button>
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.username}吗？`"
            width="200px"
            @confirm="delUser(row.id)"
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
      :page-sizes="[100, 200, 300, 400]"
      :background="true"
      layout=" prev, pager, next,
    jumper,->,sizes,total,"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <!-- 抽屉组件，更新和添加用户信息 -->
  <DrawerUser
    v-model:showDrawer="showDrawer"
    v-model:userData="userData"
    @getUserInfo="getUserInfo"
  />
  <!-- 抽屉组件,分配用户权限 -->
  <DrawerRole ref="drawerRole" @getUserInfo="getUserInfo" />
</template>
<script setup lang="ts">
import DrawerUser from './component/drawerUser.vue'
import DrawerRole from './component/drawerRole.vue'
import {
  getUserInfoAPI,
  delUserAPI,
  delUserListAPI,
} from '@/api/acl/user/index'
import type { UserResponesData, UserData } from '@/api/acl/user/type'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import useSettingStore from '@/store/modules/setting'
const settingStore = useSettingStore()
const userData = ref<UserData>()
// 收集搜索栏用户输入的关键字
const keywords = ref('')
// 控制抽屉组件的显示与隐藏
const showDrawer = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)
const userInfo = ref<UserData[]>([])
const total = ref(0)
// 获取DrawerRole组件实例
const drawerRole = ref()
// 批量删除用户的id
const idList = ref<number[]>([])
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getUserInfo()
}
// 获取用户列表信息
const getUserInfo = async () => {
  const res: UserResponesData = await getUserInfoAPI(
    currentPage.value,
    pageSize.value,
    keywords.value,
  )
  if (res.code === 200) {
    userInfo.value = res.data.records
    total.value = res.data.total
  }
}
// 添加用户
const addUser = () => {
  userData.value = {}
  showDrawer.value = true
}
// 更新用户信息
const updateUser = (row: UserData) => {
  showDrawer.value = true
  userData.value = row
}
// 分配角色权限
const setRole = (row: UserData) => {
  drawerRole.value.drawer = true
  drawerRole.value.initDrawerRole(row)
}
// 删除某个用户信息
const delUser = async (id: number) => {
  const res: any = await delUserAPI(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getUserInfo()
  } else ElMessage.error('删除失败')
}
// 当选择项发生变化时会触发该事件
const selChange = (val: any) => {
  idList.value = val.map((item: UserData) => item.id)
  console.log(idList.value)
}
// 批量删除用户信息
const delUserList = async () => {
  const res: any = await delUserListAPI(idList.value)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getUserInfo()
  } else ElMessage.error('删除失败')
}
// 搜索按钮的回调
const search = () => {
  getUserInfo()
  // 清空关键字
  keywords.value = ''
}
// 重置按钮的回调
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
onMounted(() => getUserInfo())
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
