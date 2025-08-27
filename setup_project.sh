#!/bin/bash

# EduBoost RWA 项目初始化脚本
echo "🚀 开始初始化 EduBoost RWA 项目..."

# 创建项目目录结构
echo "📁 创建项目目录结构..."
mkdir -p eduboost-rwa/{frontend,backend,blockchain,docs}
cd eduboost-rwa

# 初始化前端项目
echo "⚛️ 初始化前端项目..."
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

# 安装前端依赖
echo "📦 安装前端依赖..."
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets
npm install zustand @tanstack/react-query axios
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install @hookform/resolvers react-hook-form zod
npm install recharts @types/recharts

# 初始化后端项目
echo "🔧 初始化后端项目..."
cd ../backend
npm init -y

# 安装后端依赖
echo "📦 安装后端依赖..."
npm install express typescript @types/node @types/express
npm install prisma @prisma/client bcryptjs jsonwebtoken
npm install cors helmet morgan dotenv
npm install @solana/web3.js @project-serum/anchor
npm install redis ioredis
npm install multer @types/multer
npm install joi @types/joi
npm install nodemailer @types/nodemailer

# 开发依赖
npm install -D @types/bcryptjs @types/jsonwebtoken
npm install -D @types/cors @types/morgan
npm install -D ts-node nodemon
npm install -D jest @types/jest supertest @types/supertest

# 初始化 Prisma
echo "🗄️ 初始化数据库..."
npx prisma init

# 初始化区块链项目
echo "⛓️ 初始化区块链项目..."
cd ../blockchain
npm init -y
npm install @project-serum/anchor
npm install -D @types/node typescript

# 创建 Anchor 项目
anchor init eduboost --yes
cd eduboost

# 返回根目录
cd ../..

# 创建环境配置文件
echo "⚙️ 创建环境配置文件..."
cat > .env.example << EOF
# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/eduboost"
REDIS_URL="redis://localhost:6379"

# JWT配置
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Solana配置
SOLANA_RPC_URL="https://api.devnet.solana.com"
PROGRAM_ID="your-program-id"
GLOBAL_STATE_ADDRESS="your-global-state-address"

# 邮件配置
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# 文件存储
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="eduboost-files"

# 应用配置
NODE_ENV="development"
PORT=4000
FRONTEND_URL="http://localhost:3000"
EOF

# 创建 Docker 配置
echo "🐳 创建 Docker 配置..."
cat > docker-compose.yml << EOF
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000
      - NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/eduboost
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=production

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=eduboost
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  redis_data:
EOF

# 创建 package.json 脚本
echo "📝 创建根目录 package.json..."
cat > package.json << EOF
{
  "name": "eduboost-rwa",
  "version": "1.0.0",
  "description": "EduBoost RWA 全栈式学业支持平台",
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "test": "npm run test:frontend && npm run test:backend",
    "test:frontend": "cd frontend && npm test",
    "test:backend": "cd backend && npm test",
    "db:migrate": "cd backend && npx prisma migrate dev",
    "db:generate": "cd backend && npx prisma generate",
    "db:studio": "cd backend && npx prisma studio",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:build": "docker-compose build",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install && cd ../blockchain && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "keywords": ["education", "blockchain", "rwa", "solana"],
  "author": "EduBoost Team",
  "license": "MIT"
}
EOF

# 创建 README
echo "📖 创建 README..."
cat > README.md << EOF
# EduBoost RWA 全栈式学业支持平台

## 项目概述

EduBoost是一个基于RWA（Real World Asset）技术的全栈式学业支持平台，旨在为高中生提供学术提升、大学申请和心理健康支持的综合服务。

## 技术栈

- **前端**: React 18 + TypeScript + Next.js 14 + Tailwind CSS
- **后端**: Node.js + Express.js + TypeScript + PostgreSQL + Redis
- **区块链**: Solana + Anchor Framework + Metaplex
- **部署**: Docker + AWS/Vercel

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose

### 安装步骤

