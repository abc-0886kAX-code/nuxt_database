/**
 * @FilePath: /nuxt_tes/server/data/system.ts
 * @Description: 系统状态数据存储（模拟数据库）
 */

// 系统状态数据
export const systemStatusData = {
  cpu: 45,
  memory: 62,
  disk: 78,
  uptime: '15天 8小时',
  serverTime: new Date().toISOString()
}

// 最近活动数据
export const recentActivitiesData = [
  { id: 1, type: 'user', message: '新用户 user5 注册成功', time: '5分钟前' },
  { id: 2, type: 'system', message: '系统数据备份完成', time: '30分钟前' },
  { id: 3, type: 'security', message: '检测到异常登录尝试', time: '1小时前' },
  { id: 4, type: 'user', message: '管理员修改了系统设置', time: '2小时前' },
  { id: 5, type: 'system', message: '数据统计报告已生成', time: '3小时前' }
]
