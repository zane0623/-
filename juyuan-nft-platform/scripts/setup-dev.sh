#!/bin/bash

# 钜园农业NFT平台 - 开发环境设置脚本
# 用法: ./scripts/setup-dev.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo ""
echo "=========================================="
echo "   钜园农业NFT平台 - 开发环境设置"
echo "=========================================="
echo ""

# 1. 检查Node.js版本
print_info "检查 Node.js 版本..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        print_success "Node.js 版本: $(node -v) ✓"
    else
        print_error "Node.js 版本过低，需要 >= 18.0.0"
        exit 1
    fi
else
    print_error "Node.js 未安装"
    exit 1
fi

# 2. 检查npm版本
print_info "检查 npm 版本..."
if command -v npm &> /dev/null; then
    print_success "npm 版本: $(npm -v) ✓"
else
    print_error "npm 未安装"
    exit 1
fi

# 3. 检查Docker
print_info "检查 Docker..."
if command -v docker &> /dev/null; then
    print_success "Docker 版本: $(docker --version | awk '{print $3}') ✓"
else
    print_warning "Docker 未安装（可选，用于容器化部署）"
fi

# 4. 安装根目录依赖
print_info "安装根目录依赖..."
cd "$PROJECT_ROOT"
npm install

# 5. 安装智能合约依赖
print_info "安装智能合约依赖..."
cd "$PROJECT_ROOT/contracts"
npm install

# 6. 编译智能合约
print_info "编译智能合约..."
npm run compile

# 7. 安装后端服务依赖
print_info "安装后端服务依赖..."

services=("user" "nft" "payment" "logistics" "presale" "notification" "compliance" "currency" "i18n" "traceability")

for service in "${services[@]}"; do
    service_path="$PROJECT_ROOT/backend/services/$service"
    if [ -d "$service_path" ] && [ -f "$service_path/package.json" ]; then
        print_info "  安装 $service 服务依赖..."
        cd "$service_path"
        npm install 2>/dev/null || print_warning "  $service 服务安装失败（可能缺少package.json）"
    fi
done

# 8. 安装前端依赖
print_info "安装前端依赖..."
cd "$PROJECT_ROOT/frontend/web"
if [ -f "package.json" ]; then
    npm install
    print_success "前端依赖安装完成"
else
    print_warning "前端 package.json 不存在"
fi

# 9. 创建环境变量文件
print_info "创建环境变量文件..."
cd "$PROJECT_ROOT"

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "已创建 .env 文件（请编辑配置）"
    else
        cat > .env << 'EOF'
# 数据库配置
DATABASE_URL=postgresql://juyuan_admin:password@localhost:5432/juyuan_nft
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your_dev_jwt_secret_here

# 区块链配置
BLOCKCHAIN_RPC_URL=http://localhost:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# NFT合约地址（部署后填写）
NFT_CONTRACT_ADDRESS=
PRESALE_CONTRACT_ADDRESS=
ESCROW_CONTRACT_ADDRESS=

# IPFS配置
IPFS_GATEWAY=https://gateway.pinata.cloud
PINATA_API_KEY=
PINATA_SECRET_KEY=

# 开发环境
NODE_ENV=development
EOF
        print_success "已创建默认 .env 文件"
    fi
else
    print_warning ".env 文件已存在，跳过创建"
fi

# 10. 生成Prisma客户端
print_info "生成 Prisma 客户端..."
cd "$PROJECT_ROOT/backend"
if [ -f "prisma/schema.prisma" ]; then
    npx prisma generate 2>/dev/null || print_warning "Prisma生成失败"
fi

# 11. 启动本地区块链（Hardhat）
print_info "检查本地区块链..."
cd "$PROJECT_ROOT/contracts"
echo "  运行 'npx hardhat node' 可启动本地区块链"

# 完成
echo ""
echo "=========================================="
print_success "开发环境设置完成!"
echo "=========================================="
echo ""
echo "下一步操作:"
echo ""
echo "  1. 编辑 .env 文件，配置必要的环境变量"
echo ""
echo "  2. 启动数据库和Redis:"
echo "     docker-compose -f deployment/docker/docker-compose.yml up -d postgres redis"
echo ""
echo "  3. 运行数据库迁移:"
echo "     cd backend && npx prisma migrate dev"
echo ""
echo "  4. 启动本地区块链:"
echo "     cd contracts && npx hardhat node"
echo ""
echo "  5. 部署智能合约:"
echo "     cd contracts && npm run deploy:testnet"
echo ""
echo "  6. 启动后端服务:"
echo "     cd backend/services/user && npm run dev"
echo ""
echo "  7. 启动前端:"
echo "     cd frontend/web && npm run dev"
echo ""
echo "  访问 http://localhost:3000 查看应用"
echo ""

