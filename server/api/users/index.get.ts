/*
 * @FilePath: /nuxt_database/server/api/users/index.get.ts
 * @Author: abc-0886kAX-code
 * @Date: 2026-01-20 16:34:06
 * @LastEditors: abc-0886kAX-code
 * @LastEditTime: 2026-01-30 14:40:32
 * @Description: 
 */
/**
 * @FilePath: /nuxt_tes/server/api/users/index.get.ts
 * @Description: 获取用户列表（分页）
 */

import type { PaginationParams } from '~/types/api'
import { paginationResponse, successResponse, serverErrorResponse } from '~/server/utils/response'
import { getAllUsers } from '~/server/db/users'
import { hasPermission, permissionDenied } from '~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  try {
    // 权限检查：需要登录才能查看用户列表
    const user = event.context.user
    if (!user) {
      return permissionDenied('未登录或登录已过期')
    }

    // 检查是否有查看用户列表的权限
    if (!hasPermission(user.role, 'canViewUsers')) {
      return permissionDenied('权限不足，无法查看用户列表')
    }

    const query = getQuery(event)
    const { page = 1, pageSize = 10, search } = query

    // 获取所有用户（支持搜索）
    const allUsers = await getAllUsers(search ? String(search) : undefined)

    const total = allUsers.length
    const pageNum = Number(page)
    const pageSizeNum = Number(pageSize)

    // 分页
    const startIndex = (pageNum - 1) * pageSizeNum
    const endIndex = startIndex + pageSizeNum
    const paginatedUsers = allUsers.slice(startIndex, endIndex)

    // 返回分页数据
    return paginationResponse(paginatedUsers, total, pageNum, pageSizeNum)
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return serverErrorResponse('获取用户列表失败')
  }
})
