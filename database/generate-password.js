/**
 * 生成bcrypt加密的密码
 * 用于初始化数据库管理员账户
 */

import bcrypt from 'bcryptjs'

const password = '123456'
const saltRounds = 10

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('加密失败:', err)
    process.exit(1)
  }

  console.log('\n原始密码:', password)
  console.log('加密后的密码:', hash)
  console.log('\n请将以下SQL语句中的加密密码复制到 init.sql 中:\n')
  console.log(`INSERT INTO users (username, email, password, role, status) VALUES`)
  console.log(`('admin', 'admin@example.com', '${hash}', '管理员', 'enabled');\n`)
})
