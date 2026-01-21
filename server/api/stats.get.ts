/**
 * @FilePath: /nuxt_tes/server/api/stats.get.ts
 * @Description: 获取统计数据（从数据库实时计算）
 */

import { getUserStats } from '~/server/db/users'
import { getActiveUsersCount } from '~/server/db/login-logs'
import { getPostStats } from '~/server/db/posts'

export default defineEventHandler(async (event) => {
  try {
    // 并行获取所有统计数据
    const [userStats, activeUsers, postStats] = await Promise.all([
      getUserStats(),
      getActiveUsersCount(),
      getPostStats()
    ])

    // 构建统计数据
    const statsData = {
      totalUsers: userStats.total,
      activeUsers: activeUsers,
      totalPosts: postStats.total,
      totalViews: postStats.totalViews
    }

    // 构建用户增长数据（模拟月度数据）
    const userGrowthData = [
      { month: '1月', count: Math.round(userStats.total * 0.1) },
      { month: '2月', count: Math.round(userStats.total * 0.15) },
      { month: '3月', count: Math.round(userStats.total * 0.2) },
      { month: '4月', count: Math.round(userStats.total * 0.25) },
      { month: '5月', count: Math.round(userStats.total * 0.15) },
      { month: '6月', count: Math.round(userStats.total * 0.15) }
    ]

    // 构建访问来源数据（基于实际数据的模拟）
    const trafficSourceData = [
      { source: '直接访问', count: Math.round(postStats.totalViews * 0.4) || 100 },
      { source: '搜索引擎', count: Math.round(postStats.totalViews * 0.3) || 80 },
      { source: '社交媒体', count: Math.round(postStats.totalViews * 0.2) || 50 },
      { source: '外部链接', count: Math.round(postStats.totalViews * 0.1) || 30 }
    ]

    return {
      success: true,
      message: '获取统计数据成功',
      data: {
        stats: statsData,
        userGrowth: userGrowthData,
        trafficSources: trafficSourceData
      },
      timestamp: Date.now()
    }
  } catch (error) {
    console.error('获取统计数据错误:', error)
    return {
      success: false,
      message: '获取统计数据失败',
      error: error.message,
      timestamp: Date.now()
    }
  }
})
