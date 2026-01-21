/**
 * @FilePath: /nuxt_tes/composables/useSystemSettings.ts
 * @Description: 系统设置 Composable
 */

import type { SystemSettings } from '~/types/api'

export const useSystemSettings = () => {
  // 系统设置
  const settings = ref<SystemSettings>({
    siteName: '加载中...',
    siteUrl: '',
    adminEmail: '',
    maxUsers: 100,
    allowRegistration: true,
    requireEmailVerification: false,
    sessionTimeout: 60,
    enableNotifications: true,
    maintenanceMode: false
  })

  // 加载状态
  const loading = ref(false)

  /**
   * 获取系统设置
   */
  const fetchSettings = async () => {
    loading.value = true
    try {
      const { data, error } = await useFetch('/api/settings')

      if (error.value) {
        console.error('获取系统设置失败:', error.value)
        return
      }

      if (data.value?.success) {
        settings.value = data.value.data
      }
    } catch (e) {
      console.error('获取系统设置失败:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新设置
   */
  const refreshSettings = () => {
    fetchSettings()
  }

  // 计算属性：站点名称
  const siteName = computed(() => settings.value.siteName)

  // 计算属性：是否允许注册
  const allowRegistration = computed(() => settings.value.allowRegistration)

  // 计算属性：是否维护模式
  const isMaintenanceMode = computed(() => settings.value.maintenanceMode)

  // 初始化时加载设置
  onMounted(() => {
    fetchSettings()
  })

  return {
    settings,
    siteName,
    allowRegistration,
    isMaintenanceMode,
    loading,
    fetchSettings,
    refreshSettings
  }
}
