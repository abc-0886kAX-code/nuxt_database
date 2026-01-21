/**
 * @FilePath: /nuxt_tes/plugins/api-error-handler.ts
 * @Description: 全局API错误处理插件
 */

export default defineNuxtPlugin(() => {
  // 在客户端拦截 fetch 请求，处理 Token 过期
  if (import.meta.client) {
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      const response = await originalFetch(...args)

      // 克隆响应以便读取
      const clonedResponse = response.clone()

      try {
        const data = await clonedResponse.json()

        // 检查是否为 Token 过期错误
        if (data.code === 400 && data.message && data.message.includes('过期')) {
          // 清除本地存储
          localStorage.clear()

          // 跳转到登录页
          await navigateTo('/login', {
            replace: true,
            query: {
              redirect: useRoute().fullPath,
              reason: 'session_expired'
            }
          })
        }

        // 检查是否为未授权错误（401）
        if (data.code === 401) {
          // 只在非登录页面时跳转
          if (useRoute().path !== '/login') {
            localStorage.clear()
            await navigateTo('/login', {
              replace: true,
              query: {
                redirect: useRoute().fullPath,
                reason: 'unauthorized'
              }
            })
          }
        }
      } catch (error) {
        // 忽略 JSON 解析错误
      }

      return response
    }
  }
})
