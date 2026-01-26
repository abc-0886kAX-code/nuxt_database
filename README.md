<div align="center">

# 🔐 Nuxt Database Management System

**基于 Nuxt 3 + MySQL 的现代化全栈管理系统**

[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

提供完善的用户管理、权限控制、文章管理和系统审计功能

</div>

---

<div align="center">

[![在线演示](https://img.shields.io/badge/🌐-在线演示-00DC82?style=for-the-badge)](http://your-domain-or-ip:8086/login)

**👉 点击访问：http://your-domain-or-ip:8086/login**

</div>

---

## 项目简介

这是一个现代化的全栈管理系统，采用 Nuxt 3 的服务端渲染能力，提供高性能的用户体验。系统内置了完整的 RBAC 权限管理体系，支持多角色用户管理，适合作为各类管理系统的开发基础。

## ✨ 功能特性

### 🎯 核心功能

| 功能模块        | 描述                                   | 状态 |
| --------------- | -------------------------------------- | ---- |
| 🔑 **用户认证** | JWT Token 认证机制，支持会话过期管理   | ✅   |
| 👥 **用户管理** | 用户的增删改查，支持角色分配和状态管理 | ✅   |
| 🛡️ **权限控制** | 基于角色的访问控制（RBAC）             | ✅   |
| 📝 **文章管理** | 文章的创建、编辑、发布、归档等功能     | ✅   |
| 📷 **图片上传** | 支持图片上传，自动生成唯一文件名       | ✅   |
| 📊 **登录日志** | 记录用户登录行为，支持安全审计         | ✅   |
| ⚙️ **系统设置** | 灵活的配置管理系统                     | ✅   |

#### 角色权限体系

- **👑 管理员** - 拥有所有权限，可管理用户、文章、系统设置
- **✏️ 编辑** - 可创建和编辑文章，查看用户列表
- **👤 普通用户** - 只能查看文章和自己的信息

### 🚀 技术亮点

<details>
<summary>点击查看技术细节</summary>

- ⚡ **前后端一体化架构** - Nuxt 3 服务端渲染
- 🔒 **TypeScript 类型安全** - 完整的类型定义
- 🛡️ **参数化查询** - 防止 SQL 注入
- 🔐 **bcrypt 密码加密** - 10轮加盐保护
- 🌐 **RESTful API** - 标准化的接口设计
- 📱 **响应式设计** - 完美支持移动端
- 🎨 **现代化 UI** - 优雅的用户界面
- 📦 **模块化开发** - 易于扩展和维护

</details>

## 🛠️ 技术栈

### 🎨 前端技术

| 技术                                                                                              | 版本 | 说明                          |
| ------------------------------------------------------------------------------------------------- | ---- | ----------------------------- |
| ![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82?logo=nuxt.js)                                | 3.x  | Vue 3 全栈框架                |
| ![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white)                   | 3.x  | 渐进式 JavaScript 框架        |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white) | 5.x  | JavaScript 超集，提供类型安全 |
| ![Sass](https://img.shields.io/badge/Sass-1.x-CC6699?logo=sass&logoColor=white)                   | 1.x  | CSS 预处理器                  |

### 🔧 后端技术

| 技术                                                                                 | 版本   | 说明                     |
| ------------------------------------------------------------------------------------ | ------ | ------------------------ |
| ![Nitro](https://img.shields.io/badge/Nitro-Latest-00DC82?logo=nuxt.js)              | Latest | Nuxt 3 服务端引擎        |
| ![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)  | 8.0+   | 关系型数据库             |
| ![mysql2](https://img.shields.io/badge/mysql2-3.x-4479A1?logo=mysql&logoColor=white) | 3.x    | MySQL 驱动，支持 Promise |

### 🔒 安全技术

| 技术                                                                             | 说明                 |
| -------------------------------------------------------------------------------- | -------------------- |
| ![bcryptjs](https://img.shields.io/badge/bcryptjs-3.x-000000?logo=javascript)    | 密码加密（10轮加盐） |
| ![JWT](https://img.shields.io/badge/JWT-Authenticated-000000?logo=jsonwebtokens) | 身份认证             |
| 🛡️ 参数化查询                                                                    | SQL 注入防护         |

## 🚀 快速开始

### 📋 环境要求

| 依赖                                                                                 | 版本要求  | 说明                |
| ------------------------------------------------------------------------------------ | --------- | ------------------- |
| ![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-339933?logo=node.js)        | >= 18.0.0 | JavaScript 运行环境 |
| ![MySQL](https://img.shields.io/badge/MySQL->=8.0-4479A1?logo=mysql&logoColor=white) | >= 8.0    | 关系型数据库        |
| ![npm](https://img.shields.io/badge/npm->=9.0.0-CB3837?logo=npm)                     | >= 9.0.0  | 包管理器            |

### 📦 安装步骤

<details>
<summary><b>步骤 1️⃣：克隆项目</b></summary>

```bash
# 使用 Git 克隆
git clone <repository-url>
cd nuxt_database
```

</details>

<details>
<summary><b>步骤 2️⃣：安装依赖</b></summary>

```bash
npm install
```

</details>

<details>
<summary><b>步骤 3️⃣：配置环境变量</b></summary>

创建 `.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=nuxt_app

# 服务端口（可选，默认3000）
PORT=3000
```

⚠️ **注意**：请将 `your_password_here` 替换为你的 MySQL 密码

</details>

<details>
<summary><b>步骤 4️⃣：初始化数据库</b></summary>

```bash
mysql -u root -p < database/init.sql
```

或者使用 MySQL 命令行：

```bash
mysql -u root -p
source /path/to/database/init.sql
```

</details>

<details>
<summary><b>步骤 5️⃣：启动开发服务器</b></summary>

```bash
npm run dev
```

✨ 服务启动成功后，访问 http://localhost:3000

</details>

### 🔑 默认账号

| 字段   | 值        |
| ------ | --------- |
| 用户名 | `admin`   |
| 密码   | `123456`  |
| 角色   | 👑 管理员 |

> ⚠️ **安全提示**：首次登录后请立即修改密码！

> 💡 **提示**：以上账号适用于本地开发和在线演示 http://152.136.167.65:8086/login

## 📁 项目结构

```
nuxt_database/
├── 📂 assets/              # 静态资源
├── 📂 composables/         # 组合式函数
├── 📂 database/            # 数据库脚本
│   ├── init.sql           # 数据库初始化
│   └── generate-password.js
├── 📂 layouts/             # 布局组件
├── 📂 middleware/          # 中间件
├── 📂 pages/               # 页面路由
│   ├── index.vue          # 🏠 首页
│   ├── login.vue          # 🔐 登录页
│   ├── users/             # 👥 用户管理
│   ├── posts/             # 📝 文章管理
│   └── logs/              # 📊 登录日志
├── 📂 plugins/             # 插件
├── 📂 public/              # 公共资源
├── 📂 server/              # 服务端代码
│   ├── api/               # 🌐 API 接口
│   │   ├── login.post.ts
│   │   ├── register.post.ts
│   │   ├── users/
│   │   ├── posts/
│   │   ├── login-logs/
│   │   ├── settings/
│   │   └── stats/
│   ├── config/            # ⚙️ 配置文件
│   │   └── database.ts
│   ├── db/                # 💾 数据库操作层
│   ├── middleware/        # 🔒 服务端中间件
│   │   └── api-auth.ts
│   └── utils/             # 🛠️ 工具函数
├── 📂 types/               # 类型定义
├── 📄 .env                 # 环境变量
├── 📄 nuxt.config.ts      # Nuxt 配置
├── 📄 package.json        # 项目配置
├── 📖 后端.md             # 后端开发文档
└── 📖 启动部署.md         # 部署文档
```

## 🌐 API 接口

### 🔐 认证接口

| 方法 | 端点            | 描述     | 认证 |
| ---- | --------------- | -------- | ---- |
| POST | `/api/login`    | 用户登录 | ❌   |
| POST | `/api/register` | 用户注册 | ❌   |

### 👥 用户管理

| 方法   | 端点                     | 描述         | 认证 | 权限        |
| ------ | ------------------------ | ------------ | ---- | ----------- |
| GET    | `/api/users`             | 获取用户列表 | ✅   | 所有角色    |
| POST   | `/api/users`             | 创建用户     | ✅   | 管理员      |
| PUT    | `/api/users/{id}`        | 更新用户     | ✅   | 管理员/本人 |
| DELETE | `/api/users/{id}`        | 删除用户     | ✅   | 管理员      |
| PATCH  | `/api/users/{id}/status` | 更新用户状态 | ✅   | 管理员      |

### 📝 文章管理

| 方法   | 端点              | 描述         | 认证 | 权限        |
| ------ | ----------------- | ------------ | ---- | ----------- |
| GET    | `/api/posts`      | 获取文章列表 | ✅   | 所有角色    |
| GET    | `/api/posts/{id}` | 获取文章详情 | ✅   | 所有角色    |
| POST   | `/api/posts`      | 创建文章     | ✅   | 管理员/编辑 |
| PUT    | `/api/posts/{id}` | 更新文章     | ✅   | 作者/管理员 |
| DELETE | `/api/posts/{id}` | 删除文章     | ✅   | 作者/管理员 |

### ⚙️ 系统管理

| 方法 | 端点              | 描述         | 认证 | 权限   |
| ---- | ----------------- | ------------ | ---- | ------ |
| POST | `/api/upload`     | 上传图片     | ❌   | 公开   |
| GET  | `/api/login-logs` | 获取登录日志 | ✅   | 管理员 |
| GET  | `/api/settings`   | 获取系统设置 | ❌   | 公开   |
| PUT  | `/api/settings`   | 更新系统设置 | ✅   | 管理员 |
| GET  | `/api/stats`      | 获取统计数据 | ❌   | 公开   |

📖 **详细的 API 文档**：请参考 [后端.md](./后端.md)

## 💻 开发指南

### 📏 代码规范

- ✅ 使用 TypeScript 进行类型定义
- ✅ 遵循 ESLint 和 Prettier 配置
- ✅ 使用组合式 API（Composition API）

### 📝 命名规范

| 类型   | 规范             | 示例            |
| ------ | ---------------- | --------------- |
| 文件名 | kebab-case       | `user-list.vue` |
| 组件名 | PascalCase       | `UserList.vue`  |
| 变量名 | camelCase        | `userName`      |
| 常量名 | UPPER_SNAKE_CASE | `MAX_USERS`     |

### ⚡ 常用命令

```bash
# 🚀 启动开发服务器
npm run dev

# 🏗️ 构建生产版本
npm run build

# 👁️ 预览生产构建
npm run preview

# 📦 生成静态站点
npm run generate

# 🔧 准备项目
npm run postinstall
```

## 🚀 部署

### 支持的部署方式

<details>
<summary><b>☁️ Vercel 部署（推荐）</b></summary>

✨ **优点**：零配置、自动 HTTPS、全球 CDN

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel

# 生产环境部署
vercel --prod
```

</details>

<details>
<summary><b>🐳 Docker 部署</b></summary>

```bash
# 构建镜像
docker build -t nuxt-database .

# 运行容器
docker run -d \
  --name nuxt-app \
  -p 3000:3000 \
  --env-file .env \
  nuxt-database
```

</details>

<details>
<summary><b>🖥️ 传统服务器部署（PM2）</b></summary>

```bash
# 构建项目
npm run build

# 使用 PM2 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs nuxt-app
```

</details>

📖 **详细的部署指南**：请参考 [启动部署.md](./启动部署.md)

## 💾 数据库设计

### 📊 数据表

| 表名              | 说明       | 主要字段                                    |
| ----------------- | ---------- | ------------------------------------------- |
| 👥 **users**      | 用户表     | id, username, email, password, role, status |
| 📝 **posts**      | 文章表     | id, title, content, author_id, status       |
| ⚙️ **settings**   | 系统设置表 | key_name, value, description                |
| 📋 **login_logs** | 登录日志表 | user_id, username, ip_address, login_time   |

### 🔧 数据库配置

| 配置项   | 值                   |
| -------- | -------------------- |
| 数据库名 | `nuxt_app`           |
| 字符集   | `utf8mb4`            |
| 排序规则 | `utf8mb4_unicode_ci` |
| 最小版本 | MySQL 8.0+           |

## 🔒 安全机制

| 安全措施            | 实现方式         | 说明               |
| ------------------- | ---------------- | ------------------ |
| 🔐 **密码加密**     | bcrypt 10轮加盐  | 防止密码泄露       |
| 🛡️ **SQL 注入防护** | 参数化查询       | 防止恶意 SQL 注入  |
| 🔑 **身份认证**     | JWT Token        | 无状态身份验证     |
| ⏰ **会话管理**     | 60分钟超时       | 自动过期保护       |
| ✅ **输入验证**     | 邮箱、用户名检查 | 防止非法输入       |
| 🚦 **权限控制**     | RBAC             | 基于角色的访问控制 |
| 📝 **审计日志**     | 登录日志记录     | 追溯用户行为       |

## ❓ 常见问题

<details>
<summary><b>🔗 数据库连接失败</b></summary>

**解决方案**：

- 检查 `.env` 文件中的数据库配置
- 确认 MySQL 服务是否启动
- 验证用户名和密码是否正确

```bash
# 检查 MySQL 状态
sudo systemctl status mysql
```

</details>

<details>
<summary><b>🚪 端口被占用</b></summary>

**解决方案**：

```bash
# 查找占用进程
lsof -ti:3000

# 杀死进程
lsof -ti:3000 | xargs kill -9

# 或使用其他端口
PORT=3001 npm run dev
```

</details>

<details>
<summary><b>🔑 Token 过期问题</b></summary>

**解决方案**：

- 检查系统设置中的 `sessionTimeout` 配置
- 清除浏览器 localStorage
- 确认客户端系统时间是否正确

</details>

更多问题请参考 [启动部署.md](./启动部署.md)

## 📚 文档

- 📖 [后端开发文档](./后端.md) - 详细的 API 文档和数据库设计
- 🚀 [启动部署文档](./启动部署.md) - 部署指南和常见问题

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目仅供学习和研究使用。

## 📮 联系方式

如有问题，请通过以下方式联系：

- 🐛 提交 [GitHub Issue](../../issues)
- 📧 发送邮件至开发团队

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

Made with ❤️ by [Your Name]

</div>
