# 🔐 Vercel 环境变量配置指南

## 📋 快速设置

### 在 Vercel Dashboard 中设置：

1. 进入你的项目
2. 点击 **"Settings"** → **"Environment Variables"**
3. 添加以下变量（逐个添加或批量导入）

---

## 🌐 Web 前端环境变量

### 必需变量

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://wntvfodzwuyfbqisjocs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase_Anon_Key

# API 地址（后端服务地址）
NEXT_PUBLIC_API_URL=https://你的后端服务.onrender.com
# 或本地开发: http://localhost:3001

# WalletConnect 配置
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=你的WalletConnect_Project_ID

# 应用配置
NEXT_PUBLIC_APP_NAME=钜园农业NFT平台
NEXT_PUBLIC_APP_URL=https://你的vercel域名.vercel.app

# 区块链配置
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_RPC_URL=https://polygon-rpc.com
```

### 获取方式

#### 1. Supabase 配置
- 访问：https://supabase.com/dashboard/project/wntvfodzwuyfbqisjocs/settings/api
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 2. WalletConnect Project ID
- 访问：https://cloud.walletconnect.com/
- 创建项目后获取 Project ID
- 填入 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

#### 3. 后端 API 地址
- Render 部署后获取的服务 URL
- 例如：`https://user-service.onrender.com`
- 填入 `NEXT_PUBLIC_API_URL`

---

## 🔧 Admin 后台环境变量

### 必需变量

```env
# Supabase 配置（与 Web 前端相同）
NEXT_PUBLIC_SUPABASE_URL=https://wntvfodzwuyfbqisjocs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase_Anon_Key

# API 地址
NEXT_PUBLIC_API_URL=https://你的后端服务.onrender.com

# 管理后台配置
NEXT_PUBLIC_ADMIN_SECRET=你的管理密钥
```

---

## 📝 Vercel 环境变量格式说明

### 格式要求

1. **变量名**：
   - 必须以 `NEXT_PUBLIC_` 开头（客户端可访问）
   - 或普通变量名（仅服务端可用）
   - 区分大小写
   - 使用大写字母和下划线

2. **变量值**：
   - 字符串直接填写
   - 不需要引号（Vercel 会自动处理）
   - URL 不需要转义

3. **环境选择**：
   - ✅ **Production** - 生产环境
   - ✅ **Preview** - 预览环境（PR）
   - ✅ **Development** - 开发环境

### 示例格式

```
变量名: NEXT_PUBLIC_SUPABASE_URL
变量值: https://wntvfodzwuyfbqisjocs.supabase.co
环境: Production, Preview, Development
```

---

## 🎯 完整环境变量列表

### Web 前端（frontend/web）

| 变量名 | 说明 | 示例值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGc...` | ✅ |
| `NEXT_PUBLIC_API_URL` | 后端 API 地址 | `https://api.railway.app` | ✅ |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect 项目 ID | `abc123...` | ✅ |
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | `钜园农业NFT平台` | ⚠️ |
| `NEXT_PUBLIC_APP_URL` | 应用 URL | `https://xxx.vercel.app` | ⚠️ |
| `NEXT_PUBLIC_CHAIN_ID` | 区块链网络 ID | `137` (Polygon) | ⚠️ |
| `NEXT_PUBLIC_RPC_URL` | RPC 节点地址 | `https://polygon-rpc.com` | ⚠️ |

### Admin 后台（frontend/admin）

| 变量名 | 说明 | 示例值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGc...` | ✅ |
| `NEXT_PUBLIC_API_URL` | 后端 API 地址 | `https://api.railway.app` | ✅ |
| `NEXT_PUBLIC_ADMIN_SECRET` | 管理后台密钥 | `your-secret-key` | ⚠️ |

---

## 🚀 在 Vercel 中设置步骤

### 方法 1：通过 Dashboard（推荐）

1. **进入项目设置**
   ```
   Vercel Dashboard → 你的项目 → Settings → Environment Variables
   ```

2. **添加变量**
   - 点击 **"Add New"**
   - 输入变量名（例如：`NEXT_PUBLIC_SUPABASE_URL`）
   - 输入变量值
   - 选择环境（Production, Preview, Development）
   - 点击 **"Save"**

3. **批量添加**
   - 逐个添加每个变量
   - 或使用 Vercel CLI（见方法 2）

### 方法 2：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 添加环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 然后输入值

# 或从文件导入（需要先创建 .env 文件）
vercel env pull .env.local
```

---

## 📋 快速复制模板

### Web 前端环境变量（复制到 Vercel）

```env
NEXT_PUBLIC_SUPABASE_URL=https://wntvfodzwuyfbqisjocs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase_Anon_Key
NEXT_PUBLIC_API_URL=https://你的后端服务.railway.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=你的WalletConnect_Project_ID
NEXT_PUBLIC_APP_NAME=钜园农业NFT平台
NEXT_PUBLIC_APP_URL=https://你的vercel域名.vercel.app
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_RPC_URL=https://polygon-rpc.com
```

### Admin 后台环境变量（复制到 Vercel）

```env
NEXT_PUBLIC_SUPABASE_URL=https://wntvfodzwuyfbqisjocs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase_Anon_Key
NEXT_PUBLIC_API_URL=https://你的后端服务.railway.app
NEXT_PUBLIC_ADMIN_SECRET=你的管理密钥
```

---

## ⚠️ 重要提示

### 1. 变量命名规则
- ✅ 客户端可访问：必须以 `NEXT_PUBLIC_` 开头
- ❌ 服务端专用：不要加 `NEXT_PUBLIC_` 前缀

### 2. 环境选择
- **Production**：生产环境使用
- **Preview**：每个 PR 的预览环境
- **Development**：本地开发环境

建议：所有变量都选择三个环境，确保一致性。

### 3. 敏感信息
- ✅ 可以安全存储在 Vercel（加密存储）
- ❌ 不要提交到 Git
- ✅ 使用 Vercel 的环境变量管理

### 4. 更新变量后
- 环境变量更新后需要**重新部署**
- Vercel 会自动触发重新部署
- 或手动点击 **"Redeploy"**

---

## 🔍 验证环境变量

### 在代码中检查

```typescript
// 在组件中检查
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

### 在 Vercel 中查看

1. 进入 **"Deployments"** 标签
2. 点击最新的部署
3. 查看 **"Build Logs"**
4. 检查环境变量是否正确加载

---

## 🐛 常见问题

### Q1: 环境变量不生效？
**解决：**
- 确认变量名以 `NEXT_PUBLIC_` 开头（客户端变量）
- 重新部署项目
- 检查变量值是否正确（无多余空格）

### Q2: 如何区分不同环境？
**解决：**
- 在 Vercel 中为不同环境设置不同的值
- 使用 `NODE_ENV` 判断（Vercel 自动设置）

### Q3: 可以导入 .env 文件吗？
**解决：**
- Vercel Dashboard 不支持直接导入
- 使用 Vercel CLI：`vercel env pull .env.local`
- 然后手动在 Dashboard 中添加

---

## 📞 需要帮助？

如果遇到问题：
1. 检查变量名拼写（区分大小写）
2. 确认变量值格式正确
3. 重新部署项目
4. 查看构建日志

---

## ✅ 检查清单

设置完成后，确认：

- [ ] 所有 `NEXT_PUBLIC_` 变量已设置
- [ ] 变量值格式正确（无引号、无多余空格）
- [ ] 选择了正确的环境（Production/Preview/Development）
- [ ] 已重新部署项目
- [ ] 构建日志无错误
- [ ] 网站功能正常
