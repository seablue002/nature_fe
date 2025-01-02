import { http } from '@/utils/http'

// 系统用户列表接口
export const getAuthUserList = (data) => {
  return http.post('/api/v1/auth/user/list', data)
}

// 系统用户权限菜单列表接口
// export const getAuthMenus = (data) => {
//   return http.post('/api/v1/auth/menus', data)
// }

// 系统用户新增接口
export const createUser = (data) => {
  return http.post('/api/v1/auth/user/create', data)
}

// 系统用户编辑接口
export const updateUser = (data) => {
  return http.post('/api/v1/auth/user/update', data)
}

// 系统角色列表接口
export const getAuthRoleList = (data) => {
  return http.post('/api/v1/auth/role/list', data)
}

// 系统功能树形列表接口
export const getAuthFuncListTree = (data) => {
  return http.post('/api/v1/auth/func/listTree', data)
}

// 系统角色新增接口
export const createRole = (data) => {
  return http.post('/api/v1/auth/role/create', data)
}

// 系统角色编辑接口
export const updateRole = (data) => {
  return http.post('/api/v1/auth/role/update', data)
}

// 系统功能列表接口
export const getAuthFuncList = (data) => {
  return http.post('/api/v1/auth/func/list', data)
}

// 系统功能新增接口
export const createFunc = (data) => {
  return http.post('/api/v1/auth/func/create', data)
}

// 系统功能编辑接口
export const updateFunc = (data) => {
  return http.post('/api/v1/auth/func/update', data)
}
