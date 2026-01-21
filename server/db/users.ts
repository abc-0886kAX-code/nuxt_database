/**
 * @FilePath: /server/db/users.ts
 * @Description: 用户数据库操作层（使用MySQL）
 */

import bcrypt from 'bcryptjs'
import type { UserListItem, CreateUserParams, UpdateUserParams } from '~/types/api'
import { query, queryOne, insert, update, del } from '~/server/config/database'

/**
 * 用户数据映射函数
 */
function mapUserFromDb(dbUser: any): UserListItem {
  return {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    role: dbUser.role,
    status: dbUser.status,
    createdAt: new Date(dbUser.created_at).toLocaleString('zh-CN'),
    updatedAt: new Date(dbUser.updated_at).toLocaleString('zh-CN')
  }
}

/**
 * 获取所有用户（支持搜索）
 */
export async function getAllUsers(search?: string): Promise<UserListItem[]> {
  let sql = `
    SELECT id, username, email, role, status, created_at, updated_at
    FROM users
  `
  const params: any[] = []

  if (search) {
    sql += ` WHERE username LIKE ? OR email LIKE ? OR role LIKE ?`
    const searchTerm = `%${search}%`
    params.push(searchTerm, searchTerm, searchTerm)
  }

  sql += ` ORDER BY id ASC`

  const users = await query<any>(sql, params)
  return users.map(mapUserFromDb)
}

/**
 * 根据ID获取用户
 */
export async function getUserById(id: number): Promise<UserListItem | null> {
  const sql = `
    SELECT id, username, email, role, status, created_at, updated_at
    FROM users
    WHERE id = ?
  `
  const user = await queryOne<any>(sql, [id])
  return user ? mapUserFromDb(user) : null
}

/**
 * 根据邮箱获取用户（包含密码，用于登录验证）
 */
export async function getUserByEmailWithEmailPassword(email: string): Promise<any> {
  const sql = `
    SELECT * FROM users
    WHERE email = ?
  `
  return await queryOne<any>(sql, [email])
}

/**
 * 根据用户名获取用户（包含密码，用于登录验证）
 */
export async function getUserByUsernameWithPassword(username: string): Promise<any> {
  const sql = `
    SELECT * FROM users
    WHERE username = ?
  `
  return await queryOne<any>(sql, [username])
}

/**
 * 根据邮箱获取用户（不包含密码）
 */
export async function getUserByEmail(email: string): Promise<UserListItem | null> {
  const sql = `
    SELECT id, username, email, role, status, created_at, updated_at
    FROM users
    WHERE email = ?
  `
  const user = await queryOne<any>(sql, [email])
  return user ? mapUserFromDb(user) : null
}

/**
 * 根据用户名获取用户（不包含密码）
 */
export async function getUserByUsername(username: string): Promise<UserListItem | null> {
  const sql = `
    SELECT id, username, email, role, status, created_at, updated_at
    FROM users
    WHERE username = ?
  `
  const user = await queryOne<any>(sql, [username])
  return user ? mapUserFromDb(user) : null
}

/**
 * 验证用户登录
 */
export async function validateUser(username: string, password: string): Promise<UserListItem | null> {
  const user = await getUserByUsernameWithPassword(username)

  if (!user) {
    return null
  }

  // 验证密码
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return null
  }

  // 返回用户信息（不包含密码）
  return mapUserFromDb(user)
}

/**
 * 创建用户
 */
export async function createUser(userData: CreateUserParams & { password: string }): Promise<UserListItem> {
  // 加密密码
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

  const sql = `
    INSERT INTO users (username, email, password, role, status)
    VALUES (?, ?, ?, ?, ?)
  `

  const result = await insert(sql, [
    userData.username,
    userData.email,
    hashedPassword,
    userData.role || '普通用户',
    userData.status || 'enabled'
  ])

  // 返回新创建的用户
  const newUser = await getUserById(result.insertId)
  if (!newUser) {
    throw new Error('创建用户失败')
  }

  return newUser
}

/**
 * 更新用户
 */
export async function updateUser(id: number, updates: UpdateUserParams): Promise<UserListItem | null> {
  const fields: string[] = []
  const params: any[] = []

  // 构建动态UPDATE语句
  if (updates.username) {
    fields.push('username = ?')
    params.push(updates.username)
  }

  if (updates.email) {
    fields.push('email = ?')
    params.push(updates.email)
  }

  if (updates.role) {
    fields.push('role = ?')
    params.push(updates.role)
  }

  if (updates.status) {
    fields.push('status = ?')
    params.push(updates.status)
  }

  if (updates.password) {
    // 如果更新密码，需要加密
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(updates.password, saltRounds)
    fields.push('password = ?')
    params.push(hashedPassword)
  }

  if (fields.length === 0) {
    return await getUserById(id)
  }

  params.push(id)

  const sql = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = ?
  `

  await update(sql, params)
  return await getUserById(id)
}

/**
 * 删除用户
 */
export async function deleteUser(id: number): Promise<boolean> {
  const sql = `DELETE FROM users WHERE id = ?`
  const result = await del(sql, [id])
  return result.affectedRows > 0
}

/**
 * 更新用户状态
 */
export async function updateUserStatus(id: number, status: 'enabled' | 'disabled'): Promise<UserListItem | null> {
  const sql = `
    UPDATE users
    SET status = ?
    WHERE id = ?
  `
  await update(sql, [status, id])
  return await getUserById(id)
}

/**
 * 获取用户总数
 */
export async function getUserCount(): Promise<number> {
  const sql = `SELECT COUNT(*) as count FROM users`
  const result = await queryOne<any>(sql)
  return result.count
}

/**
 * 获取用户统计信息
 */
export async function getUserStats(): Promise<{
  total: number
  enabled: number
  disabled: number
  admins: number
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'enabled' THEN 1 ELSE 0 END) as enabled,
      SUM(CASE WHEN status = 'disabled' THEN 1 ELSE 0 END) as disabled,
      SUM(CASE WHEN role = '管理员' THEN 1 ELSE 0 END) as admins
    FROM users
  `
  const result = await queryOne<any>(sql)
  return {
    total: result.total,
    enabled: result.enabled,
    disabled: result.disabled,
    admins: result.admins
  }
}
