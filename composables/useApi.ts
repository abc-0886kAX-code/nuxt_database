/**
 * @FilePath: /nuxt_des/composables/useApi.ts
 * @Description: API 请求 Composable - 自动添加 Authorization 头
 */

import type { FetchOptions } from 'ofetch'

/**
 * 获取认证的请求头
 */
const getAuthHeaders = () => {
  const headers: Record<string, string> = {}

  // 只在客户端获取 token
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * 带认证的 API 请求
 */
export const useApi = () => {
  /**
   * 发送 GET 请求
   */
  const get = async <T = any>(url: string, options?: Omit<FetchOptions<'json'>, 'method'>) => {
    return await useFetch<T>(url, {
      ...options,
      // 强制在客户端执行，确保能访问 localStorage
      server: false,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers
      }
    })
  }

  /**
   * 发送 POST 请求
   */
  const post = async <T = any>(url: string, body?: any, options?: Omit<FetchOptions<'json'>, 'method' | 'body'>) => {
    return await useFetch<T>(url, {
      method: 'POST',
      body,
      ...options,
      // 强制在客户端执行，确保能访问 localStorage
      server: false,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers
      }
    })
  }

  /**
   * 发送 PUT 请求
   */
  const put = async <T = any>(url: string, body?: any, options?: Omit<FetchOptions<'json'>, 'method' | 'body'>) => {
    return await useFetch<T>(url, {
      method: 'PUT',
      body,
      ...options,
      // 强制在客户端执行，确保能访问 localStorage
      server: false,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers
      }
    })
  }

  /**
   * 发送 PATCH 请求
   */
  const patch = async <T = any>(url: string, body?: any, options?: Omit<FetchOptions<'json'>, 'method' | 'body'>) => {
    return await useFetch<T>(url, {
      method: 'PATCH',
      body,
      ...options,
      // 强制在客户端执行，确保能访问 localStorage
      server: false,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers
      }
    })
  }

  /**
   * 发送 DELETE 请求
   */
  const del = async <T = any>(url: string, options?: Omit<FetchOptions<'json'>, 'method'>) => {
    return await useFetch<T>(url, {
      method: 'DELETE',
      ...options,
      // 强制在客户端执行，确保能访问 localStorage
      server: false,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers
      }
    })
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del
  }
}
