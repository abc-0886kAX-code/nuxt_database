/**
 * @FilePath: /nuxt_tes/middleware/auth.global.ts
 * @Description: 全局认证中间件
 */

export default defineNuxtRouteMiddleware((to, from) => {
  // 只在客户端检查 token
  // 如果在服务端，跳过检查以避免 SSR 时的重定向问题
  if (import.meta.server) {
    return
  }

  // 获取 token 和用户信息
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')

  // 定义公开路由（不需要登录即可访问）
  const publicRoutes = ['/login']

  // 检查当前路由是否是公开路由
  const isPublicRoute = publicRoutes.includes(to.path)

  // 如果未登录或没有用户信息且访问的不是公开路由，重定向到登录页
  if ((!token || !userInfo) && !isPublicRoute) {
    // 保存原始目标URL，登录后可以跳回
    return navigateTo('/login', {
      redirectCode: 302,
      query: {
        redirect: to.fullPath
      }
    })
  }

  // 如果已登录且访问登录页，重定向到首页
  if (token && userInfo && to.path === '/login') {
    return navigateTo('/')
  }
})
