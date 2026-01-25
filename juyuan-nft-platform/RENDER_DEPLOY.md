# 🚀 Render 部署指南

## 📋 概述

Render 是一个现代化的云平台，提供：
- ✅ 完全免费（免费层）
- ✅ 自动 SSL 证书
- ✅ 自动部署（连接 GitHub）
- ✅ PostgreSQL 数据库支持
- ⚠️ 免费服务会休眠（15分钟无请求后）

---

## 🎯 部署步骤

### 步骤 1：注册 Render 账号

1. 访问：https://render.com
2. 点击 **"Get Started for Free"**
3. 选择 **"Sign up with GitHub"**（推荐）
4. 授权 Render 访问你的 GitHub

### 步骤 2：创建 Web Service

1. 在 Render Dashboard，点击 **"New +"** → **"Web Service"**
2. 选择 **"Connect a repository"**
3. 选择你的仓库：`zane0623/-`
4. 点击 **"Connect"**

### 步骤 3：配置服务

#### 基本设置

- **Name**: `user-service`（或你的服务名）
- **Region**: 选择最近的区域（如 `Singapore`）
- **Branch**: `main`
- **Root Directory**: `backend/services/user` ⚠️ **重要！**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### 环境变量

点击 **"Environment"** 标签，添加：

```env
# 服务配置
PORT=3001
NODE_ENV=production

# 数据库
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# JWT
JWT_SECRET=你的JWT密钥_至少32字符
JWT_REFRESH_SECRET=你的刷新密钥_至少32字符

# CORS
CORS_ORIGIN=https://你的前端.vercel.app

# Redis（可选）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### 步骤 4：部署

1. 点击 **"Create Web Service"**
2. Render 会自动开始构建和部署
3. 等待部署完成（通常 3-5 分钟）

---

## 🔗 获取服务 URL

部署完成后，Render 会提供：

- **服务 URL**: `https://user-service.onrender.com`
- **健康检查**: `https://user-service.onrender.com/health`

### 自定义域名（可选）

1. 进入服务设置
2. 点击 **"Custom Domains"**
3. 添加你的域名
4. 按照提示配置 DNS

---

## 📋 部署所有服务

为每个服务重复上述步骤：

| 服务 | Root Directory | Port | 服务名 |
|------|----------------|------|--------|
| User Service | `backend/services/user` | 3001 | `user-service` |
| NFT Service | `backend/services/nft` | 3002 | `nft-service` |
| Presale Service | `backend/services/presale` | 3003 | `presale-service` |
| Payment Service | `backend/services/payment` | 3004 | `payment-service` |
| Traceability Service | `backend/services/traceability` | 3005 | `traceability-service` |
| Logistics Service | `backend/services/logistics` | 3006 | `logistics-service` |
| Compliance Service | `backend/services/compliance` | 3007 | `compliance-service` |
| Notification Service | `backend/services/notification` | 3008 | `notification-service` |
| i18n Service | `backend/services/i18n` | 3009 | `i18n-service` |
| Currency Service | `backend/services/currency` | 3010 | `currency-service` |

---

## 🔐 环境变量配置

### 通用环境变量（所有服务）

```env
# 服务配置
PORT=3001
NODE_ENV=production

# 数据库（Supabase）
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# JWT
JWT_SECRET=你的JWT密钥
JWT_REFRESH_SECRET=你的刷新密钥

# CORS
CORS_ORIGIN=https://你的前端.vercel.app,https://你的管理后台.vercel.app

# 前端地址
FRONTEND_URL=https://你的前端.vercel.app
```

### 服务特定环境变量

#### Payment Service

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_你的密钥
STRIPE_WEBHOOK_SECRET=whsec_你的密钥

# 服务间通信
NFT_SERVICE_URL=https://nft-service.onrender.com
NOTIFICATION_SERVICE_URL=https://notification-service.onrender.com
```

#### NFT Service

```env
# 区块链
BLOCKCHAIN_RPC_URL=https://polygon-rpc.com
NFT_CONTRACT_ADDRESS=你的合约地址
PRIVATE_KEY=你的私钥

