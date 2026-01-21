/**
 * @FilePath: /nuxt_tes/server/utils/response.ts
 * @Description: API 响应工具函数
 */

import type { ApiResponse } from '~/types/api'

/**
 * 成功响应
 * @param data 响应数据
 * @param message 成功消息
 * @param code 状态码
 * @returns 统一格式的成功响应
 */
export function successResponse<T = any>(
  data?: T,
  message = '操作成功',
  code = 200
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    code,
    timestamp: Date.now()
  }
}

/**
 * 失败响应
 * @param message 错误消息
 * @param code 错误码
 * @param data 错误相关数据
 * @returns 统一格式的失败响应
 */
export function errorResponse<T = any>(
  message = '操作失败',
  code = 400,
  data?: T
): ApiResponse<T> {
  return {
    success: false,
    message,
    code,
    data,
    timestamp: Date.now()
  }
}

/**
 * 参数错误响应
 * @param message 错误消息
 * @returns 参数错误响应
 */
export function validationErrorResponse(message = '参数错误') {
  return errorResponse(message, 400)
}

/**
 * 未授权响应
 * @param message 错误消息
 * @returns 未授权响应
 */
export function unauthorizedResponse(message = '未授权，请先登录') {
  return errorResponse(message, 401)
}

/**
 * 禁止访问响应
 * @param message 错误消息
 * @returns 禁止访问响应
 */
export function forbiddenResponse(message = '禁止访问') {
  return errorResponse(message, 403)
}

/**
 * 未找到响应
 * @param message 错误消息
 * @returns 未找到响应
 */
export function notFoundResponse(message = '资源未找到') {
  return errorResponse(message, 404)
}

/**
 * 服务器错误响应
 * @param message 错误消息
 * @returns 服务器错误响应
 */
export function serverErrorResponse(message = '服务器内部错误') {
  return errorResponse(message, 500)
}

/**
 * 分页成功响应
 * @param items 数据列表
 * @param total 总数
 * @param page 当前页
 * @param pageSize 每页数量
 * @param message 成功消息
 * @returns 分页响应
 */
export function paginationResponse<T = any>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  message = '获取数据成功'
) {
  const totalPages = Math.ceil(total / pageSize)

  return successResponse(
    {
      items,
      total,
      page,
      pageSize,
      totalPages
    },
    message
  )
}
