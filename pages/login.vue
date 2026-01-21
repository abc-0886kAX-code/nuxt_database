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
            alert('注册成功！请登录');
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
    <div class="login-box">
        <!-- 标签切换 -->
        <div class="auth-tabs">
            <button @click="switchTab('login')" :class="{ active: activeTab === 'login' }" class="tab-button">登录</button>
            <button @click="switchTab('register')" :class="{ active: activeTab === 'register' }" class="tab-button">注册</button>
        </div>

        <!-- 登录表单 -->
        <div v-if="activeTab === 'login'" class="auth-form-container">
            <h1 class="login-title">用户登录</h1>
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
            <h1 class="login-title">用户注册</h1>
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
                    <p>注册后即可使用系统功能</p>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
.login-box {
    background: white;
    border-radius: 12px;
    padding: 40px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.auth-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;

    .tab-button {
        flex: 1;
        padding: 12px;
        font-size: 16px;
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
        }
    }
}

.auth-form-container {
    margin-top: 8px;
}

.login-title {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin: 0 0 30px 0;
}

.login-form {
    .form-item {
        margin-bottom: 20px;

        label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #555;
            margin-bottom: 8px;
        }

        .form-input {
            width: 100%;
            padding: 12px 16px;
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

            &:disabled {
                background-color: #f5f5f5;
                cursor: not-allowed;
            }

            &::placeholder {
                color: #999;
            }
        }
    }

    .error-message {
        background-color: #fee;
        color: #c33;
        padding: 10px 12px;
        border-radius: 6px;
        font-size: 14px;
        margin-bottom: 20px;
        border: 1px solid #fcc;
    }

    .login-button {
        width: 100%;
        padding: 14px;
        font-size: 16px;
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
    padding-top: 20px;
    border-top: 1px solid #eee;
    text-align: center;

    p {
        font-size: 13px;
        color: #999;
        margin: 0;
    }
}
</style>
