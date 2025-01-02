<template>
  <div class="page-container page-container--bg">
    <el-card shadow="never" class="border-0">
      <!-- S 搜索表单 -->
      <NTSearchFormFilter
        ref="searchFormFilterRef"
        :model="searchFormFilter"
        :inline="true"
        label-width="80"
        label-position="left"
        :loading="loadding"
        :searchHandle="handleSearch"
        :resetHandle="handleReset"
      >
        <template #default="{ isFoldFormFilter }">
          <NTSearchFormFilterItem>
            <el-form-item label="用户ID:" prop="id">
              <el-input
                v-model.trim="searchFormFilter.id"
                clearable
                placeholder="请输入ID号"
                @change="handleSearch"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>

          <NTSearchFormFilterItem>
            <el-form-item label="账号名:" prop="account">
              <el-input
                v-model.trim="searchFormFilter.account"
                clearable
                placeholder="请输入账号名"
                @change="handleSearch"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>

          <NTSearchFormFilterItem>
            <el-form-item label="账号状态:" prop="status">
              <el-select
                v-model="searchFormFilter.status"
                placeholder="请选择账号状态"
                clearable
                @change="handleSearch"
                @clear="handleSearch"
              >
                <el-option
                  v-for="item in ACCOUNT_STATUS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </NTSearchFormFilterItem>

          <NTSearchFormFilterItem v-show="!isFoldFormFilter">
            <el-form-item label="创建时间:" prop="createTime">
              <el-date-picker
                v-model="searchFormFilter.createTime"
                :style="{ width: '250px' }"
                type="daterange"
                align="right"
                unlink-panels
                value-format="YYYY-MM-DD"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
                @change="handleSearch"
                @clear="handleSearch"
              >
              </el-date-picker>
            </el-form-item>
          </NTSearchFormFilterItem>
        </template>
      </NTSearchFormFilter>
      <!-- E 搜索表单 -->

      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-button type="primary" @click="handleShowAddDialog">
            <i class="ri-add-line"></i>
            添加
          </el-button>
          <el-button
            type="danger"
            :disabled="!multipleSelection.length"
            @click="handleMultipleDiabled"
          >
            <i class="ri-user-forbid-line"></i>
            批量禁用
          </el-button>
        </el-col>
      </el-row>

      <!-- S 表格列表 -->
      <NTCustomTable
        ref="tableRef"
        v-loading="loadding"
        :data="dataList"
        :columns="columns"
        stripe
        :show-overflow-tooltip="true"
        :pagination="pagination"
        @page-change="handleCurrentChange"
        @size-change="handleSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template #otherOperate="{ row }">
          <el-button
            type="primary"
            text
            size="small"
            @click="handleShowDetail(row)"
            >详情
          </el-button>
          <el-button
            type="primary"
            text
            size="small"
            @click="handleShowEdit(row)"
            >编辑
          </el-button>
          <el-button type="danger" text size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </NTCustomTable>
      <!-- E 表格列表 -->
    </el-card>

    <!-- S 新增、编辑用户弹窗 -->
    <AddUserDialog
      ref="addUserDialogRef"
      :mode="userDialogMode"
    ></AddUserDialog>
    <!-- E 新增、编辑用户弹窗 -->
  </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import useListPage from '@/hooks/business/useListPage'
import AddUserDialog from './components/AddUserDialog/index.vue'

