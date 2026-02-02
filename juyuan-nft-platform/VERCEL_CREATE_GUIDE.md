# 🚀 Vercel 项目创建详细指南

## 📋 概述

本指南将帮助你从零开始创建 Vercel 项目并部署前端应用。

---

## 🎯 创建 Web 前端项目

### 步骤 1：注册/登录 Vercel

1. 访问：https://vercel.com
2. 点击右上角 **"Sign Up"** 或 **"Log In"**
3. 选择 **"Continue with GitHub"**（推荐）
4. 授权 Vercel 访问你的 GitHub 账户

---

### 步骤 2：创建新项目

1. **进入 Dashboard**
   - 登录后，你会看到 Vercel Dashboard
   - 点击 **"Add New..."** 按钮（通常在右上角或中间）

2. **选择项目类型**
   - 点击 **"Project"**（不是 Team 或其他选项）

3. **导入 GitHub 仓库**
   - 在仓库列表中，找到：`zane0623/-`
   - 如果没看到，点击 **"Adjust GitHub App Permissions"** 授权访问
   - 点击仓库旁边的 **"Import"** 按钮

---

### 步骤 3：配置项目设置

#### 基本配置

在项目配置页面，你会看到以下选项：

**Project Name**（项目名称）
- 默认：`-`（仓库名）
- 建议改为：`juyuan-nft-web` 或 `juyuan-web`

**Framework Preset**（框架预设）
- 自动检测：`Next.js`
- 如果没自动检测，手动选择：`Next.js`

**Root Directory** ⚠️ **重要！**
- 点击 **"Edit"** 按钮
- 设置为：`frontend/web`
- 这样 Vercel 知道从哪个目录构建

**Build and Output Settings**（构建和输出设置）
- **Build Command**: `npm run build`（默认，通常不需要修改）
- **Output Directory**: `.next`（默认，通常不需要修改）
- **Install Command**: `npm install`（默认，通常不需要修改）

**Environment Variables**（环境变量）
- 点击 **"Environment Variables"** 展开
- 添加以下变量（见下方详细说明）

---

### 步骤 4：添加环境变量

在配置页面，点击 **"Environment Variables"**，添加：

#### 必需变量

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://wntvfodzwuyfbqisjocs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase_Anon_Key

# API 地址（后端服务）
NEXT_PUBLIC_API_URL=https://rwa-xo22.onrender.com

# WalletConnect 配置
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=你的WalletConnect_Project_ID

# 应用配置
NEXT_PUBLIC_APP_NAME=钜园农业NFT平台
NEXT_PUBLIC_APP_URL=https://你的vercel域名.vercel.app

# 区块链配置
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_RPC_URL=https://polygon-rpc.com
```

#### 如何添加变量

1. 点击 **"Add Environment Variable"**
2. 输入变量名（例如：`NEXT_PUBLIC_SUPABASE_URL`）
3. 输入变量值
4. 选择环境：
   - ✅ **Production**（生产环境）
   - ✅ **Preview**（预览环境）
   - ✅ **Development**（开发环境）
5. 点击 **"Add"**
6. 重复添加所有变量

---

### 步骤 5：部署

1. **检查配置**
   - 确认 Root Directory: `frontend/web`
   - 确认所有环境变量已添加
   - 确认 Framework Preset: `Next.js`

2. **开始部署**
   - 点击页面底部的 **"Deploy"** 按钮
   - Vercel 会自动开始构建和部署

3. **等待部署完成**
   - 通常需要 1-3 分钟
   - 可以在部署页面查看实时日志

---

### 步骤 6：获取部署 URL

部署成功后：

1. **查看部署状态**
   - 部署完成后，会显示 "Ready"
   - 你会看到一个 URL，例如：`https://juyuan-nft-web.vercel.app`

2. **访问网站**
   - 点击 URL 或复制到浏览器访问
   - 网站应该可以正常访问了

---

## 🎯 创建 Admin 后台项目

如果需要部署管理后台，重复上述步骤，但配置不同：

### 配置差异

**Project Name**
- `juyuan-nft-admin` 或 `juyuan-admin`

