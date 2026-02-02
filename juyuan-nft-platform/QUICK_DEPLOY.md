
  # ⚡ 快速部署指南（5分钟）

## 🎯 推荐：Railway（完全免费）

### 为什么选择Railway？
- ✅ 每月 $5 免费额度（足够使用）
- ✅ 服务24/7运行，不会休眠
- ✅ 自动部署，连接GitHub即可
- ✅ 支持所有微服务
- ✅ 免费SSL证书

---

## 📋 3步部署

### 步骤1：注册Railway（1分钟）

1. 访问：https://railway.app
2. 点击 "Start a New Project"
3. 选择 "Login with GitHub"
4. 授权Railway访问你的GitHub

### 步骤2：部署第一个服务（2分钟）

1. 在Railway Dashboard点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择仓库：`zane0623/-`
4. 点击 "Add Service" → "GitHub Repo"
5. 设置：
   - **Root Directory**: `backend/services/user`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 步骤3：配置环境变量（1分钟）

在服务设置中找到 "Variables" 标签，添加：

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-us-west-2.pooler.supabase.com:6543/postgres
JWT_SECRET=your_random_secret_key_here
CORS_ORIGIN=*
```

**获取Supabase数据库URL：**
1. 访问：https://supabase.com/dashboard/project/wntvfodzwuyfbqisjocs/settings/database
2. 复制 "Connection string" → "URI"
3. 替换 `[password]` 为你的数据库密码

---

## 🚀 部署其他服务

重复步骤2，为每个服务创建部署：

| 服务 | Root Directory | Port |
|------|----------------|------|
| User Service | `backend/services/user` | 3001 |
| NFT Service | `backend/services/nft` | 3002 |
| Presale Service | `backend/services/presale` | 3003 |
| Payment Service | `backend/services/payment` | 3004 |
| Logistics Service | `backend/services/logistics` | 3005 |
| Notification Service | `backend/services/notification` | 3006 |
| Traceability Service | `backend/services/traceability` | 3007 |
| Compliance Service | `backend/services/compliance` | 3008 |
| Currency Service | `backend/services/currency` | 3010 |
| i18n Service | `backend/services/i18n` | 3011 |

---

## 📱 使用CLI部署（可选）

```bash
# 1. 安装Railway CLI
npm install -g @railway/cli

# 2. 登录
railway login

# 3. 进入服务目录
cd backend/services/user

# 4. 初始化
railway init

# 5. 部署
railway up
```

---

## 🔗 获取服务URL

部署完成后，Railway会提供：
- **服务URL**: `https://user-service-production.up.railway.app`
- **健康检查**: `https://user-service-production.up.railway.app/health`

在Railway Dashboard中可以看到所有服务的URL。

---

## 💰 成本

| 项目 | 成本 |
|------|------|
| Railway（10个服务） | $0（免费额度内） |
| Supabase数据库 | $0（免费层） |
| Vercel前端 | $0（免费） |
| **总计** | **$0/月** |

---

## ✅ 验证部署

访问健康检查端点：
```bash
curl https://your-service.up.railway.app/health
```

应该返回：
```json
{
  "status": "healthy",
  "service": "user-service",
  "timestamp": "2024-12-25T10:00:00.000Z"
}
```

---

## 🆘 遇到问题？

1. **构建失败**
   - 检查 `package.json` 中的构建脚本
   - 查看Railway构建日志

2. **服务无法启动**
   - 检查环境变量是否正确
   - 确认端口配置

3. **数据库连接失败**
   - 验证 `DATABASE_URL` 格式
   - 检查Supabase防火墙设置

4. **需要帮助**
   - Railway文档：https://docs.railway.app
   - Railway Discord：https://discord.gg/railway

---

## 🎉 完成！

现在你的后端服务已经运行在云端了！

**下一步：**
- 更新前端API地址
- 配置CORS允许的域名
- 设置自定义域名（可选）


