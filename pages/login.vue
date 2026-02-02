<script setup lang="ts">
/**
 * @FilePath: /nuxt_tes/pages/login.vue
 * @Description: 登录/注册页面
 */

// 使用登录页布局
definePageMeta({
    layout: 'login',
});

// 获取路由对象，用于登录后跳转
const route = useRoute();

// 当前激活的标签页
const activeTab = ref<'login' | 'register'>('login');

// 登录表单数据
const loginForm = ref({
    username: '',
    password: '',
});

// 注册表单数据
const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
});

// 加载状态
const loading = ref(false);

// 错误信息
const errorMessage = ref('');

// 检查是否因会话过期而跳转
onMounted(() => {
    const reason = route.query.reason as string;
    if (reason === 'session_expired') {
        errorMessage.value = '登录已过期，请重新登录';
    } else if (reason === 'unauthorized') {
        errorMessage.value = '请先登录';
    }
});

// 切换标签页
const switchTab = (tab: 'login' | 'register') => {
    activeTab.value = tab;
    errorMessage.value = '';
};

// 登录方法
const handleLogin = async () => {
    // 表单验证
    if (!loginForm.value.username || !loginForm.value.password) {
        errorMessage.value = '请输入用户名和密码';
        return;
    }

    loading.value = true;
    errorMessage.value = '';

    try {
        // 调用登录接口
        const { data, error } = await useFetch('/api/login', {
            method: 'POST',
            body: {
                username: loginForm.value.username,
                password: loginForm.value.password,
            },
        });

        if (error.value) {
            errorMessage.value = error.value.message || '登录失败，请重试';
            return;
        }

        if (data.value?.success) {
            // 保存用户信息和 token 到 localStorage
            if (import.meta.client) {
                localStorage.setItem('token', data.value.data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.value.data.user));
            }

            // 登录成功，跳转到原始页面或首页
            const redirectPath = (route.query.redirect as string) || '/';
            await navigateTo(redirectPath, { replace: true });
        } else {
            errorMessage.value = data.value?.message || '用户名或密码错误';
        }
    } catch (e) {
        errorMessage.value = '登录失败，请重试';
        console.error('登录错误:', e);
    } finally {
        loading.value = false;
    }
};

