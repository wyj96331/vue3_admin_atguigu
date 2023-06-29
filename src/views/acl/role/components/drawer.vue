<template>
  <el-drawer :model-value="modelValue" @close="closehandle">
    <template #header>
      <h4>分配角色权限</h4>
    </template>
    <template #default>
      <el-tree
        ref="tree"
        :data="MenuListdata"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectedId"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAllMenuListAPI, setPermisstionAPI } from '@/api/acl/role/index'
import type {
  MenuListResponesData,
  RoleData,
  ChildrenData,
} from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'
defineProps<{
  modelValue: boolean
}>()

// 获取树形组件实例
const tree = ref<any>()
const pramasInfo = ref<RoleData>()
const emit = defineEmits(['update:modelValue', 'getRoleInfo'])
// 定义树形组件defaultProps属性的类型
const defaultProps = {
  children: 'children',
  label: 'name',
}
// 被选中的节点的id
const selectedId = ref<number[]>([])
// 收集树形组件数据
const MenuListdata = ref<ChildrenData[]>([])
// 取消按钮的回调
const cancel = () => {
  // 例如重置表单或关闭弹窗等操作
  emit('update:modelValue', false)
}
// 确认按钮的回调
const confirm = async () => {
  // 例如提交表单或执行特定操作等
  const roleId = pramasInfo.value?.id as number
  // 选中节点的id
  const arr1 = tree.value.getCheckedKeys()
  // 半选中的节点的id
  const arr2 = tree.value.getHalfCheckedKeys()
  // 将两个数据合并到一个数组中去
  const permissionId = arr1.concat(arr2)
  // 调用接口发送数据
  const res: any = await setPermisstionAPI(roleId, permissionId)
  if (res.code === 200) {
    ElMessage.success('分配成功')
    emit('update:modelValue', false)
    // 页面刷新
    window.location.reload()
  } else ElMessage.error('分配失败')
}
// 关闭时的回调
const closehandle = () => {
  emit('update:modelValue', false)
}

/**
 * forEach方法实现
 const filterSelectArr = (MenuList: ChildrenData[], initArr: number[]) => {
  MenuList.forEach((item: ChildrenData) => {
    if (item.select && item.level === 4) initArr.push(item.id)
    if (item.children && item.children.length > 0)
      filterSelectArr(item.children, initArr)
  })
  return initArr
}
 */
// flatMap方法实现
const filterSelectArr = (menuList: ChildrenData[]): number[] => {
  return menuList.flatMap((item: ChildrenData) => {
    if (item.select && item.level === 4) {
      return [item.id]
    }
    if (item.children && item.children.length > 0) {
      return filterSelectArr(item.children)
    }
    return []
  })
}
// 根据角色获取菜单
const getMenuList = async (row: RoleData) => {
  pramasInfo.value = row
  const res: MenuListResponesData = await getAllMenuListAPI(row.id as number)
  if (res.code === 200) MenuListdata.value = res.data
  selectedId.value = filterSelectArr(MenuListdata.value)
}

// 对外暴露组件属性和方法
defineExpose({
  getMenuList,
})
</script>

<style lang="scss" scoped></style>
