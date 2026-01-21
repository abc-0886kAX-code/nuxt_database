/**
 * @FilePath: /nuxt_tes/composables/usePermissions.ts
 * @Description: 权限管理 Composable
 */

import type { MenuItem } from '~/server/utils/permissions'

export const usePermissions = () => {
  // 用户信息
  const userInfo = ref<{
    id: number | string
    username: string
    role: string
    email?: string
    loginTime?: string
  } | null>(null)

  /**
   * 初始化：从 localStorage 获取用户信息
   */
  const initUserInfo = () => {
    if (import.meta.client) {
      const storedUser = localStorage.getItem('userInfo')
      if (storedUser) {
        try {
          userInfo.value = JSON.parse(storedUser)
        } catch (error) {
          console.error('解析用户信息失败:', error)
          userInfo.value = null
        }
      }
    }
  }

  /**
   * 获取用户的可见菜单列表
   */
  const visibleMenus = computed<MenuItem[]>(() => {
    if (!userInfo.value) {
      return []
    }

    const role = userInfo.value.role as any

    // 所有可用菜单
    const allMenus: MenuItem[] = [
      { name: '首页', path: '/', icon: 'home' },
      { name: '文章管理', path: '/posts', icon: 'document' },
      { name: '用户管理', path: '/users', icon: 'users' },
      { name: '系统设置', path: '/settings', icon: 'settings' },
      { name: '操作日志', path: '/logs', icon: 'log' }
    ]

    // 根据角色返回可见菜单
    if (role === '普通用户') {
      return allMenus.filter(menu => ['首页', '文章管理'].includes(menu.name))
    }

    // 编辑和管理员：可以看到所有菜单
    return allMenus
  })

  /**
   * 检查是否有编辑权限
   */
  const canEdit = computed(() => {
    if (!userInfo.value) return false
    const role = userInfo.value.role
    return role === '管理员' || role === '编辑'
  })

  /**
   * 检查是否可以编辑文章
   */
  const canEditPosts = computed(() => {
    if (!userInfo.value) return false
    const role = userInfo.value.role
    return role === '管理员' || role === '编辑'
  })

  /**
   * 检查是否可以编辑他人内容
   */
  const canEditOthers = computed(() => {
    if (!userInfo.value) return false
    return userInfo.value.role === '管理员'
  })

  /**
   * 检查是否为管理员
   */
  const isAdmin = computed(() => {
    return userInfo.value?.role === '管理员'
  })

  /**
   * 检查是否为编辑
   */
  const isEditor = computed(() => {
    return userInfo.value?.role === '编辑'
  })

  /**
   * 检查是否为普通用户
   */
  const isNormalUser = computed(() => {
    return userInfo.value?.role === '普通用户'
  })

  /**
   * 刷新用户信息
   */
  const refreshUserInfo = () => {
    initUserInfo()
  }

  // 初始化用户信息
  onMounted(() => {
    initUserInfo()
  })

  return {
    userInfo,
    visibleMenus,
    canEdit,
    canEditPosts,
    canEditOthers,
    isAdmin,
    isEditor,
    isNormalUser,
    refreshUserInfo
  }
}