# IPFS
PINATA_API_KEY=你的Pinata密钥
PINATA_SECRET_KEY=你的Pinata密钥
IPFS_GATEWAY=https://gateway.pinata.cloud
```

#### Notification Service

```env
# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=你的邮箱
SMTP_PASSWORD=你的应用密码
SMTP_FROM=noreply@juyuan-nft.com
```

#### Logistics Service

```env
# 快递100（可选）
KD100_CUSTOMER=你的客户编码

# 服务间通信
NOTIFICATION_SERVICE_URL=https://notification-service.onrender.com
NFT_SERVICE_URL=https://nft-service.onrender.com
```

---

## ⚠️ 重要提示

### 1. Root Directory 设置

**非常重要**：必须在每个服务的设置中指定 Root Directory：

- User Service: `backend/services/user`
- NFT Service: `backend/services/nft`
- 以此类推...

### 2. 服务休眠

Render 免费服务会在 15 分钟无请求后休眠：
- 首次唤醒需要 30-60 秒
- 可以使用 **"Render Cron"** 定期唤醒服务
- 或升级到付费计划（不会休眠）

### 3. 环境变量更新

- 更新环境变量后需要手动 **"Manual Deploy"**
- 或等待下次 Git push 自动部署

### 4. 构建超时

- 免费服务构建时间限制：10 分钟
- 如果构建超时，检查构建命令和依赖

---

## 🔄 自动部署

### 连接 GitHub 后

Render 会自动：
- ✅ 每次推送到 `main` 分支 → 自动部署
- ✅ 每次创建 PR → 创建预览部署（付费功能）

### 手动部署

1. 进入服务页面
2. 点击 **"Manual Deploy"**
3. 选择分支和 commit

---

## 📊 监控和日志

### 查看日志

1. 进入服务页面
2. 点击 **"Logs"** 标签
3. 实时查看构建和运行日志

### 健康检查

所有服务都提供健康检查端点：

```bash
curl https://user-service.onrender.com/health
```

响应：
```json
{
  "status": "healthy",
  "service": "user-service",
  "timestamp": "2024-12-25T10:00:00.000Z"
}
```

---

## 🐛 常见问题

### Q1: 构建失败 "Cannot find module"

**原因**：Root Directory 设置错误

**解决**：
1. 进入服务设置
2. 检查 **"Root Directory"** 是否正确
3. 重新部署

### Q2: 服务休眠后首次请求很慢

**原因**：免费服务会休眠

**解决**：
- 使用 Render Cron 定期唤醒
- 或升级到付费计划

### Q3: 环境变量不生效

**解决**：
1. 确认变量名正确（区分大小写）
2. 手动触发重新部署
3. 检查构建日志

### Q4: 数据库连接失败

**解决**：
1. 检查 `DATABASE_URL` 格式
2. 确认 Supabase 防火墙设置
3. 使用连接池 URL（Supabase 提供）

---

## 💰 成本

### 免费层

- ✅ 750 小时/月（足够使用）
- ✅ 自动 SSL
- ✅ 自动部署
- ⚠️ 服务会休眠

### 付费计划

- $7/月：服务不休眠
- $25/月：更多资源

---

## ✅ 部署检查清单

部署前确认：

- [ ] Root Directory 已正确设置
- [ ] 环境变量已配置
- [ ] Build Command 正确
- [ ] Start Command 正确
- [ ] 数据库连接字符串正确

部署后检查：

- [ ] 构建成功
- [ ] 服务运行中
- [ ] 健康检查通过
- [ ] 日志无错误

---

## 🎉 完成！

部署完成后，你的服务 URL 格式：

```
https://user-service.onrender.com
https://nft-service.onrender.com
https://presale-service.onrender.com
...
```

**下一步：**
1. 更新前端环境变量中的 `NEXT_PUBLIC_API_URL`
2. 配置 CORS 允许的域名
3. 测试 API 连接

---

## 📞 需要帮助？

- Render 文档：https://render.com/docs
- Render 支持：https://render.com/support
