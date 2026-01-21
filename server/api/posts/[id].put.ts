/**
 * @Description: 更新文章 API
 */

import { updatePost, getPostById } from '~/server/db/posts'
import { successResponse, validationErrorResponse, notFoundResponse, serverErrorResponse } from '~/server/utils/response'

export interface UpdatePostParams {
  title?: string
  content?: string
  excerpt?: string
  category?: string
  tags?: string
  status?: 'published' | 'draft' | 'archived'
}

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody<UpdatePostParams>(event)

    if (!id || isNaN(id)) {
      return notFoundResponse('文章ID无效')
    }

    // 检查文章是否存在
    const existingPost = await getPostById(id)
    if (!existingPost) {
      return notFoundResponse('文章不存在')
    }

    // 权限检查（只有作者和管理员可以编辑）
    const userInfo = event.context.user
    if (!userInfo) {
      return validationErrorResponse('未登录或登录已过期')
    }

    if (userInfo.role !== '管理员' && existingPost.author_id !== userInfo.id) {
      return validationErrorResponse('无权限编辑此文章')
    }

    // 更新文章
    const updated = await updatePost(id, body)

    if (!updated) {
      return serverErrorResponse('更新文章失败')
    }

    // 获取更新后的文章
    const updatedPost = await getPostById(id)

    return successResponse(updatedPost, '更新文章成功')
  } catch (error) {
    console.error('更新文章错误:', error)
    return serverErrorResponse('更新文章失败')
  }
})