// 注册方法
const handleRegister = async () => {
    // 表单验证
    if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
        errorMessage.value = '请填写所有必填项';
        return;
    }

    // 验证密码确认
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        errorMessage.value = '两次输入的密码不一致';
        return;
    }

    // 密码长度验证
    if (registerForm.value.password.length < 6) {
        errorMessage.value = '密码长度至少为6位';
        return;
    }

    loading.value = true;
    errorMessage.value = '';

    try {
        // 调用注册接口
        const { data, error } = await useFetch('/api/register', {
            method: 'POST',
            body: {
                username: registerForm.value.username,
                email: registerForm.value.email,
                password: registerForm.value.password,
            },
        });

        if (error.value) {
            errorMessage.value = error.value.message || '注册失败，请重试';
            return;
        }

        if (data.value?.success) {
            // 注册成功，切换到登录页并提示
            errorMessage.value = '';

            // 显示成功提示，告知用户角色
            alert(`注册成功！\n\n您的账号：${registerForm.value.username}\n角色：普通用户\n\n现在将跳转到登录页面`);

            // 切换到登录标签
            switchTab('login');

            // 清空注册表单
            registerForm.value = {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
            };
        } else {
            errorMessage.value = data.value?.message || '注册失败';
        }
    } catch (e) {
        errorMessage.value = '注册失败，请重试';
        console.error('注册错误:', e);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="login-container">
        <!-- 左侧：项目介绍 -->
        <div class="login-left">
            <div class="left-content">
                <div class="logo-section">
                    <div class="logo-icon">🚀</div>
                    <h1 class="app-title">管理系统</h1>
                    <p class="app-subtitle">现代化的一站式管理解决方案</p>
                </div>

                <div class="feature-list">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div class="feature-text">
                            <h3>完善的功能</h3>
                            <p>用户管理、权限控制、文章发布等核心功能</p>
                        </div>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <div class="feature-text">
                            <h3>安全可靠</h3>
                            <p>JWT认证、密码加密、权限验证等多重保障</p>
                        </div>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <div class="feature-text">
                            <h3>高性能</h3>
                            <p>基于Nuxt 3构建，响应快速，体验流畅</p>
                        </div>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                        </div>
                        <div class="feature-text">
                            <h3>现代化架构</h3>
                            <p>TypeScript + MySQL + SCSS 技术栈</p>
                        </div>
                    </div>
                </div>

                <div class="tech-tags">
                    <span class="tech-tag nuxt">Nuxt 3</span>
                    <span class="tech-tag vue">Vue 3</span>
                    <span class="tech-tag ts">TypeScript</span>
                    <span class="tech-tag mysql">MySQL</span>
                </div>
            </div>
        </div>

        <!-- 右侧：登录/注册表单 -->
        <div class="login-right">
            <div class="login-box">
                <!-- 标签切换 -->
                <div class="auth-tabs">
                    <button @click="switchTab('login')" :class="{ active: activeTab === 'login' }" class="tab-button">登录</button>
                    <button @click="switchTab('register')" :class="{ active: activeTab === 'register' }" class="tab-button">注册</button>
                </div>

                <!-- 登录表单 -->
                <div v-if="activeTab === 'login'" class="auth-form-container">
                    <h1 class="login-title">欢迎回来</h1>
                    <p class="login-subtitle">登录以继续使用系统</p>
                    <form @submit.prevent="handleLogin" class="login-form">
                        <!-- 用户名输入 -->
                        <div class="form-item">
                            <label for="username">用户名</label>
                            <input id="username" v-model="loginForm.username" type="text" placeholder="请输入用户名" class="form-input" :disabled="loading" />
                        </div>

                        <!-- 密码输入 -->
                        <div class="form-item">
                            <label for="password">密码</label>
                            <input id="password" v-model="loginForm.password" type="password" placeholder="请输入密码" class="form-input" :disabled="loading" />
                        </div>

                        <!-- 错误提示 -->
                        <div v-if="errorMessage" class="error-message">
                            {{ errorMessage }}
                        </div>

                        <!-- 登录按钮 -->
                        <button type="submit" class="login-button" :disabled="loading">
                            {{ loading ? '登录中...' : '登录' }}
                        </button>
                    </form>

                    <div class="login-tips">
                        <p>测试账号: cs / 123456</p>
                    </div>
                </div>

                <!-- 注册表单 -->
                <div v-else class="auth-form-container">
                    <h1 class="login-title">创建账户</h1>
                    <p class="login-subtitle">注册以开始使用系统</p>
                    <form @submit.prevent="handleRegister" class="login-form">
                        <!-- 用户名输入 -->
                        <div class="form-item">
                            <label for="reg-username">用户名</label>
                            <input id="reg-username" v-model="registerForm.username" type="text" placeholder="请输入用户名" class="form-input" :disabled="loading" />
                        </div>

                        <!-- 邮箱输入 -->
                        <div class="form-item">
                            <label for="reg-email">邮箱</label>
                            <input id="reg-email" v-model="registerForm.email" type="email" placeholder="请输入邮箱" class="form-input" :disabled="loading" />
                        </div>

                        <!-- 密码输入 -->
                        <div class="form-item">
                            <label for="reg-password">密码</label>
                            <input id="reg-password" v-model="registerForm.password" type="password" placeholder="请输入密码（至少6位）" class="form-input" :disabled="loading" />
                        </div>

                        <!-- 确认密码输入 -->
                        <div class="form-item">
                            <label for="reg-confirm-password">确认密码</label>
                            <input id="reg-confirm-password" v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" class="form-input" :disabled="loading" />
                        </div>

                        <!-- 错误提示 -->
                        <div v-if="errorMessage" class="error-message">
                            {{ errorMessage }}
                        </div>

                        <!-- 注册按钮 -->
                        <button type="submit" class="login-button" :disabled="loading">
                            {{ loading ? '注册中...' : '注册' }}
                        </button>

                        <div class="login-tips">
                            <p>💡 注册成功后，您的角色将为「普通用户」</p>
                            <p>📧 请使用真实邮箱，便于后续账号找回</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.login-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
}

// 左侧：项目介绍区域
.login-left {
    flex: 1;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 80px;
    position: relative;
    overflow: hidden;

    // 装饰性背景图案
    &::before {
        content: '';
        position: absolute;
        width: 600px;
        height: 600px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50%;
        top: -200px;
        left: -200px;
    }

    &::after {
        content: '';
        position: absolute;
        width: 400px;
        height: 400px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50%;
        bottom: -100px;
        right: -100px;
    }

    .left-content {
        position: relative;
        z-index: 2;
        max-width: 560px;
        color: white;
    }

    .logo-section {
        margin-bottom: 60px;

        .logo-icon {
            font-size: 64px;
            margin-bottom: 20px;
            animation: float 3s ease-in-out infinite;
        }

        .app-title {
            font-size: 48px;
            font-weight: 700;
            margin: 0 0 12px 0;
            line-height: 1.2;
        }

        .app-subtitle {
            font-size: 18px;
            opacity: 0.9;
            margin: 0;
        }
    }

    .feature-list {
        display: flex;
        flex-direction: column;
        gap: 32px;
        margin-bottom: 60px;

        .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 20px;

            .feature-icon {
                width: 56px;
                height: 56px;
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                color: white;
                transition: all 0.3s;

                &:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: translateY(-4px);
                }
            }

            .feature-text {
                h3 {
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0 0 6px 0;
                }

                p {
                    font-size: 14px;
                    opacity: 0.85;
                    margin: 0;
                    line-height: 1.6;
                }
            }
        }
    }

    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        .tech-tag {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            transition: all 0.3s;

            &:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: translateY(-2px);
            }

            &.nuxt {
                background: rgba(0, 198, 251, 0.3);
            }

            &.vue {
                background: rgba(66, 184, 131, 0.3);
            }

            &.ts {
                background: rgba(49, 120, 198, 0.3);
            }

            &.mysql {
                background: rgba(245, 158, 11, 0.3);
            }
        }
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

