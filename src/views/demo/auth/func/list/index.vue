<template>
  <div class="page-container page-container--bg">
    <el-card shadow="never" class="border-0">
      <el-row class="mb-[12px]">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-button type="primary" @click="handleShowAddDialog()">
            <i class="ri-add-line"></i>
            添加
          </el-button>
        </el-col>
      </el-row>

      <!-- S 表格列表 -->
      <el-table
        v-loading="loadding"
        border
        :data="dataList"
        stripe
        highlight-current-row
        row-key="id"
      >
        <el-table-column
          prop="title"
          label="功能名称"
          min-width="200"
          fixed
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="type"
          label="功能类型"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="path"
          label="页面路径"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="code"
          label="唯一标识码"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="100"
          show-overflow-tooltip
        >
          <template #default="{ row: { status } }">
            <el-text v-if="status === 0" type="danger">
              {{ formatDictKeyToValue(FUNC_STATUS, status) }}
            </el-text>
            <el-text v-else-if="status === 1" type="success">
              {{ formatDictKeyToValue(FUNC_STATUS, status) }}
            </el-text>
            <el-text v-else>
              {{ formatDictKeyToValue(FUNC_STATUS, status) }}
            </el-text>
          </template>
        </el-table-column>
        <el-table-column
          prop="order"
          label="排序"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" min-width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleShowAddDialog(row)"
              >新增
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click="handleShowDetail(row)"
              >详情
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click="handleShowEdit(row)"
              >编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- E 表格列表 -->
    </el-card>

    <!-- S 新增、编辑功能弹窗 -->
    <AddFuncDialog
      ref="addFuncDialogRef"
      :mode="funcDialogMode"
    ></AddFuncDialog>
    <!-- E 新增、编辑功能弹窗 -->
  </div>
</template>
<script>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import useListPage from '@/hooks/business/useListPage'
import AddFuncDialog from './components/AddFuncDialog/index.vue'

export default {
  components: {
    AddFuncDialog,
  },
  setup() {
    const { $api, $apiCode, $message, $dict } = useCurrentInstance()
    const { list: dataList, loadding } = useListPage()

    const {
      $formatDictKeyToValue,
      auth: { FUNC_STATUS },
    } = $dict

    // 获取数据列表
    const getDataList = async () => {
      loadding.value = true

      const apiRes = await $api.auth.getAuthFuncList().catch((error) => {
        $message.error({
          message: error,
          duration: 3000,
        })
        setTimeout(() => {
          // 解决loadding闪烁
          loadding.value = false
        }, 150)
      })

      const { code, data, msg } = apiRes.data
      if (code === $apiCode.SUCCESS && data) {
        dataList.value = data
      } else {
        $message.error({
          message: msg,
          duration: 3000,
        })
      }
      setTimeout(() => {
        // 解决loadding闪烁
        loadding.value = false
      }, 150)
    }

    onMounted(() => {
      getDataList()
    })

    const addFuncDialogRef = ref(null)

    const funcDialogMode = ref('add')

    // 新增
    const handleShowAddDialog = (parent) => {
      funcDialogMode.value = 'add'
      addFuncDialogRef.value.open()

      if (parent) {
        nextTick(() => {
          addFuncDialogRef.value.formMdl.pid = parent.id
          addFuncDialogRef.value.formMdl.parentName = parent.title
        })
      }
    }

    // 详情
    const handleShowDetail = (row) => {
      funcDialogMode.value = 'detail'
      openAndFillAddDialog(row)
    }

    // 编辑
    const handleShowEdit = (row) => {
      funcDialogMode.value = 'edit'
      openAndFillAddDialog(row)
    }

    // 打开新增、编辑、详情弹窗并填充默认数据
    const openAndFillAddDialog = (row) => {
      addFuncDialogRef.value.open()

      // 默认数据填充
      nextTick(() => {
        const { pid, parentName, title, type, status, path, code, sort, icon } =
          row
        addFuncDialogRef.value.formMdl = {
          pid,
          parentName,
          title,
          type,
          status,
          path,
          code,
          sort,
          icon,
        }
      })
    }

    // 删除
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `
          确定要删除吗？
        `,
        '提示',
        {
          type: 'warning',
        }
      )
        .then(() => {
          $message.success({
            message: '模拟删除成功提示！',
            duration: 3000,
          })
        })
        .catch(() => {})
      console.log(row)
    }

    return {
      formatDictKeyToValue: $formatDictKeyToValue,
      FUNC_STATUS,
      loadding,
      dataList,
      addFuncDialogRef,
      funcDialogMode,
      handleShowAddDialog,
      handleShowDetail,
      handleShowEdit,
      handleDelete,
    }
  },
}
</script>
<style lang="scss" scoped></style>
