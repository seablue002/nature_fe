<template>
  <div class="page-container page-container--bg">
    <el-card v-loading="loadding" shadow="never">
      <el-alert
        title="本框架采用RBAC(Role-Based Access Control)基于角色的访问控制，展示相关用户所拥有角色对应的菜单与按钮权限"
        type="error"
      />

      <el-form label-position="top" class="py-[24px]">
        <el-form-item label="切换账号">
          <el-radio-group v-model="account" @change="handleSwitchAccount">
            <el-radio-button label="admin">
              <template #default>admin：管理员</template>
            </el-radio-button>
            <el-radio-button label="finance">
              <template #default>finance：财务</template>
            </el-radio-button>
            <el-radio-button label="operator">
              <template #default>operator：运营</template>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限按钮">
          <el-card shadow="never" class="w-[100%] mb-[12px]">
            <template #header>方式1、hasPermission函数</template>
            <el-button
              :type="
                hasPermission(ConfigurableTableDetail) ? 'primary' : 'danger'
              "
              :disabled="!hasPermission(ConfigurableTableDetail)"
            >
              配置型表格-详情按钮
              <span v-if="!hasPermission(ConfigurableTableDetail)">
                （无权限）
              </span>
            </el-button>
            <el-button
              :type="
                hasPermission(ConfigurableTableEdit) ? 'primary' : 'danger'
              "
              :disabled="!hasPermission(ConfigurableTableEdit)"
            >
              配置型表格-编辑按钮
              <span v-if="!hasPermission(ConfigurableTableEdit)">
                （无权限）
              </span>
            </el-button>
            <el-button
              :type="
                hasPermission(ConfigurableTableCreate) ? 'primary' : 'danger'
              "
              :disabled="!hasPermission(ConfigurableTableCreate)"
            >
              配置型表格-新增按钮
              <span v-if="!hasPermission(ConfigurableTableCreate)">
                （无权限）
              </span>
            </el-button>
            <el-button
              :type="
                hasPermission(ConfigurableTableDelete) ? 'primary' : 'danger'
              "
              :disabled="!hasPermission(ConfigurableTableDelete)"
            >
              配置型表格-删除按钮
              <span v-if="!hasPermission(ConfigurableTableDelete)">
                （无权限）
              </span>
            </el-button>
          </el-card>

          <el-card :key="ablePermissionButtons" shadow="never" class="w-[100%]">
            <template #header>方式2、v-permission-auth指令</template>
            <el-button
              v-permission-auth="ConfigurableTableDetail"
              type="primary"
            >
              配置型表格-详情按钮
            </el-button>
            <el-button v-permission-auth="ConfigurableTableEdit" type="primary">
              配置型表格-编辑按钮
            </el-button>
            <el-button
              v-permission-auth="ConfigurableTableCreate"
              type="primary"
            >
              配置型表格-新增按钮
            </el-button>
            <el-button
              v-permission-auth="ConfigurableTableDelete"
              type="primary"
            >
              配置型表格-删除按钮
            </el-button>
          </el-card>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { ref, toRefs } from 'vue'
import useUserStore from '@/store/modules/user'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import usePermission from '@/hooks/usePermission'
import {
  ConfigurableTableDetail,
  ConfigurableTableEdit,
  ConfigurableTableCreate,
  ConfigurableTableDelete,
} from '@/settings/config/permission'

export default {
  setup() {
    const userStore = useUserStore()
    const { $message } = useCurrentInstance()
    const { hasPermission } = usePermission()

    const { userInfo, ablePermissionButtons } = toRefs(userStore)

    // 账号切换
    const account = ref(userInfo.value?.name || 'admin')
    const loadding = ref(false)
    const handleSwitchAccount = async () => {
      if (loadding.value) {
        return
      }
      loadding.value = true
      userStore
        .login({ account: account.value })
        .then(() => {
          $message.success({
            message: '账号切换成功',
            duration: 3000,
          })
        })
        .catch(() => {
          $message.error({
            message: '账号切换失败',
            duration: 3000,
          })
        })
        .finally(() => {
          setTimeout(() => {
            // 解决loadding闪烁
            loadding.value = false
          }, 150)
        })
    }

    return {
      ablePermissionButtons,
      ConfigurableTableDetail,
      ConfigurableTableEdit,
      ConfigurableTableCreate,
      ConfigurableTableDelete,
      hasPermission,
      account,
      loadding,
      handleSwitchAccount,
    }
  },
}
</script>
<style lang="scss" scoped></style>
