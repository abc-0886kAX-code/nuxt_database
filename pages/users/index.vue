<script setup lang="ts">
/**
 * @FilePath: /nuxt_tes/pages/users/index.vue
 * @Description: 用户管理页面
 */

// 使用默认布局
definePageMeta({
  layout: 'default'
})

import type { UserListItem, CreateUserParams, UpdateUserParams } from '~/types/api'

// 用户列表数据
const users = ref<UserListItem[]>([])
const loading = ref(false)
const searchQuery = ref('')

// 系统设置
const maxUsers = ref(0)
const currentUserCount = ref(0)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 弹窗控制
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)

// 表单数据
const formData = ref<CreateUserParams | UpdateUserParams>({
  username: '',
  email: '',
  password: '',
  role: '普通用户',
  status: 'enabled'
})

// 当前操作的用户
const currentUser = ref<UserListItem | null>(null)

// 提交加载状态
const submitLoading = ref(false)

// 错误消息
const errorMessage = ref('')

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const { data, error } = await useFetch('/api/users', {
      method: 'GET',
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value
      }
    })

    if (error.value) {
      errorMessage.value = error.value.message || '获取用户列表失败'
      return
    }

    if (data.value?.success) {
      users.value = data.value.data.items
      total.value = data.value.data.total
      currentUserCount.value = data.value.data.total
    } else {
      errorMessage.value = data.value?.message || '获取用户列表失败'
    }
  } catch (e) {
    errorMessage.value = '获取用户列表失败'
    console.error('获取用户列表错误:', e)
  } finally {
    loading.value = false
  }
}

// 获取系统设置
const fetchSettings = async () => {
  try {
    const { data } = await useFetch('/api/settings')
    if (data.value?.success) {
      maxUsers.value = data.value.data.maxUsers || 0
    }
  } catch (e) {
    console.error('获取系统设置失败:', e)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

// 打开创建弹窗
const openCreateModal = () => {
  formData.value = {
    username: '',
    email: '',
    password: '',
    role: '普通用户',
    status: 'enabled'
  }
  errorMessage.value = ''
  showCreateModal.value = true
}

// 打开编辑弹窗
const openEditModal = (user: UserListItem) => {
  currentUser.value = user
  formData.value = {
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status
  }
  errorMessage.value = ''
  showEditModal.value = true
}

// 打开删除确认
const openDeleteConfirm = (user: UserListItem) => {
  currentUser.value = user
  showDeleteConfirm.value = true
}

// 创建用户
const handleCreate = async () => {
  submitLoading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await useFetch('/api/users', {
      method: 'POST',
      body: formData.value
    })

    if (error.value) {
      errorMessage.value = error.value.message || '创建用户失败'
      return
    }

    if (data.value?.success) {
      showCreateModal.value = false
      fetchUsers()
    } else {
      errorMessage.value = data.value?.message || '创建用户失败'
    }
  } catch (e) {
    errorMessage.value = '创建用户失败'
    console.error('创建用户错误:', e)
  } finally {
    submitLoading.value = false
  }
}

// 更新用户
const handleUpdate = async () => {
  if (!currentUser.value) return

  submitLoading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await useFetch(`/api/users/${currentUser.value.id}`, {
      method: 'PUT',
      body: formData.value
    })

    if (error.value) {
      errorMessage.value = error.value.message || '更新用户失败'
      return
    }

    if (data.value?.success) {
      showEditModal.value = false
      fetchUsers()
    } else {
      errorMessage.value = data.value?.message || '更新用户失败'
    }
  } catch (e) {
    errorMessage.value = '更新用户失败'
    console.error('更新用户错误:', e)
  } finally {
    submitLoading.value = false
  }
}

// 删除用户
const handleDelete = async () => {
  if (!currentUser.value) return

  submitLoading.value = true

  try {
    const { data, error } = await useFetch(`/api/users/${currentUser.value.id}`, {
      method: 'DELETE'
    })

    if (error.value) {
      alert(error.value.message || '删除用户失败')
      return
    }

    if (data.value?.success) {
      showDeleteConfirm.value = false
      fetchUsers()
    } else {
      alert(data.value?.message || '删除用户失败')
    }
  } catch (e) {
    alert('删除用户失败')
    console.error('删除用户错误:', e)
  } finally {
    submitLoading.value = false
  }
}

