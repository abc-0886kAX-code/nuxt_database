/**
 * @FilePath: /nuxt_tes/server/api/system.get.ts
 * @Description: 获取系统状态和最近活动
 */

import { systemStatusData, recentActivitiesData } from '~/server/data/system'

export default defineEventHandler(async (event) => {
  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 400))

    return {
      success: true,
      message: '获取系统状态成功',
      data: {
        status: systemStatusData,
        activities: recentActivitiesData
      },
      timestamp: Date.now()
    }
  } catch (error) {
    return {
      success: false,
      message: '获取系统状态失败',
      error: error.message,
      timestamp: Date.now()
    }
  }
})
