#!/bin/bash

# 钜园农业NFT预售平台 - 完整启动脚本
# ========================================

set -e  # 遇到错误立即退出

echo "🚀 开始启动钜园农业NFT预售平台..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  钜园农业NFT预售平台 - 启动向导${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================
# 1. 检查依赖
# ============================================
echo -e "${YELLOW}[1/6] 检查系统依赖...${NC}"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未安装Node.js${NC}"
    echo "请访问 https://nodejs.org 安装Node.js"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 未安装npm${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v)${NC}"

# 检查PostgreSQL或Docker
POSTGRES_METHOD="none"

if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL (本地安装)${NC}"
    POSTGRES_METHOD="local"
elif command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker (将使用容器)${NC}"
    POSTGRES_METHOD="docker"
else
    echo -e "${YELLOW}⚠️  未找到PostgreSQL或Docker${NC}"
    echo ""
    echo "选择安装方式："
    echo "  1) 使用Homebrew安装PostgreSQL: brew install postgresql@15"
    echo "  2) 使用Docker Desktop: https://www.docker.com/products/docker-desktop"
    echo "  3) 跳过数据库（仅运行前端）"
    echo ""
    read -p "请选择 (1/2/3): " choice
    
    case $choice in
        1)
            echo "执行: brew install postgresql@15"
            if command -v brew &> /dev/null; then
                brew install postgresql@15
                brew services start postgresql@15
                POSTGRES_METHOD="local"
            else
                echo -e "${RED}未安装Homebrew${NC}"
                exit 1
            fi
            ;;
        2)
            echo "请先安装Docker Desktop，然后重新运行此脚本"
            exit 1
            ;;
        3)
            echo -e "${YELLOW}将仅运行前端（后端功能不可用）${NC}"
            POSTGRES_METHOD="skip"
            ;;
        *)
            echo "无效选择"
            exit 1
            ;;
    esac
fi

echo ""

# ============================================
# 2. 安装项目依赖
# ============================================
echo -e "${YELLOW}[2/6] 安装项目依赖...${NC}"

if [ ! -d "node_modules" ]; then
    echo "安装根目录依赖..."
    npm install
else
    echo -e "${GREEN}✅ 根目录依赖已安装${NC}"
fi

# 前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "安装前端依赖..."
    cd frontend && npm install && cd ..
else
    echo -e "${GREEN}✅ 前端依赖已安装${NC}"
fi

# 后端依赖
if [ ! -d "backend/node_modules" ]; then
    echo "安装后端依赖..."
    cd backend && npm install && cd ..
else
    echo -e "${GREEN}✅ 后端依赖已安装${NC}"
fi

echo ""

# ============================================
# 3. 配置数据库
# ============================================
if [ "$POSTGRES_METHOD" != "skip" ]; then
    echo -e "${YELLOW}[3/6] 配置数据库...${NC}"
    
    if [ "$POSTGRES_METHOD" = "docker" ]; then
        echo "启动PostgreSQL Docker容器..."
        
        # 检查容器是否已存在
        if docker ps -a --format '{{.Names}}' | grep -q '^lychee-postgres$'; then
            echo "容器已存在，启动中..."
            docker start lychee-postgres || true
        else
            echo "创建新容器..."
            docker run -d \
                --name lychee-postgres \
                -e POSTGRES_PASSWORD=password \
                -e POSTGRES_DB=lychee_nft \
                -p 5432:5432 \
                postgres:15-alpine
        fi
        
        echo "等待PostgreSQL启动..."
        sleep 5
        
        DATABASE_URL="postgresql://postgres:password@localhost:5432/lychee_nft?schema=public"
        
    elif [ "$POSTGRES_METHOD" = "local" ]; then
        echo "使用本地PostgreSQL..."
        
        # 创建数据库（如果不存在）
        if ! psql -lqt | cut -d \| -f 1 | grep -qw lychee_nft; then
            echo "创建数据库 lychee_nft..."
            createdb lychee_nft || true
        fi
        
        # 获取当前用户
        DB_USER=$(whoami)
        DATABASE_URL="postgresql://${DB_USER}@localhost:5432/lychee_nft?schema=public"
    fi
    
    # 更新backend/.env
    cat > backend/.env << EOF
# 服务器配置
NODE_ENV=development
PORT=3001
API_PREFIX=/api

# 数据库配置
DATABASE_URL="${DATABASE_URL}"

# JWT配置
JWT_SECRET=super-secret-jwt-key-for-development-only-change-in-production-32chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=super-secret-refresh-key-for-development-only-32chars
JWT_REFRESH_EXPIRES_IN=30d

# 区块链配置
BLOCKCHAIN_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
BLOCKCHAIN_CHAIN_ID=97
PRIVATE_KEY=

