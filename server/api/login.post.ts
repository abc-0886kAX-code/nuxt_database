/**
 * @FilePath: /nuxt_tes/server/api/login.post.ts
 * @Description: 登录 API 接口
 */

import type { LoginParams, LoginData, UserInfo } from '~/types/api'
import { successResponse, validationErrorResponse, unauthorizedResponse, serverErrorResponse } from '~/server/utils/response'
import { validateUser } from '~/server/db/users'
import { createLoginLog } from '~/server/db/login-logs'
import { getSystemSettings } from '~/server/db/settings'

export default defineEventHandler(async (event) => {
  try {
    // 获取请求体
    const body = await readBody<LoginParams>(event)

    const { username, password } = body

    // 参数验证
    if (!username || !password) {
      return validationErrorResponse('用户名和密码不能为空')
    }

    // 验证用户（使用MySQL数据库）
    const user = await validateUser(username, password)

    if (!user) {
      return unauthorizedResponse('用户名或密码错误')
    }

    // 记录登录日志
    const headers = getHeaders(event)
    const ipAddress = headers['x-forwarded-for'] || headers['x-real-ip'] || event.node.req.socket.remoteAddress
    const userAgent = headers['user-agent']

    await createLoginLog({
      user_id: user.id!,
      username: user.username,
      ip_address: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      user_agent: userAgent
    })

    // 获取系统设置（会话超时时间）
    const settings = await getSystemSettings()
    const sessionTimeout = settings.sessionTimeout || 60 // 默认60分钟

    // 计算Token过期时间
    const expiresAt = Date.now() + (sessionTimeout * 60 * 1000)

    // 生成包含过期时间的Token
    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
      expiresAt
    }
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64')

    // 构建用户信息
    const userInfo: UserInfo = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      loginTime: new Date().toLocaleString('zh-CN')
    }

    // 构建登录数据
    const loginData: LoginData = {
      token,
      user: userInfo,
      sessionTimeout // 返回超时时间给前端
    }

    // 返回成功响应
    return successResponse(loginData, '登录成功')
  } catch (error) {
    console.error('登录错误:', error)
    // 返回服务器错误响应
    return serverErrorResponse('服务器错误，请稍后重试')
  }
})
