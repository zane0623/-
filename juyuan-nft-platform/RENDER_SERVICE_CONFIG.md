# 🔧 Render 服务配置检查清单

## 📋 服务信息

- **Service ID**: `srv-d5qp9s7pm1nc738v9s8g`
- **Service Name**: `-RWA`
- **Service URL**: `https://rwa-xo22.onrender.com`
- **Repository**: `zane0623/-`
- **Branch**: `main`

---

## ✅ 必须检查的配置项

### 1. Root Directory ⚠️ **最重要**

**位置**：Settings → General → Root Directory

**正确值**：
```
backend/services/user
```

**检查**：
- [ ] Root Directory 设置为 `backend/services/user`
- [ ] 不是 `user` 或 `/backend/services/user`
- [ ] 没有结尾斜杠

---

### 2. Environment / Runtime

**位置**：Settings → Build & Deploy → Environment

**推荐设置**：
- **Environment**: `Node`（推荐）
- 或 `Docker`（如果使用 Dockerfile）

**检查**：
- [ ] 已设置为 `Node` 或 `Docker`
- [ ] 如果使用 Docker，确保 Dockerfile 正确

---

### 3. Build Command

**位置**：Settings → Build & Deploy → Build Command

**如果使用 Node.js**：
```
npm install && npm run build
```

**如果使用 Docker**：
```
（留空，Dockerfile 会自动处理）
```

**检查**：
- [ ] Build Command 已设置
- [ ] 命令格式正确

---

### 4. Start Command

**位置**：Settings → Build & Deploy → Start Command

**如果使用 Node.js**：
```
npm start
```

**如果使用 Docker**：
```
（留空，Dockerfile CMD 会自动处理）
```

**检查**：
- [ ] Start Command 已设置
- [ ] 命令格式正确

---

### 5. 环境变量

**位置**：Settings → Environment

**必需变量**：

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=你的数据库URL
JWT_SECRET=你的JWT密钥
CORS_ORIGIN=https://你的前端.vercel.app
```

**检查**：
- [ ] PORT 设置为 3001
- [ ] NODE_ENV 设置为 production
- [ ] DATABASE_URL 已配置
- [ ] JWT_SECRET 已配置
- [ ] CORS_ORIGIN 已配置

---

## 🎯 快速配置步骤

### 步骤 1：进入设置

1. 访问：https://dashboard.render.com/web/srv-d5qp9s7pm1nc738v9s8g
2. 点击左侧 **"Settings"** 标签

### 步骤 2：检查 Root Directory

1. 在 **"General"** 部分
2. 找到 **"Root Directory"**
3. 确认值为：`backend/services/user`

### 步骤 3：检查构建设置

1. 找到 **"Build & Deploy"** 部分
2. 确认：
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 步骤 4：检查环境变量

1. 找到 **"Environment"** 部分
2. 确认所有必需变量已设置

### 步骤 5：重新部署

1. 点击 **"Manual Deploy"**
2. 选择 **"Deploy latest commit"**
3. 等待部署完成

---

## 🔍 使用 Render CLI 检查配置

如果安装了 Render CLI：

```bash
# 查看服务信息
render services show srv-d5qp9s7pm1nc738v9s8g

# 查看环境变量
render env list srv-d5qp9s7pm1nc738v9s8g

# 查看日志
render logs srv-d5qp9s7pm1nc738v9s8g
```

---

## 📊 服务状态检查

### 健康检查端点

部署成功后，访问：

```
https://rwa-xo22.onrender.com/health
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

## 🐛 常见问题排查

### 问题 1：构建失败

**检查**：
- Root Directory 是否正确
- Build Command 是否正确
- 查看构建日志

### 问题 2：服务无法启动

**检查**：
- Start Command 是否正确
- PORT 环境变量是否设置
- 查看运行日志

### 问题 3：数据库连接失败

**检查**：
- DATABASE_URL 格式是否正确
- Supabase 防火墙设置
- 数据库是否可访问

---

## 📝 配置模板

### Node.js 运行时配置

```
Root Directory: backend/services/user
Environment: Node
Build Command: npm install && npm run build
Start Command: npm start
Node Version: 20
```

### Docker 运行时配置

```
Root Directory: backend/services/user
Environment: Docker
Build Command: (留空)
Start Command: (留空)
```

---

## ✅ 配置验证清单

部署前确认：

- [ ] Root Directory: `backend/services/user`
- [ ] Environment: `Node` 或 `Docker`
- [ ] Build Command: `npm install && npm run build`（Node.js）
- [ ] Start Command: `npm start`（Node.js）
- [ ] PORT: 3001
- [ ] DATABASE_URL: 已设置
- [ ] JWT_SECRET: 已设置
- [ ] CORS_ORIGIN: 已设置

---

## 🎉 完成！

配置正确后，服务应该可以正常部署和运行了！

如果还有问题，告诉我具体的错误信息。
