# 🚀 Railway 部署 - 一步一步操作指南

## ⚠️ 当前问题
错误：`Error creating build plan with Railpack`

**原因**：Railway 在项目根目录尝试构建，但这是一个 monorepo，需要指定正确的服务目录。

---

## ✅ 解决方案：设置 Root Directory

### 📍 第一步：进入 Settings 页面

1. **在 Railway Dashboard 中：**
   - 点击你的项目：`fantastic-magic`
   - 点击左侧的服务：`RWA`（显示失败的那个）
   - **点击顶部的 "Settings" 标签** ← 重要！

### 📍 第二步：找到 Root Directory

在 Settings 页面中，向下滚动找到：

```
┌─────────────────────────────────────────┐
│ Service Settings                        │
├─────────────────────────────────────────┤
│ Service Name                            │
│ [RWA]                                   │
│                                         │
│ Root Directory                          │
│ [这里输入路径]                           │ ← 找到这个输入框
│                                         │
│ Build Command                           │
│ [留空或使用默认]                         │
│                                         │
│ Start Command                           │
│ [npm start]                             │
└─────────────────────────────────────────┘
```

### 📍 第三步：设置 Root Directory

在 **Root Directory** 输入框中，输入：

```
backend/services/user
```

**重要提示：**
- ✅ 正确：`backend/services/user`
- ❌ 错误：`/backend/services/user`（不要开头斜杠）
- ❌ 错误：`backend/services/user/`（不要结尾斜杠）

### 📍 第四步：选择构建方式

在 Settings 页面中，找到 **Build** 部分：

1. 选择 **"Dockerfile"** 作为构建方式
2. 或者选择 **"NIXPACKS"**（如果 Dockerfile 不可用）

### 📍 第五步：保存并重新部署

1. 设置会自动保存
2. Railway 会自动触发新的部署
3. 切换到 **"Deployments"** 标签查看部署进度

---

## 🔍 如果找不到 Root Directory？

### 方法1：检查服务类型

确保你的服务是 **"GitHub Repo"** 类型：
- 如果不是，需要删除并重新创建服务

### 方法2：重新创建服务（推荐）

如果当前服务无法设置 Root Directory，重新创建：

1. **删除当前服务：**
   - 在服务页面，点击右上角的 **"..."** 菜单
   - 选择 **"Delete Service"**

2. **创建新服务：**
   - 在项目页面，点击 **"+ New"** 或 **"New Service"**
   - 选择 **"GitHub Repo"**
   - 选择你的仓库
   - **在创建向导中，会看到 "Root Directory" 选项**
   - 设置为：`backend/services/user`
   - 点击 **"Deploy"**

---

## 📋 完整配置清单

设置完成后，你的服务配置应该是：

```
Service Name: RWA (或 user-service)
Root Directory: backend/services/user
Build Command: (留空，使用默认)
Start Command: npm start
Build Method: Dockerfile (或 NIXPACKS)
```

### 环境变量（在 Variables 标签中设置）：

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=你的数据库连接字符串
JWT_SECRET=你的JWT密钥
CORS_ORIGIN=*
```

---

## 🎯 快速检查清单

在设置 Root Directory 之前，确认：

- [ ] 你的服务是 "GitHub Repo" 类型
- [ ] 你进入了正确的服务页面（显示失败的那个）
- [ ] 你点击了 "Settings" 标签
- [ ] 你找到了 "Service Settings" 部分
- [ ] 你看到了 "Root Directory" 输入框

设置 Root Directory 之后，确认：

- [ ] 输入的值是：`backend/services/user`（没有斜杠）
- [ ] 设置已保存（输入框会显示你输入的值）
- [ ] 新的部署已自动触发
- [ ] 在 "Deployments" 标签中可以看到新的部署

---

## 🐛 常见问题

### Q1: 设置后还是失败？
**检查：**
1. Root Directory 路径是否正确（区分大小写）
2. 该目录下是否有 `package.json` 文件
3. 该目录下是否有 `Dockerfile` 文件（如果使用 Dockerfile）
4. 查看部署日志中的具体错误信息

### Q2: 找不到 Root Directory 输入框？
**可能原因：**
- 服务类型不是 "GitHub Repo"
- 需要重新创建服务

### Q3: 设置后没有自动重新部署？
**解决方法：**
- 手动点击 "Redeploy" 按钮
- 或者推送一个新的 commit 到 GitHub

---

## 📸 需要帮助？

如果按照以上步骤还是无法找到 Root Directory，请：

1. **截图你的 Settings 页面**发给我
2. 或者告诉我你在 Settings 页面看到了什么选项

我会根据你的具体情况提供更精确的指导。

---

## ✅ 成功标志

设置正确后，你应该看到：

- ✅ Build 步骤显示 "Building image" 或 "Installing dependencies"
- ✅ 不再出现 "Error creating build plan with Railpack"
- ✅ 部署成功，服务状态变为 "Running"
