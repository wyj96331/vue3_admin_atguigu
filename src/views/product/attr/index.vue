<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin-top: 10px">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="useCategory.category3Id ? false : true"
          @click="addArrt"
        >
          添加平台属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            align="center"
            width="120px"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240px">
            <template #="{ row }">
              <el-button type="warning" icon="Edit" @click="updataAttr(row)" />
              <el-popconfirm
                :title="`确认删除${row.attrName}?`"
                width="250px"
                icon="Delete"
                @confirm="delAttr(row.id)"
              >
                <template #reference>
                  <el-button type="danger" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改属性的结构 -->
      <div v-show="scene === 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              v-model="attrParams.attrName"
              type="text"
              placeholder="请输入属性名称"
            />
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          icon="Plus"
        >
          添加属性值
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table
          border
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <template v-if="row.editing">
                <el-input
                  v-model="row.valueName"
                  placeholder="请输入属性值"
                  ref="inputRef"
                ></el-input>
              </template>
              <template v-else>
                <span>{{ row.valueName }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row }">
              <el-button
                v-if="!row.editing"
                type="warning"
                icon="Edit"
                @click="toggleEditing(row)"
              />
              <el-button
                v-else
                type="success"
                icon="Check"
                @click="toggleEditing(row)"
              />
              <el-button type="danger" icon="Delete" @click="deleteAttr(row)" />
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="saveAttr"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {
  getAttrInfoAPI,
  addOrUpdateAttrAPI,
  delAttrAPI,
} from '@/api/product/attr/index'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import useCategoryStore from '@/store/modules/category'
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
const inputRef = ref()
const scene = ref(0)
const attrList = ref<Attr[]>([])
const useCategory = useCategoryStore()
// 新增属性的数据参数
const attrParams = reactive<Attr>({
  attrName: '',
  categoryId: '',
  categoryLevel: 3,
  attrValueList: [],
})
watch(
  () => useCategory.category3Id,
  () => {
    attrList.value = []
    // 3级分类id为空时,return
    if (!useCategory.category3Id) return
    getAttr()
  },
)
// 获取属性和属性值
const getAttr = async () => {
  const { category3Id, category2Id, category1Id } = useCategory
  const res: AttrResponseData = await getAttrInfoAPI(
    category1Id,
    category2Id,
    category3Id,
  )
  if (res.code == 200) attrList.value = res.data
}
// 添加属性
const addArrt = () => {
  // 在每次添加数据之前先清空数据,再收集
  Object.assign(attrParams, {
    attrName: '',
    categoryId: useCategory.category3Id,
    categoryLevel: 3,
    attrValueList: [],
  })
  // 切换场景
  scene.value = 1
  // 添加属性值是就是编辑状态
}
// 修改表格属性及属性值的回调
const updataAttr = (row: Attr) => {
  scene.value = 1
  // 将row的值赋值给attrParams(深拷贝row)
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 取消修改
const cancel = () => {
  scene.value = 0
}
// 添加属性值的回调
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    editing: true,
  })
  nextTick(() => inputRef.value.focus())
}
// 保存按钮的回调
const saveAttr = async () => {
  const isNull = attrParams.attrValueList.some((item) => item.valueName === '')
  if (isNull) return ElMessage.warning('属性值不能为空')
  const res = await addOrUpdateAttrAPI(attrParams)
  if (res.code === 200) {
    // 切换场景
    scene.value = 0
    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '更新成功' : '添加成功',
    })
    // 重新获取数据
    getAttr()
  } else
    ElMessage({
      type: 'error',
      message: attrParams.id ? '更新失败' : '添加失败',
    })
}
// 切换编辑状态的方法
const toggleEditing = (row: AttrValue) => {
  if (row.editing && !row.valueName)
    return ElMessage({
      type: 'warning',
      message: '属性名称不能为空',
    })
  // 通过some方法找出除自身外(item !== row),是否还有相同的属性值,有返回true无返回false
  const isDuplicate = attrParams.attrValueList.some(
    (item) => item !== row && item.valueName === row.valueName,
  )
  if (isDuplicate) {
    return ElMessage({
      type: 'warning',
      message: '属性名称不能相同',
    })
  }
  row.editing = !row.editing
  // 输入框获取光标
  if (row.editing) nextTick(() => inputRef.value.focus())
}
// 删除属性值的回调
const deleteAttr = (row: AttrValue) => {
  // const index = attrParams.attrValueList.indexOf(row)
  // if (index !== -1) {
  //   attrParams.attrValueList.splice(index, 1)
  // }
  attrParams.attrValueList = attrParams.attrValueList.filter(
    (item) => item !== row,
  )
}
// 删除attr
const delAttr = async (id: number) => {
  const res: any = await delAttrAPI(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getAttr()
  } else ElMessage.error('删除失败')
}
onBeforeUnmount(() => {
  useCategory.$reset()
})
</script>

<style scoped></style>
