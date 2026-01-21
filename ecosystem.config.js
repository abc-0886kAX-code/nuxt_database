/*
 * @FilePath: /nuxt_database/ecosystem.config.js
 * @Author: abc-0886kAX-code
 * @Date: 2026-01-16 13:28:40
 * @LastEditors: abc-0886kAX-code
 * @LastEditTime: 2026-01-21 10:05:57
 * @Description: PM2进程管理配置
 */
module.exports = {
  apps: [
    {
      name: 'demo',
      exec_mode: 'cluster',
      instances: 'max',
      port: '3000',
      script: './.output/server/index.mjs',
      args: 'start',
      error_file: './err.log', // 错误日志存放地址
      out_file: './out.log', // 输出日志存放地址
      env: {
        // 数据库配置
        DB_HOST: 'localhost',
        DB_PORT: 3306,
        DB_USER: 'root',
        DB_PASSWORD: 991113,
        DB_NAME: 'nuxt_app',
        // 应用配置
        NODE_ENv: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
