<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="500"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-row>
      <el-col :xs="24" :sm="22" :md="12" :lg="20" :xl="20">
        <el-form
          ref="formRef"
          :model="formMdl"
          :rules="!isDetailMode ? formRules : null"
          label-width="100"
          :disabled="isDetailMode"
        >
          <el-form-item prop="account" label="账号">
            <el-input
              v-model="formMdl.account"
              :maxlength="30"
              placeholder="请输入账号"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item prop="department" label="所属部门">
            <el-select
              v-model="formMdl.department"
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

          <el-form-item prop="roleIds" label="角色">
            <el-select
              v-model="formMdl.roleIds"
              placeholder="请选择角色"
              multiple
              clearable
            >
              <el-option
                v-for="item in ROLES"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="status" label="账号状态">
            <el-select
              v-model="formMdl.status"
              placeholder="请选择账号状态"
              clearable
            >
              <el-option
                v-for="item in ACCOUNT_STATUS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <template v-if="!isDetailMode" #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="loadding" @click="handleSubmit">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { ref, computed } from 'vue'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import useAddPage from '@/hooks/business/useAddPage'

export default {
  props: {
    mode: {
      type: String,
      default: 'add',
      required: true,
      validator: (value) => {
        return ['add', 'edit', 'detail'].includes(value)
      },
    },
  },
  setup(props) {
    const { $api, $apiCode, $message, $dict } = useCurrentInstance()

    const { isDetailMode, isCreateMode, isEditMode } = useAddPage(props)

    const {
      auth: { ACCOUNT_STATUS, ROLES },
      employee: { DEPARTMENTS },
    } = $dict

    const dialogVisible = ref(false)

    const dialogTitle = computed(() => {
      const map = {
        add: '添加用户',
        edit: '编辑用户',
        detail: '用户详情',
      }

      return map[props.mode]
    })

    // 表单校验规则
    const formRules = {
      account: [{ required: true, message: '请输入账号' }],
      department: [{ required: true, message: '请选择所属部门' }],
      roleIds: [{ required: true, message: '请选择角色' }],
      status: [{ required: true, message: '请选择账号状态' }],
    }

    const formRef = ref(null)
    const formMdl = ref({
      account: '',
      department: '',
      roleIds: [],
      status: '',
    })

    // 提交表单数据
    const loadding = ref(false)
    const handleSubmit = async () => {
      if (loadding.value) {
        return
      }

      // 表单校验
      const validate = await new Promise((resolve) => {
        formRef.value.validate(resolve)
      })

      if (!validate) {
        return
      }
      loadding.value = true

      // 参数组装
      const params = {
        ...formMdl.value,
      }

      console.log('API接口调用模拟', params, isCreateMode)

      // 接口调用
      let apiKey = null
      if (isCreateMode.value) {
        apiKey = 'createUser'
      } else if (isEditMode.value) {
        apiKey = 'updateUser'
      }

      const apiRes = await $api.auth[apiKey](params).catch((error) => {
        $message.error({
          message: error,
          duration: 3000,
        })
        setTimeout(() => {
          // 解决loadding闪烁
          loadding.value = false
        }, 150)
      })

      const { code, msg } = apiRes.data
      if (code === $apiCode.SUCCESS) {
        $message.success({
          message: '模拟操作成功',
          duration: 3000,
        })
        loadding.value = true
        // 关闭弹窗
        dialogVisible.value = false
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

      loadding.value = false
    }

    // 弹窗关闭
    const handleClosed = () => {
      formRef.value.resetFields()
    }

    // 打开弹窗
    const open = () => {
      dialogVisible.value = true
    }

    // 关闭弹窗
    const close = () => {
      dialogVisible.value = false
    }

    return {
      ACCOUNT_STATUS,
      ROLES,
      DEPARTMENTS,
      dialogVisible,
      dialogTitle,
      isDetailMode,
      formRules,
      formRef,
      formMdl,
      loadding,
      handleSubmit,
      handleClosed,
      open,
      close,
    }
  },
}
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
  .select-trigger {
    width: 100%;
  }
}
</style>
