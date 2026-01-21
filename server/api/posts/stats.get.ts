/**
 * @Description: 获取文章统计信息 API
 */

import { getPostStats } from '~/server/db/posts'
import { successResponse, serverErrorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const stats = await getPostStats()
    return successResponse(stats, '获取统计数据成功')
  } catch (error) {
    console.error('获取文章统计错误:', error)
    return serverErrorResponse('获取统计数据失败')
  }
})
