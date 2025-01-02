import { http } from '@/utils/http'

// 诗歌列表
export const getPoemList = (data) => {
  return http.post('/api/v1/poem/list', data)
}

// 诗歌分类列表
export const getPoemCategoryList = (data) => {
  return http.post('/api/v1/poem/categoryList', data)
}

// 诗歌新增接口
export const createPoem = (data) => {
  return http.post('/api/v1/poem/create', data)
}
