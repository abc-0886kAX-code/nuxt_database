/**
 * @FilePath: /nuxt_tes/types/api.d.ts
 * @Description: API 接口统一类型定义
 */

/**
 * API 统一响应格式
 */
export interface ApiResponse<T = any> {
  /** 是否成功 */
  success: boolean
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data?: T
  /** 错误码（可选） */
  code?: number
  /** 时间戳 */
  timestamp?: number
}

/**
 * 分页数据格式
 */
export interface PaginationData<T = any> {
  /** 数据列表 */
  items: T[]
  /** 总数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  /** 当前页 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 排序字段 */
  sortField?: string
  /** 排序方式 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户ID */
  id: number | string
  /** 用户名 */
  username: string
  /** 角色 */
  role?: string
  /** 登录时间 */
  loginTime?: string
  /** 邮箱 */
  email?: string
  /** 头像 */
  avatar?: string
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/**
 * 登录响应数据
 */
export interface LoginData {
  /** 访问令牌 */
  token: string
  /** 用户信息 */
  user: UserInfo
  /** 会话超时时间（分钟） */
  sessionTimeout?: number
}

/**
 * 用户管理 - 用户列表项
 */
export interface UserListItem {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 邮箱 */
  email: string
  /** 角色 */
  role: string
  /** 状态 */
  status: 'enabled' | 'disabled'
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 用户管理 - 创建用户参数
 */
export interface CreateUserParams {
  /** 用户名 */
  username: string
  /** 邮箱 */
  email: string
  /** 密码 */
  password: string
  /** 角色 */
  role?: string
  /** 状态 */
  status?: 'enabled' | 'disabled'
}

/**
 * 用户管理 - 更新用户参数
 */
export interface UpdateUserParams {
  /** 用户名 */
  username?: string
  /** 邮箱 */
  email?: string
  /** 角色 */
  role?: string
  /** 状态 */
  status?: 'enabled' | 'disabled'
}

/**
 * 用户管理 - 修改状态参数
 */
export interface UpdateUserStatusParams {
  /** 状态 */
  status: 'enabled' | 'disabled'
}

/**
 * 操作日志 - 日志项
 */
export interface LogItem {
  /** 日志ID */
  id: number
  /** 用户 */
  user: string
  /** 操作 */
  action: string
  /** 模块 */
  module: string
  /** IP地址 */
  ip: string
  /** 状态 */
  status: 'success' | 'error' | 'warning'
  /** 时间戳 */
  timestamp: string
}

/**
 * 登录日志
 */
export interface LoginLog {
  /** 日志ID */
  id: number
  /** 用户ID */
  user_id: number
  /** 用户名 */
  username: string
  /** IP地址 */
  ip_address?: string
  /** User Agent */
  user_agent?: string
  /** 登录时间 */
  login_time: string
}

/**
 * 统计数据
 */
export interface StatsData {
  /** 总用户数 */
  totalUsers: number
  /** 活跃用户数 */
  activeUsers: number
  /** 文章总数 */
  totalPosts: number
  /** 总浏览量 */
  totalViews: number
}

/**
 * 用户增长趋势
 */
export interface UserGrowthItem {
  /** 月份 */
  month: string
  /** 数值 */
  value: number
}

/**
 * 访问来源
 */
export interface TrafficSourceItem {
  /** 来源 */
  source: string
  /** 百分比 */
  percentage: number
  /** 颜色 */
  color: string
}

/**
 * 系统设置
 */
export interface SystemSettings {
  /** 站点名称 */
  siteName: string
  /** 站点URL */
  siteUrl: string
  /** 管理员邮箱 */
  adminEmail: string
  /** 最大用户数 */
  maxUsers: number
  /** 允许注册 */
  allowRegistration: boolean
  /** 需要邮箱验证 */
  requireEmailVerification: boolean
  /** 会话超时（分钟） */
  sessionTimeout: number
  /** 启用通知 */
  enableNotifications: boolean
  /** 维护模式 */
  maintenanceMode: boolean
}

/**
 * 系统状态
 */
export interface SystemStatus {
  /** CPU使用率 */
  cpu: number
  /** 内存使用率 */
  memory: number
  /** 磁盘使用率 */
  disk: number
  /** 运行时间 */
  uptime: string
  /** 服务器时间 */
  serverTime: string
}

/**
 * 最近活动
 */
export interface ActivityItem {
  /** 活动ID */
  id: number
  /** 类型 */
  type: 'user' | 'system' | 'security'
  /** 消息 */
  message: string
  /** 时间 */
  time: string
}
