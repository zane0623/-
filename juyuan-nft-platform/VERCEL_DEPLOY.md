# 🚀 Vercel 部署指南

## 📋 概述

Vercel 是部署 Next.js 应用的最佳选择，提供：
- ✅ 完全免费（个人项目）
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动部署（连接 GitHub）
- ✅ 预览部署（每个 PR）

---

## 🎯 部署 Web 前端（用户界面）

### 步骤 1：注册/登录 Vercel

1. 访问：https://vercel.com
2. 点击 **"Sign Up"** 或 **"Log In"**
3. 选择 **"Continue with GitHub"**
4. 授权 Vercel 访问你的 GitHub 账户

### 步骤 2：导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在仓库列表中找到：`zane0623/-`
3. 点击 **"Import"**

### 步骤 3：配置项目设置

在项目配置页面：

#### 🔧 Framework Preset
- 选择：**"Next.js"**（会自动检测）

#### 📁 Root Directory
- 点击 **"Edit"** 按钮
- 设置为：`frontend/web`
- 这样 Vercel 知道从哪个目录构建

#### ⚙️ Build and Output Settings
- **Build Command**: `npm run build`（默认，无需修改）
- **Output Directory**: `.next`（默认，无需修改）
- **Install Command**: `npm install`（默认，无需修改）

#### 🔐 Environment Variables（环境变量）

点击 **"Environment Variables"**，添加：

```env
# Next.js 配置
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://你的后端API地址
NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key

# 区块链配置（如果需要）
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_RPC_URL=你的RPC URL
```

**重要提示：**
- 所有以 `NEXT_PUBLIC_` 开头的变量会在客户端可用
- 敏感信息不要加 `NEXT_PUBLIC_` 前缀

### 步骤 4：部署

1. 点击 **"Deploy"** 按钮
2. 等待构建完成（通常 1-3 分钟）
3. 部署成功后，你会得到一个 URL，例如：
   - `https://juyuan-nft-platform.vercel.app`

---

## 🎯 部署 Admin 后台（管理界面）

### 方法 1：作为独立项目部署（推荐）

1. 在 Vercel Dashboard，再次点击 **"Add New..."** → **"Project"**
2. 选择同一个仓库：`zane0623/-`
3. 配置：
   - **Root Directory**: `frontend/admin`
   - **Framework Preset**: `Next.js`
   - **Project Name**: `juyuan-admin`（或其他名称）

### 方法 2：使用 Monorepo 配置

如果你想让两个前端在同一个 Vercel 项目中：

1. 在项目根目录创建 `vercel.json`：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/web/package.json",
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    },
    {
      "src": "frontend/admin/package.json",
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "frontend/admin/$1"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/web/$1"
    }
  ]
}
```

---

## 🔗 连接 GitHub 仓库

### 自动连接（推荐）

1. **首次部署时：**
   - Vercel 会自动检测你的 GitHub 仓库
   - 选择仓库：`zane0623/-`
   - 点击 **"Import"**

2. **授权访问：**
   - 如果还没授权，Vercel 会提示你授权
   - 点击 **"Authorize Vercel"**
   - 选择要授权的仓库（或所有仓库）

### 手动连接

如果自动连接失败：

1. 在 Vercel Dashboard，点击 **"Settings"** → **"Git"**
2. 点击 **"Connect Git Provider"**
3. 选择 **"GitHub"**
4. 授权访问
5. 选择仓库：`zane0623/-`

---

## ⚙️ 环境变量配置

### 在 Vercel Dashboard 中设置

1. 进入项目设置
2. 点击 **"Settings"** → **"Environment Variables"**
3. 添加变量：

#### Web 前端环境变量

```env
# API 配置
NEXT_PUBLIC_API_URL=https://你的后端API地址
NEXT_PUBLIC_SUPABASE_URL=https://wntvfodzwuyfbqisjocs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key

# 区块链配置
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/你的密钥

# 其他配置
NEXT_PUBLIC_APP_NAME=钜园农业NFT平台
NEXT_PUBLIC_APP_URL=https://你的vercel域名
```

#### Admin 后台环境变量

```env
# API 配置
NEXT_PUBLIC_API_URL=https://你的后端API地址
NEXT_PUBLIC_SUPABASE_URL=https://wntvfodzwuyfbqisjocs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key

