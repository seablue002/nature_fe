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
          :validate-on-rule-change="false"
        >
          <el-form-item prop="name" label="角色名称">
            <el-input
              v-model="formMdl.name"
              :maxlength="30"
              placeholder="请输入角色名称"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item prop="permission" label="权限设置">
            <el-card
              v-loading="permissionLoadding"
              shadow="never"
              class="w-[100%]"
            >
              <el-tree
                ref="permissionTreeRef"
                :data="treeData"
                node-key="code"
                default-expand-all
                :check-strictly="false"
                :default-checked-keys="checkedKeysArr"
                :props="{ label: 'title', children: 'children' }"
                :show-checkbox="!isDetailMode"
              ></el-tree>
            </el-card>
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
    const { $api, $apiCode, $message } = useCurrentInstance()

    const { isDetailMode, isCreateMode, isEditMode } = useAddPage(props)

    const dialogVisible = ref(false)

    const dialogTitle = computed(() => {
      const map = {
        add: '添加角色',
        edit: '编辑角色',
        detail: '角色详情',
      }

      return map[props.mode]
    })

    // 表单校验规则
    const formRules = {
      name: [{ required: true, message: '请输入角色名称' }],
      permission: [{ required: true, message: '请勾选权限' }],
    }

    const formRef = ref(null)
    const formMdl = ref({
      name: '',
      permission: [],
    })

    const permissionTreeRef = ref(null)
    const checkedKeysArr = ref(['Home'])
    const treeData = ref([])

    // 获取系统功能树形列表
    const permissionLoadding = ref(false)
    const getAuthFuncListTree = async () => {
      permissionLoadding.value = true

      const apiRes = await $api.auth.getAuthFuncListTree().catch((error) => {
        $message.error({
          message: error,
          duration: 3000,
        })
        setTimeout(() => {
          // 解决permissionLoadding闪烁
          permissionLoadding.value = false
        }, 150)
      })

      const { code, data, msg } = apiRes.data
      if (code === $apiCode.SUCCESS && data) {
        treeData.value = data
      } else {
        $message.error({
          message: msg,
          duration: 3000,
        })
      }
      setTimeout(() => {
        // 解决permissionLoadding闪烁
        permissionLoadding.value = false
      }, 150)
    }

    // 提交表单数据
    const loadding = ref(false)
    const handleSubmit = async () => {
      if (loadding.value) {
        return
      }

      // 权限树选中值获取
      formMdl.value.permission = permissionTreeRef.value.getCheckedNodes(
        false,
        true
      )

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
        apiKey = 'createRole'
      } else if (isEditMode.value) {
        apiKey = 'updateRole'
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

      getAuthFuncListTree()
    }

    // 关闭弹窗
    const close = () => {
      dialogVisible.value = false
    }

    return {
      dialogVisible,
      dialogTitle,
      isDetailMode,
      formRules,
      formRef,
      formMdl,
      permissionTreeRef,
      checkedKeysArr,
      treeData,
      permissionLoadding,
      loadding,
      handleSubmit,
      handleClosed,
      open,
      close,
    }
  },
}
</script>
<style lang="scss" scoped></style>
