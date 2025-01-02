/*
 * 基础路由配置
 */
import {
  DEFAULT_HOME_PAGE_ROUTE_PATH,
  NOT_FOUND_PAGE_ROUTE_PATH,
  NO_AUTH_ROUTE_PATH,
} from '@/settings/config/router'

import NTLayouts from '#LAYOUTS/index.vue'

// 根路由
export const rootRoute = {
  path: '/',
  name: 'Root',
  component: NTLayouts,
  redirect: DEFAULT_HOME_PAGE_ROUTE_PATH,
  children: [
    {
      path: '/home',
      name: 'Home',
      meta: {
        icon: 'ri-home-line',
        title: '首页',
      },
      component: () => import('@/views/home/index.vue'),
    },
  ],
}

// 登录页路由
export const loginRoutes = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
}

// 错误页路由
export const errorRoute = {
  path: '/error',
  name: 'Error',
  redirect: NO_AUTH_ROUTE_PATH,
  children: [
    {
      path: NO_AUTH_ROUTE_PATH,
      name: 'NoAuth',
      component: () => import('@/views/errors/noAuth.vue'),
    },
  ],
}

// 404页路由
export const notFoundRoutes = [
  {
    path: '/:path(.*)*',
    name: 'NotFound',
    redirect: NOT_FOUND_PAGE_ROUTE_PATH,
  },
  {
    path: NOT_FOUND_PAGE_ROUTE_PATH,
    name: 'PageNotFound',
    component: () => import('@/views/errors/404NotFound.vue'),
  },
]

const basicRoutes = [rootRoute, loginRoutes, errorRoute, ...notFoundRoutes]

// 如果是本地开发模式，添加开发模式下特有的页面路由
// if (import.meta.env.VITE_APP_COMMAND === 'dev') {
//   const devExtraRoutes = [
//     {
//       path: '/demo',
//       name: 'Demo',
//       component: NTLayouts,
//       redirect: '/demo/components-use',
//       children: [
//         {
//           path: '/demo/components-use',
//           name: 'ComponentsUseDemo',
//           component: () => import('@/views/other/demo/componentsUse/index.vue'),
//           meta: {
//             title: '功能组件使用demo',
//             cache: true,
//             hidden: true,
//           },
//         },
//       ],
//     },
//   ]
//   basicRoutes.push(...devExtraRoutes)
// }
export default basicRoutes