# 管理后台配置
NEXT_PUBLIC_ADMIN_SECRET=你的管理密钥
```

### 为不同环境设置变量

Vercel 支持为不同环境设置不同的变量：
- **Production**（生产环境）
- **Preview**（预览环境，每个 PR）
- **Development**（开发环境）

---

## 🔄 自动部署

### 默认行为

连接 GitHub 后，Vercel 会自动：
- ✅ 每次推送到 `main` 分支 → 自动部署到 Production
- ✅ 每次创建 PR → 自动创建 Preview 部署
- ✅ 每次合并 PR → 自动部署到 Production

### 禁用自动部署

如果需要手动控制：

1. 进入项目 **"Settings"** → **"Git"**
2. 取消勾选 **"Automatically deploy"**

---

## 📊 查看部署状态

### 在 Vercel Dashboard

1. 进入项目页面
2. 点击 **"Deployments"** 标签
3. 查看所有部署历史：
   - ✅ 成功的部署（绿色）
   - ⚠️ 构建中的部署（黄色）
   - ❌ 失败的部署（红色）

### 查看构建日志

1. 点击失败的部署
2. 查看 **"Build Logs"** 了解错误原因

---

## 🐛 常见问题

### Q1: 构建失败 "Cannot find module"

**原因**：Root Directory 设置错误

**解决**：
1. 进入项目 **"Settings"** → **"General"**
2. 检查 **"Root Directory"** 是否为 `frontend/web` 或 `frontend/admin`
3. 保存后重新部署

### Q2: 环境变量不生效

**原因**：变量名没有 `NEXT_PUBLIC_` 前缀

**解决**：
- 客户端可访问的变量必须以 `NEXT_PUBLIC_` 开头
- 修改后需要重新部署

### Q3: 找不到仓库

**原因**：GitHub 授权不完整

**解决**：
1. 进入 Vercel **"Settings"** → **"Git"**
2. 点击 **"Disconnect"** 然后重新连接
3. 确保授权访问所有仓库或特定仓库

### Q4: 部署后页面空白

**可能原因**：
1. 环境变量未设置
2. API 地址错误
3. 构建错误

**解决**：
1. 检查浏览器控制台错误
2. 检查 Vercel 构建日志
3. 确认环境变量已正确设置

---

## 🔐 自定义域名

### 添加自定义域名

1. 进入项目 **"Settings"** → **"Domains"**
2. 输入你的域名，例如：`www.juyuan-nft.com`
3. 按照提示配置 DNS：
   - 添加 CNAME 记录指向 Vercel
   - 或添加 A 记录指向 Vercel IP

### SSL 证书

Vercel 会自动为所有域名提供免费的 SSL 证书（Let's Encrypt）

---

## 📈 性能优化

### Vercel 自动优化

- ✅ 自动代码分割
- ✅ 自动图片优化
- ✅ 自动静态资源缓存
- ✅ 全球 CDN 分发

### 手动优化建议

1. **使用 Vercel Analytics**（可选）
2. **启用 Edge Functions**（如果需要）
3. **优化图片**：使用 `next/image` 组件

---

## ✅ 部署检查清单

部署前确认：

- [ ] GitHub 仓库已连接
- [ ] Root Directory 已正确设置
- [ ] 环境变量已配置
- [ ] Build Command 正确
- [ ] 代码已推送到 GitHub

部署后检查：

- [ ] 构建成功（无错误）
- [ ] 网站可以访问
- [ ] API 调用正常
- [ ] 环境变量生效
- [ ] 自定义域名（如已设置）正常

---

## 🚀 快速开始命令

如果你想使用 Vercel CLI：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署（在 frontend/web 目录）
cd frontend/web
vercel

# 部署到生产环境
vercel --prod
```

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Vercel 构建日志
2. 检查 GitHub Actions（如果有）
3. 查看 Vercel 文档：https://vercel.com/docs

---

## 🎉 完成！

部署成功后，你的网站将：
- ✅ 自动更新（每次 Git push）
- ✅ 全球 CDN 加速
- ✅ 免费 SSL 证书
- ✅ 预览部署（每个 PR）

访问你的网站：`https://你的项目名.vercel.app`
