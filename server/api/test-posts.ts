/**
 * 测试数据库连接和文章查询
 */

import { getPosts, getPostStats } from '~/server/db/posts'
import { query } from '~/server/config/database'

export default defineEventHandler(async (event) => {
  try {
    console.log('=== 开始测试文章管理数据库 ===')

    // 1. 测试数据库连接
    console.log('1. 测试数据库连接...')
    const testQuery = await query('SELECT 1 as test')
    console.log('✓ 数据库连接正常:', testQuery)

    // 2. 测试获取文章列表
    console.log('2. 测试获取文章列表...')
    const postsResult = await getPosts({ page: 1, pageSize: 10 })
    console.log(`✓ 获取到 ${postsResult.posts.length} 篇文章，总数: ${postsResult.total}`)

    // 3. 测试获取文章统计
    console.log('3. 测试获取文章统计...')
    const stats = await getPostStats()
    console.log('✓ 文章统计:', stats)

    // 4. 测试带筛选条件的查询
    console.log('4. 测试带筛选条件的查询...')
    const filteredResult = await getPosts({
      status: 'published',
      page: 1,
      pageSize: 5
    })
    console.log(`✓ 已发布文章: ${filteredResult.posts.length} 篇`)

    console.log('=== 所有测试通过 ===')

    return {
      success: true,
      message: '测试通过',
      data: {
        database: 'OK',
        posts: postsResult,
        stats: stats,
        filtered: filteredResult
      }
    }
  } catch (error) {
    console.error('测试失败:', error)
    return {
      success: false,
      message: '测试失败',
      error: error.message,
      stack: error.stack
    }
  }
})
