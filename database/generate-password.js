/*
 * @FilePath: /nuxt_database/database/generate-password.js
 * @Author: abc-0886kAX-code
 * @Date: 2026-01-16 14:14:43
 * @LastEditors: abc-0886kAX-code
 * @LastEditTime: 2026-01-21 14:19:33
 * @Description:
 */
/**
 * 生成bcrypt加密的密码
 * 用于初始化数据库管理员账户
 */

import bcrypt from 'bcryptjs';

const password = 'zhangxin';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('加密失败:', err);
    process.exit(1);
  }

  console.log('\n原始密码:', password);
  console.log('加密后的密码:', hash);
  console.log('\n请将以下SQL语句中的加密密码复制到 init.sql 中:\n');
  console.log(`INSERT INTO users (username, email, password, role, status) VALUES`);
  console.log(`('admin', 'admin@example.com', '${hash}', '管理员', 'enabled');\n`);
});
