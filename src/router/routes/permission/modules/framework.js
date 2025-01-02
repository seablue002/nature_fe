/**
 * 框架使用展示模块路由
 */

// 框架使用模块总路由集成
const framework = {
  path: '/demo/framework',
  name: 'Framework',
  meta: {
    icon: 'ri-presentation-fill',
    title: '框架使用',
    defaultOpen: true,
  },
  redirect: '/demo/framework/routeCache/multiLevelRoutingCache',
  children: [
    {
      path: '/demo/framework/routeCache/multiLevelRoutingCache',
      name: 'MultiLevelRoutingCache',
      meta: {
        icon: 'ri-git-merge-line',
        title: '多级路由缓存',
      },
      redirect: '/demo/framework/routeCache/multiLevelRoutingCache1-1',
      children: [
        {
          path: '/demo/framework/routeCache/multiLevelRoutingCache1-1',
          name: 'MultiLevelRoutingCache1',
          meta: {
            title: '多级路由1-1',
          },
          redirect: '/demo/framework/routeCache/multiLevelRoutingCache1-1-1',
          children: [
            {
              path: '/demo/framework/routeCache/multiLevelRoutingCache1-1-1',
              name: 'MultiLevelRoutingCache2',
              meta: {
                title: '多级路由1-1-1',
                cache: true,
              },
              component: () =>
                import('@/views/demo/framework/routeCache/index.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/demo/framework/pageLeaveConfirm',
      name: 'PageLeaveConfirm',
      meta: {
        icon: 'ri-arrow-left-circle-line',
        title: '离开页面确认',
      },
      component: () =>
        import('@/views/demo/framework/pageLeaveConfirm/index.vue'),
    },
    {
      path: '/demo/framework/authControl',
      name: 'AuthControl',
      meta: {
        icon: 'ri-git-repository-private-line',
        title: '权限控制',
      },
      component: () => import('@/views/demo/framework/authControl/index.vue'),
    },
    {
      path: '/demo/framework/messageSingleton',
      name: 'MessageSingleton',
      meta: {
        icon: 'ri-chat-4-line',
        title: 'message提示单例',
      },
      component: () =>
        import('@/views/demo/framework/messageSingleton/index.vue'),
    },
  ],
}

export default framework
