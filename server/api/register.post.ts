/**
 * @FilePath: /nuxt_tes/server/api/register.post.ts
 * @Description: 用户注册 API 接口
 */

import type { CreateUserParams } from '~/types/api'
import { successResponse, validationErrorResponse, errorResponse, serverErrorResponse } from '~/server/utils/response'
import { createUser, getUserByUsername, getUserByEmail, getUserCount } from '~/server/db/users'
import { getSystemSettings } from '~/server/db/settings'

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体
    const body = await readBody<CreateUserParams>(event)

    const { username, email, password } = body

    // 参数验证
    if (!username || !email || !password) {
      return validationErrorResponse('用户名、邮箱和密码不能为空')
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return validationErrorResponse('邮箱格式不正确')
    }

    // 密码长度验证
    if (password.length < 6) {
      return validationErrorResponse('密码长度至少为6位')
    }

    // 获取系统设置
    const settings = await getSystemSettings()

    // 检查是否允许注册
    if (!settings.allowRegistration) {
      return errorResponse(403, '系统暂未开放注册')
    }

    // 检查用户数是否已达上限
    const currentUserCount = await getUserCount()
    if (currentUserCount >= settings.maxUsers) {
      return errorResponse(403, `系统用户数已达上限（${settings.maxUsers}），无法注册新用户`)
    }

    // 检查用户名是否已存在
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      return validationErrorResponse('用户名已存在')
    }

    // 检查邮箱是否已存在
    const existingEmail = await getUserByEmail(email)
    if (existingEmail) {
      return validationErrorResponse('邮箱已被注册')
    }

    // 创建用户（默认角色为"普通用户"，状态为启用）
    const newUserId = await createUser({
      username,
      email,
      password,
      role: '普通用户',
      status: 'enabled'
    })

    // 返回成功响应（不返回密码等敏感信息）
    return successResponse({
      id: newUserId,
      username,
      email,
      role: '普通用户',
      message: '注册成功，请登录'
    }, '注册成功')
  } catch (error) {
    console.error('注册错误:', error)
    return serverErrorResponse('注册失败，请稍后重试')
  }
})
