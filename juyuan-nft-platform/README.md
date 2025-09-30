# 钜园农业农产品NFT预售平台

> 基于区块链技术的农产品NFT/RWA代币化平台，支持多国合规、国际化和多币种交易

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/solidity-^0.8.20-blue)](https://soliditylang.org/)

## 📋 项目概述

钜园农业NFT预售平台是一个完整的Web3应用，将优质农产品代币化为NFT，使消费者能够预购农产品，同时获得数字资产所有权和投资机会。

### 核心特性

- 🌾 **农产品NFT铸造** - ERC-721标准NFT代表实物农产品
- 🌍 **国际化支持** - 8种语言（中文、英语、泰语、马来语、越南语、日语、韩语）
- 💱 **多币种交易** - 10种法币 + 4种加密货币
- ⚖️ **多国合规** - 9个司法管辖区（新加坡、中国、香港、东南亚等）
- 🔗 **多链部署** - Ethereum、Polygon、Arbitrum
- 📊 **完整溯源** - 从种植到交付的全链条追踪
- 💳 **多支付方式** - 微信、支付宝、Stripe、加密货币
- 📱 **多平台应用** - Web、微信小程序、管理后台

## 🏗️ 技术架构

### 技术栈

#### 智能合约层
- **Solidity** 0.8.20
- **Hardhat** - 开发框架
- **OpenZeppelin** - 安全合约库
- **Ethers.js** - 区块链交互

#### 后端服务（微服务架构）
- **Node.js** 18+ / **Express.js** 4.18
- **TypeScript** 5.0
- **PostgreSQL** 15 - 主数据库
- **Redis** 7 - 缓存
- **Prisma** - ORM
- **Bull** - 消息队列

#### 前端应用
- **Next.js** 14 / **React** 18
- **TypeScript**
- **Tailwind CSS**
- **Zustand** - 状态管理
- **WalletConnect** v2 - Web3连接

#### 基础设施
- **Docker** & **Docker Compose**
- **Nginx** - 反向代理
- **GitHub Actions** - CI/CD

### 微服务列表

| 服务 | 端口 | 功能 |
|------|------|------|
| User Service | 3001 | 用户管理、KYC/AML |
| NFT Service | 3002 | NFT铸造和管理 |
| Presale Service | 3003 | 预售管理 |
| Payment Service | 3004 | 支付处理 |
| Traceability Service | 3005 | 供应链溯源 |
| Logistics Service | 3006 | 物流配送 |
| Compliance Service | 3007 | 合规监控 |
| Notification Service | 3008 | 通知推送 |
| i18n Service | 3009 | 国际化 |
| Currency Service | 3010 | 多币种 |

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** >= 24.0.0
- **PostgreSQL** 15
- **Redis** 7

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/zane0623/-.git
cd juyuan-nft-platform
```

#### 2. 安装依赖

```bash
# 安装所有依赖
npm run install:all

# 或分别安装
npm run install:contracts
npm run install:backend
npm run install:frontend
```

#### 3. 环境配置

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要的环境变量：

```env
# 数据库
DATABASE_URL=postgresql://juyuan_admin:password@localhost:5432/juyuan_nft
REDIS_URL=redis://localhost:6379

# 区块链
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here

# IPFS
IPFS_GATEWAY=https://gateway.pinata.cloud

# JWT
JWT_SECRET=your_jwt_secret_here

# 支付
STRIPE_SECRET_KEY=sk_test_...
WECHAT_APP_ID=wx...
WECHAT_APP_SECRET=...

# 汇率API
COINGECKO_API_KEY=...
CURRENCY_LAYER_API_KEY=...

# KYC/AML
JUMIO_API_KEY=...
ONFIDO_API_KEY=...
```

#### 4. 数据库迁移

```bash
npm run db:migrate
npm run db:seed
```

#### 5. 编译智能合约

```bash
cd contracts
npm run compile
```

#### 6. 部署智能合约（测试网）

```bash
npm run deploy:testnet
```

#### 7. 启动开发服务器

```bash
# 启动所有服务（前端+后端）
npm run dev

# 或分别启动
npm run dev:backend  # 后端服务
npm run dev:frontend # Web前端
npm run dev:admin    # 管理后台
```

### 使用Docker（推荐）

```bash
# 构建镜像
npm run docker:build

# 启动所有服务
npm run docker:up

# 查看日志
docker-compose -f deployment/docker/docker-compose.yml logs -f

# 停止服务
npm run docker:down
```

服务将在以下地址可用：

- **Web应用**: http://localhost
- **管理后台**: http://localhost/admin
- **API网关**: http://localhost/api
- **用户服务**: http://localhost:3001
- **NFT服务**: http://localhost:3002

## 📖 项目文档

完整的技术文档位于 `docs/` 目录：

- **[PRD - 产品需求文档](../钜园农业农产品NFT预售平台PRD.md)** - 产品规格和功能需求
- **[FIP - 功能实施计划](../钜园农业农产品NFT预售平台FIP.md)** - 技术实施细节
- **[合约文档](./contracts/README.md)** - 智能合约说明
- **[API文档](./docs/API.md)** - RESTful API规范
- **[部署指南](./docs/DEPLOYMENT.md)** - 生产环境部署

## 🔧 开发指南

### 项目结构

```
juyuan-nft-platform/
├── contracts/                 # 智能合约
│   ├── contracts/
│   │   ├── AgriProductNFT.sol        # 农产品NFT合约
│   │   ├── PresaleManager.sol        # 预售管理合约
│   │   └── EscrowManager.sol         # 托管合约
│   ├── scripts/              # 部署脚本
│   ├── test/                 # 合约测试
│   └── hardhat.config.ts     # Hardhat配置
├── backend/                  # 后端服务
│   ├── services/
│   │   ├── user/            # 用户服务
│   │   ├── nft/             # NFT服务
│   │   ├── payment/         # 支付服务
│   │   ├── i18n/            # 国际化服务
│   │   ├── currency/        # 多币种服务
│   │   └── compliance/      # 合规服务
│   ├── shared/              # 共享模块
│   └── scripts/             # 脚本工具
├── frontend/                # 前端应用
│   ├── web/                 # Web应用
│   ├── miniprogram/         # 微信小程序
│   └── admin/               # 管理后台
├── deployment/              # 部署配置
│   ├── docker/              # Docker配置
│   └── kubernetes/          # K8s配置
├── docs/                    # 文档
└── scripts/                 # 项目脚本
```

### 开发流程

#### 1. 智能合约开发

```bash
cd contracts

# 编译合约
npm run compile

# 运行测试
npm run test

# 代码覆盖率
npm run coverage

# 部署到测试网
npm run deploy:testnet
```

#### 2. 后端服务开发

```bash
cd backend/services/user  # 或其他服务

# 启动开发模式
npm run dev

# 运行测试
npm run test

# 构建
npm run build
```

#### 3. 前端开发

```bash
cd frontend/web

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 测试

```bash
# 运行所有测试
npm test

# 智能合约测试
npm run test:contracts

# 后端测试
npm run test:backend

# 前端测试
npm run test:frontend
```

### 代码规范

项目使用以下代码规范工具：

- **ESLint** - JavaScript/TypeScript代码检查
- **Prettier** - 代码格式化
- **Solhint** - Solidity代码检查

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

## 🌐 国际化支持

### 支持语言

| 语言 | 代码 | 状态 |
|------|------|------|
| 简体中文 | zh-CN | ✅ 已支持 |
| 繁体中文 | zh-TW | ✅ 已支持 |
| 英语 | en-US | ✅ 已支持 |
| 泰语 | th-TH | 🚧 开发中 |
| 马来语 | ms-MY | 🚧 开发中 |
| 越南语 | vi-VN | 🚧 开发中 |
| 日语 | ja-JP | 📅 计划中 |
| 韩语 | ko-KR | 📅 计划中 |

### 支持货币

**法币**：USD, SGD, CNY, HKD, THB, MYR, VND, JPY, KRW, EUR

**加密货币**：ETH, USDT, USDC, BTC

### 支持支付方式

- **中国**：微信支付、支付宝、银联
- **新加坡**：PayNow、GrabPay
- **香港**：PayMe、八达通
- **泰国**：PromptPay
- **马来西亚**：Touch 'n Go
- **越南**：MoMo
- **国际**：Stripe、PayPal

## ⚖️ 合规框架

平台支持以下司法管辖区的合规要求：

| 地区 | 监管机构 | 牌照类型 | 状态 |
|------|---------|---------|------|
| 🇸🇬 新加坡 | MAS | PSA牌照 | 📅 申请中 |
| 🇨🇳 中国 | PBOC/CAC | ICP备案 | 📅 申请中 |
| 🇭🇰 香港 | SFC | 公司注册 | 📅 申请中 |
| 🇹🇭 泰国 | Thai SEC | 数字资产牌照 | 📅 计划中 |
| 🇲🇾 马来西亚 | SC Malaysia | 交易所注册 | 📅 计划中 |

### KYC/AML集成

- **Jumio** - 身份验证
- **Onfido** - 人脸识别
- **Chainalysis** - 区块链交易分析
- **Elliptic** - 风险评估

## 📊 部署

### 生产环境部署

详细的部署指南请参考 [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

#### 使用Docker Compose

```bash
# 生产环境配置
cp .env.production .env

# 构建镜像
docker-compose -f deployment/docker/docker-compose.yml build

# 启动服务
docker-compose -f deployment/docker/docker-compose.yml up -d

# 查看状态
docker-compose ps
```

#### 使用Kubernetes

```bash
# 应用配置
kubectl apply -f deployment/kubernetes/

# 查看Pod状态
kubectl get pods -n juyuan-nft

# 查看服务
kubectl get services -n juyuan-nft
```

### CI/CD

项目使用GitHub Actions进行自动化部署：

- **Push到main分支** → 自动测试 → 构建Docker镜像 → 部署到生产环境
- **Pull Request** → 自动测试 → 代码检查

## 🤝 贡献指南

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。

### 贡献流程

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件

## 👥 团队

- **产品团队** - 产品设计和需求管理
- **技术团队** - 技术实现和架构
- **合规团队** - 多国合规管理
- **运营团队** - 平台运营和市场推广

## 📞 联系方式

- **官网**: https://juyuan-nft.com
- **邮箱**: tech@juyuan-agri.com
- **GitHub**: https://github.com/zane0623/-

## 🙏 鸣谢

本项目使用了以下开源项目：

- [OpenZeppelin](https://openzeppelin.com/) - 智能合约库
- [Hardhat](https://hardhat.org/) - 以太坊开发环境
- [Next.js](https://nextjs.org/) - React框架
- [Prisma](https://www.prisma.io/) - 数据库ORM
- [Redis](https://redis.io/) - 缓存系统

---

**由钜园农业技术团队精心打造 🌾** 

**Powered by Blockchain Technology 🔗** 