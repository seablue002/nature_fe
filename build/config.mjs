/*
 * vite项目编译相关配置
 */

// 需要启用cdn替换的资源对应的cdn地址
export const CDN_RESOURCE = {
  // vue: {
  //   moduleName: 'Vue',
  //   resources: {
  //     js: ['https://test.com/npm/vue@2.6.11/dist/vue.min.js'],
  //   },
  // },
  // vuex: {
  //   moduleName: 'Vuex',
  //   resources: {
  //     js: ['https://test.com/npm/vuex@3.1.3/vuex.min.js'],
  //   },
  // },
  // 'element-ui': {
  //   moduleName: 'ELEMENT',
  //   resources: {
  //     // css: [
  //     //   'https://test.com/npm/element-ui@2.13.2/lib/theme-chalk/index.css',
  //     // ],
  //     js: [
  //       'https://test.com/npm/element-ui@2.13.2/lib/index.js',
  //       // 'https://test.com/npm/element-ui@2.13.2/locale/zh-CN.min.js',
  //     ],
  //   },
  // },
}

export function formatImportToCDN(cdnResourceOptions) {
  const cdnResource = []

  Object.keys(cdnResourceOptions).forEach((moduleKey) => {
    const module = cdnResourceOptions[moduleKey]
    Object.keys(module.resources).forEach((resourceKey) => {
      const resources = module.resources[resourceKey]
      resources.forEach((resourceUrl) => {
        const temp = {
          name: moduleKey,
          var: module.moduleName,
        }

        if (resourceKey === 'css') {
          temp.css = resourceUrl
        }

        if (resourceKey === 'js') {
          temp.path = resourceUrl
        }

        cdnResource.push(temp)
      })
    })
  })

  return cdnResource
}
