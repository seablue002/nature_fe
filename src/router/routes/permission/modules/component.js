/**
 * 框架组件展示模块路由
 */

// 框架组件模块总路由集成
const component = {
  path: '/demo/components',
  name: 'Components',
  meta: {
    icon: 'ri-shape-fill',
    title: '组件',
    defaultOpen: true,
  },
  redirect: '/demo/components/base',
  children: [
    {
      path: '/demo/components/base',
      name: 'ComponentsBase',
      meta: {
        icon: 'ri-layout-grid-line',
        title: '基础组件',
        defaultOpen: true,
      },
      redirect: '/demo/components/base/table',
      children: [
        {
          path: '/demo/components/base/table',
          name: 'Table',
          meta: {
            title: '表格',
          },
          redirect: '/demo/components/base/table/configurableTable',
          children: [
            {
              path: '/demo/components/base/table/configurableTable',
              name: 'ConfigurableTable',
              meta: {
                title: '配置型表格',
                cache: true,
              },
              component: () =>
                import(
                  '@/views/demo/components/base/table/configurableTable/index.vue'
                ),
            },
            {
              path: '/demo/components/base/table/customeTable',
              name: 'CustomeTable',
              meta: {
                title: '自定义表格',
              },
              component: () =>
                import(
                  '@/views/demo/components/base/table/customTable/index.vue'
                ),
            },
          ],
        },
        {
          path: '/demo/components/base/form',
          name: 'Form',
          meta: {
            title: '表单',
          },
          redirect: '/demo/components/base/form/dynamicForm',
          children: [
            {
              path: '/demo/components/base/form/dynamicForm',
              name: 'DynamicForm',
              meta: {
                title: '动态表单',
              },
              component: () =>
                import(
                  '@/views/demo/components/base/form/dynamicForm/index.vue'
                ),
            },
            // {
            //   path: '/demo/components/base/form/tabForm',
            //   name: 'tabForm',
            //   meta: {
            //     title: 'tab表单',
            //   },
            //   component: () =>
            //     import('@/views/demo/components/base/form/tabForm/index.vue'),
            // },
            {
              path: '/demo/components/base/form/stepForm',
              name: 'StepForm',
              meta: {
                title: '分步表单',
              },
              component: () =>
                import('@/views/demo/components/base/form/stepForm/index.vue'),
            },
          ],
        },
        {
          path: '/demo/components/base/column',
          name: 'Column',
          meta: {
            title: '分栏',
          },
          redirect: '/demo/components/base/columnAndList',
          children: [
            {
              path: '/demo/components/base/columnAndList',
              name: 'ColumnAndList',
              meta: {
                title: '左分类右列表',
              },
              component: () =>
                import(
                  '@/views/demo/components/base/column/columnAndList/index.vue'
                ),
            },
          ],
        },
        {
          path: '/demo/components/base/tree',
          name: 'Tree',
          meta: {
            title: '树状图',
          },
          redirect: '/demo/components/base/tree/lineTree',
          children: [
            {
              path: '/demo/components/base/tree/lineTree',
              name: 'LineTree',
              meta: {
                title: '水平树状图',
              },
              component: () =>
                import('@/views/demo/components/base/tree/lineTree/index.vue'),
            },
          ],
        },
      ],
    },
  ],
}

export default component
