import { query, queryOne, insert } from '~/server/config/database'

export interface LoginLog {
  id?: number
  user_id: number
  username: string
  ip_address?: string
  user_agent?: string
  login_time?: Date
}

// 创建登录记录
export async function createLoginLog(log: Omit<LoginLog, 'id' | 'login_time'>): Promise<number> {
  const sql = `
    INSERT INTO login_logs (user_id, username, ip_address, user_agent)
    VALUES (?, ?, ?, ?)
  `
  const result = await insert(sql, [
    log.user_id,
    log.username,
    log.ip_address || null,
    log.user_agent || null
  ])
  return result.insertId
}

// 获取用户登录次数
export async function getUserLoginCount(userId: number): Promise<number> {
  const sql = 'SELECT COUNT(*) as count FROM login_logs WHERE user_id = ?'
  const result = await queryOne<{ count: number }>(sql, [userId])
  return result?.count || 0
}

// 获取活跃用户数（最近30天登录过的用户）
export async function getActiveUsersCount(): Promise<number> {
  const sql = `
    SELECT COUNT(DISTINCT user_id) as count
    FROM login_logs
    WHERE login_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  `
  const result = await queryOne<{ count: number }>(sql)
  return result?.count || 0
}

// 获取用户登录历史
export async function getUserLoginHistory(
  userId: number,
  limit: number = 10
): Promise<LoginLog[]> {
  // LIMIT 使用数字插值
  const sql = `
    SELECT id, user_id, username, ip_address, user_agent, login_time
    FROM login_logs
    WHERE user_id = ?
    ORDER BY login_time DESC
    LIMIT ${Math.floor(Number(limit))}
  `
  return await query<LoginLog>(sql, [userId])
}

// 获取最近的登录记录
export async function getRecentLoginLogs(limit: number = 20): Promise<LoginLog[]> {
  // 注意：LIMIT 使用数字插值，因为某些 MySQL 驱动对 LIMIT 参数支持不好
  const sql = `
    SELECT id, user_id, username, ip_address, user_agent, login_time
    FROM login_logs
    ORDER BY login_time DESC
    LIMIT ${Math.floor(Number(limit))}
  `
  return await query<LoginLog>(sql)
}
