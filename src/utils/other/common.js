import router from '@/router'
import { rootRoute } from '@/router/routes/basic'
import permissionRoutes from '@/router/routes/permission'
import * as $is from '@/utils/helper/is'
import * as $tree from '@/utils/helper/tree'
import * as $array from '@/utils/helper/array'
import { cloneDeep } from 'lodash'

// 生成最终权限菜单树tree，以及动态添加路由
export const formatAndAddPermissionRoutes = (
  authList,
  updateAblePermissionRoutesFullTree,
  updateAblePermissionButtons
) => {
  // 从store中的权限菜单，获取剔除children字段后的权限菜单tree
  const onlinePermissionList = []
  $tree.treeFlat(onlinePermissionList, authList, 0, ['children'], 'children')

  // 将本地所有菜单路由扁平化
  const permissionRoutesFlat = []
  $tree.treeFlat(
    permissionRoutesFlat,
    permissionRoutes,
    0,
    ['children'],
    'children'
  )

  // 根据用户权限菜单过滤出本地有权限访问的菜单数组
  const permissionRoutesMatched = permissionRoutesFlat.filter((node) => {
    const index = $array.indexOfObjInObjArrByKey(
      node,
      onlinePermissionList,
      'name'
    )

    if (index !== -1) {
      // 将匹配到的本地路由加上对应上线路由id,pid字段信息，为后续使用做准备
      const { id, pid, sort } = onlinePermissionList[index]
      node.id = id
      node.pid = pid
      node.sort = sort
    }

    return index !== -1
  })

  // 将根据用户权限菜单过滤出本地有权限访问的菜单数组转为tree
  const permissionRoutesMatchedTree = []
  $tree.getTree(
    permissionRoutesMatchedTree,
    permissionRoutesMatched,
    {
      id: 'id',
      pid: 'pid',
      path: 'path',
      name: 'name',
      redirect: 'redirect',
      meta: 'meta',
      component: 'component',
      sort: 'sort',
    },
    []
  )

  // 升序排序菜单
  permissionRoutesMatchedTree.sort((a, b) => {
    return a.sort - b.sort
  })

  $tree.recursionMachine(permissionRoutesMatchedTree, (node) => {
    if ($is.isArray(node.children)) {
      node.children.sort((a, b) => {
        return a.sort - b.sort
      })
    }
  })

  // 完整的可访问权限树，组装整颗可访问的权限菜单树
  const ablePermissionRoutesFullTree = cloneDeep(rootRoute)
  ablePermissionRoutesFullTree.children = [
    ...ablePermissionRoutesFullTree.children,
    ...(permissionRoutesMatchedTree || []),
  ]

  // 动态添加权限路由到路由router
  if (ablePermissionRoutesFullTree.children) {
    ablePermissionRoutesFullTree.children.forEach((route) => {
      router.addRoute('Root', route)
    })
  }

  // 保存权限菜单
  updateAblePermissionRoutesFullTree(ablePermissionRoutesFullTree)

  // 保存权限按钮
  const ablePermissionButtons = onlinePermissionList
    .filter((route) => {
      return route.type === 'button'
    })
    .map((route) => {
      return route.code
    })
  updateAblePermissionButtons(ablePermissionButtons)
}
