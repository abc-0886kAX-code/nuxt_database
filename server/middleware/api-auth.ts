/**
 * API认证中间件
 * 验证Token，检查是否过期，注入用户信息到event.context
 */

export default defineEventHandler(async (event) => {
  // 不需要认证的路径（精确匹配）
  const path = event.node.req.url || ''
  const publicPaths = ['/api/login', '/api/register', '/api/settings', '/api/stats', '/api/system']

  // 精确匹配路径，避免 /api/login-logs 被 /api/login 误匹配
  const isPublicPath = publicPaths.some(p => {
    // 精确匹配或精确匹配带斜杠的路径
    return path === p || path === p + '/'
  })

  if (isPublicPath) {
    return
  }

  try {
    // 获取Authorization头
    const authHeader = getHeader(event, 'authorization')

    // 如果没有 Token，不做任何处理，让各个 API 自己决定是否需要认证
    if (!authHeader) {
      return
    }

    // 提取Token
    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      return
    }

    // 解析Token
    let payload
    try {
      payload = JSON.parse(Buffer.from(token, 'base64').toString())
    } catch (error) {
      // Token 格式无效，不做处理，让 API 自己处理
      return
    }

    // 检查Token是否过期 - 过期返回400错误
    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return errorResponse(400, '登录已过期，请重新登录')
    }

    // 验证用户是否仍然存在且状态正常
    const { getUserById } = await import('~/server/db/users')
    const user = await getUserById(payload.id)

    if (!user) {
      return errorResponse(401, '用户不存在')
    }

    if (user.status === 'disabled') {
      return errorResponse(403, '账号已被禁用')
    }

    // 注入用户信息到event.context，供后续API使用
    event.context.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    }

  } catch (error) {
    console.error('认证中间件错误:', error)
    // 发生错误时不影响请求继续，让 API 自己处理
  }
})

// 辅助函数：返回错误响应
function errorResponse(code: number, message: string) {
  return {
    success: false,
    code,
    message,
    timestamp: Date.now()
  }
}
