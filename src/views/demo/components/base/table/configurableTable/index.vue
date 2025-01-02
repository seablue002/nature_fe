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
            <el-form-item label="标题:" prop="title">
              <el-input
                v-model.trim="searchFormFilter.title"
                clearable
                placeholder="请输入标题"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>

          <NTSearchFormFilterItem>
            <el-form-item label="作者名称:" prop="author">
              <el-input
                v-model.trim="searchFormFilter.author"
                clearable
                placeholder="请输入作者"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>

          <NTSearchFormFilterItem>
            <el-form-item label="时期:" prop="dynasty">
              <el-input
                v-model.trim="searchFormFilter.dynasty"
                clearable
                placeholder="请输入时期"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>

          <NTSearchFormFilterItem v-show="!isFoldFormFilter">
            <el-form-item label="状态:" prop="publishStatus">
              <el-input
                v-model.trim="searchFormFilter.publishStatus"
                clearable
                placeholder="请输入状态"
                @clear="handleSearch"
              />
            </el-form-item>
          </NTSearchFormFilterItem>
        </template>
      </NTSearchFormFilter>
      <!-- E 搜索表单 -->

      <el-row>
        <el-col>
          <el-button v-permission-auth="ConfigurableTableCreate" type="primary">
            <i class="ri-add-line"></i>
            新增
          </el-button>
        </el-col>
      </el-row>

      <!-- S 表格列表 -->
      <NTTable
        ref="tableRef"
        v-loading="loadding"
        :data="dataList"
        :columns="columns"
        stripe
        border
        :show-overflow-tooltip="true"
        :pagination="pagination"
        @page-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
        <template #otherOperate="{ row }">
          <el-button
            v-permission-auth="ConfigurableTableDetail"
            type="primary"
            text
            size="small"
            @click="handleShowDetail(row)"
            >详情
          </el-button>
          <el-button
            v-permission-auth="ConfigurableTableEdit"
            type="primary"
            text
            size="small"
            >编辑</el-button
          >
          <el-button
            v-permission-auth="ConfigurableTableDelete"
            type="primary"
            text
            size="small"
            >删除</el-button
          >
        </template>
      </NTTable>
      <!-- E 表格列表 -->
    </el-card>
  </div>
</template>
<script>
import { ref, reactive, onMounted, resolveComponent, h } from 'vue'
import { ElMessageBox } from 'element-plus'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import useListPage from '@/hooks/business/useListPage'
import {
  ConfigurableTableDetail,
  ConfigurableTableEdit,
  ConfigurableTableCreate,
  ConfigurableTableDelete,
} from '@/settings/config/permission'

export default {
  name: 'ConfigurableTable',
  setup() {
    const { $api, $apiCode, $message, $dict } = useCurrentInstance()
    const { list: dataList, loadding } = useListPage()

    const tableRef = ref(null)

    // 筛选条件
    const searchFormFilterRef = ref(null)
    const searchFormFilter = reactive({
      title: '',
      author: '',
    })

    // 列表列配置
    const columns = [
      {
        label: '#',
        prop: '$index',
        width: 80,
      },
      {
        label: '标题',
        prop: 'title',
      },
      {
        label: '封面',
        prop: 'cover',
        dataFormatConf: {
          renderType: 'html',
          withScopeRow: true,
          formatFunction: ({ value }) => {
            const component = {
              setup() {
                const ElImage = resolveComponent('ElImage')
                return () => {
                  return h(ElImage, {
                    src: value,
                    fit: 'cover',
                    'preview-src-list': [value],
                    'preview-teleported': true,
                    'hide-on-click-modal': true,
                    class: 'cover',
                  })
                }
              },
            }

            return component
          },
        },
        minWidth: 60,
      },
      {
        label: '作者',
        prop: 'author',
      },
      {
        label: '时期',
        prop: 'dynasty',
      },
      {
        label: '状态',
        prop: 'publishStatus',
        dataFormatConf: {
          withScopeRow: true,
          formatFunction: ({ value }) => {
            return `${$dict.$formatDictKeyToValue(
              $dict.poem.PUBLISH_STATUS,
              value
            )}`
          },
        },
      },
      {
        label: '创建日期',
        prop: 'createTime',
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

      const { name } = searchFormFilter

      const { currentPage, pageSize } = tableRef.value
      const params = {
        name,
        page: currentPage,
        pageSize,
      }

      const apiRes = await $api.poem.getPoemList(params).catch((error) => {
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

    // 详情
    const handleShowDetail = (row) => {
      ElMessageBox.confirm(
        `根据自身业务需要，使用row数据进行相关逻辑处理。\n${JSON.stringify(
          row
        )}`,
        '提示',
        {
          type: 'warning',
        }
      )
        .then(() => {})
        .catch(() => {})
      console.log(row)
    }

    return {
      ConfigurableTableDetail,
      ConfigurableTableEdit,
      ConfigurableTableCreate,
      ConfigurableTableDelete,
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
      handleShowDetail,
    }
  },
}
</script>
<style lang="scss" scoped>
:deep(.cover) {
  width: 30px;
}
</style>
