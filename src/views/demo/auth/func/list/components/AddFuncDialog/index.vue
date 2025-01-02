<template>
  <div class="add-func-dialog">
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
      @closed="handleClosed"
    >
      <el-form
        ref="formRef"
        :model="formMdl"
        :rules="!isDetailMode ? formRules : null"
        label-width="110"
        :disabled="isDetailMode"
        :validate-on-rule-change="false"
      >
        <el-form-item prop="pid" label="父级功能ID" class="hidden">
          <el-input v-model="formMdl.pid" :maxlength="30" disabled></el-input>
        </el-form-item>

        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb-[5px]">
            <el-form-item prop="parentName" label="父级功能">
              <el-input
                v-model="formMdl.parentName"
                disabled
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb-[5px]">
            <el-form-item label="功能名称" prop="title">
              <el-input
                v-model="formMdl.title"
                placeholder="请输入功能名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb-[5px]">
            <el-form-item label="功能类型" prop="type">
              <el-select
                v-model="formMdl.type"
                placeholder="请选择"
                clearable
                class="w-[100%]"
              >
                <el-option :key="0" label="菜单" :value="0"></el-option>
                <el-option :key="1" label="按钮" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb-[5px]">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="formMdl.status"
                placeholder="请选择功能状态"
                clearable
                class="w-[100%]"
              >
                <el-option
                  v-for="item in FUNC_STATUS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb-[5px]">
            <el-form-item label="页面路由" prop="path">
              <el-input
                v-model="formMdl.path"
                placeholder="页面路由"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb-[5px]">
            <el-form-item label="唯一标识" prop="code">
              <el-input
                v-model="formMdl.code"
                placeholder="请输入功能唯一标识"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb-[5px]">
            <el-form-item label="icon" prop="icon">
              <el-input
                v-model="formMdl.icon"
                placeholder="请输入icon名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb-[5px]">
            <el-form-item label="排序值" prop="sort">
              <el-input
                v-model="formMdl.sort"
                placeholder="请输入排序值"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template v-if="!isDetailMode" #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="loadding" @click="handleSubmit">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import useAddPage from '@/hooks/business/useAddPage'
import { isPositiveInteger, isNullOrUnDef } from '@/utils/helper/is'

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

    const {
      auth: { FUNC_STATUS },
    } = $dict

    const { isDetailMode, isCreateMode, isEditMode } = useAddPage(props)

    const dialogVisible = ref(false)

    const dialogTitle = computed(() => {
      const map = {
        add: '添加功能',
        edit: '编辑功能',
        detail: '功能详情',
      }

      return map[props.mode]
    })

    // 表单校验规则
    const formRules = ref({
      title: [
        { required: true, message: '请输入功能名称' },
        { max: 20, message: '功能名称不超过20个字符', trigger: 'blur' },
      ],
      type: [{ required: true, message: '请选择功能类型' }],
      status: [{ required: true, message: '请选择功能状态' }],
      path: [{ required: false, message: '请输入页面路由' }],
      code: [{ required: true, message: '请填写功能标识' }],
      sort: [
        {
          required: false,
          validator: (rule, value, callback) => {
            if (
              !isNullOrUnDef(value) &&
              value !== '' &&
              !isPositiveInteger(value)
            ) {
              callback(new Error('排序为0或正整数'))
            }
            callback()
          },
        },
      ],
    })

    const formRef = ref(null)
    const formMdl = ref({
      pid: '',
      parentName: '',
      title: '',
      type: '',
      status: '',
      path: '',
      code: '',
      sort: '',
      icon: '',
    })

    watch(
      () => formMdl.value.type,
      (nVal) => {
        const isRequired = nVal === 0
        formRules.value.path[0].required = isRequired

        if (!isRequired) {
          formRef.value?.clearValidate(['path'])
        }
      }
    )

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

      console.log('API接口调用模拟', params)

      // 接口调用
      let apiKey = null
      if (isCreateMode.value) {
        apiKey = 'createFunc'
      } else if (isEditMode.value) {
        apiKey = 'updateFunc'
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
      FUNC_STATUS,
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
@media screen and (max-width: 768px) {
  :deep(.el-dialog) {
    width: 80%;
  }
}
</style>