# CORS
CORS_ORIGIN=http://localhost:3000
EOF
    
    echo -e "${GREEN}✅ 数据库配置完成${NC}"
    echo ""
    
    # ============================================
    # 4. 初始化数据库
    # ============================================
    echo -e "${YELLOW}[4/6] 初始化数据库...${NC}"
    
    cd backend
    
    # 生成Prisma Client
    echo "生成Prisma Client..."
    npx prisma generate
    
    # 运行数据库迁移
    echo "运行数据库迁移..."
    npx prisma migrate dev --name init --skip-seed 2>/dev/null || {
        echo -e "${YELLOW}⚠️  迁移可能已存在，继续...${NC}"
    }
    
    cd ..
    echo -e "${GREEN}✅ 数据库初始化完成${NC}"
    echo ""
else
    echo -e "${YELLOW}[3/6] 跳过数据库配置${NC}"
    echo -e "${YELLOW}[4/6] 跳过数据库初始化${NC}"
    echo ""
fi

# ============================================
# 5. 停止旧进程
# ============================================
echo -e "${YELLOW}[5/6] 清理旧进程...${NC}"

# 停止占用3000端口的进程
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "端口3000未被占用"

# 停止占用3001端口的进程
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "端口3001未被占用"

echo -e "${GREEN}✅ 清理完成${NC}"
echo ""

# ============================================
# 6. 启动服务
# ============================================
echo -e "${YELLOW}[6/6] 启动服务...${NC}"
echo ""

# 创建日志目录
mkdir -p logs

# 启动前端
echo "启动前端服务 (端口 3000)..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✅ 前端已启动 (PID: $FRONTEND_PID)${NC}"

# 启动后端（如果有数据库）
if [ "$POSTGRES_METHOD" != "skip" ]; then
    echo "启动后端服务 (端口 3001)..."
    cd backend
    npm run dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    echo -e "${GREEN}✅ 后端已启动 (PID: $BACKEND_PID)${NC}"
else
    echo -e "${YELLOW}⚠️  后端未启动（无数据库）${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 启动完成！${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 等待服务启动
echo "等待服务启动..."
sleep 5

# 检查服务状态
echo ""
echo -e "${BLUE}📊 服务状态:${NC}"
echo ""

# 检查前端
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 前端:${NC} http://localhost:3000"
else
    echo -e "${YELLOW}⏳ 前端:${NC} 正在启动中... (稍后访问)"
fi

# 检查后端
if [ "$POSTGRES_METHOD" != "skip" ]; then
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 后端:${NC} http://localhost:3001"
    else
        echo -e "${YELLOW}⏳ 后端:${NC} 正在启动中... (稍后访问)"
    fi
fi

# 数据库状态
if [ "$POSTGRES_METHOD" = "docker" ]; then
    echo -e "${GREEN}✅ 数据库:${NC} PostgreSQL (Docker容器)"
elif [ "$POSTGRES_METHOD" = "local" ]; then
    echo -e "${GREEN}✅ 数据库:${NC} PostgreSQL (本地)"
else
    echo -e "${YELLOW}⚠️  数据库:${NC} 未启动"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 访问提示
echo -e "${GREEN}🌐 立即访问:${NC}"
echo ""
echo "  前端网站: ${BLUE}http://localhost:3000${NC}"
if [ "$POSTGRES_METHOD" != "skip" ]; then
    echo "  后端API:  ${BLUE}http://localhost:3001${NC}"
fi
echo ""

# 日志查看
echo -e "${BLUE}📝 查看日志:${NC}"
echo ""
echo "  前端日志: tail -f logs/frontend.log"
if [ "$POSTGRES_METHOD" != "skip" ]; then
    echo "  后端日志: tail -f logs/backend.log"
fi
echo ""

# 停止服务
echo -e "${BLUE}⏹️  停止服务:${NC}"
echo ""
echo "  停止所有: lsof -ti:3000,3001 | xargs kill -9"
if [ "$POSTGRES_METHOD" = "docker" ]; then
    echo "  停止数据库: docker stop lychee-postgres"
fi
echo ""

# 保存PID
echo $FRONTEND_PID > logs/frontend.pid
if [ "$POSTGRES_METHOD" != "skip" ]; then
    echo $BACKEND_PID > logs/backend.pid
fi

echo -e "${GREEN}✨ 项目运行中！祝您开发愉快！${NC}"
echo ""

# 可选：打开浏览器
read -t 5 -p "是否自动打开浏览器? (Y/n): " open_browser || open_browser="y"
if [[ $open_browser =~ ^[Yy]$ ]] || [[ -z $open_browser ]]; then
    echo "打开浏览器..."
    sleep 2
    open http://localhost:3000 2>/dev/null || \
    xdg-open http://localhost:3000 2>/dev/null || \
    echo "请手动打开: http://localhost:3000"
fi