// 右侧：登录/注册表单区域
.login-right {
    width: 520px;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.login-box {
    background: white;
    border-radius: 16px;
    padding: 48px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.auth-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;

    .tab-button {
        flex: 1;
        padding: 12px;
        font-size: 15px;
        font-weight: 600;
        color: #666;
        background: #f5f5f5;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            background: #e8e8e8;
        }

        &.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
    }
}

.auth-form-container {
    margin-top: 8px;
}

.login-title {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
    margin: 0 0 8px 0;
}

.login-subtitle {
    font-size: 14px;
    color: #6b7280;
    text-align: center;
    margin: 0 0 32px 0;
}

.login-form {
    .form-item {
        margin-bottom: 20px;

        label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }

        .form-input {
            width: 100%;
            padding: 12px 16px;
            font-size: 14px;
            border: 1.5px solid #e5e7eb;
            border-radius: 8px;
            transition: all 0.3s;
            box-sizing: border-box;
            background: #f9fafb;

            &:focus {
                outline: none;
                border-color: #667eea;
                background: white;
                box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            }

            &:disabled {
                background-color: #f5f5f5;
                cursor: not-allowed;
                opacity: 0.6;
            }

            &::placeholder {
                color: #9ca3af;
            }
        }
    }

    .error-message {
        background: linear-gradient(135deg, #fee 0%, #fdd 100%);
        color: #dc2626;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 20px;
        border: 1px solid #fecaca;
        display: flex;
        align-items: center;
        gap: 8px;

        &::before {
            content: '⚠️';
            font-size: 16px;
        }
    }

    .login-button {
        width: 100%;
        padding: 14px;
        font-size: 16px;
        font-weight: 600;
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 8px;

        &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        &:active:not(:disabled) {
            transform: translateY(0);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
}

.login-tips {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    text-align: center;

    p {
        font-size: 13px;
        color: #6b7280;
        margin: 0;
        line-height: 1.8;

        &:not(:last-child) {
            margin-bottom: 4px;
        }
    }
}

// 响应式设计
@media (max-width: 1024px) {
    .login-container {
        flex-direction: column;
    }

    .login-left {
        padding: 60px 40px;
        min-height: 400px;

        .left-content {
            max-width: 100%;
        }

        .logo-section {
            margin-bottom: 40px;

            .app-title {
                font-size: 36px;
            }
        }

        .feature-list {
            gap: 24px;

            .feature-item {
                .feature-icon {
                    width: 48px;
                    height: 48px;
                }

                .feature-text {
                    h3 {
                        font-size: 16px;
                    }
                }
            }
        }
    }

    .login-right {
        width: 100%;
        padding: 32px 24px;
    }

    .login-box {
        max-width: 100%;
        padding: 32px;
    }
}

@media (max-width: 640px) {
    .login-left {
        padding: 40px 24px;

        .logo-section {
            .logo-icon {
                font-size: 48px;
            }

            .app-title {
                font-size: 28px;
            }

            .app-subtitle {
                font-size: 16px;
            }
        }

        .feature-list {
            margin-bottom: 40px;
        }

        .tech-tags {
            .tech-tag {
                font-size: 12px;
                padding: 6px 12px;
            }
        }
    }

    .login-right {
        padding: 24px 16px;
    }

    .login-box {
        padding: 24px;
        border-radius: 12px;
    }

    .auth-tabs {
        margin-bottom: 24px;

        .tab-button {
            padding: 10px;
            font-size: 14px;
        }
    }

    .login-title {
        font-size: 24px;
    }

    .login-form {
        .form-item {
            margin-bottom: 16px;
        }

        .login-button {
            padding: 12px;
            font-size: 15px;
        }
    }
}
</style>
