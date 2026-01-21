/*
 * @FilePath: /nuxt_database/server/api/users/index.post.ts
 * @Author: abc-0886kAX-code
 * @Date: 2026-01-16 14:16:48
 * @LastEditors: abc-0886kAX-code
 * @LastEditTime: 2026-01-19 10:18:55
 * @Description: 
 */
/**
 * @FilePath: /nuxt_tes/server/api/users/index.post.ts
 * @Description: 创建用户
 */

import type { CreateUserParams } from '~/types/api'
import { successResponse, validationErrorResponse, errorResponse, serverErrorResponse } from '~/server/utils/response'
import { createUser, getUserByEmail, getUserByUsername, getUserCount } from '~/server/db/users'
import { hasPermission, permissionDenied } from '~/server/utils/permissions'
import { getSystemSettings } from '~/server/db/settings'

export default defineEventHandler(async (event) => {
  try {
    // 权限检查 - 只有管理员可以创建用户
    const userInfo = event.context.user
    if (!userInfo) {
      return validationErrorResponse('未登录或登录已过期')
    }

    if (!hasPermission(userInfo.role as any, 'canCreateUsers')) {
      return permissionDenied('只有管理员可以创建用户')
    }

    const body = await readBody<CreateUserParams>(event)

    // 参数验证
    if (!body.username || !body.email || !body.password) {
      return validationErrorResponse('用户名、邮箱和密码不能为空')
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return validationErrorResponse('邮箱格式不正确')
    }

    // 检查邮箱是否已存在
    const existingEmail = await getUserByEmail(body.email)
    if (existingEmail) {
      return errorResponse('该邮箱已被使用', 409)
    }

    // 检查用户名是否已存在
    const existingUsername = await getUserByUsername(body.username)
    if (existingUsername) {
      return errorResponse('该用户名已被使用', 409)
    }

    // 检查系统用户数限制
    const settings = await getSystemSettings()
    const currentUserCount = await getUserCount()

    if (currentUserCount >= settings.maxUsers) {
      return errorResponse(403, `系统用户数已达上限（${settings.maxUsers}），无法创建新用户`)
    }

    // 创建用户
    const newUser = await createUser({
      username: body.username,
      email: body.email,
      password: body.password,
      role: body.role || '普通用户',
      status: body.status || 'enabled'
    })

    // 返回成功响应（不包含密码）
    return successResponse(
      newUser,
      '用户创建成功',
      201
    )
  } catch (error) {
    console.error('创建用户失败:', error)
    return serverErrorResponse('创建用户失败')
  }
})
