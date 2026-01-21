import { query, queryOne, update, del } from '~/server/config/database'

export interface Setting {
  id?: number
  key_name: string
  value: string
  description?: string
  created_at?: Date
  updated_at?: Date
}

// 获取单个设置值
export async function getSetting(key: string): Promise<string | null> {
  const sql = 'SELECT value FROM settings WHERE key_name = ?'
  const result = await queryOne<{ value: string }>(sql, [key])
  return result?.value || null
}

// 获取多个设置值
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  if (keys.length === 0) return {}

  const placeholders = keys.map(() => '?').join(',')
  const sql = `SELECT key_name, value FROM settings WHERE key_name IN (${placeholders})`
  const rows = await query<{ key_name: string; value: string }>(sql, keys)

  const settings: Record<string, string> = {}
  rows.forEach(row => {
    settings[row.key_name] = row.value
  })

  return settings
}

// 获取所有设置
export async function getAllSettings(): Promise<Record<string, string>> {
  const sql = 'SELECT key_name, value FROM settings'
  const rows = await query<{ key_name: string; value: string }>(sql)

  const settings: Record<string, string> = {}
  rows.forEach(row => {
    settings[row.key_name] = row.value
  })

  return settings
}

// 设置单个值
export async function setSetting(key: string, value: string, description?: string): Promise<void> {
  const sql = `
    INSERT INTO settings (key_name, value, description)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE value = ?, description = ?, updated_at = CURRENT_TIMESTAMP
  `
  await update(sql, [key, value, description || null, value, description || null])
}

// 批量设置值
export async function setSettings(settings: Record<string, { value: string; description?: string }>): Promise<void> {
  const promises = Object.entries(settings).map(([key, data]) =>
    setSetting(key, data.value, data.description)
  )
  await Promise.all(promises)
}

// 删除设置
export async function deleteSetting(key: string): Promise<boolean> {
  const sql = 'DELETE FROM settings WHERE key_name = ?'
  const result = await del(sql, [key])
  return result.affectedRows > 0
}

// 获取系统设置（返回格式化的对象）
export async function getSystemSettings(): Promise<{
  siteName: string
  siteUrl: string
  adminEmail: string
  maxUsers: number
  allowRegistration: boolean
  requireEmailVerification: boolean
  sessionTimeout: number
  enableNotifications: boolean
  maintenanceMode: boolean
}> {
  const defaults = {
    siteName: 'Nuxt管理系统',
    siteUrl: '',
    adminEmail: '',
    maxUsers: 1000,
    allowRegistration: true,
    requireEmailVerification: false,
    sessionTimeout: 60,
    enableNotifications: true,
    maintenanceMode: false
  }

  const settings = await getAllSettings()

  return {
    siteName: settings.site_name || defaults.siteName,
    siteUrl: settings.site_url || defaults.siteUrl,
    adminEmail: settings.admin_email || defaults.adminEmail,
    maxUsers: parseInt(settings.max_users || defaults.maxUsers.toString()),
    allowRegistration: settings.allow_registration === 'true',
    requireEmailVerification: settings.require_email_verification === 'true',
    sessionTimeout: parseInt(settings.session_timeout || defaults.sessionTimeout.toString()),
    enableNotifications: settings.enable_notifications === 'true',
    maintenanceMode: settings.maintenance_mode === 'true'
  }
}

// 保存系统设置
export async function saveSystemSettings(settings: {
  siteName?: string
  siteUrl?: string
  adminEmail?: string
  maxUsers?: number
  allowRegistration?: boolean
  requireEmailVerification?: boolean
  sessionTimeout?: number
  enableNotifications?: boolean
  maintenanceMode?: boolean
}): Promise<void> {
  const settingsToSave: Record<string, { value: string; description?: string }> = {}

  if (settings.siteName !== undefined) {
    settingsToSave.site_name = { value: settings.siteName, description: '站点名称' }
  }
  if (settings.siteUrl !== undefined) {
    settingsToSave.site_url = { value: settings.siteUrl, description: '站点URL' }
  }
  if (settings.adminEmail !== undefined) {
    settingsToSave.admin_email = { value: settings.adminEmail, description: '管理员邮箱' }
  }
  if (settings.maxUsers !== undefined) {
    settingsToSave.max_users = { value: settings.maxUsers.toString(), description: '最大用户数量' }
  }
  if (settings.allowRegistration !== undefined) {
    settingsToSave.allow_registration = { value: settings.allowRegistration.toString(), description: '是否允许用户注册' }
  }
  if (settings.requireEmailVerification !== undefined) {
    settingsToSave.require_email_verification = { value: settings.requireEmailVerification.toString(), description: '是否需要邮箱验证' }
  }
  if (settings.sessionTimeout !== undefined) {
    settingsToSave.session_timeout = { value: settings.sessionTimeout.toString(), description: '会话超时时间（分钟）' }
  }
  if (settings.enableNotifications !== undefined) {
    settingsToSave.enable_notifications = { value: settings.enableNotifications.toString(), description: '是否启用系统通知' }
  }
  if (settings.maintenanceMode !== undefined) {
    settingsToSave.maintenance_mode = { value: settings.maintenanceMode.toString(), description: '维护模式' }
  }

  await setSettings(settingsToSave)
}
