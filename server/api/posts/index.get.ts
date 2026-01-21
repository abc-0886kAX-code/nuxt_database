/*
 * @FilePath: /nuxt_database/server/api/posts/index.get.ts
 * @Author: abc-0886kAX-code
 * @Date: 2026-01-19 11:23:53
 * @LastEditors: abc-0886kAX-code
 * @LastEditTime: 2026-01-19 14:25:58
 * @Description: 
 */
/**
 * @Description: 获取文章列表 API
 */

import { getPosts } from '~/server/db/posts'
import { successResponse, serverErrorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const filters = {
      status: queryParams.status as any,
      category: queryParams.category as string,
      author_id: queryParams.author_id ? Number(queryParams.author_id) : undefined,
      search: queryParams.search as string,
      page: queryParams.page ? Number(queryParams.page) : 1,
      pageSize: queryParams.pageSize ? Number(queryParams.pageSize) : 10
    }

    const result = await getPosts(filters)

    return successResponse(result, '获取文章列表成功')
  } catch (error) {
    console.error('获取文章列表错误:', error)
    return serverErrorResponse('获取文章列表失败')
  }
})
