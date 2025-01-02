/**
 * 权限管理模块路由
 */

// 系统用户管理模块路由
export const user = {
  path: '/auth/user',
  name: 'AuthUser',
  redirect: '/auth/user/list',
  meta: {
    icon: 'ri-user-3-line',
    title: '用户管理',
  },
  children: [
    {
      path: '/auth/user/list',
      name: 'AuthUserList',
      component: () => import('@/views/demo/auth/user/list/index.vue'),
      meta: {
        title: '用户列表',
        cache: true,
        hidden: true,
      },
    },
  ],
}

export const role = {
  path: '/auth/role',
  name: 'AuthRole',
  redirect: '/auth/role/list',
  meta: {
    icon: 'ri-shield-user-line',
    title: '角色管理',
  },
  children: [
    {
      path: '/auth/role/list',
      name: 'AuthRoleList',
      component: () => import('@/views/demo/auth/role/list/index.vue'),
      meta: {
        title: '角色列表',
        cache: true,
        hidden: true,
      },
    },
  ],
}

export const func = {
  path: '/auth/func',
  name: 'AuthFunc',
  redirect: '/auth/func/list',
  meta: {
    icon: 'ri-function-line',
    title: '功能管理',
  },
  children: [
    {
      path: '/auth/func/list',
      name: 'AuthFuncList',
      component: () => import('@/views/demo/auth/func/list/index.vue'),
      meta: {
        title: '功能列表',
        cache: true,
        hidden: true,
      },
    },
  ],
}

// 权限管理模块总路由集成
const auth = {
  path: '/auth',
  name: 'Auth',
  redirect: '/auth/user',
  meta: {
    icon: 'ri-user-settings-line',
    title: '权限管理',
  },
  children: [user, role, func],
}

export default auth
