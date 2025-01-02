<template>
  <div class="step1">
    <el-form
      ref="formRef"
      :model="formMdl"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item prop="paymentAccount" label="付款账户：">
        <el-input v-model="formMdl.paymentAccount" clearable />
      </el-form-item>
      <el-form-item prop="receivingAccount" label="收款账户：">
        <el-input v-model="formMdl.receivingAccount" clearable />
      </el-form-item>
      <el-form-item prop="payee" label="收款人姓名">
        <el-input v-model="formMdl.payee" clearable />
      </el-form-item>
      <el-form-item prop="amount" label="转账金额：">
        <el-input v-model="formMdl.amount" clearable />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ref } from 'vue'
import { isNullOrUnDef, isPositive } from '@/utils/helper/is'

const formRules = {
  paymentAccount: [{ required: true, message: '请输入付款账户' }],
  receivingAccount: [{ required: true, message: '请输入收款账户' }],
  payee: [{ required: true, message: '请输入收款人姓名' }],
  amount: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (isNullOrUnDef(value) || value === '') {
          callback(new Error('请输入转账金额'))
        } else if (!isPositive(value)) {
          callback(new Error('请输入合法金额数字'))
        } else {
          const reg = /\.(\d+)$/
          const match = reg.exec(value.toString())
          const decimalDigits = match ? match[1].length : 0
          if (decimalDigits > 2) {
            callback(new Error('请输入合法金额数字'))
          } else if (value < 0) {
            callback(new Error('请输入合法金额数字'))
          } else if (value > 100000) {
            callback(new Error('单笔转账金额不超过100,000'))
          }
        }

        callback()
      },
    },
  ],
}
export default {
  setup() {
    const formRef = ref(null)
    const formMdl = ref({
      paymentAccount: '',
      receivingAccount: '',
      payee: '',
      amount: '',
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
