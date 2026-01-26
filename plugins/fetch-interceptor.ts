/**
 * @Description: 全局 Fetch 拦截器
 * 自动为所有 API 请求添加 Authorization token
 */

export default defineNuxtPlugin(() => {
  // 只在客户端运行
  if (import.meta.client) {
    // 保存原始的 fetch 函数
    const originalFetch = window.fetch

    // 重写全局 fetch
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      // 获取 token
      const token = localStorage.getItem('token')

      // 如果请求的是 API 接口，自动添加 Authorization header
      if (typeof input === 'string' && input.startsWith('/api')) {
        init = init || {}

        // 初始化 headers 对象
        if (!init.headers) {
          init.headers = {}
        }

        // 如果 headers 是 Headers 对象，需要先转换
        if (init.headers instanceof Headers) {
          const headers: Record<string, string> = {}
          init.headers.forEach((value, key) => {
            headers[key] = value
          })
          init.headers = headers
        }

        // 添加 Authorization token（如果有）
        if (token) {
          (init.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
        }

        // 确保有 Content-Type（如果是 POST/PUT/PATCH 请求）
        // 但不要覆盖 FormData 请求的 Content-Type（浏览器会自动设置 multipart/form-data）
        const method = (init.method || 'GET').toUpperCase()
        const isFormData = init.body instanceof FormData
        if (['POST', 'PUT', 'PATCH'].includes(method) &&
            !(init.headers as Record<string, string>)['Content-Type'] &&
            !isFormData) {
          (init.headers as Record<string, string>)['Content-Type'] = 'application/json'
        }
      }

      // 调用原始 fetch
      return originalFetch(input, init)
    }
  }
})
