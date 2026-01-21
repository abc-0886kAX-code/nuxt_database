/**
 * 权限控制系统
 * 定义角色权限和权限检查函数
 */

// 角色类型
export type Role = '管理员' | '编辑' | '普通用户'

// 权限类型
export interface Permissions {
  // 用户管理权限
  canViewUsers: boolean
  canCreateUsers: boolean
  canEditUsers: boolean
  canDeleteUsers: boolean
  canChangeUserRoles: boolean

  // 文章管理权限
  canViewPosts: boolean
  canCreatePosts: boolean
  canEditOwnPosts: boolean
  canEditAllPosts: boolean
  canDeleteOwnPosts: boolean
  canDeleteAllPosts: boolean
  canPublishPosts: boolean

  // 系统设置权限
  canViewSettings: boolean
  canEditSettings: boolean

  // 操作日志权限
  canViewLogs: boolean
  canDeleteLogs: boolean
}

// 角色权限配置
const rolePermissions: Record<Role, Permissions> = {
  管理员: {
    // 用户管理 - 所有权限
    canViewUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canChangeUserRoles: true,

    // 文章管理 - 所有权限
    canViewPosts: true,
    canCreatePosts: true,
    canEditOwnPosts: true,
    canEditAllPosts: true,
    canDeleteOwnPosts: true,
    canDeleteAllPosts: true,
    canPublishPosts: true,

    // 系统设置 - 所有权限
    canViewSettings: true,
    canEditSettings: true,

    // 操作日志 - 所有权限
    canViewLogs: true,
    canDeleteLogs: true
  },

  编辑: {
    // 用户管理 - 仅查看
    canViewUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canChangeUserRoles: false,

    // 文章管理 - 创建和编辑自己的文章，可以发布
    canViewPosts: true,
    canCreatePosts: true,
    canEditOwnPosts: true,
    canEditAllPosts: false,
    canDeleteOwnPosts: true,
    canDeleteAllPosts: false,
    canPublishPosts: true,

    // 系统设置 - 仅查看
    canViewSettings: true,
    canEditSettings: false,

    // 登录日志 - 不可查看
    canViewLogs: false,
    canDeleteLogs: false
  },

  普通用户: {
    // 用户管理 - 仅查看
    canViewUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canChangeUserRoles: false,

    // 文章管理 - 仅查看
    canViewPosts: true,
    canCreatePosts: false,
    canEditOwnPosts: false,
    canEditAllPosts: false,
    canDeleteOwnPosts: false,
    canDeleteAllPosts: false,
    canPublishPosts: false,

    // 系统设置 - 仅查看
    canViewSettings: true,
    canEditSettings: false,

    // 登录日志 - 不可查看
    canViewLogs: false,
    canDeleteLogs: false
  }
}

/**
 * 获取角色的权限配置
 */
export function getRolePermissions(role: Role): Permissions {
  return rolePermissions[role] || rolePermissions['普通用户']
}

/**
 * 检查用户是否有某个权限
 */
export function hasPermission(role: Role, permission: keyof Permissions): boolean {
  const permissions = getRolePermissions(role)
  return permissions[permission]
}

/**
 * 检查用户是否可以编辑文章
 * (编辑自己的文章 或 编辑所有文章权限)
 */
export function canEditPost(role: Role, authorId: number, currentUserId: number): boolean {
  const permissions = getRolePermissions(role)
  return permissions.canEditAllPosts || (permissions.canEditOwnPosts && authorId === currentUserId)
}

/**
 * 检查用户是否可以删除文章
 * (删除自己的文章 或 删除所有文章权限)
 */
export function canDeletePost(role: Role, authorId: number, currentUserId: number): boolean {
  const permissions = getRolePermissions(role)
  return permissions.canDeleteAllPosts || (permissions.canDeleteOwnPosts && authorId === currentUserId)
}

/**
 * 权限检查中间件错误响应
 */
export function permissionDenied(message: string = '权限不足') {
  return {
    success: false,
    message,
    code: 403,
    timestamp: Date.now()
  }
}

/**
 * 菜单项类型
 */
export interface MenuItem {
  /** 菜单名称 */
  name: string
  /** 路由路径 */
  path: string
  /** 图标（可选） */
  icon?: string
}

/**
 * 获取角色的可见菜单列表
 */
export function getVisibleMenus(role: Role): MenuItem[] {
  // 所有可用菜单
  const allMenus: MenuItem[] = [
    { name: '首页', path: '/', icon: 'home' },
    { name: '文章管理', path: '/posts', icon: 'document' },
    { name: '用户管理', path: '/users', icon: 'users' },
    { name: '系统设置', path: '/settings', icon: 'settings' },
    { name: '操作日志', path: '/logs', icon: 'log' }
  ]

  // 根据角色返回可见菜单
  const permissions = getRolePermissions(role)

  // 普通用户：只能看首页和文章管理
  if (role === '普通用户') {
    return allMenus.filter(menu => ['首页', '文章管理'].includes(menu.name))
  }

  // 编辑和管理员：可以看到所有菜单
  return allMenus
}

/**
 * 检查菜单是否对指定角色可见
 */
export function isMenuVisible(role: Role, menuName: string): boolean {
  const visibleMenus = getVisibleMenus(role)
  return visibleMenus.some(menu => menu.name === menuName)
}
