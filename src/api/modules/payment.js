import { http } from '@/utils/http'

// 转账
export const payment = (data) => {
  return http.post('/api/v1/payment', data)
}
