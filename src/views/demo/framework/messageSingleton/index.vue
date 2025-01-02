<template>
  <div class="page-container page-container--bg">
    <!-- S 常规方式消息提示 -->
    <el-card shadow="never" class="mb-[12px]">
      <template #header>
        <div class="card-header">
          <span>常规方式消息提示（请连续点击按钮）</span>
        </div>
      </template>

      <el-button :plain="true" @click="handleShowMessage1">success</el-button>
      <el-button :plain="true" @click="handleShowMessage2">warning</el-button>
      <el-button :plain="true" @click="handleShowMessage3">message</el-button>
      <el-button :plain="true" @click="handleShowMessage4">error</el-button>
    </el-card>
    <!-- E 常规方式消息提示 -->

    <!-- S 单例方式消息提示 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>单例方式消息提示（请连续点击按钮）</span>
        </div>
      </template>

      <el-alert
        title="仅有一个消息提示显示在页面。每个消息提示出现前会关闭前面显示中的消息"
        type="error"
        class="mb-[12px]"
      />

      <el-button :plain="true" @click="handleShowSingletonMessage1">
        success
      </el-button>
      <el-button :plain="true" @click="handleShowSingletonMessage2">
        warning
      </el-button>
      <el-button :plain="true" @click="handleShowSingletonMessage3">
        message
      </el-button>
      <el-button :plain="true" @click="handleShowSingletonMessage4">
        error
      </el-button>
    </el-card>
    <!-- E 单例方式消息提示 -->
  </div>
</template>
<script>
import { ElMessage } from 'element-plus'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'

export default {
  setup() {
    const { $message } = useCurrentInstance()

    // 常规方式消息提示
    const handleShowMessage1 = () => {
      ElMessage({
        message: '常规方式 success 消息提示',
        type: 'success',
      })
    }

    const handleShowMessage2 = () => {
      ElMessage.warning('常规方式 warning 消息提示')
    }

    const handleShowMessage3 = () => {
      ElMessage('常规方式消息提示')
    }

    const handleShowMessage4 = () => {
      ElMessage({
        message: '常规方式 error 消息提示',
        type: 'error',
      })
    }

    // 常规方式消息提示
    const handleShowSingletonMessage1 = () => {
      $message({
        message: '单例方式 success 消息提示',
        type: 'success',
      })
    }

    const handleShowSingletonMessage2 = () => {
      $message.warning('单例方式 warning 消息提示')
    }

    const handleShowSingletonMessage3 = () => {
      $message('单例方式消息提示')
    }

    const handleShowSingletonMessage4 = () => {
      $message({
        message: '单例方式 error 消息提示',
        type: 'error',
      })
    }

    return {
      handleShowMessage1,
      handleShowMessage2,
      handleShowMessage3,
      handleShowMessage4,
      handleShowSingletonMessage1,
      handleShowSingletonMessage2,
      handleShowSingletonMessage3,
      handleShowSingletonMessage4,
    }
  },
}
</script>
<style lang="scss" scoped></style>
