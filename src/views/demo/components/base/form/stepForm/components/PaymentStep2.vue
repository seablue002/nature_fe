<template>
  <div class="step2">
    <el-alert
      title="确认转账后，资金将直接打入对方账户，无法退回。"
      type="error"
      show-icon
      class="mb-[24px]"
    />
    <el-form
      ref="formRef"
      :model="formMdl"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="付款账户：">
        {{ step1FormMdl.paymentAccount }}
      </el-form-item>
      <el-form-item label="收款账户：">
        {{ step1FormMdl.receivingAccount }}
      </el-form-item>
      <el-form-item label="收款人姓名">
        {{ step1FormMdl.payee }}
      </el-form-item>
      <el-form-item label="转账金额：">
        {{ step1FormMdl.amount }}
      </el-form-item>
      <el-form-item prop="password" label="支付密码：">
        <el-input v-model="formMdl.password" clearable />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ref } from 'vue'

const formRules = {
  password: [{ required: true, message: '请输入支付密码' }],
}
export default {
  props: {
    step1FormMdl: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const formRef = ref(null)
    const formMdl = ref({
      password: '',
    })

    return {
      formRules,
      formMdl,
      formRef,
    }
  },
}
</script>
<style lang="scss" scoped></style>
