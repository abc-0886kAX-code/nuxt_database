<script setup lang="ts">
/**
 * @FilePath: /nuxt_tes/pages/index.vue
 * @Description: 首页
 */

// 使用默认布局
definePageMeta({
  layout: 'default'
})

import type { StatsData, UserInfo } from '~/types/api'

// 获取用户信息
const userInfo = ref<UserInfo | null>(null)

// 快速统计数据
const quickStats = ref<StatsData>({
  totalUsers: 0,
  activeUsers: 0,
  totalPosts: 0,
  totalViews: 0
})

// 加载状态
const loading = ref(false)

// 角色文案配置
const roleMessages: Record<string, { title: string; subtitle: string }> = {
  '管理员': {
    title: '管理员',
    subtitle: '这是您的管理控制台，可以快速查看系统概况和访问各项功能'
  },
  '超级管理员': {
    title: '超级管理员',
    subtitle: '欢迎回到系统管理中心，您拥有最高权限，可以管理所有系统功能和用户'
  },
  '普通用户': {
    title: '用户',
    subtitle: '欢迎回来，这里是您的个人中心，可以查看和编辑您的信息'
  },
  '编辑': {
    title: '编辑',
    subtitle: '欢迎回来，您可以在这里管理文章内容和发布新文章'
  },
  '访客': {
    title: '访客',
    subtitle: '欢迎访问我们的系统，您可以浏览公开的内容'
  }
}

// 计算角色显示的文案
const roleTitle = computed(() => {
  if (!userInfo.value?.role) return '用户'
  return roleMessages[userInfo.value.role]?.title || userInfo.value.role
})

const roleSubtitle = computed(() => {
  if (!userInfo.value?.role) return '欢迎回来'
  return roleMessages[userInfo.value.role]?.subtitle || '欢迎回来'
})

// 获取首页数据
const fetchHomeData = async () => {
  loading.value = true
  try {
    // 获取统计数据
    const statsResult = await useFetch('/api/stats')
    if (statsResult.data.value?.success) {
      quickStats.value = statsResult.data.value.data.stats
    }
  } catch (e) {
    console.error('获取首页数据失败:', e)
  } finally {
    loading.value = false
  }
}

// 从 localStorage 获取用户信息
const loadUserInfo = () => {
  if (import.meta.client) {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      try {
        userInfo.value = JSON.parse(userInfoStr)
      } catch (e) {
        console.error('解析用户信息失败:', e)
      }
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadUserInfo()
  fetchHomeData()
})
</script>