// 切换用户状态
const toggleStatus = async (user: UserListItem) => {
  const newStatus = user.status === 'enabled' ? 'disabled' : 'enabled'

  try {
    const { data, error } = await useFetch(`/api/users/${user.id}/status`, {
      method: 'PATCH',
      body: { status: newStatus }
    })

    if (error.value) {
      alert(error.value.message || '更新状态失败')
      return
    }

    if (data.value?.success) {
      fetchUsers()
    } else {
      alert(data.value?.message || '更新状态失败')
    }
  } catch (e) {
    alert('更新状态失败')
    console.error('更新状态错误:', e)
  }
}

// 计算是否已达用户数上限
const isUserLimitReached = computed(() => {
  return currentUserCount.value >= maxUsers.value && maxUsers.value > 0
})

// 页面加载时获取用户列表和系统设置
onMounted(() => {
  fetchUsers()
  fetchSettings()
})

// 监听搜索输入（防抖）
let searchTimer: NodeJS.Timeout | null = null
watch(searchQuery, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    handleSearch()
  }, 500)
})
</script>

<template>
  <div class="users-container">
    <!-- 头部 -->
    <div class="header">
      <div class="header-left">
        <h1>用户管理</h1>
        <!-- 用户数统计 -->
        <div class="user-count-info">
          <span class="count-item">当前用户: {{ currentUserCount }}</span>
          <span class="count-item">最大用户数: {{ maxUsers }}</span>
          <span v-if="isUserLimitReached" class="warning-badge">
            ⚠️ 用户数已达上限
          </span>
        </div>
      </div>
      <button
        @click="openCreateModal"
        class="create-button"
        :disabled="isUserLimitReached"
        :title="isUserLimitReached ? '用户数已达上限' : '新增用户'"
      >
        + 新增用户
      </button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索用户名、邮箱或角色..."
        class="search-input"
      />
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage && !loading" class="error-banner">
      {{ errorMessage }}
    </div>

    <!-- 用户表格 -->
    <div v-if="!loading" class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span
                :class="['status-badge', user.status]"
                class="status-badge"
              >
                {{ user.status === 'enabled' ? '已启用' : '已停用' }}
              </span>
            </td>
            <td>{{ user.createdAt }}</td>
            <td class="actions">
              <button
                @click="toggleStatus(user)"
                :class="['action-button', 'toggle', user.status]"
              >
                {{ user.status === 'enabled' ? '停用' : '启用' }}
              </button>
              <button @click="openEditModal(user)" class="action-button edit">编辑</button>
              <button @click="openDeleteConfirm(user)" class="action-button delete">删除</button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="7" class="empty-row">暂无用户数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 分页 -->
    <div v-if="!loading && total > 0" class="pagination">
      <button
        @click="currentPage--; fetchUsers()"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        上一页
      </button>
      <span class="pagination-info">
        第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页
      </span>
      <button
        @click="currentPage++; fetchUsers()"
        :disabled="currentPage >= Math.ceil(total / pageSize)"
        class="pagination-button"
      >
        下一页
      </button>
    </div>

    <!-- 创建用户弹窗 -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>新增用户</h2>
          <button @click="showCreateModal = false" class="close-button">×</button>
        </div>
        <div class="modal-body">
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div class="form-group">
            <label>用户名 *</label>
            <input v-model="formData.username" type="text" placeholder="请输入用户名" />
          </div>
          <div class="form-group">
            <label>邮箱 *</label>
            <input v-model="formData.email" type="email" placeholder="请输入邮箱" />
          </div>
          <div class="form-group">
            <label>密码 *</label>
            <input v-model="formData.password" type="password" placeholder="请输入密码" />
          </div>
          <div class="form-group">
            <label>角色</label>
            <select v-model="formData.role">
              <option value="管理员">管理员</option>
              <option value="普通用户">普通用户</option>
              <option value="编辑">编辑</option>
            </select>
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="formData.status">
              <option value="enabled">启用</option>
              <option value="disabled">停用</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showCreateModal = false" class="cancel-button">取消</button>
          <button
            @click="handleCreate"
            :disabled="submitLoading || !formData.username || !formData.email || !formData.password"
            class="submit-button"
          >
            {{ submitLoading ? '创建中...' : '创建' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑用户弹窗 -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>编辑用户</h2>
          <button @click="showEditModal = false" class="close-button">×</button>
        </div>
        <div class="modal-body">
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div class="form-group">
            <label>用户名 *</label>
            <input v-model="formData.username" type="text" placeholder="请输入用户名" />
          </div>
          <div class="form-group">
            <label>邮箱 *</label>
            <input v-model="formData.email" type="email" placeholder="请输入邮箱" />
          </div>
          <div class="form-group">
            <label>角色</label>
            <select v-model="formData.role">
              <option value="管理员">管理员</option>
              <option value="普通用户">普通用户</option>
              <option value="编辑">编辑</option>
            </select>
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="formData.status">
              <option value="enabled">启用</option>
              <option value="disabled">停用</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showEditModal = false" class="cancel-button">取消</button>
          <button
            @click="handleUpdate"
            :disabled="submitLoading || !formData.username || !formData.email"
            class="submit-button"
          >
            {{ submitLoading ? '更新中...' : '更新' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="modal small">
        <div class="modal-header">
          <h2>确认删除</h2>
          <button @click="showDeleteConfirm = false" class="close-button">×</button>
        </div>
        <div class="modal-body">
          <p>确定要删除用户 <strong>{{ currentUser?.username }}</strong> 吗？</p>
          <p class="warning">此操作不可恢复！</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteConfirm = false" class="cancel-button">取消</button>
          <button
            @click="handleDelete"
            :disabled="submitLoading"
            class="submit-button danger"
          >
            {{ submitLoading ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.users-container {
  min-height: 100vh;
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  .header-left {
    flex: 1;

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      margin: 0 0 12px 0;
    }

    .user-count-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;

      .count-item {
        font-size: 14px;
        color: #666;
        padding: 6px 12px;
        background: #f5f7fa;
        border-radius: 6px;
        font-weight: 500;
      }

      .warning-badge {
        font-size: 14px;
        color: #fff;
        padding: 6px 12px;
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
        border-radius: 6px;
        font-weight: 600;
        animation: pulse 2s infinite;
      }
    }
  }

  .create-button {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #999;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.search-bar {
  margin-bottom: 24px;

  .search-input {
    width: 100%;
    max-width: 400px;
    padding: 12px 16px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
}

.error-banner {
  background-color: #fee;
  color: #c33;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #fcc;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f8f9fa;

    th {
      padding: 16px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      color: #555;
      border-bottom: 1px solid #eee;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f8f9fa;
      }

      td {
        padding: 16px;
        font-size: 14px;
        color: #333;
      }
    }
  }

  .status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;

    &.enabled {
      background: #d4edda;
      color: #155724;
    }

    &.disabled {
      background: #f8d7da;
      color: #721c24;
    }
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .action-button {
    padding: 6px 12px;
    font-size: 12px;
    border: 1px solid;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    &.toggle {
      &.enabled {
        background: #fff3cd;
        color: #856404;
        border-color: #ffc107;
      }

      &.disabled {
        background: #d4edda;
        color: #155724;
        border-color: #28a745;
      }
    }

    &.edit {
      background: #cce5ff;
      color: #004085;
      border-color: #007bff;
    }

    &.delete {
      background: #f8d7da;
      color: #721c24;
      border-color: #dc3545;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  .empty-row {
    text-align: center;
    color: #999;
    padding: 40px !important;
  }
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
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
  }

  p {
    margin-top: 16px;
    color: #666;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;

  .pagination-button {
    padding: 8px 16px;
    font-size: 14px;
    color: #667eea;
    background: white;
    border: 1px solid #667eea;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .pagination-info {
    font-size: 14px;
    color: #666;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

    &.small {
      max-width: 400px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #eee;

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }

      .close-button {
        font-size: 28px;
        color: #999;
        background: none;
        border: none;
        cursor: pointer;
        line-height: 1;
        transition: color 0.3s;

        &:hover {
          color: #333;
        }
      }
    }

    .modal-body {
      padding: 24px;

      .error-message {
        background: #fee;
        color: #c33;
        padding: 10px 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        border: 1px solid #fcc;
        font-size: 14px;
      }

      .form-group {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #555;
          margin-bottom: 8px;
        }

        input,
        select {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          transition: all 0.3s;

          &:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
        }

        p {
          font-size: 14px;
          color: #666;
          margin: 8px 0 0 0;

          &.warning {
            color: #dc3545;
            font-weight: 600;
          }
        }
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #eee;

      .cancel-button {
        padding: 10px 20px;
        font-size: 14px;
        color: #666;
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #f5f5f5;
        }
      }

      .submit-button {
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        &.danger {
          background: #dc3545;

          &:hover:not(:disabled) {
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
          }
        }
      }
    }
  }
}
</style>
