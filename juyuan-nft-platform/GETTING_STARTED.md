# 钜园农业NFT平台 - 快速启动指南

本指南将帮助您在5分钟内启动并运行钜园农业NFT预售平台。

## 📦 前提条件

在开始之前，请确保您的系统已安装以下软件：

- ✅ **Node.js** 18.0.0 或更高版本
- ✅ **npm** 9.0.0 或更高版本  
- ✅ **Docker** 24.0.0 或更高版本（推荐）
- ✅ **Git** 2.30 或更高版本

检查版本：

```bash
node --version  # 应该 >= v18.0.0
npm --version   # 应该 >= 9.0.0
docker --version # 应该 >= 24.0.0
```

## 🚀 方式一：使用Docker（推荐）

这是最简单快速的方式，适合快速体验和演示。

### 步骤1：克隆项目

```bash
git clone https://github.com/zane0623/-.git
cd juyuan-nft-platform
```

### 步骤2：启动服务

```bash
# 一键启动所有服务
docker-compose -f deployment/docker/docker-compose.yml up -d
```

等待约2-3分钟，Docker将自动：
- 拉取所有需要的镜像
- 创建数据库和Redis容器
- 启动所有微服务
- 配置Nginx反向代理

### 步骤3：访问应用

打开浏览器访问：

- **前端应用**: http://localhost
- **管理后台**: http://localhost/admin  
- **API文档**: http://localhost/api-docs

### 步骤4：停止服务

```bash
docker-compose -f deployment/docker/docker-compose.yml down
```

## 🛠️ 方式二：本地开发环境

适合需要修改代码和深度开发的场景。

### 步骤1：克隆并安装依赖

```bash
git clone https://github.com/zane0623/-.git
cd juyuan-nft-platform

# 安装所有依赖（可能需要5-10分钟）
npm install
```

### 步骤2：配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件，至少配置以下必需项：
nano .env
```

**最小化配置（用于本地开发）：**

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/juyuan_nft
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-min-32-chars-long
```

### 步骤3：启动数据库

使用Docker启动PostgreSQL和Redis：

```bash
docker run -d --name juyuan-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=juyuan_nft \
  -p 5432:5432 \
  postgres:15-alpine

docker run -d --name juyuan-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 步骤4：数据库迁移

```bash
# 运行数据库迁移
npm run db:migrate

# 填充测试数据
npm run db:seed
```

### 步骤5：启动开发服务器

```bash
# 同时启动所有服务
npm run dev
```

这将启动：
- ✅ 所有后端微服务（端口3001-3010）
- ✅ 前端Web应用（端口3000）
- ✅ 管理后台（端口3001）

### 步骤6：访问应用

- **前端应用**: http://localhost:3000
- **管理后台**: http://localhost:3001
- **API服务**: http://localhost:3001-3010

## 🔗 部署智能合约

### 步骤1：配置区块链RPC

在`.env`中配置：

```env
# Polygon Mumbai测试网
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_wallet_private_key
```

获取免费的Alchemy API Key：https://www.alchemy.com/

### 步骤2：编译合约

```bash
cd contracts
npm run compile
```

### 步骤3：部署到测试网

```bash
npm run deploy:testnet
```

部署成功后，复制合约地址到`.env`：

```env
NFT_CONTRACT_ADDRESS=0x...
PRESALE_CONTRACT_ADDRESS=0x...
ESCROW_CONTRACT_ADDRESS=0x...
```

### 步骤4：验证合约

```bash
npm run verify
```

## 📚 下一步

### 1. 创建管理员账户

```bash
npm run create:admin -- --email admin@juyuan.com --password yourpassword
```

### 2. 铸造第一个NFT

登录管理后台，进入NFT管理页面，点击"铸造NFT"。

### 3. 创建预售批次

在管理后台的预售管理页面创建新批次。

### 4. 配置国际化

在管理后台的国际化设置中添加翻译内容。

### 5. 配置支付网关

在设置页面配置微信支付、支付宝等支付方式。

## 🐛 常见问题

### 问题1：端口被占用

```bash
# 查看端口占用
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 问题2：数据库连接失败

检查PostgreSQL是否正在运行：

```bash
docker ps | grep postgres
```

### 问题3：合约部署失败

确保：
- 钱包有足够的测试网代币
- RPC URL正确
- 私钥格式正确（不包含0x前缀）

获取测试网代币：https://faucet.polygon.technology/

### 问题4：Docker服务启动失败

```bash
# 查看日志
docker-compose logs -f service-name

# 重启服务
docker-compose restart service-name
```

## 📖 更多资源

- **完整文档**: [README.md](./README.md)
- **API文档**: http://localhost/api-docs
- **产品需求**: [PRD.md](../钜园农业农产品NFT预售平台PRD.md)
- **实施计划**: [FIP.md](../钜园农业农产品NFT预售平台FIP.md)

## 🆘 获取帮助

遇到问题？

1. 检查 [常见问题](#常见问题) 章节
2. 查看项目 [Issues](https://github.com/zane0623/-/issues)
3. 发起新的 Issue
4. 发送邮件至 tech@juyuan-agri.com

## 🎉 恭喜！

您已成功启动钜园农业NFT预售平台！

现在您可以：
- ✅ 浏览Web应用
- ✅ 登录管理后台
- ✅ 铸造NFT
- ✅ 创建预售
- ✅ 开始开发

祝您使用愉快！🌾🚀

---

**由钜园农业技术团队精心打造** 