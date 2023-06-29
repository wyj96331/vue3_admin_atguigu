<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配角色用户</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input
            v-model="userInfoParams.username"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox v-for="role in allRole" :key="role.id" :label="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button>取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type {
  UserData,
  AssignRolesData,
  UserRoleResponesData,
  SetUserRoleData,
} from '@/api/acl/user/type'
import { getUserRoleAPI, setUserRoleAPI } from '@/api/acl/user/index'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['getUserInfo'])
// 全选框收集数据
const checkAll = ref(false)
// 设置不确定状态，仅负责样式控制
const isIndeterminate = ref(true)
const drawer = ref(false)
// 全部角色
const allRole = ref<AssignRolesData[]>([])
// 选中的角色
const userRole = ref<any>([])
// 收集用户信息参数
const userInfoParams = ref<UserData>({
  username: '',
  name: '',
  password: '',
  id: 0,
})
// 初始化用户信息
const initDrawerRole = (row: UserData) => {
  userInfoParams.value = row
  getUserRole(row)
}
const handleCheckAllChange = (val: any) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: any) => {
  // 已勾选的选项的长度
  const checkedCount = value.length
  // 已勾选的选项的长度与所有选项的长度相比
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}
// 根据用户获取角色数据
const getUserRole = async (row: UserData) => {
  const res: UserRoleResponesData = await getUserRoleAPI(row.id as number)
  if (res.code === 200) {
    allRole.value = res.data.allRolesList
    userRole.value = res.data.assignRoles
  }
}
// 确定按钮的回调
const save = async () => {
  const data: SetUserRoleData = {
    userId: userInfoParams.value.id as number,
    roleIdList: userRole.value.map((item: AssignRolesData) => item.id),
  }
  const res: any = await setUserRoleAPI(data)
  if (res.code === 200) {
    ElMessage.success('分配成功')
    drawer.value = false
    emit('getUserInfo')
  } else ElMessage.error('分配失败')
}
defineExpose({ drawer, initDrawerRole })
</script>
