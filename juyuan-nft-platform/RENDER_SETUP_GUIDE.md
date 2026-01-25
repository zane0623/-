# 🎯 Render 设置详细指南（找不到 Build Command 时）

## 📍 在哪里找到 Build Command 和 Start Command？

### 情况 1：创建服务时没有看到这些字段

**解决方法：**

1. **先创建服务**（即使没有这些字段）
2. 创建后，进入服务页面
3. 点击 **"Settings"** 标签
4. 向下滚动找到 **"Build & Deploy"** 部分
5. 在这里设置：
   - **Build Command**
   - **Start Command**

### 情况 2：使用 render.yaml 配置文件（最简单）

**推荐方法：**

1. 项目根目录已经有 `render.yaml` 文件
2. 在 Render Dashboard：
   - 点击 **"New +"** → **"Blueprint"**
   - 选择你的仓库
   - Render 会自动读取 `render.yaml` 并创建所有服务

---

## 🔍 详细步骤

### 步骤 1：创建服务

1. 访问：https://render.com
2. 点击 **"New +"** → **"Web Service"**
3. 连接 GitHub 仓库：`zane0623/-`
4. 填写基本信息：
   - **Name**: `user-service`
   - **Region**: `Singapore`（或你选择的区域）
   - **Branch**: `main`
   - **Root Directory**: `backend/services/user` ⚠️ **重要！**

5. 点击 **"Create Web Service"**（即使没看到 Build Command）

### 步骤 2：设置 Build Command 和 Start Command

创建服务后：

1. **进入服务页面**
   - 在 Dashboard 中点击你的服务

2. **打开 Settings**
   - 点击左侧或顶部的 **"Settings"** 标签

3. **找到 Build & Deploy 部分**
   - 向下滚动
   - 找到 **"Build & Deploy"** 或 **"Build Settings"** 部分

4. **设置命令**
   - **Build Command**: 
     ```
     cd backend/services/user && npm install && npm run build
     ```
   - **Start Command**: 
     ```
     cd backend/services/user && npm start
     ```

5. **保存**
   - 点击 **"Save Changes"** 或自动保存

### 步骤 3：设置环境变量

在同一个 Settings 页面：

1. 找到 **"Environment"** 或 **"Environment Variables"** 部分
2. 点击 **"Add Environment Variable"**
3. 添加以下变量：

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=你的数据库URL
JWT_SECRET=你的JWT密钥
CORS_ORIGIN=https://你的前端.vercel.app
```

4. 点击 **"Save Changes"**

### 步骤 4：触发部署

设置完成后：

1. 点击 **"Manual Deploy"** → **"Deploy latest commit"**
2. 或等待自动部署（如果有新的 Git push）

---

## 🖼️ 界面位置示意图

```
Render Dashboard
├── 你的项目
│   └── user-service (点击这里)
│       ├── Overview (概览)
│       ├── Logs (日志)
│       ├── Metrics (指标)
│       ├── Events (事件)
│       └── Settings (设置) ← 点击这里
│           ├── General (常规)
│           │   ├── Name
│           │   ├── Region
│           │   └── Root Directory ← 在这里设置
│           │
│           ├── Build & Deploy ← 在这里！
│           │   ├── Build Command ← 设置这里
│           │   └── Start Command ← 设置这里
│           │
│           └── Environment ← 环境变量
│               └── Environment Variables
```

---

## ✅ 快速检查清单

- [ ] 已创建服务
- [ ] 已设置 Root Directory: `backend/services/user`
- [ ] 已设置 Build Command: `cd backend/services/user && npm install && npm run build`
- [ ] 已设置 Start Command: `cd backend/services/user && npm start`
- [ ] 已添加环境变量
- [ ] 已触发部署

---

## 🐛 如果还是找不到？

### 方法 1：使用 render.yaml（最简单）

项目根目录已经有 `render.yaml` 文件：

1. 在 Render Dashboard
2. 点击 **"New +"** → **"Blueprint"**
3. 选择仓库：`zane0623/-`
4. Render 会自动读取配置并创建所有服务

### 方法 2：联系我

告诉我：
1. 你在 Render 的哪个页面？
2. 你看到了哪些选项？
3. 截图发给我（如果可能）

我会根据你的具体情况提供更精确的指导。

---

## 📝 各服务的 Build Command 和 Start Command

| 服务 | Build Command | Start Command |
|------|--------------|--------------|
| User | `cd backend/services/user && npm install && npm run build` | `cd backend/services/user && npm start` |
| NFT | `cd backend/services/nft && npm install && npm run build` | `cd backend/services/nft && npm start` |
| Presale | `cd backend/services/presale && npm install && npm run build` | `cd backend/services/presale && npm start` |
| Payment | `cd backend/services/payment && npm install && npm run build` | `cd backend/services/payment && npm start` |
| Traceability | `cd backend/services/traceability && npm install && npm run build` | `cd backend/services/traceability && npm start` |
| Logistics | `cd backend/services/logistics && npm install && npm run build` | `cd backend/services/logistics && npm start` |
| Compliance | `cd backend/services/compliance && npm install && npm run build` | `cd backend/services/compliance && npm start` |
| Notification | `cd backend/services/notification && npm install && npm run build` | `cd backend/services/notification && npm start` |
| i18n | `cd backend/services/i18n && npm install && npm run build` | `cd backend/services/i18n && npm start` |
| Currency | `cd backend/services/currency && npm install && npm run build` | `cd backend/services/currency && npm start` |

---

## 🎉 完成！

设置完成后，你的服务应该可以正常部署了！

如果还有问题，告诉我你看到的界面，我会继续帮助你。
