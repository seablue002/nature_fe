<template>
  <div class="page-container page-container--bg">
    <el-card shadow="never">
      <template #header>
        <span>奖金发放记录</span>
      </template>

      <div class="mb-[12px]">
        <el-button type="primary" @click="handleAddRecord">添加</el-button>
      </div>

      <el-form ref="formRef" :model="formMdl">
        <el-table :data="formMdl.records" border>
          <el-table-column label="序号" width="100">
            <template #default="{ $index }">
              <el-form-item label-width="0">
                {{ $index + 1 }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="员工姓名">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`records[${$index}].name`"
                :rules="formRules.name"
                label-width="0"
              >
                <el-input
                  v-model="row.name"
                  :maxlength="30"
                  placeholder="请输入员工姓名"
                  clearable
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="所属部门">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`records[${$index}].department`"
                :rules="formRules.department"
                label-width="0"
              >
                <el-select
                  v-model="row.department"
                  placeholder="请选择所属部门"
                  clearable
                >
                  <el-option
                    v-for="item in DEPARTMENTS"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column>
            <template #header>
              金额/元
              <el-popover placement="top-start" width="auto" trigger="click">
                <template #default>
                  <p class="ml-[4px]">金额/元：</p>
                  <p class="ml-[12px]">1、必填</p>
                  <p class="ml-[12px]">
                    2、0和正实数，允许2位小数，最小值为0元，最大值为100,000
                  </p>
                </template>
                <template #reference>
                  <i class="ri-question-line ml-[4px]"></i>
                </template>
              </el-popover>
            </template>
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`records[${$index}].amount`"
                :rules="formRules.amount"
                label-width="0"
              >
                <el-input
                  v-model="row.amount"
                  clearable
                  placeholder="请输入金额"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="发放状态" minWidth="50">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`records[${$index}].status`"
                :rules="formRules.status"
                label-width="0"
              >
                <el-switch
                  v-model="row.status"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注说明" minWidth="130">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`records[${$index}].remark`"
                :rules="formRules.remark"
                label-width="0"
              >
                <el-input
                  v-model="row.remark"
                  type="textarea"
                  :maxlength="150"
                  show-word-limit
                  clearable
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ $index }">
              <el-button
                type="danger"
                plain
                @click="handleDeleteRecord($index)"
              >
                <i class="ri-delete-bin-line mr-[2px]"></i>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <div class="mt-[24px] text-right">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { debounce } from 'lodash'
import { isNullOrUnDef, isPositive } from '@/utils/helper/is'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '请输入员工姓名' }],
  amount: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (isNullOrUnDef(value) || value === '') {
          callback(new Error('请输入金额'))
        } else if (!isPositive(value)) {
          callback(new Error('请输入合法金额数字'))
        } else {
          const reg = /\.(\d+)$/
          const match = reg.exec(value.toString())
          const decimalDigits = match ? match[1].length : 0
          if (decimalDigits > 2) {
            callback(new Error('请输入合法金额数字'))
          } else if (value < 0 || value > 100000) {
            callback(new Error('请输入合法金额数字'))
          }
        }

        callback()
      },
    },
  ],
  department: [{ required: true, message: '请选择所属部门' }],
}
export default {
  setup() {
    const { $dict } = useCurrentInstance()
    const {
      employee: { DEPARTMENTS },
    } = $dict

    const formRef = ref(null)

    const formMdlItem = {
      name: '',
      amount: null,
      department: null,
      status: 1,
      remark: null,
    }

    // 表单数据模型
    const formMdl = ref({
      records: [{ ...formMdlItem }],
    })

    // 新增一条记录
    const handleAddRecord = debounce(() => {
      formMdl.value.records.push({ ...formMdlItem })
    }, 200)

    // 删除一条记录
    const handleDeleteRecord = (index) => {
      formMdl.value.records.splice(index, 1)
    }

    // 重置表单
    const handleReset = () => {
      // 清除原有可能触发的表单校验提示
      formRef.value.resetFields()
      formMdl.value.records = [{ ...formMdlItem }]
    }

    // 提交表单数据
    const submitLoading = ref(false)
    const handleSubmit = async () => {
      if (submitLoading.value) {
        return
      }

      // 表单校验
      const validate = await new Promise((resolve) => {
        formRef.value.validate(resolve)
      })

      if (!validate) {
        return
      }
      submitLoading.value = true

      // 参数组装
      const params = {
        ...formMdl.value.records,
      }

      // 接口调用
      ElMessageBox.confirm(
        `
          根据自身业务需要，使用params数据进行相关逻辑处理。
          <br />
          ${JSON.stringify(params)}
        `,
        '提示',
        {
          type: 'warning',
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {})
        .catch(() => {})
      console.log('API接口调用模拟', params)

      submitLoading.value = false
    }

    return {
      DEPARTMENTS,
      formRules,
      formRef,
      formMdl,
      handleAddRecord,
      handleDeleteRecord,
      submitLoading,
      handleReset,
      handleSubmit,
    }
  },
}
</script>
<style lang="scss" scoped>
.el-card {
  border: 0;
  :deep(.el-card__header) {
    padding-bottom: 0;
    border-bottom: 0;
  }

  .el-card-body {
    .el-table__inner-wrapper::before {
      content: none;
    }
  }
}
</style>
