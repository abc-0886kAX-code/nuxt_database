<!--
 * @FilePath: /nuxt_tes/layouts/default.vue
 * @Description: 默认布局（用于已登录的页面）
-->
<script setup lang="ts">
// 使用权限 composable
const { userInfo, visibleMenus } = usePermissions()
// 使用系统设置 composable
const { siteName } = useSystemSettings()
const mobileMenuOpen = ref(false)

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 退出登录
const handleLogout = () => {
  // 清除本地存储
  if (import.meta.client) {
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }

  // 跳转到登录页（使用 replace 避免返回）
  navigateTo('/login', { replace: true })
}
</script>

<template>
  <div class="default-layout">
    <!-- 全局导航栏 -->
    <nav class="navbar">
      <div class="navbar-content">
        <h1 class="logo">{{ siteName || '我的应用' }}</h1>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span v-if="!mobileMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>

        <div class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
          <NuxtLink
            v-for="menu in visibleMenus"
            :key="menu.path"
            :to="menu.path"
            class="nav-link"
            @click="mobileMenuOpen = false"
          >
            {{ menu.name }}
          </NuxtLink>
        </div>
        <div class="user-info">
          <span v-if="userInfo" class="username">欢迎, {{ userInfo.username }}</span>
          <button @click="handleLogout" class="logout-button">退出登录</button>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <slot />
    </main>

    <!-- 全局底部 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 {{ siteName || '我的应用' }}. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  .navbar-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .logo {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }

  // 移动端菜单按钮
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    color: #667eea;
  }

  .nav-links {
    display: flex;
    gap: 24px;
    align-items: center;

    .nav-link {
      font-size: 14px;
      color: #666;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        background: #f5f5f5;
        color: #667eea;
      }

      &.router-link-active {
        color: #667eea;
        background: #f0f0ff;
        font-weight: 600;
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .username {
      font-size: 14px;
      color: #666;
      display: block;
    }

    .logout-button {
      padding: 8px 16px;
      font-size: 14px;
      color: #667eea;
      background: white;
      border: 1px solid #667eea;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;

      &:hover {
        background: #667eea;
        color: white;
      }
    }
  }

  // 移动端响应式
  @media (max-width: 768px) {
    .navbar-content {
      padding: 12px 16px;
    }

    .logo {
      font-size: 20px;
    }

    .mobile-menu-btn {
      display: block;
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
    }

    .nav-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      flex-direction: column;
      padding: 12px 16px;
      gap: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      display: none;

      &.mobile-open {
        display: flex;
      }

      .nav-link {
        width: 100%;
        padding: 12px 16px;
        border-radius: 8px;
        text-align: center;
      }
    }

    .user-info {
      .username {
        display: none;
      }

      .logout-button {
        padding: 8px 12px;
        font-size: 13px;
      }
    }
  }

  @media (max-width: 480px) {
    .navbar-content {
      padding: 10px 12px;
    }

    .logo {
      font-size: 18px;
    }

    .mobile-menu-btn {
      right: 12px;
      font-size: 20px;
    }

    .user-info {
      .logout-button {
        padding: 6px 10px;
        font-size: 12px;
      }
    }
  }
}

.main-content {
  flex: 1;
  width: 100%;
}

.footer {
  background: white;
  border-top: 1px solid #eee;
  padding: 20px 0;
  margin-top: auto;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    text-align: center;

    p {
      font-size: 14px;
      color: #999;
      margin: 0;
    }
  }
}
</style>