<template>
  <div class="home-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <div class="banner-text">
          <h1>欢迎回来，{{ roleTitle }}！</h1>
          <p class="banner-subtitle">{{ roleSubtitle }}</p>
        </div>
        <div class="banner-decoration">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
      </div>
    </div>

    <!-- 快速统计 -->
    <div class="stats-section">
      <h2 class="section-title">数据概览</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stat-trend up">+12%</div>
          </div>
          <div class="stat-value">{{ quickStats.totalUsers.toLocaleString() }}</div>
          <div class="stat-label">总用户数</div>
          <div class="stat-divider"></div>
          <NuxtLink to="/users" class="stat-action">查看详情</NuxtLink>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="stat-trend up">+8%</div>
          </div>
          <div class="stat-value">{{ quickStats.totalPosts.toLocaleString() }}</div>
          <div class="stat-label">文章总数</div>
          <div class="stat-divider"></div>
          <NuxtLink to="/posts" class="stat-action">管理文章</NuxtLink>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div class="stat-trend up">+23%</div>
          </div>
          <div class="stat-value">{{ quickStats.activeUsers.toLocaleString() }}</div>
          <div class="stat-label">活跃用户</div>
          <div class="stat-divider"></div>
          <NuxtLink to="/users" class="stat-action">查看用户</NuxtLink>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11-8-11 8-4 8-11 8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div class="stat-trend up">+15%</div>
          </div>
          <div class="stat-value">{{ quickStats.totalViews.toLocaleString() }}</div>
          <div class="stat-label">总浏览量</div>
          <div class="stat-divider"></div>
          <div class="stat-action">数据分析</div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- 左侧：功能入口 -->
      <div class="features-section">
        <div class="section-header">
          <h2 class="section-title">快速入口</h2>
          <p class="section-subtitle">常用功能快速访问</p>
        </div>
        <div class="feature-list">
          <NuxtLink to="/posts" class="feature-item">
            <div class="feature-icon-wrapper blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div class="feature-info">
              <h3>文章管理</h3>
              <p>创建、编辑和管理文章内容</p>
            </div>
            <svg class="feature-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </NuxtLink>

          <NuxtLink to="/users" class="feature-item">
            <div class="feature-icon-wrapper purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="feature-info">
              <h3>用户管理</h3>
              <p>管理系统用户、角色和权限</p>
            </div>
            <svg class="feature-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </NuxtLink>

          <NuxtLink to="/settings" class="feature-item">
            <div class="feature-icon-wrapper orange">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-1.82.33z"></path>
              </svg>
            </div>
            <div class="feature-info">
              <h3>系统设置</h3>
              <p>配置系统参数和功能选项</p>
            </div>
            <svg class="feature-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </NuxtLink>

          <NuxtLink to="/logs" class="feature-item">
            <div class="feature-icon-wrapper green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div class="feature-info">
              <h3>登录日志</h3>
              <p>查看用户登录记录和安全审计</p>
            </div>
            <svg class="feature-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </NuxtLink>
        </div>
      </div>

      <!-- 右侧：系统介绍 -->
      <div class="info-section">
        <!-- 系统介绍 -->
        <div class="info-card">
          <div class="section-header">
            <h2 class="section-title">关于系统</h2>
            <p class="section-subtitle">基于现代化技术栈构建</p>
          </div>
          <div class="info-content">
            <div class="info-item">
              <div class="info-icon">🚀</div>
              <div class="info-text">
                <h3>技术栈</h3>
                <div class="tech-tags">
                  <span class="tech-tag nuxt">Nuxt 3</span>
                  <span class="tech-tag ts">TypeScript</span>
                  <span class="tech-tag mysql">MySQL</span>
                  <span class="tech-tag scss">SCSS</span>
                </div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">🏗️</div>
              <div class="info-text">
                <h3>架构设计</h3>
                <ul class="check-list">
                  <li><span class="check">✓</span> 前后端一体化架构</li>
                  <li><span class="check">✓</span> 完善的权限管理系统</li>
                  <li><span class="check">✓</span> RESTful API 设计</li>
                  <li><span class="check">✓</span> 模块化代码组织</li>
                </ul>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">⚡</div>
              <div class="info-text">
                <h3>核心特性</h3>
                <ul class="check-list">
                  <li><span class="check">✓</span> JWT 身份认证</li>
                  <li><span class="check">✓</span> 响应式设计</li>
                  <li><span class="check">✓</span> 数据权限控制</li>
                  <li><span class="check">✓</span> 安全的密码加密</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="links-card">
          <div class="section-header">
            <h2 class="section-title">学习资源</h2>
            <p class="section-subtitle">官方文档和教程</p>
          </div>
          <div class="links-grid">
            <a href="https://nuxt.com" target="_blank" class="link-card">
              <div class="link-icon">📖</div>
              <div class="link-info">
                <div class="link-title">Nuxt 文档</div>
                <div class="link-desc">nuxt.com</div>
              </div>
              <svg class="link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>

            <a href="https://vuejs.org" target="_blank" class="link-card">
              <div class="link-icon">💚</div>
              <div class="link-info">
                <div class="link-title">Vue 3</div>
                <div class="link-desc">vuejs.org</div>
              </div>
              <svg class="link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>

            <a href="https://www.typescriptlang.org" target="_blank" class="link-card">
              <div class="link-icon">📘</div>
              <div class="link-info">
                <div class="link-title">TypeScript</div>
                <div class="link-desc">typescriptlang.org</div>
              </div>
              <svg class="link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

// 欢迎横幅
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);

  .banner-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 48px 56px;
    position: relative;
    z-index: 2;
  }

  .banner-text {
    flex: 1;

    h1 {
      font-size: 42px;
      font-weight: 700;
      color: white;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .banner-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      max-width: 600px;
    }
  }

  .banner-decoration {
    position: relative;
    width: 300px;
    height: 300px;

    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;

      &.circle-1 {
        width: 200px;
        height: 200px;
        top: 20px;
        right: 40px;
        animation-delay: 0s;
      }

      &.circle-2 {
        width: 150px;
        height: 150px;
        top: 80px;
        right: 80px;
        animation-delay: 2s;
      }

      &.circle-3 {
        width: 100px;
        height: 100px;
        top: 120px;
        right: 120px;
        animation-delay: 4s;
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

// 统计区域
.stats-section {
  margin-bottom: 40px;

  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 24px 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
  }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 28px rgba(102, 126, 234, 0.25);

      &::before {
        opacity: 1;
      }
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      color: white;

      &.purple {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.blue {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.green {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }

      &.orange {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }
    }

    .stat-trend {
      font-size: 13px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 12px;
      background: #ecfdf5;
      color: #059669;

      &.up {
        background: #ecfdf5;
        color: #059669;
      }
    }

    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
      line-height: 1;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 20px;
    }

    .stat-divider {
      height: 1px;
      background: #f3f4f6;
      margin-bottom: 16px;
    }

    .stat-action {
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      color: #667eea;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: #764ba2;
      }
    }
  }
}

