/**
 * @FilePath: /nuxt_tes/server/data/settings.ts
 * @Description: 系统设置数据存储（模拟数据库）
 */

// 系统设置数据
export const settingsData = {
  siteName: '我的应用',
  siteUrl: 'https://example.com',
  adminEmail: 'admin@example.com',
  maxUsers: 10000,
  allowRegistration: true,
  requireEmailVerification: true,
  sessionTimeout: 30,
  enableNotifications: true,
  maintenanceMode: false
}

// 更新设置
export function updateSettings(newSettings: any) {
  Object.assign(settingsData, newSettings)
  return { ...settingsData }
}
