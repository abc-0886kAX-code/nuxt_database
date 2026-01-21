/**
 * @FilePath: /nuxt_tes/server/api/settings.put.ts
 * @Description: 更新系统设置（保存到数据库）
 */

import { saveSystemSettings } from '~/server/db/settings'
import { successResponse, validationErrorResponse, serverErrorResponse } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // 权限检查 - 只有管理员可以修改系统设置
    const userInfo = event.context.user
    if (!userInfo) {
      return validationErrorResponse('未登录或登录已过期')
    }

    if (userInfo.role !== '管理员') {
      return validationErrorResponse('只有管理员可以修改系统设置')
    }

    // 保存设置到数据库
    await saveSystemSettings(body)

    // 返回更新后的设置
    const { getSystemSettings } = await import('~/server/db/settings')
    const updatedSettings = await getSystemSettings()

    return successResponse(updatedSettings, '更新系统设置成功')
  } catch (error) {
    console.error('更新系统设置错误:', error)
    return serverErrorResponse('更新系统设置失败')
  }
})
