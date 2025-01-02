<template>
  <div id="app">
    <router-view></router-view>

    <!-- S 滚动到顶部 -->
    <el-backtop></el-backtop>
    <!-- E 滚动到顶部 -->
  </div>
</template>

<script>
import '#ASSETS/style/app.scss'

export default {}
</script>

<style lang="scss" scoped></style>
