import useUserStore from '@/store/modules/user'
import { NO_AUTH_ROUTE_PATH, WHITE_ROUTES_PATH } from '@/settings/config/router'

export default function tokenGuard(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const { token } = userStore
    if (!token && !WHITE_ROUTES_PATH.includes(to.path)) {
      next(NO_AUTH_ROUTE_PATH)
      return
    }
    next()
  })
}
