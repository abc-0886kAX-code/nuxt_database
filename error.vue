<script setup lang="ts">
/**
 * @FilePath: /nuxt_tes/error.vue
 * @Description: 错误页面
 */

const props = defineProps({
  error: Object
})

const handleError = () => {
  clearError({
    redirect: '/login'
  })
}
</script>

<template>
  <div class="error-container">
    <div class="error-box">
      <h1>出错了</h1>
      <p>{{ error?.message || '页面未找到' }}</p>
      <button @click="handleError" class="back-button">
        返回登录页
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-box {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 48px;
    color: #333;
    margin: 0 0 20px 0;
  }

  p {
    font-size: 16px;
    color: #666;
    margin: 0 0 30px 0;
  }

  .back-button {
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  }
}
</style>
