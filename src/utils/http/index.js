/*
 * http实例主文件
 */
import useUserStore from '@/store/modules/user'
import { XHR_TIMEOUT } from '@/settings/config/http'
import Message from '@/utils/other/message'
import NTAxios from './NTAxios'

// 请求拦截器函数
function requestInterceptorHandler(axiosInstance, requestConfig) {
  const userStore = useUserStore()
  requestConfig.headers.Authorization = userStore.token
}

// 响应拦截器函数
function responseInterceptorHandler(axiosInstance, response) {
  const userStore = useUserStore()
  const { code, errorCode } = response.data

  if (['0000001', '0000002'].includes(code)) {
    Message.error({
      message: '登录失效',
      duration: 3000,
    })
  } else if (code !== 0) {
    if (errorCode === 10003) {
      Message.error({
        message: 'token错误',
        duration: 3000,
      })

      // 清除用户store数据
      userStore.clear()
    } else if (errorCode === 20604) {
      Message.error({
        message: '用户未登录',
        duration: 3000,
      })
    } else if (errorCode === 20607) {
      Message.error({
        message: '账号被锁定，请联系管理员',
        duration: 3000,
      })
    } else if (errorCode === 20608) {
      Message.error({
        message: '未授权访问',
        duration: 3000,
      })
      // 清除用户store数据
      // userStore.clear()
    }
  }
}

// http请求对象，由NTAxios封装类生成，为axios实例
export const http = new NTAxios({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: XHR_TIMEOUT,
  requestInterceptorHandler,
  responseInterceptorHandler,
}).axiosInstance

// 其他url请求调用的axios实例, 可以根据具体请求特性进行多个实例生成
export const otherHttp = new NTAxios({
  // 具体业务需要，进行具体特性化参数配置
})
