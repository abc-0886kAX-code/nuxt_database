/**
 * @Description: 获取登录日志列表（分页）
 */

import { paginationResponse, serverErrorResponse } from '~/server/utils/response'
import { getRecentLoginLogs } from '~/server/db/login-logs'
import { hasPermission, permissionDenied } from '~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  try {
    // 权限检查：需要登录才能查看登录日志
    const user = event.context.user
    if (!user) {
      return permissionDenied('未登录或登录已过期')
    }

    // 检查是否有查看日志的权限
    if (!hasPermission(user.role as any, 'canViewLogs')) {
      return permissionDenied('权限不足，无法查看登录日志')
    }

    const query = getQuery(event)
    const { page = 1, pageSize = 20 } = query

    // 获取最近的登录记录（获取所有，然后手动分页）
    const allLogs = await getRecentLoginLogs(1000) // 获取最近1000条记录

    // 将 Date 对象转换为字符串
    const formattedLogs = allLogs.map(log => ({
      ...log,
      login_time: log.login_time ? log.login_time.toISOString() : null
    }))

    const total = formattedLogs.length
    const pageNum = Number(page)
    const pageSizeNum = Number(pageSize)

    // 分页
    const startIndex = (pageNum - 1) * pageSizeNum
    const endIndex = startIndex + pageSizeNum
    const paginatedLogs = formattedLogs.slice(startIndex, endIndex)

    // 返回分页数据
    return paginationResponse(paginatedLogs, total, pageNum, pageSizeNum)
  } catch (error) {
    console.error('获取登录日志失败:', error)
    return serverErrorResponse('获取登录日志失败')
  }
})
