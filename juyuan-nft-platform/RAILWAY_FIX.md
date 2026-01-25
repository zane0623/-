# 🔧 Railway 部署问题修复指南

## 问题
错误：`Error creating build plan with Railpack`

## 解决方案

### 方法1：使用 Dockerfile（推荐）

1. **在 Railway 中设置服务配置：**
   - 进入你的服务设置
   - 点击 "Settings" 标签
   - 找到 "Root Directory" 设置
   - 设置为：`backend/services/user`

2. **设置构建方式：**
   - 在 "Settings" → "Build" 中
   - 选择 "Dockerfile"
   - Dockerfile 路径会自动检测（因为已经在服务目录中）

3. **环境变量：**
   确保设置了以下环境变量：
   ```env
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=你的数据库URL
   JWT_SECRET=你的密钥
   CORS_ORIGIN=*
   ```

### 方法2：使用 NIXPACKS（如果方法1不行）

1. **在 Railway 中设置：**
   - Root Directory: `backend/services/user`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **或者使用项目根目录：**
   - Root Directory: `/` (项目根目录)
   - 使用 `nixpacks.toml` 配置文件（已创建）

### 方法3：重新创建服务（最简单）

1. **删除当前失败的服务**
2. **创建新服务：**
   - 点击 "New Service"
   - 选择 "GitHub Repo"
   - 选择你的仓库
   - **重要：在服务设置中设置 Root Directory 为 `backend/services/user`**
   - 使用 Dockerfile 构建方式

## 快速修复步骤

1. 进入 Railway Dashboard
2. 选择你的服务
3. 点击 "Settings"
4. 设置 **Root Directory**: `backend/services/user`
5. 在 "Build" 部分选择 **Dockerfile**
6. 点击 "Redeploy"

## 验证

部署成功后，你应该看到：
- ✅ Build 成功
- ✅ Deploy 成功
- ✅ 服务运行中

如果还有问题，检查：
- 环境变量是否正确设置
- 数据库连接是否正常
- 端口是否正确（3001）