**Root Directory**
- `frontend/admin`（不是 `frontend/web`）

**环境变量**
- 使用相同的 Supabase 配置
- API URL 相同

---

## 📋 完整配置检查清单

### Web 前端配置

- [ ] Project Name: `juyuan-nft-web`
- [ ] Framework Preset: `Next.js`
- [ ] Root Directory: `frontend/web`
- [ ] Build Command: `npm run build`（默认）
- [ ] Output Directory: `.next`（默认）
- [ ] 环境变量已全部添加

### Admin 后台配置

- [ ] Project Name: `juyuan-nft-admin`
- [ ] Framework Preset: `Next.js`
- [ ] Root Directory: `frontend/admin`
- [ ] Build Command: `npm run build`（默认）
- [ ] Output Directory: `.next`（默认）
- [ ] 环境变量已全部添加

---

## 🔍 详细步骤截图说明

### 步骤 1：点击 "Add New..."

```
Vercel Dashboard
└── [Add New...] 按钮（右上角或中间）
    └── Project（点击这个）
```

### 步骤 2：选择仓库

```
Import Project
├── GitHub（已连接）
│   └── 仓库列表
│       └── zane0623/- [Import] ← 点击这里
```

### 步骤 3：配置页面

```
Configure Project
├── Project Name: [juyuan-nft-web]
├── Framework Preset: [Next.js] (自动检测)
├── Root Directory: [frontend/web] ← 点击 Edit 设置
├── Build Command: [npm run build]
├── Output Directory: [.next]
└── Environment Variables: [展开添加变量]
```

---

## 🐛 常见问题

### Q1: 找不到仓库？

**解决**：
1. 点击 **"Adjust GitHub App Permissions"**
2. 授权 Vercel 访问所有仓库或特定仓库
3. 刷新页面

### Q2: Root Directory 设置错误？

**解决**：
1. 点击 Root Directory 旁边的 **"Edit"** 按钮
2. 输入：`frontend/web`（Web 前端）或 `frontend/admin`（Admin 后台）
3. 保存

### Q3: 构建失败？

**检查**：
1. Root Directory 是否正确
2. 查看构建日志中的错误信息
3. 确认 `package.json` 中有正确的构建脚本

### Q4: 环境变量不生效？

**解决**：
1. 确认变量名以 `NEXT_PUBLIC_` 开头（客户端变量）
2. 重新部署项目
3. 检查浏览器控制台是否有错误

---

## 📝 环境变量获取方式

### 1. Supabase 配置

访问：https://supabase.com/dashboard/project/wntvfodzwuyfbqisjocs/settings/api

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. WalletConnect Project ID

访问：https://cloud.walletconnect.com/

1. 创建项目
2. 获取 Project ID
3. 填入 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### 3. 后端 API 地址

使用 Render 部署的服务 URL：
- `https://rwa-xo22.onrender.com`
- 填入 `NEXT_PUBLIC_API_URL`

---

## ✅ 部署后验证

### 1. 访问网站

部署成功后，访问你的 Vercel URL：
```
https://juyuan-nft-web.vercel.app
```

### 2. 检查功能

- [ ] 网站可以正常访问
- [ ] 页面加载正常
- [ ] API 调用正常（检查浏览器控制台）
- [ ] 环境变量生效

### 3. 查看日志

如果遇到问题：
1. 进入项目 Dashboard
2. 点击 **"Deployments"** 标签
3. 点击失败的部署
4. 查看 **"Build Logs"** 和 **"Runtime Logs"**

---

## 🎉 完成！

部署成功后，你的网站将：

- ✅ 自动更新（每次 Git push）
- ✅ 全球 CDN 加速
- ✅ 免费 SSL 证书
- ✅ 预览部署（每个 PR）

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Vercel 构建日志
2. 检查环境变量配置
3. 查看浏览器控制台错误
4. 参考 Vercel 文档：https://vercel.com/docs

---

## 🚀 快速命令（可选）

如果你想使用 Vercel CLI：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 在项目目录中部署
cd frontend/web
vercel

# 部署到生产环境
vercel --prod
```

但推荐使用 Dashboard 方式，更简单直观！
