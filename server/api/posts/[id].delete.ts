/**
 * @Description: 删除文章 API
 */

import { deletePost, getPostById } from '~/server/db/posts'
import { successResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'))

    if (!id || isNaN(id)) {
      return notFoundResponse('文章ID无效')
    }

    // 检查文章是否存在
    const existingPost = await getPostById(id)
    if (!existingPost) {
      return notFoundResponse('文章不存在')
    }

    // 权限检查（只有作者和管理员可以删除）
    const userInfo = event.context.user
    if (!userInfo) {
      return validationErrorResponse('未登录或登录已过期')
    }

    if (userInfo.role !== '管理员' && existingPost.author_id !== userInfo.id) {
      return validationErrorResponse('无权限删除此文章')
    }

    // 删除文章
    const deleted = await deletePost(id)

    if (!deleted) {
      return serverErrorResponse('删除文章失败')
    }

    return successResponse({ id }, '删除文章成功')
  } catch (error) {
    console.error('删除文章错误:', error)
    return serverErrorResponse('删除文章失败')
  }
})
