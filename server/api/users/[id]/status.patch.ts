/**
 * @FilePath: /nuxt_tes/server/api/users/[id]/status.patch.ts
 * @Description: 更新用户状态（启用/停用）
 */

import type { UpdateUserStatusParams } from '~/types/api'
import { successResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '~/server/utils/response'
import { getUserById, updateUserStatus } from '~/server/db/users'
import { hasPermission, permissionDenied } from '~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  try {
    // 权限检查：只有管理员可以更改用户状态
    const user = event.context.user
    if (!user) {
      return permissionDenied('未登录或登录已过期')
    }

    if (!hasPermission(user.role, 'canEditUsers')) {
      return permissionDenied('权限不足，仅管理员可更改用户状态')
    }

    const userId = Number(getRouterParam(event, 'id'))

    // 检查用户是否存在
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      return notFoundResponse('用户不存在')
    }

    const body = await readBody<UpdateUserStatusParams>(event)

    // 参数验证
    if (!body.status || !['enabled', 'disabled'].includes(body.status)) {
      return validationErrorResponse('状态值不正确')
    }

    // 更新用户状态
    const updatedUser = await updateUserStatus(userId, body.status)

    if (!updatedUser) {
      return serverErrorResponse('更新用户状态失败')
    }

    return successResponse(updatedUser, `用户已${body.status === 'enabled' ? '启用' : '停用'}`)
  } catch (error) {
    console.error('更新用户状态失败:', error)
    return serverErrorResponse('更新用户状态失败')
  }
})
