/**
 * @FilePath: /nuxt_tes/server/api/settings.get.ts
 * @Description: 获取系统设置（从数据库）
 */

import { getSystemSettings } from '~/server/db/settings'
import { successResponse, serverErrorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const settings = await getSystemSettings()
    return successResponse(settings, '获取系统设置成功')
  } catch (error) {
    console.error('获取系统设置错误:', error)
    return serverErrorResponse('获取系统设置失败')
  }
})
