#!/bin/bash

# Lychee NFT Platform Docker 快速设置脚本

set -e

echo "🍈 欢迎使用荔枝 NFT 平台 Docker 快速设置"
echo "=========================================="

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cp env.example .env
    echo "⚠️  请编辑 .env 文件，填入实际的配置值"
    echo "   特别是 JWT_SECRET 和 CONTRACT_ADDRESS"
fi

# 检查 SSL 证书
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    echo "🔐 生成自签名 SSL 证书（仅用于开发环境）..."
    cd ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout key.pem \
        -out cert.pem \
        -subj "/C=CN/ST=Guangdong/L=Guangzhou/O=Lychee NFT/CN=localhost" \
        2>/dev/null
    cd ..
    echo "✅ SSL 证书已生成"
else
    echo "✅ SSL 证书已存在"
fi

# 询问是否启动服务
read -p "是否现在启动所有服务？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 启动服务..."
    docker-compose up -d
    
    echo ""
    echo "=========================================="
    echo "✅ 服务启动成功！"
    echo ""
    echo "📍 访问地址："
    echo "   前端应用: http://localhost"
    echo "   后端 API: http://localhost/api"
    echo "   数据库:   localhost:5432"
    echo "   Redis:    localhost:6379"
    echo ""
    echo "📊 查看日志: docker-compose logs -f"
    echo "🛑 停止服务: docker-compose down"
    echo "=========================================="
else
    echo ""
    echo "配置完成！使用以下命令启动服务："
    echo "  docker-compose up -d"
fi
