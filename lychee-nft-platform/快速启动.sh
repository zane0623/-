#!/bin/bash

# 钜园农业NFT预售平台 - 快速启动脚本
# Juyuan Agriculture NFT Presale Platform - Quick Start Script

echo "🚀 钜园农业NFT预售平台 - 快速启动"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查Node.js
echo "📦 检查环境..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装，请先安装 Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v)${NC}"

# 检查Docker（可选）
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker $(docker -v | cut -d ' ' -f 3)${NC}"
else
    echo -e "${YELLOW}⚠️  Docker 未安装（可选，用于数据库）${NC}"
fi

echo ""
echo "📥 安装依赖..."
echo ""

# 安装根依赖
echo "正在安装根依赖..."
npm install --silent

# 安装后端依赖
echo "正在安装后端依赖..."
cd backend && npm install --silent && cd ..

# 安装前端依赖
echo "正在安装前端依赖..."
cd frontend && npm install --silent && cd ..

# 安装合约依赖
echo "正在安装合约依赖..."
cd contracts && npm install --silent && cd ..

echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# 检查环境变量
echo "🔧 检查环境变量..."
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env 不存在${NC}"
    echo "请根据 backend/.env.example 创建配置文件"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env.local 不存在${NC}"
    echo "请根据 frontend/.env.example 创建配置文件"
fi

echo ""
echo "🗄️  数据库设置..."
echo ""
echo "选择数据库启动方式："
echo "  1) 使用 Docker 启动 PostgreSQL 和 Redis（推荐）"
echo "  2) 使用本地已安装的数据库"
echo "  3) 跳过数据库设置"
echo ""
read -p "请选择 [1-3]: " db_choice

case $db_choice in
    1)
        if command -v docker &> /dev/null; then
            echo "正在使用 Docker 启动数据库..."
            cd deployment/docker
            docker-compose up -d postgres redis
            cd ../..
            echo -e "${GREEN}✅ 数据库已启动${NC}"
            sleep 3
        else
            echo -e "${RED}❌ Docker 未安装，请先安装 Docker${NC}"
            exit 1
        fi
        ;;
    2)
        echo -e "${YELLOW}使用本地数据库，请确保 PostgreSQL 和 Redis 已启动${NC}"
        ;;
    3)
        echo "跳过数据库设置"
        ;;
    *)
        echo -e "${RED}无效选择${NC}"
        exit 1
        ;;
esac

# 初始化数据库
if [ $db_choice -ne 3 ]; then
    echo ""
    echo "🔄 初始化数据库..."
    cd backend
    
    echo "生成 Prisma Client..."
    npx prisma generate
    
    echo "运行数据库迁移..."
    npx prisma migrate dev --name init
    
    echo -e "${GREEN}✅ 数据库初始化完成${NC}"
    cd ..
fi

echo ""
echo "🎉 安装完成！"
echo ""
echo "=================================="
echo "📚 快速指南："
echo "=================================="
echo ""
echo "启动开发服务器："
echo "  npm run dev             # 同时启动前后端"
echo "  npm run dev:backend     # 只启动后端"
echo "  npm run dev:frontend    # 只启动前端"
echo ""
echo "访问地址："
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:5000"
echo "  API:  http://localhost:5000/api"
echo ""
echo "数据库管理："
echo "  npx prisma studio       # 可视化数据库管理"
echo ""
echo "部署智能合约："
echo "  cd contracts"
echo "  npx hardhat compile"
echo "  npx hardhat run scripts/deploy.ts --network bscTestnet"
echo ""
echo "=================================="
echo ""
read -p "是否现在启动开发服务器？[y/N]: " start_now

if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ]; then
    echo ""
    echo "🚀 启动开发服务器..."
    npm run dev
else
    echo ""
    echo "稍后运行 'npm run dev' 启动开发服务器"
    echo ""
fi

echo -e "${GREEN}✨ 祝您开发愉快！${NC}"

