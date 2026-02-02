/**
 * API认证中间件
 * 验证Token，检查是否过期，注入用户信息到event.context
 */

export default defineEventHandler(async (event) => {
  // 不需要认证的路径（精确匹配）
  const fullPath = event.node.req.url || ''
  // 去掉查询参数，只保留路径部分
  const path = fullPath.split('?')[0]
  // 获取HTTP方法（GET, POST, PUT, DELETE等）
  const method = event.node.req.method?.toUpperCase() || 'GET'

  // 公开路径配置：包含路径和允许的HTTP方法
  // 如果方法不在数组中，则需要认证
  const publicPathsWithMethods = {
    '/api/login': ['GET', 'POST'],
    '/api/register': ['POST'],
    '/api/settings': ['GET'], // 只有GET是公开的，PUT/DELETE需要认证
    '/api/stats': ['GET'],
    '/api/system': ['GET']
  }

  // 检查是否为公开路径
  let isPublicPath = false
  for (const [publicPath, allowedMethods] of Object.entries(publicPathsWithMethods)) {
    // 精确匹配路径
    if (path === publicPath || path === publicPath + '/') {
      // 检查HTTP方法是否在允许列表中
      if (allowedMethods.includes(method)) {
        isPublicPath = true
        break
      }
    }
  }

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
      const decoded = Buffer.from(token, 'base64').toString('utf-8')

      // 尝试去除可能的空白字符和无效字符
      // 找到第一个 { 和最后一个 } 之间的有效JSON部分
      const startIndex = decoded.indexOf('{')
      const endIndex = decoded.lastIndexOf('}')

      if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
        throw new Error('无效的Token格式：找不到有效的JSON')
      }

      const jsonStr = decoded.substring(startIndex, endIndex + 1)
      payload = JSON.parse(jsonStr)
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
