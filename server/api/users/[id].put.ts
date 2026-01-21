/**
 * @FilePath: /nuxt_tes/server/api/users/[id].put.ts
 * @Description: 更新用户
 */

import type { UpdateUserParams } from '~/types/api'
import { successResponse, notFoundResponse, validationErrorResponse, errorResponse, serverErrorResponse } from '~/server/utils/response'
import { getUserById, updateUser, getUserByEmail, getUserByUsername } from '~/server/db/users'
import { hasPermission, permissionDenied } from '~/server/utils/permissions'

export default defineEventHandler(async (event) => {
  try {
    const userId = Number(getRouterParam(event, 'id'))
    const currentUser = event.context.user

    if (!currentUser) {
      return permissionDenied('未登录或登录已过期')
    }

    // 权限检查：管理员可以编辑所有用户，其他角色只能编辑自己的信息
    const isEditingSelf = userId === currentUser.id
    const canEditAnyUser = hasPermission(currentUser.role, 'canEditUsers')

    if (!isEditingSelf && !canEditAnyUser) {
      return permissionDenied('权限不足，只能修改自己的信息')
    }

    // 检查用户是否存在
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      return notFoundResponse('用户不存在')
    }

    const body = await readBody<UpdateUserParams>(event)

    // 非管理员不能修改角色和状态
    if (!canEditAnyUser && (body.role || body.status)) {
      return permissionDenied('权限不足，无法修改角色和状态')
    }

    // 如果更新邮箱，检查邮箱是否已被其他用户使用
    if (body.email && body.email !== existingUser.email) {
      const emailUser = await getUserByEmail(body.email)
      if (emailUser && emailUser.id !== userId) {
        return errorResponse('该邮箱已被其他用户使用', 409)
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return validationErrorResponse('邮箱格式不正确')
      }
    }

    // 如果更新用户名，检查用户名是否已被其他用户使用
    if (body.username && body.username !== existingUser.username) {
      const usernameUser = await getUserByUsername(body.username)
      if (usernameUser && usernameUser.id !== userId) {
        return errorResponse('该用户名已被其他用户使用', 409)
      }
    }

    // 更新用户
    const updatedUser = await updateUser(userId, body)

    if (!updatedUser) {
      return serverErrorResponse('更新用户失败')
    }

    return successResponse(updatedUser, '用户更新成功')
  } catch (error) {
    console.error('更新用户失败:', error)
    return serverErrorResponse('更新用户失败')
  }
})
