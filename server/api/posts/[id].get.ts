/**
 * @Description: 获取单个文章 API
 */

import { getPostById, incrementPostViews } from '~/server/db/posts'
import { successResponse, notFoundResponse, serverErrorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id || isNaN(id)) {
      return notFoundResponse('文章ID无效')
    }

    const post = await getPostById(id)

    if (!post) {
      return notFoundResponse('文章不存在')
    }

    // 增加浏览量
    await incrementPostViews(id)

    return successResponse(post, '获取文章成功')
  } catch (error) {
    console.error('获取文章错误:', error)
    return serverErrorResponse('获取文章失败')
  }
})
