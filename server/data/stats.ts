/**
 * @FilePath: /nuxt_tes/server/data/stats.ts
 * @Description: 统计数据存储（模拟数据库）
 */

// 统计数据
export const statsData = {
  totalUsers: 1250,
  activeUsers: 856,
  totalPosts: 3420,
  totalViews: 45890
}

// 用户增长趋势数据
export const userGrowthData = [
  { month: '1月', value: 850 },
  { month: '2月', value: 920 },
  { month: '3月', value: 980 },
  { month: '4月', value: 1150 },
  { month: '5月', value: 1200 },
  { month: '6月', value: 1250 }
]

// 访问来源数据
export const trafficSourceData = [
  { source: '直接访问', percentage: 45, color: '#667eea' },
  { source: '搜索引擎', percentage: 30, color: '#764ba2' },
  { source: '社交媒体', percentage: 15, color: '#f093fb' },
  { source: '其他', percentage: 10, color: '#4facfe' }
]
