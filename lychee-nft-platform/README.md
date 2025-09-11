# 钜园农业恐龙蛋荔枝NFT/RWA预售平台

## 项目概述

钜园农业恐龙蛋荔枝NFT/RWA预售平台是一个基于区块链技术的农产品数字化预售系统，旨在通过NFT/RWA技术实现恐龙蛋荔枝的数字化预售，打造"从农场到餐桌"的透明供应链。

## 技术栈

- **前端**: React 18 + TypeScript + Next.js 14 + Tailwind CSS
- **后端**: Node.js + Express.js + TypeScript + PostgreSQL + Redis
- **区块链**: Polygon + Solidity + OpenZeppelin
- **部署**: Docker + AWS/Vercel

## 项目结构

```
lychee-nft-platform/
├── docs/                    # 项目文档
│   ├── technical/           # 技术文档
│   ├── compliance/          # 合规文档
│   └── business/            # 商业文档
├── contracts/               # 智能合约
│   ├── src/                 # 合约源码
│   ├── test/                # 合约测试
│   └── artifacts/           # 编译产物
├── frontend/                # 前端应用
│   ├── src/                 # 源码
│   ├── public/              # 静态资源
│   └── components/          # 组件
├── backend/                 # 后端API
│   ├── src/                 # 源码
│   ├── config/              # 配置
│   └── models/              # 数据模型
├── scripts/                 # 脚本工具
│   ├── deploy/              # 部署脚本
│   ├── test/                # 测试脚本
│   └── utils/               # 工具脚本
└── deployment/              # 部署配置
    ├── docker/              # Docker配置
    ├── kubernetes/          # K8s配置
    └── terraform/           # 基础设施配置
```

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/zane0623/-.git
cd lychee-nft-platform
```

2. 安装依赖
```bash
npm run install:all
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入相应的配置
```

4. 启动开发环境
```bash
npm run dev
```

## 功能特性

- 🚀 **NFT预售**: 基于区块链的荔枝预售系统
- 🔍 **全程溯源**: 从种植到交付的完整溯源链
- 💰 **智能合约**: 自动化的交易和收益分配
- 🌐 **跨境合规**: 多司法管辖区合规框架
- 📱 **移动优先**: 响应式设计，支持移动端
- 🔒 **安全可靠**: 多重安全防护机制

## 合规性

本项目严格遵循以下合规要求：

- 新加坡MAS监管要求
- 中国数据出境合规
- 国际KYC/AML标准
- GDPR数据保护法规

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目维护者: 钜园农业团队
- 邮箱: contact@lychee-nft.com
- 项目链接: [https://github.com/zane0623/-.git](https://github.com/zane0623/-.git)
