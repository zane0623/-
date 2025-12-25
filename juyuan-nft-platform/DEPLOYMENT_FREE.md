# 🚀 免费部署指南

## 推荐方案：Railway（最佳选择）

### ✅ 为什么选择Railway？

- **免费额度**：每月 $5 免费额度
- **无需休眠**：服务24/7运行
- **多服务支持**：可以部署所有微服务
- **自动部署**：连接GitHub自动部署
- **环境变量管理**：可视化配置
- **PostgreSQL支持**：可以直接连接Supabase数据库

### 📋 部署步骤

#### 1. 注册Railway账号
访问：https://railway.app
- 使用GitHub账号登录（推荐）
- 或使用邮箱注册

#### 2. 创建新项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的仓库：`zane0623/-`

#### 3. 部署用户服务（User Service）

**方式一：通过Railway Dashboard**
1. 在项目中添加新服务
2. 选择 "GitHub Repo"
3. 设置根目录：`backend/services/user`
4. 配置环境变量（见下方）

**方式二：使用Railway CLI**
```bash
# 安装Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 初始化项目
cd backend/services/user
railway init

# 部署
railway up
```

#### 4. 配置环境变量

在Railway Dashboard中为每个服务配置：

**User Service 环境变量：**
```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[password]@db.wntvfodzwuyfbqisjocs.supabase.co:5432/postgres
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=https://your-frontend-domain.com
```

**获取Supabase数据库连接字符串：**
1. 访问：https://supabase.com/dashboard/project/wntvfodzwuyfbqisjocs/settings/database
2. 复制 "Connection string" → "URI"
3. 格式：`postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

#### 5. 部署其他服务

重复步骤3，为每个服务创建部署：
- `backend/services/nft` → NFT Service
- `backend/services/presale` → Presale Service
- `backend/services/payment` → Payment Service
- `backend/services/logistics` → Logistics Service
- `backend/services/notification` → Notification Service
- `backend/services/traceability` → Traceability Service
- `backend/services/compliance` → Compliance Service
- `backend/services/currency` → Currency Service
- `backend/services/i18n` → i18n Service

---

## 备选方案

### 方案2：Render（免费但会休眠）

**优点：**
- 完全免费
- 支持PostgreSQL
- 自动SSL

**缺点：**
- 免费服务会休眠（15分钟无请求后）
- 首次唤醒需要30秒

**部署步骤：**
1. 访问：https://render.com
2. 注册账号
3. 创建 "New Web Service"
4. 连接GitHub仓库
5. 设置：
   - Build Command: `cd backend/services/user && npm install && npm run build`
   - Start Command: `cd backend/services/user && npm start`
   - Environment: `Node`

### 方案3：Fly.io（免费层）

**优点：**
- 3个共享CPU实例免费
- 全球边缘部署
- 快速启动

**缺点：**
- 需要Docker配置
- 免费层资源有限

**部署步骤：**
1. 安装Fly CLI：`curl -L https://fly.io/install.sh | sh`
2. 登录：`fly auth login`
3. 初始化：`fly launch`
4. 部署：`fly deploy`

### 方案4：Supabase Edge Functions（完全免费）

**优点：**
- 完全免费
- 与Supabase数据库完美集成
- 全球CDN

**缺点：**
- 需要重写为Deno函数
- 不适合长时间运行的任务

**适用场景：**
- API端点
- Webhook处理
- 轻量级业务逻辑

---

## 🎯 推荐架构

### 生产环境架构

```
┌─────────────────┐
│   Frontend      │  → Vercel (免费)
│   (Next.js)     │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   API Gateway   │  → Railway (免费)
│   (Nginx)       │
└─────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│Service1│ │Service2│  → Railway (免费)
│Service3│ │Service4│
└────────┘ └────────┘
    │         │
    └────┬────┘
         ▼
┌─────────────────┐
│   Supabase      │  → Supabase (免费)
│   PostgreSQL    │
└─────────────────┘
```

### 成本估算

| 服务 | 平台 | 成本 |
|------|------|------|
| 前端Web | Vercel | $0 |
| 前端Admin | Vercel | $0 |
| 后端API | Railway | $0 (免费额度内) |
| 数据库 | Supabase | $0 (免费层) |
| **总计** | | **$0/月** |

---

## 📝 快速开始（Railway）

### 1. 一键部署脚本

```bash
# 安装Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 部署用户服务
cd backend/services/user
railway init
railway add --service user-service
railway up
```

### 2. 批量部署脚本

创建 `deploy-railway.sh`：

```bash
#!/bin/bash

SERVICES=(
  "user:3001"
  "nft:3002"
  "presale:3003"
  "payment:3004"
  "logistics:3005"
  "notification:3006"
  "traceability:3007"
  "compliance:3008"
  "currency:3010"
  "i18n:3011"
)

for service in "${SERVICES[@]}"; do
  IFS=':' read -r name port <<< "$service"
  echo "Deploying $name service on port $port..."
  cd "backend/services/$name"
  railway init
  railway up
  cd ../../..
done
```

---

## 🔧 环境变量配置

### 所有服务通用变量

```env
# 数据库
DATABASE_URL=postgresql://postgres:[password]@db.wntvfodzwuyfbqisjocs.supabase.co:5432/postgres

# Redis (可选，Railway提供免费Redis)
REDIS_URL=redis://default:[password]@[host]:[port]

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# CORS
CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app

# 区块链
PRIVATE_KEY=your_private_key
CONTRACT_NFT_ADDRESS=0x...
CONTRACT_PRESALE_ADDRESS=0x...
```

### 服务特定变量

**Payment Service:**
```env
STRIPE_SECRET_KEY=sk_test_...
ALIPAY_APP_ID=...
WECHAT_PAY_MCH_ID=...
```

**Notification Service:**
```env
SENDGRID_API_KEY=SG...
TWILIO_ACCOUNT_SID=...
```

---

## 📊 监控和日志

### Railway Dashboard
- 实时日志查看
- 资源使用监控
- 部署历史
- 环境变量管理

### 健康检查端点

所有服务都提供健康检查：
```
GET /health
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

## 🚨 注意事项

1. **免费额度限制**
   - Railway: $5/月，超出后需要付费
   - 监控使用量避免超支

2. **数据库连接**
   - Supabase免费层有连接数限制
   - 使用连接池优化

3. **冷启动**
   - Render免费服务会休眠
   - Railway不会休眠

4. **域名配置**
   - Railway提供免费子域名
   - 可以绑定自定义域名

---

## 🎉 完成！

部署完成后，你的服务将运行在：
- User Service: `https://user-service-production.up.railway.app`
- NFT Service: `https://nft-service-production.up.railway.app`
- ...

所有服务都可以通过Railway Dashboard统一管理！

