import { http } from '@/utils/http'

// 系统用户登录接口
export const login = (data) => {
  return http.post('/api/v1/user/login', data)
}
