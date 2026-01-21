<script setup lang="ts">
/**
 * @FilePath: /nuxt_tes/pages/logs/index.vue
 * @Description: 登录日志页面
 */

// 使用默认布局
definePageMeta({
  layout: 'default'
})

import type { LoginLog } from '~/types/api'

// 日志数据
const logs = ref<LoginLog[]>([])

// 加载状态
const loading = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 获取日志列表
const fetchLogs = async () => {
  loading.value = true
  try {
    // 使用和 users 页面相同的 useFetch 方式
    const { data, error } = await useFetch('/api/login-logs', {
      method: 'GET',
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })

    if (error.value) {
      throw new Error(error.value.message || '获取日志失败')
    }

    if (data.value?.success) {
      logs.value = data.value.data.items
      total.value = data.value.data.total
    } else {
      alert(data.value?.message || '获取日志失败')
    }
  } catch (e) {
    console.error('获取日志失败:', e)
    alert('获取日志失败，请重试')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 格式化User Agent
const formatUserAgent = (userAgent: string) => {
  if (!userAgent) return '未知设备'

  // 简单的浏览器检测
  if (userAgent.includes('Chrome')) {
    if (userAgent.includes('Edg')) return 'Microsoft Edge'
    return 'Chrome'
  } else if (userAgent.includes('Firefox')) {
    return 'Firefox'
  } else if (userAgent.includes('Safari')) {
    return 'Safari'
  } else if (userAgent.includes('Mobile')) {
    return '移动设备'
  }
  return '其他浏览器'
}

// 获取设备图标
const getDeviceIcon = (userAgent: string) => {
  if (!userAgent) return '💻'

  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    return '📱'
  }
  return '💻'
}

// 上一页
const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchLogs()
  }
}

// 下一页
const goToNextPage = () => {
  const maxPage = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < maxPage) {
    currentPage.value++
    fetchLogs()
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <div class="logs-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>登录日志</h1>
      <div class="header-info">
        <span class="total-count">共 {{ total }} 条记录</span>
      </div>
    </div>

    <!-- 日志列表 -->
    <div v-if="!loading" class="logs-list">
      <div v-if="logs.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>暂无登录记录</h3>
        <p>系统还没有登录记录</p>
      </div>

      <div v-else class="logs-table-wrapper">
        <table class="logs-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>IP 地址</th>
              <th>设备</th>
              <th>登录时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td class="user-cell">
                <div class="user-info">
                  <span class="user-icon">👤</span>
                  <span class="username">{{ log.username }}</span>
                </div>
              </td>
              <td class="ip-cell">
                <code class="ip-address">{{ log.ip_address || '未知' }}</code>
              </td>
              <td class="device-cell">
                <span class="device-icon">{{ getDeviceIcon(log.user_agent) }}</span>
                <span class="device-name">{{ formatUserAgent(log.user_agent) }}</span>
              </td>
              <td class="time-cell">
                <div class="time-info">
                  <span class="time-text">{{ formatDate(log.login_time) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 分页 -->
    <div v-if="!loading && total > 0" class="pagination">
      <button
        @click="goToPrevPage"
        :disabled="currentPage === 1"
        class="page-btn"
      >
        上一页
      </button>
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页
      </span>
      <button
        @click="goToNextPage"
        :disabled="currentPage >= Math.ceil(total / pageSize)"
        class="page-btn"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .header-info {
    .total-count {
      font-size: 14px;
      color: #6b7280;
      padding: 8px 16px;
      background: #f3f4f6;
      border-radius: 6px;
      font-weight: 500;
    }
  }
}

.logs-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 8px;
    color: #1f2937;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
}

.logs-table-wrapper {
  overflow-x: auto;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f8f9fa;
    border-bottom: 1px solid #e5e7eb;

    th {
      padding: 16px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f3f4f6;
      transition: background 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f8f9fa;
      }

      td {
        padding: 16px;
        font-size: 14px;
        color: #374151;
      }
    }
  }

  .user-cell {
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .user-icon {
        font-size: 20px;
      }

      .username {
        font-weight: 500;
        color: #1f2937;
      }
    }
  }

  .ip-cell {
    .ip-address {
      padding: 4px 8px;
      background: #f3f4f6;
      border-radius: 4px;
      font-size: 13px;
      font-family: 'Courier New', monospace;
      color: #667eea;
    }
  }

  .device-cell {
    .device-icon {
      font-size: 18px;
      margin-right: 6px;
    }

    .device-name {
      font-size: 13px;
      color: #6b7280;
    }
  }

  .time-cell {
    .time-text {
      font-size: 13px;
      color: #6b7280;
    }
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  p {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;

  .page-btn {
    padding: 8px 16px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #667eea;
    transition: all 0.3s;

    &:hover:not(:disabled) {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .page-info {
    font-size: 14px;
    color: #6b7280;
  }
}

@media (max-width: 768px) {
  .logs-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    h1 {
      font-size: 24px;
    }
  }

  .logs-table {
    thead th,
    tbody td {
      padding: 12px 8px;
      font-size: 13px;
    }
  }

  .device-cell .device-name {
    display: none;
  }
}
</style>
