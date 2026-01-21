#!/bin/bash

# 数据库初始化脚本
# 使用方法: chmod +x setup.sh && ./setup.sh

echo "==================================="
echo "MySQL 数据库初始化脚本"
echo "==================================="
echo ""

# 检查是否存在 .env 文件
if [ ! -f .env ]; then
    echo "创建 .env 配置文件..."
    cp .env.example .env
    echo "✓ .env 文件已创建"
    echo ""
    echo "⚠️  请先编辑 .env 文件，填入你的 MySQL 配置信息："
    echo "   - DB_HOST (默认: localhost)"
    echo "   - DB_PORT (默认: 3306)"
    echo "   - DB_USER (默认: root)"
    echo "   - DB_PASSWORD (必填)"
    echo "   - DB_NAME (默认: nuxt_app)"
    echo ""
    read -p "配置完成后按回车继续..."
fi

# 读取 .env 配置
source .env

echo ""
echo "数据库配置："
echo "  主机: ${DB_HOST:-localhost}"
echo "  端口: ${DB_PORT:-3306}"
echo "  用户: ${DB_USER:-root}"
echo "  数据库: ${DB_NAME:-nuxt_app}"
echo ""

# 测试 MySQL 连接
echo "测试 MySQL 连接..."
if mysql -h"${DB_HOST:-localhost}" -P"${DB_PORT:-3306}" -u"${DB_USER:-root}" -p"${DB_PASSWORD}" -e "SELECT 1;" &> /dev/null; then
    echo "✓ MySQL 连接成功"
else
    echo "✗ MySQL 连接失败"
    echo "请检查 .env 文件中的数据库配置"
    exit 1
fi

# 创建数据库和表
echo ""
echo "创建数据库和表结构..."
if mysql -h"${DB_HOST:-localhost}" -P"${DB_PORT:-3306}" -u"${DB_USER:-root}" -p"${DB_PASSWORD}" < database/init.sql 2>/dev/null; then
    echo "✓ 数据库初始化成功"
else
    echo "✗ 数据库初始化失败"
    exit 1
fi

# 生成管理员密码（可选）
echo ""
read -p "是否生成新的管理员密码？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "生成加密密码..."
    node database/generate-password.js
    echo ""
    echo "请将上面的 SQL 语句复制到 MySQL 中执行以更新管理员密码"
fi

echo ""
echo "==================================="
echo "✓ 初始化完成！"
echo "==================================="
echo ""
echo "下一步："
echo "1. 运行 'npm run dev' 启动开发服务器"
echo "2. 使用 admin/123456 登录（请及时修改密码）"
echo ""
echo "详细文档请查看: database/README.md"
echo ""
