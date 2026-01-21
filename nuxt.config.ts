/*
 * @FilePath: /nuxt_tes/nuxt.config.ts
 * @Author: abc-0886kAX-code
 * @Date: 2025-04-01 23:14:11
 * @LastEditors: abc-0886kAX-code
 * @LastEditTime: 2025-04-12 13:11:31
 * @Description:
 */
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // 启用页面路由
  pages: true,

  // 确保扫描 layouts 目录
  scans: ['layouts'],

  // 运行时的一些全局变量
  runtimeConfig: {
    // 私有配置，只有服务器端可以访问
    count: 1,
    // 公开配置，客户端和服务端都可以访问
    public: {
      baseURL: "localhost:8080"
    }
  }
})
