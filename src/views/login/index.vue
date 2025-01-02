<template>
  <el-button @click="handleLogin">登录</el-button>
</template>
<script>
import { ref } from 'vue'
import useUserStore from '@/store/modules/user'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import { DEFAULT_HOME_PAGE_ROUTE_PATH } from '@/settings/config/router'

export default {
  setup() {
    const userStore = useUserStore()
    const { router, $message } = useCurrentInstance()

    // 登录
    const loadding = ref(false)
    const formMdl = ref({
      account: 'admin',
    })
    const handleLogin = async () => {
      if (loadding.value) {
        return
      }
      loadding.value = true
      userStore
        .login(formMdl.value)
        .then(() => {
          $message.success({
            message: '登录成功',
            duration: 3000,
          })

          // 跳转默认页
          router.push({ path: DEFAULT_HOME_PAGE_ROUTE_PATH })
        })
        .catch(() => {
          $message.error({
            message: '登录失败',
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
      handleLogin,
    }
  },
}
</script>
<style lang="scss" scoped></style>