export default {
  components: {
    AddUserDialog,
  },
  setup() {
    const { $api, $apiCode, $message, $dict, $is } = useCurrentInstance()
    const { list: dataList, loadding } = useListPage()

    const {
      auth: { ACCOUNT_STATUS },
    } = $dict

    const { isArray } = $is

    const tableRef = ref(null)

    // 筛选条件
    const searchFormFilterRef = ref(null)
    const searchFormFilter = reactive({
      id: '',
      account: '',
      status: '',
      createTime: null,
    })

    // 列表列配置
    const columns = [
      {
        label: '选择框',
        prop: 'TABLE_COLUMN_CHECKBOX',
      },
      {
        label: '#',
        prop: '$index',
        width: 80,
      },
      {
        label: 'ID',
        prop: 'id',
        sortable: true,
      },
      {
        label: '账号',
        prop: 'account',
      },
      {
        label: '部门',
        prop: 'department',
      },
      {
        label: '角色',
        prop: 'roleNames',
        dataFormatConf: {
          formatFunction: (value) => {
            return value.join(',')
          },
        },
      },
      {
        label: '状态',
        prop: 'status',
      },
      {
        label: '创建时间',
        prop: 'createTime',
        sortable: true,
      },
      {
        label: '更新时间',
        prop: 'updateTime',
        sortable: true,
      },
      {
        label: '操作',
        prop: 'TABLE_COLUMN_OPTS',
        fixed: 'right',
        width: 200,
        overflowTooltip: false,
      },
    ]

    // 分页配置
    const pagination = ref({
      layout: 'total, prev, pager, next, sizes, jumper',
      // 数据总条数
      total: 0,
    })

    // 获取数据列表
    const getDataList = async () => {
      loadding.value = true

      const { createTime, ...extraParams } = searchFormFilter

      const { currentPage, pageSize } = tableRef.value
      const params = {
        ...extraParams,
        page: currentPage,
        pageSize,
      }

      // 创建时间处理
      if (isArray(createTime)) {
        const [startDate, endDate] = createTime
        params.createStartTime = startDate
        params.createEndTime = endDate
      }

      const apiRes = await $api.auth.getAuthUserList(params).catch((error) => {
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
        const { list, total } = data
        dataList.value = list
        pagination.value.total = total
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

    // 页码变化
    const handleCurrentChange = () => {
      getDataList()
    }

    // 每页条数选项变化
    const handleSizeChange = () => {
      getDataList()
    }

    // 搜索
    const handleSearch = () => {
      tableRef.value.currentPage = 1
      getDataList()
    }
    onMounted(() => {
      handleSearch()
    })

    // 重置
    const handleReset = () => {
      // 重置表单搜索条件
      tableRef.value.currentPage = 1
      searchFormFilterRef.value.$refs.ntSearchFormFilterForm.resetFields()
      handleSearch()
    }

    // 多选选择
    const multipleSelection = ref([])
    const handleSelectionChange = (rows) => {
      multipleSelection.value = rows
    }

    // 批量禁用
    const handleMultipleDiabled = () => {
      ElMessageBox.confirm('确认要禁用这些账号吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          $message.success({
            message: '模拟批量禁用成功提示！',
            duration: 3000,
          })
        })
        .catch(() => {})
    }

    const addUserDialogRef = ref(null)

    const userDialogMode = ref('add')

    // 新增
    const handleShowAddDialog = () => {
      userDialogMode.value = 'add'
      addUserDialogRef.value.open()
    }

    // 详情
    const handleShowDetail = (row) => {
      userDialogMode.value = 'detail'
      openAndFillAddDialog(row)
    }

    // 编辑
    const handleShowEdit = (row) => {
      userDialogMode.value = 'edit'
      openAndFillAddDialog(row)
    }

    // 打开新增、编辑、详情弹窗并填充默认数据
    const openAndFillAddDialog = (row) => {
      addUserDialogRef.value.open()

      // 默认数据填充
      const { account, department, roleIds, status } = row
      addUserDialogRef.value.formMdl = {
        account,
        department,
        roleIds,
        status,
      }
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
      ACCOUNT_STATUS,
      tableRef,
      searchFormFilterRef,
      searchFormFilter,
      loadding,
      columns,
      pagination,
      dataList,
      handleCurrentChange,
      handleSizeChange,
      handleSearch,
      handleReset,
      multipleSelection,
      handleSelectionChange,
      addUserDialogRef,
      userDialogMode,
      handleShowAddDialog,
      handleShowDetail,
      handleShowEdit,
      handleDelete,
      handleMultipleDiabled,
    }
  },
}
</script>
<style lang="scss" scoped></style>
