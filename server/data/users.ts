/**
 * @FilePath: /nuxt_tes/server/data/users.ts
 * @Description: 用户数据存储（模拟数据库）
 */

import type { UserListItem } from '~/types/api'

// 模拟用户数据库
export const usersDatabase: UserListItem[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: '管理员',
    status: 'enabled',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: '普通用户',
    status: 'enabled',
    createdAt: '2024-01-02 10:00:00',
    updatedAt: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    role: '普通用户',
    status: 'disabled',
    createdAt: '2024-01-03 10:00:00',
    updatedAt: '2024-01-03 10:00:00'
  },
  {
    id: 4,
    username: 'user3',
    email: 'user3@example.com',
    role: '编辑',
    status: 'enabled',
    createdAt: '2024-01-04 10:00:00',
    updatedAt: '2024-01-04 10:00:00'
  },
  {
    id: 5,
    username: 'user4',
    email: 'user4@example.com',
    role: '普通用户',
    status: 'enabled',
    createdAt: '2024-01-05 10:00:00',
    updatedAt: '2024-01-05 10:00:00'
  }
]

// 生成自增ID
let nextId = 6

/**
 * 获取所有用户
 */
export function getAllUsers(): UserListItem[] {
  return [...usersDatabase]
}

/**
 * 根据ID获取用户
 */
export function getUserById(id: number): UserListItem | undefined {
  return usersDatabase.find(user => user.id === id)
}

/**
 * 根据邮箱获取用户
 */
export function getUserByEmail(email: string): UserListItem | undefined {
  return usersDatabase.find(user => user.email === email)
}

/**
 * 根据用户名获取用户
 */
export function getUserByUsername(username: string): UserListItem | undefined {
  return usersDatabase.find(user => user.username === username)
}

/**
 * 创建用户
 */
export function createUser(userData: Omit<UserListItem, 'id' | 'createdAt' | 'updatedAt'>): UserListItem {
  const newUser: UserListItem = {
    ...userData,
    id: nextId++,
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN')
  }
  usersDatabase.push(newUser)
  return newUser
}

/**
 * 更新用户
 */
export function updateUser(id: number, updates: Partial<Omit<UserListItem, 'id' | 'createdAt' | 'updatedAt'>>): UserListItem | null {
  const index = usersDatabase.findIndex(user => user.id === id)
  if (index === -1) return null

  usersDatabase[index] = {
    ...usersDatabase[index],
    ...updates,
    updatedAt: new Date().toLocaleString('zh-CN')
  }
  return usersDatabase[index]
}

/**
 * 删除用户
 */
export function deleteUser(id: number): boolean {
  const index = usersDatabase.findIndex(user => user.id === id)
  if (index === -1) return false

  usersDatabase.splice(index, 1)
  return true
}

/**
 * 更新用户状态
 */
export function updateUserStatus(id: number, status: 'enabled' | 'disabled'): UserListItem | null {
  return updateUser(id, { status })
}