1. 克隆项目
\`\`\`bash
git clone <repository-url>
cd eduboost-rwa
\`\`\`

2. 安装依赖
\`\`\`bash
npm run install:all
\`\`\`

3. 配置环境变量
\`\`\`bash
cp .env.example .env
# 编辑 .env 文件，填入相应的配置
\`\`\`

4. 启动数据库
\`\`\`bash
npm run docker:up
\`\`\`

5. 运行数据库迁移
\`\`\`bash
npm run db:migrate
\`\`\`

6. 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

## 项目结构

\`\`\`
eduboost-rwa/
├── frontend/          # Next.js 前端应用
├── backend/           # Express.js 后端 API
├── blockchain/        # Solana 智能合约
├── docs/             # 项目文档
├── docker-compose.yml # Docker 配置
└── README.md         # 项目说明
\`\`\`

## 功能模块

- 用户认证与授权系统
- 智能学习系统
- 大学申请管理系统
- 心理健康监护系统
- RWA代币经济系统

## 开发指南

详细的开发指南请参考 \`docs/\` 目录下的文档：

- [需求文档](./docs/EduBoost_RWA_详细需求文档.md)
- [技术实现指南](./docs/EduBoost_技术实现指南.md)

## 部署

### 开发环境
\`\`\`bash
npm run dev
\`\`\`

### 生产环境
\`\`\`bash
npm run build
npm run docker:up
\`\`\`

## 测试

\`\`\`bash
npm run test
\`\`\`

## 贡献指南

1. Fork 项目
2. 创建功能分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your.email@example.com]
- 项目链接: [https://github.com/your-username/eduboost-rwa]
EOF

# 创建 .gitignore
echo "🚫 创建 .gitignore..."
cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
.next/
out/
dist/
build/

# Database
*.db
*.sqlite

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Docker
.dockerignore

# Solana
target/
**/*.rs.bk
Cargo.lock

# Anchor
.anchor/
target/
**/*.rs.bk
Cargo.lock
EOF

# 创建开发脚本
echo "🔧 创建开发脚本..."
mkdir -p scripts

cat > scripts/dev.sh << 'EOF'
#!/bin/bash

echo "🚀 启动 EduBoost 开发环境..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 启动数据库服务
echo "🗄️ 启动数据库服务..."
docker-compose up -d postgres redis

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 运行数据库迁移
echo "🔄 运行数据库迁移..."
cd backend
npx prisma migrate dev
npx prisma generate
cd ..

# 启动开发服务器
echo "⚡ 启动开发服务器..."
concurrently \
    "cd frontend && npm run dev" \
    "cd backend && npm run dev" \
    --names "frontend,backend" \
    --prefix-colors "blue,green"
EOF

chmod +x scripts/dev.sh

# 创建部署脚本
cat > scripts/deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 部署 EduBoost 到生产环境..."

# 构建项目
echo "🔨 构建项目..."
npm run build

# 构建 Docker 镜像
echo "🐳 构建 Docker 镜像..."
docker-compose build

# 停止现有服务
echo "🛑 停止现有服务..."
docker-compose down

# 启动生产服务
echo "⚡ 启动生产服务..."
docker-compose up -d

echo "✅ 部署完成！"
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:4000"
EOF

chmod +x scripts/deploy.sh

# 创建测试脚本
cat > scripts/test.sh << 'EOF'
#!/bin/bash

echo "🧪 运行测试..."

# 运行前端测试
echo "⚛️ 运行前端测试..."
cd frontend
npm test -- --watchAll=false
cd ..

# 运行后端测试
echo "🔧 运行后端测试..."
cd backend
npm test
cd ..

echo "✅ 测试完成！"
EOF

chmod +x scripts/test.sh

echo "✅ 项目初始化完成！"
echo ""
echo "📋 下一步操作："
echo "1. 复制环境配置文件: cp .env.example .env"
echo "2. 编辑 .env 文件，填入相应的配置"
echo "3. 启动开发环境: npm run dev"
echo "4. 或者使用脚本: ./scripts/dev.sh"
echo ""
echo "📚 查看文档："
echo "- 需求文档: docs/EduBoost_RWA_详细需求文档.md"
echo "- 技术指南: docs/EduBoost_技术实现指南.md"
echo ""
echo "🎉 开始开发吧！" 