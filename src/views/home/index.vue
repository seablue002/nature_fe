<template>
  <div class="page-container page-container--bg">
    <!-- S 项目特性介绍信息 -->
    <el-card shadow="never" class="mb-[16px]">
      <div class="flex items-center">
        <img src="@/assets/images/avatar.png" class="avatar" />

        <div class="info">
          <p class="text-[18px] font-bold">
            你好 admin，我是Vue Admin Nature，简称VAN，
            一款基于vue3、element-plus技术栈研发而成的前端管理系统框架。
          </p>
          <p>
            最近更新：
            <a href="" target="_blank">VAN</a>
            拥有清晰合理的功能与目录划分，内置常用组件封装，包含常用助手方法，支持多环境开发与打包，采用eslint格式校验等，让中后台管理系统端业务功能开发变得稳定而高效。
            <span style="color: #ff5722">活动优惠，买了就赚了</span>
          </p>
        </div>
      </div>
    </el-card>
    <!-- S 项目特性介绍信息 -->

    <!-- S 统计与项目技术信息 -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="mb-[16px]">
        <el-card shadow="never">
          <template #header>
            <span>访问量</span>
            <el-tag type="success" size="small" class="float-right">日</el-tag>
          </template>
          <NTEcharts ref="visitsChartRef" class="visits-chart-card"></NTEcharts>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="mb-[16px]">
        <el-card shadow="never">
          <template #header>
            <span>授权数</span>
            <el-tag type="warning" size="small" class="float-right">日</el-tag>
          </template>
          <NTEcharts ref="buyChartRef" class="buy-chart-card"></NTEcharts>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb-[16px]">
        <el-card shadow="never">
          <template #header>
            <span>框架信息</span>
            <el-tag size="small" class="float-right"> 当前版本：v3.5.0 </el-tag>
          </template>
          <el-scrollbar>
            <el-descriptions :column="3" border>
              <el-descriptions-item>
                <template #label>vue</template>
                <el-tag type="success" size="small">^3.3.4</el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span class="whitespace-nowrap">vue-router</span>
                </template>
                <el-tag type="success" size="small">^4.2.5</el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>pinia</template>
                <el-tag type="success" size="small">^2.1.7</el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>vite</template>
                <el-tag type="success" size="small">^4.3.9</el-tag>
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>
                  <span class="whitespace-nowrap">element-plus</span>
                </template>
                <el-tag type="success" size="small">^2.3.7</el-tag>
              </el-descriptions-item>
              <el-descriptions-item :span="3">
                <template #label>
                  <span class="whitespace-nowrap">授权渠道</span>
                </template>
                <el-button type="primary">源码购买 ￥19.9</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
    <!-- E 统计与项目技术信息 -->

    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="mb-[16px]">
        <el-card shadow="never">
          <template #header>
            <span>源码购买与商业使用授权</span>
          </template>

          <div class="flex flex-col justify-center items-center">
            <img src="~@/assets/images/wechat_qrcode.png" class="w-[150px]" />
            <el-text>扫码添加微信</el-text>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'HomePage',
  setup() {
    // 访问量
    const visitsChartRef = ref(null)
    onMounted(() => {
      visitsChartRef.value.init()

      const option = visitsData()

      visitsChartRef.value.setOption(option)
    })

    // 访问数据
    const visitsData = () => {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        grid: {
          top: '6px',
          left: '0',
          right: '15px',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: 'rgb(255, 70, 131)',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 158, 68)',
                },
                {
                  offset: 1,
                  color: 'rgb(255, 70, 131)',
                },
              ]),
            },
            data: [],
          },
        ],
      }

      // 近7天日期
      const dateArr = getDate()

      option.xAxis[0].data = dateArr.map((date) => {
        return date.join('/')
      })

      dateArr.forEach(() => {
        const num =
          6000 +
          Math.ceil(Math.random() * 3000) * (Math.random() > 0.5 ? 1 : -1)
        option.series[0].data.push(num)
      })

      return option
    }

    // 获取最近days天的日期
    const getDate = (days = 7) => {
      const date = new Date()
      const dateArr = []
      date.setDate(date.getDate() + 1)
      for (let i = 0; i < days; i += 1) {
        date.setDate(date.getDate() - 1)
        // const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        dateArr.push([month, day])
      }
      return dateArr
    }

    // 授权数
    const buyChartRef = ref(null)
    onMounted(() => {
      buyChartRef.value.init()

      const option = buyData()

      buyChartRef.value.setOption(option)
    })

    // 购买数据
    const buyData = () => {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        grid: {
          top: '6px',
          left: '0',
          right: '15px',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '授权数',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: 'rgb(100, 188, 255)',
            },
            data: [],
          },
        ],
      }

      // 近7天日期
      const dateArr = getDate()

      option.xAxis[0].data = dateArr.map((date) => {
        return date.join('/')
      })

      dateArr.forEach(() => {
        const num =
          66 + Math.ceil(Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1)
        option.series[0].data.push(num)
      })

      return option
    }

    return {
      visitsChartRef,
      buyChartRef,
    }
  },
}
</script>
<style lang="scss" scoped>
.avatar {
  width: 60px;
  height: 60px;
  margin-right: 24px;
}

.visits-chart-card,
.buy-chart-card,
.el-descriptions {
  height: 150px;
}
</style>
