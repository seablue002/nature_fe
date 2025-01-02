<template>
  <div class="page-container page-container--bg">
    <el-card shadow="never">
      <el-row>
        <el-col :xs="24" :sm="22" :md="12" :lg="10" :xl="10">
          <el-form ref="formRef" :model="formMdl" :rules="formRules">
            <el-form-item prop="name" label="标题">
              <el-input
                v-model="formMdl.name"
                :maxlength="30"
                placeholder="请输入标题"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="author" label="作者">
              <el-input
                v-model="formMdl.author"
                :maxlength="30"
                placeholder="请输入作者"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="dynasty" label="时期">
              <el-select
                v-model="formMdl.dynasty"
                placeholder="请选择时期"
                clearable
              >
                <el-option
                  v-for="item in DYNASTY"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button @click="handleCancel">
                取消
                <el-popover placement="top-start" width="auto" trigger="hover">
                  <template #default>
                    <p class="ml-[4px]">关闭当前页面后跳转到指定页面</p>
                  </template>
                  <template #reference>
                    <i class="ri-question-line ml-[4px]"></i>
                  </template>
                </el-popover>
              </el-button>
              <el-button @click="handleCancel2">
                取消2
                <el-popover placement="top-start" width="auto" trigger="hover">
                  <template #default>
                    <p class="ml-[4px]">
                      关闭当前页面后系统自行判断跳转历史页面，
                      无其他历史页面则打开默认页面
                    </p>
                  </template>
                  <template #reference>
                    <i class="ri-question-line ml-[4px]"></i>
                  </template>
                </el-popover>
              </el-button>
              <el-button
                type="primary"
                :loadding="submitLoading"
                @click="handleSubmit"
              >
                提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { ref } from 'vue'
import useLayoutStore from '@/store/modules/layout'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '请输入标题' }],
  author: [{ required: true, message: '请输入作者' }],
  dynasty: [{ required: true, message: '请选择时期' }],
}

export default {
  setup() {
    const layoutStore = useLayoutStore()
    const { router, route, $api, $apiCode, $message, $bus, $dict } =
      useCurrentInstance()

    const {
      poem: { DYNASTY },
    } = $dict

    const formRef = ref(null)
    const formMdl = ref({
      name: '',
      author: '',
      dynasty: '',
    })

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

      console.log('API接口调用模拟', params)

      // 接口调用
      const apiRes = await $api.poem.createPoem(params).catch((error) => {
        $message.error({
          message: error,
          duration: 3000,
        })
        setTimeout(() => {
          // 解决loadding闪烁
          submitLoading.value = false
        }, 150)
      })

      const { code, msg } = apiRes.data
      if (code === $apiCode.SUCCESS) {
        $message.success({
          message: '新增成功',
          duration: 3000,
        })
        submitLoading.value = true

        // 设置已经确认离开状态值，则离开页面时不会弹出确认弹窗
        layoutStore.updateIsSureConfirmLeave(true)
        $bus.ntVisitedTagsBus.emit([
          route,
          false,
          () => {
            router.push({ path: '/demo/components/base/columnAndList' })
          },
        ])
      } else {
        $message.error({
          message: msg,
          duration: 3000,
        })
      }
      setTimeout(() => {
        // 解决loadding闪烁
        submitLoading.value = false
      }, 150)

      submitLoading.value = false
    }

    const handleCancel = () => {
      // 方式1：
      // 关闭当前页面后跳转到指定页面
      $bus.ntVisitedTagsBus.emit([
        route,
        false,
        () => {
          router.push({ path: '/demo/components/base/columnAndList' })
        },
      ])
    }

    const handleCancel2 = () => {
      // 方式2：
      // 关闭当前页面后系统自行判断跳转历史页面，
      // 无其他历史页面则打开默认页面（一般是首页，可以自行在setting/config/router配置）
      $bus.ntVisitedTagsBus.emit([route, true])
    }

    return {
      DYNASTY,
      formRules,
      formRef,
      formMdl,
      submitLoading,
      handleSubmit,
      handleCancel,
      handleCancel2,
    }
  },
}
</script>
<style lang="scss" scoped></style>
