/**
 * @FilePath: /server/config/database.ts
 * @Description: 数据库配置
 */

import mysql from 'mysql2/promise'

// 数据库连接池配置
export const poolConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nuxt_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

// 创建连接池
let pool: mysql.Pool | null = null

/**
 * 获取数据库连接池
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(poolConfig)
    console.log('数据库连接池已创建')
  }
  return pool
}

/**
 * 执行查询（使用参数化查询防止SQL注入）
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const pool = getPool()
  try {
    const [rows] = await pool.execute(sql, params || [])
    return rows as T[]
  } catch (error) {
    console.error('[DB Query Error]:', error.message)
    console.error('[DB Query SQL]:', sql)
    console.error('[DB Query Params]:', params)
    throw error
  }
}

/**
 * 执行查询单个结果
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const results = await query<T>(sql, params)
  return results.length > 0 ? results[0] : null
}

/**
 * 执行插入操作
 */
export async function insert(
  sql: string,
  params?: any[]
): Promise<mysql.ResultSetHeader> {
  const pool = getPool()
  const [result] = await pool.execute(sql, params || [])
  return result as mysql.ResultSetHeader
}

/**
 * 执行更新操作
 */
export async function update(
  sql: string,
  params?: any[]
): Promise<mysql.ResultSetHeader> {
  const pool = getPool()
  const [result] = await pool.execute(sql, params || [])
  return result as mysql.ResultSetHeader
}

/**
 * 执行删除操作
 */
export async function del(
  sql: string,
  params?: any[]
): Promise<mysql.ResultSetHeader> {
  const pool = getPool()
  const [result] = await pool.execute(sql, params || [])
  return result as mysql.ResultSetHeader
}

/**
 * 关闭连接池
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    console.log('数据库连接池已关闭')
  }
}

// 开发环境下测试连接
if (process.env.NODE_ENV !== 'production') {
  getPool().getConnection()
    .then(connection => {
      console.log('数据库连接测试成功')
      connection.release()
    })
    .catch(err => {
      console.error('数据库连接测试失败:', err.message)
    })
}
