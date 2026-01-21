<!--
 * @FilePath: /nuxt_tes/layouts/login.vue
 * @Description: 登录页布局（只用于登录页面）
-->
<template>
  <div class="login-layout">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.login-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
</style>
