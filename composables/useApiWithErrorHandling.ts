/**
 * @FilePath: /nuxt_tes/composables/useApiWithErrorHandling.ts
 * @Description: 全局API错误处理，自动处理Token过期跳转
 */

import type { ApiResponse } from '~/types/api'

export const useApiWithErrorHandling = () => {
  /**
   * 带错误处理的API请求函数
   * @param url API地址
   * @param options 请求选项
   * @returns API响应数据
   */
  const apiFetch = async <T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T> | null> => {
    try {
      // 获取Token
      let token = ''
      if (import.meta.client) {
        token = localStorage.getItem('token') || ''
      }

      // 发送请求
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      // 解析响应
      const data: ApiResponse<T> = await response.json()

      // 检查是否为Token过期错误（400错误且消息包含"过期"）
      if (data.code === 400 && data.message && data.message.includes('过期')) {
        if (import.meta.client) {
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
        return null
      }

      // 检查是否为未登录错误（401）
      if (data.code === 401) {
        if (import.meta.client) {
          // 清除本地存储
          localStorage.clear()

          // 跳转到登录页
          await navigateTo('/login', {
            replace: true,
            query: {
              redirect: useRoute().fullPath,
              reason: 'unauthorized'
            }
          })
        }
        return null
      }

      return data
    } catch (error) {
      console.error('API请求错误:', error)
      throw error
    }
  }

  /**
   * GET请求
   */
  const get = <T = any>(url: string, options?: RequestInit) => {
    return apiFetch<T>(url, { ...options, method: 'GET' })
  }

  /**
   * POST请求
   */
  const post = <T = any>(url: string, body?: any, options?: RequestInit) => {
    return apiFetch<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  /**
   * PUT请求
   */
  const put = <T = any>(url: string, body?: any, options?: RequestInit) => {
    return apiFetch<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    })
  }

  /**
   * PATCH请求
   */
  const patch = <T = any>(url: string, body?: any, options?: RequestInit) => {
    return apiFetch<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    })
  }

  /**
   * DELETE请求
   */
  const del = <T = any>(url: string, options?: RequestInit) => {
    return apiFetch<T>(url, { ...options, method: 'DELETE' })
  }

  return {
    apiFetch,
    get,
    post,
    put,
    patch,
    delete: del
  }
}
