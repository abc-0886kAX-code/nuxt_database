# Nuxt Database Management System

基于 Nuxt 3 + MySQL 构建的全栈管理系统，提供完善的用户管理、权限控制、文章管理和系统审计功能。

## 项目简介

这是一个现代化的全栈管理系统，采用 Nuxt 3 的服务端渲染能力，提供高性能的用户体验。系统内置了完整的 RBAC 权限管理体系，支持多角色用户管理，适合作为各类管理系统的开发基础。

## 功能特性

### 核心功能

- **用户认证** - JWT Token 认证机制，支持会话过期管理
- **用户管理** - 用户的增删改查，支持角色分配和状态管理
- **权限控制** - 基于角色的访问控制（RBAC）
  - 管理员：拥有所有权限
  - 编辑：可创建和编辑文章
  - 普通用户：查看权限
- **文章管理** - 文章的创建、编辑、发布、归档等功能
- **登录日志** - 记录用户登录行为，支持安全审计
- **系统设置** - 灵活的配置管理系统

### 技术亮点

- 前后端一体化架构
- TypeScript 类型安全
- 参数化查询防止 SQL 注入
- bcrypt 密码加密（10轮加盐）
- RESTful API 设计
- 响应式设计，支持移动端

## 技术栈

### 前端
- **Nuxt 3** - Vue 3 全栈框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router** - 路由管理
- **TypeScript** - 类型安全

### 后端
- **Nitro** - Nuxt 3 服务端引擎
- **MySQL 8.0+** - 关系型数据库
- **mysql2** - MySQL 驱动

### 安全
- **bcryptjs** - 密码加密
- **JWT** - 身份认证
- **参数化查询** - SQL 注入防护

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd nuxt_database
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

创建 `.env` 文件：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=nuxt_app
PORT=3000
```

4. **初始化数据库**

```bash
mysql -u root -p < database/init.sql
```

5. **启动开发服务器**

```bash
npm run dev
```

访问 http://localhost:3000

### 默认账号

```
用户名：admin
密码：123456
角色：管理员
```

⚠️ **首次登录后请立即修改密码！**

## 项目结构

```
nuxt_database/
├── assets/              # 静态资源
├── composables/         # 组合式函数
├── database/            # 数据库脚本
├── layouts/             # 布局组件
├── middleware/          # 中间件
├── pages/               # 页面路由
│   ├── index.vue       # 首页
│   ├── login.vue       # 登录页
│   ├── users/          # 用户管理
│   ├── posts/          # 文章管理
│   └── logs/           # 登录日志
├── plugins/             # 插件
├── public/              # 公共资源
├── server/              # 服务端代码
│   ├── api/            # API 接口
│   │   ├── login.post.ts
│   │   ├── register.post.ts
│   │   ├── users/
│   │   ├── posts/
│   │   ├── login-logs/
│   │   ├── settings/
│   │   └── stats/
│   ├── config/         # 配置文件
│   │   └── database.ts
│   ├── db/             # 数据库操作层
│   ├── middleware/     # 服务端中间件
│   │   └── api-auth.ts
│   └── utils/          # 工具函数
├── types/               # 类型定义
├── .env                 # 环境变量
├── nuxt.config.ts      # Nuxt 配置
├── package.json        # 项目配置
├── 后端.md             # 后端开发文档
└── 启动部署.md         # 部署文档
```

## API 接口

### 认证接口

- `POST /api/login` - 用户登录
- `POST /api/register` - 用户注册

### 用户管理

- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建用户
- `PUT /api/users/{id}` - 更新用户
- `DELETE /api/users/{id}` - 删除用户
- `PATCH /api/users/{id}/status` - 更新用户状态

### 文章管理

- `GET /api/posts` - 获取文章列表
- `GET /api/posts/{id}` - 获取文章详情
- `POST /api/posts` - 创建文章
- `PUT /api/posts/{id}` - 更新文章
- `DELETE /api/posts/{id}` - 删除文章

### 系统管理

- `GET /api/login-logs` - 获取登录日志
- `GET /api/settings` - 获取系统设置
- `PUT /api/settings` - 更新系统设置
- `GET /api/stats` - 获取统计数据

详细的 API 文档请参考 [后端.md](./后端.md)

## 开发指南

### 代码规范

- 使用 TypeScript 进行类型定义
- 遵循 ESLint 和 Prettier 配置
- 使用组合式 API（Composition API）

### 命名规范

- 文件名：kebab-case（如：`user-list.vue`）
- 组件名：PascalCase（如：`UserList.vue`）
- 变量名：camelCase（如：`userName`）
- 常量名：UPPER_SNAKE_CASE（如：`MAX_USERS`）

### 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 生成静态站点
npm run generate
```

## 部署

支持多种部署方式：

### Vercel 部署（推荐）

零配置、自动 HTTPS、全球 CDN

### Docker 部署

```bash
docker build -t nuxt-database .
docker run -d -p 3000:3000 --env-file .env nuxt-database
```

### 传统服务器部署

使用 PM2 进行进程管理：

```bash
npm run build
pm2 start ecosystem.config.js
```

详细的部署指南请参考 [启动部署.md](./启动部署.md)

## 数据库设计

### 数据表

- **users** - 用户表
- **posts** - 文章表
- **settings** - 系统设置表
- **login_logs** - 登录日志表

### 数据库配置

- 数据库名：`nuxt_app`
- 字符集：`utf8mb4`
- 排序规则：`utf8mb4_unicode_ci`

## 安全机制

- **密码加密** - bcrypt 10轮加盐
- **SQL 注入防护** - 参数化查询
- **身份认证** - JWT Token
- **会话管理** - 60分钟会话超时
- **输入验证** - 邮箱、用户名唯一性检查
- **权限控制** - 基于角色的访问控制

## 常见问题

### 数据库连接失败

检查 `.env` 文件中的数据库配置是否正确

### 端口被占用

```bash
lsof -ti:3000 | xargs kill -9
```

### Token 过期问题

检查系统设置中的 `sessionTimeout` 配置

更多问题请参考 [启动部署.md](./启动部署.md)

## 文档

- [后端开发文档](./后端.md) - 详细的 API 文档和数据库设计
- [启动部署文档](./启动部署.md) - 部署指南和常见问题

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

本项目仅供学习和研究使用。

## 联系方式

如有问题，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至开发团队

---

**最后更新时间**：2025-01-21
