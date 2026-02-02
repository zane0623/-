#!/bin/bash

# Railway 部署脚本
# 使用方法: ./scripts/deploy-railway.sh [service-name]

set -e

SERVICE_NAME=${1:-"user"}
SERVICE_DIR="backend/services/$SERVICE_NAME"

if [ ! -d "$SERVICE_DIR" ]; then
  echo "❌ 错误: 服务目录不存在: $SERVICE_DIR"
  exit 1
fi

echo "🚀 开始部署 $SERVICE_NAME 服务..."

cd "$SERVICE_DIR"

# 检查Railway CLI是否安装
if ! command -v railway &> /dev/null; then
  echo "📦 安装Railway CLI..."
  npm install -g @railway/cli
fi

# 检查是否已登录
if ! railway whoami &> /dev/null; then
  echo "🔐 请先登录Railway..."
  railway login
fi

# 初始化Railway项目（如果还没有）
if [ ! -f ".railway" ]; then
  echo "📝 初始化Railway项目..."
  railway init
fi

# 部署
echo "🚢 部署到Railway..."
railway up

echo "✅ 部署完成！"
echo "📊 查看日志: railway logs"
echo "🌐 查看服务: railway open"


