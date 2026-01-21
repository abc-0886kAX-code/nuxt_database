/**
 * @FilePath: /nuxt_tes/server/api/users/[id].delete.ts
 * @Description: 删除用户
 */

import { successResponse, notFoundResponse, serverErrorResponse } from '~/server/utils/response'
import { getUserById, deleteUser } from '~/server/db/users'
import { hasPermission, permissionDenied } from '~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  try {
    // 权限检查：只有管理员可以删除用户
    const user = event.context.user
    if (!user) {
      return permissionDenied('未登录或登录已过期')
    }

    if (!hasPermission(user.role, 'canDeleteUsers')) {
      return permissionDenied('权限不足，仅管理员可删除用户')
    }

    const userId = Number(getRouterParam(event, 'id'))

    // 检查用户是否存在
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      return notFoundResponse('用户不存在')
    }

    // 不允许删除自己
    if (userId === user.id) {
      return permissionDenied('不能删除自己的账号')
    }

    // 删除用户
    const success = await deleteUser(userId)

    if (!success) {
      return serverErrorResponse('删除用户失败')
    }

    return successResponse(null, '用户删除成功')
  } catch (error) {
    console.error('删除用户失败:', error)
    return serverErrorResponse('删除用户失败')
  }
})
