<script setup lang="ts">
/**
 * @FilePath: /nuxt_tes/pages/settings/index.vue
 * @Description: 系统设置页面
 */

// 使用默认布局
definePageMeta({
  layout: 'default'
})

import type { SystemSettings } from '~/types/api'

// 使用 API composable
const { put } = useApi()

// 表单数据
const settings = ref<SystemSettings>({
  siteName: '',
  siteUrl: '',
  adminEmail: '',
  maxUsers: 0,
  allowRegistration: false,
  requireEmailVerification: false,
  sessionTimeout: 0,
  enableNotifications: false,
  maintenanceMode: false
})

// 保存加载状态
const saving = ref(false)

// 保存成功消息
const saveSuccess = ref(false)

// 获取设置
const fetchSettings = async () => {
  try {
    const { data, error } = await useFetch('/api/settings')

    if (error.value) {
      throw new Error(error.value.message || '获取设置失败')
    }

    if (data.value?.success) {
      settings.value = data.value.data
    }
  } catch (e) {
    console.error('获取设置失败:', e)
    alert('获取设置失败，请刷新页面重试')
  }
}

// 保存设置
const handleSave = async () => {
  saving.value = true
  saveSuccess.value = false

  try {
    const { data, error } = await put('/api/settings', settings.value)

    if (error.value) {
      throw new Error(error.value.message || '保存设置失败')
    }

    if (data.value?.success) {
      saveSuccess.value = true

      // 3秒后隐藏消息
      setTimeout(() => {
        saveSuccess.value = false
      }, 3000)
    } else {
      throw new Error(data.value?.message || '保存设置失败')
    }
  } catch (e: any) {
    console.error('保存设置失败:', e)
    alert(e.message || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 重置设置
const handleReset = async () => {
  if (confirm('确定要重置所有设置吗？')) {
    await fetchSettings()
  }
}

// 页面加载时获取设置
onMounted(() => {
  fetchSettings()
})
</script>

<template>
  <div class="settings-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>系统设置</h1>
      <div class="header-actions">
        <button @click="handleReset" class="reset-button">重置</button>
        <button @click="handleSave" class="save-button" :disabled="saving">
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </div>

    <!-- 成功消息 -->
    <div v-if="saveSuccess" class="success-message">
      ✓ 设置已成功保存
    </div>

    <!-- 设置表单 -->
    <div class="settings-content">
      <!-- 基本设置 -->
      <div class="settings-section">
        <h2>基本设置</h2>
        <div class="form-group">
          <label for="siteName">站点名称</label>
          <input
            id="siteName"
            v-model="settings.siteName"
            type="text"
            placeholder="请输入站点名称"
          />
        </div>

        <div class="form-group">
          <label for="siteUrl">站点URL</label>
          <input
            id="siteUrl"
            v-model="settings.siteUrl"
            type="url"
            placeholder="https://example.com"
          />
        </div>

        <div class="form-group">
          <label for="adminEmail">管理员邮箱</label>
          <input
            id="adminEmail"
            v-model="settings.adminEmail"
            type="email"
            placeholder="admin@example.com"
          />
        </div>

        <div class="form-group">
          <label for="maxUsers">最大用户数</label>
          <input
            id="maxUsers"
            v-model.number="settings.maxUsers"
            type="number"
            min="1"
            max="100000"
          />
        </div>
      </div>

      <!-- 用户设置 -->
      <div class="settings-section">
        <h2>用户设置</h2>

        <div class="form-group switch">
          <div class="switch-label">
            <label>允许用户注册</label>
            <p class="switch-description">关闭后新用户无法自行注册账号</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.allowRegistration" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="form-group switch">
          <div class="switch-label">
            <label>需要邮箱验证</label>
            <p class="switch-description">用户注册后需要验证邮箱才能使用</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.requireEmailVerification" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- 安全设置 -->
      <div class="settings-section">
        <h2>安全设置</h2>

        <div class="form-group">
          <label for="sessionTimeout">会话超时时间（分钟）</label>
          <input
            id="sessionTimeout"
            v-model.number="settings.sessionTimeout"
            type="number"
            min="5"
            max="1440"
          />
          <small>用户在一段时间不活动后自动退出登录</small>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="settings-section">
        <h2>通知设置</h2>

        <div class="form-group switch">
          <div class="switch-label">
            <label>启用系统通知</label>
            <p class="switch-description">系统会发送重要事件的通知邮件</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.enableNotifications" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- 维护模式 -->
      <div class="settings-section warning">
        <h2>维护模式</h2>

        <div class="form-group switch">
          <div class="switch-label">
            <label>启用维护模式</label>
            <p class="switch-description">启用后只有管理员可以访问系统</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.maintenanceMode" />
            <span class="slider"></span>
          </label>
        </div>

        <div v-if="settings.maintenanceMode" class="warning-box">
          ⚠️ 维护模式已启用，普通用户将无法访问系统
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }

  .reset-button {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
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

  .save-button {
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
  }
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 24px;
  border: 1px solid #c3e6cb;
  font-size: 14px;
  font-weight: 600;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 20px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
  }

  &.warning {
    border: 2px solid #ffc107;
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

    input[type="text"],
    input[type="url"],
    input[type="email"],
    input[type="number"] {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid #ddd;
      border-radius: 6px;
      transition: all 0.3s;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    }

    small {
      display: block;
      font-size: 12px;
      color: #999;
      margin-top: 6px;
    }

    &.switch {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;

      .switch-label {
        flex: 1;

        label {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .switch-description {
          font-size: 13px;
          color: #666;
          margin: 0;
        }
      }
    }
  }
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 26px;

    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }

  input:checked + .slider {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  input:checked + .slider:before {
    transform: translateX(24px);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #667eea;
  }
}

.warning-box {
  background: #fff3cd;
  color: #856404;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 16px;
  border: 1px solid #ffc107;
  font-size: 14px;
  font-weight: 600;
}
</style>
