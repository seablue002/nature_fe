<template>
  <div class="page-container page-container--bg">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>表单元素缓存</span>
        </div>
      </template>
      <el-input v-model="keywords"></el-input>
    </el-card>

    <el-card shadow="never" class="mt-[24px]">
      <template #header>
        <div class="card-header">
          <span>综合案例</span>
        </div>
      </template>

      <router-link to="/demo/components/base/table/configurableTable">
        <el-button type="primary">搜索条件缓存 </el-button>
      </router-link>
    </el-card>
  </div>
</template>
<script>
import { ref } from 'vue'

export default {
  name: 'MultiLevelRoutingCache2',
  setup() {
    const keywords = ref('')

    return {
      keywords,
    }
  },
}
</script>
<style lang="scss" scoped></style>
