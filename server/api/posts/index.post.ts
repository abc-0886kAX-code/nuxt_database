/**
 * @Description: 创建文章 API
 */

import { createPost } from '~/server/db/posts'
import { successResponse, validationErrorResponse, serverErrorResponse } from '~/server/utils/response'

export interface CreatePostParams {
  title: string
  content: string
  excerpt?: string
  category?: string
  tags?: string
  status?: 'published' | 'draft' | 'archived'
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreatePostParams>(event)

    // 参数验证
    if (!body.title || !body.content) {
      return validationErrorResponse('标题和内容不能为空')
    }

    // 从用户信息中获取作者ID和名称
    const userInfo = event.context.user
    if (!userInfo) {
      return validationErrorResponse('未登录或登录已过期')
    }

    const postId = await createPost({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      author_id: userInfo.id,
      author_name: userInfo.username,
      category: body.category,
      tags: body.tags,
      status: body.status || 'draft'
    })

    return successResponse({ id: postId }, '创建文章成功')
  } catch (error) {
    console.error('创建文章错误:', error)
    return serverErrorResponse('创建文章失败')
  }
})
