<template>
  <div class="page-container page-container--bg">
    <el-card shadow="never">
      <el-row class="justify-center">
        <el-col :xs="24" :sm="22" :md="12" :lg="10" :xl="10">
          <!-- S 步骤 -->
          <el-steps
            :active="currentStepIndex"
            align-center
            finish-status="finish"
          >
            <el-step title="填写转账信息" />
            <el-step title="确认转账信息" />
            <el-step title="完成" />
          </el-steps>
          <!-- E 步骤 -->

          <!-- S 表单 -->
          <el-form label-width="100px" class="mt-[36px]">
            <PaymentStep1
              ref="paymentStep1Ref"
              :class="{ hidden: currentStepIndex !== 1 }"
            ></PaymentStep1>

            <PaymentStep2
              ref="paymentStep2Ref"
              :step1FormMdl="paymentStep1Ref?.formMdl || {}"
              :class="{ hidden: currentStepIndex !== 2 }"
            ></PaymentStep2>

            <el-form-item class="mt-[44px]">
              <el-button
                v-if="currentStepIndex === 1"
                type="primary"
                @click="handleNextStep"
              >
                下一步
              </el-button>

              <el-button
                v-if="currentStepIndex === 2"
                type="primary"
                @click="handlePayment"
              >
                立即转账
              </el-button>
              <el-button v-if="currentStepIndex === 2" @click="handlePrevStep">
                上一步
              </el-button>
            </el-form-item>
          </el-form>
          <!-- E 表单 -->
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { ref } from 'vue'
import { debounce } from 'lodash'
import useCurrentInstance from '@/hooks/business/useCurrentInstance'
import PaymentStep1 from './components/PaymentStep1.vue'
import PaymentStep2 from './components/PaymentStep2.vue'

export default {
  components: {
    PaymentStep1,
    PaymentStep2,
  },
  setup() {
    const { $api, $apiCode, $message } = useCurrentInstance()

    // 当前处理步骤
    const currentStepIndex = ref(1)

    const paymentStep1Ref = ref(null)
    const paymentStep2Ref = ref(null)

    // 下一步
    const handleNextStep = async () => {
      // 表单校验
      const validate = await new Promise((resolve) => {
        paymentStep1Ref.value.formRef.validate(resolve)
      })
      if (validate) {
        currentStepIndex.value = 2
      }
    }

    // 转账
    const loadding = ref(false)
    const handlePayment = debounce(async () => {
      if (loadding.value) {
        return
      }
      // 表单校验
      const validate = await new Promise((resolve) => {
        paymentStep2Ref.value.formRef.validate(resolve)
      })
      if (!validate) {
        return
      }
      payment()
    }, 500)

    const payment = async () => {
      const params = {
        ...paymentStep1Ref?.value?.formMdl,
        ...paymentStep2Ref?.value?.formMdl,
      }

      const apiRes = await $api.payment.payment(params).catch((error) => {
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
        currentStepIndex.value = 3
        loadding.value = true
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
    }

    // 上一步
    const handlePrevStep = () => {
      currentStepIndex.value = 1
    }

    return {
      currentStepIndex,
      paymentStep1Ref,
      paymentStep2Ref,
      handleNextStep,
      handlePayment,
      handlePrevStep,
    }
  },
}
</script>
<style lang="scss" scoped></style>