// 内容网格
.content-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
}

// 功能入口
.features-section {
  .section-header {
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  .section-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #667eea;
      transform: scaleY(0);
      transition: transform 0.3s;
    }

    &:hover {
      transform: translateX(8px);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);

      &::before {
        transform: scaleY(1);
      }

      .feature-arrow {
        transform: translateX(4px);
        color: #667eea;
      }
    }

    .feature-icon-wrapper {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      flex-shrink: 0;
      color: white;

      &.blue {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.purple {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.orange {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }

      &.green {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }

    .feature-info {
      flex: 1;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 13px;
        color: #6b7280;
        margin: 0;
      }
    }

    .feature-arrow {
      color: #d1d5db;
      transition: all 0.3s;
    }
  }
}

// 信息区域
.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .info-card,
  .links-card {
    background: white;
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  .section-header {
    margin-bottom: 24px;

    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .section-subtitle {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }
  }

  .info-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .info-item {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    transition: all 0.3s;

    &:hover {
      background: #f0f0ff;
      transform: translateX(4px);
    }

    .info-icon {
      font-size: 32px;
      flex-shrink: 0;
    }

    .info-text {
      flex: 1;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 12px 0;
      }
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tech-tag {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;

      &.nuxt {
        background: linear-gradient(135deg, #00c6fb 0%, #005bea);
        color: white;
      }

      &.ts {
        background: linear-gradient(135deg, #3178c6 0%, #2563eb);
        color: white;
      }

      &.mysql {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706);
        color: white;
      }

      &.scss {
        background: linear-gradient(135deg, #cd6799 0%, #c1486c);
        color: white;
      }
    }

    .check-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;

      li {
        font-size: 14px;
        color: #4b5563;
        display: flex;
        align-items: center;
        gap: 8px;

        .check {
          color: #10b981;
          font-weight: 700;
        }
      }
    }
  }

  .links-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .link-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s;

    &:hover {
      background: #f0f0ff;
      transform: translateX(4px);

      .link-arrow {
        color: #667eea;
        transform: translateX(4px);
      }
    }

    .link-icon {
      font-size: 32px;
      flex-shrink: 0;
    }

    .link-info {
      flex: 1;

      .link-title {
        font-size: 15px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 2px;
      }

      .link-desc {
        font-size: 12px;
        color: #6b7280;
      }
    }

    .link-arrow {
      color: #d1d5db;
      transition: all 0.3s;
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 24px 16px;
  }

  .welcome-banner {
    .banner-content {
      padding: 32px 24px;
      flex-direction: column;
      text-align: center;
    }

    .banner-text h1 {
      font-size: 32px;
    }

    .banner-text .banner-subtitle {
      font-size: 16px;
    }

    .banner-decoration {
      display: none;
    }
  }

  .stats-section {
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .stat-card {
      padding: 20px;

      .stat-value {
        font-size: 28px;
      }
    }
  }

  .features-section .feature-item {
    padding: 20px;

    .feature-icon-wrapper {
      width: 48px;
      height: 48px;

      svg {
        width: 24px;
        height: 24px;
      }
    }
  }

  .info-section {
    .info-card,
    .links-card {
      padding: 20px;
    }

    .info-item {
      flex-direction: column;
      gap: 12px;
      padding: 16px;

      .info-icon {
        font-size: 24px;
      }
    }

    .check-list {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 480px) {
  .home-container {
    padding: 16px 12px;
  }

  .welcome-banner .banner-content {
    padding: 24px 20px;
  }

  .banner-text h1 {
    font-size: 28px;
  }

  .banner-text .banner-subtitle {
    font-size: 14px;
  }

  .stat-card {
    .stat-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .stat-value {
      font-size: 24px;
    }
  }
}
</style>
