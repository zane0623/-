# 🔧 Vercel 构建错误修复

## ❌ 错误信息

```
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies". Also check your Root Directory setting matches the directory of your package.json file.
```

## 🔍 问题分析

Vercel 无法检测到 Next.js，可能的原因：

1. **Root Directory 设置错误**
   - Root Directory 应该指向包含 `package.json` 的目录
   - 应该是：`frontend/web`

2. **package.json 位置**
   - Vercel 需要在 Root Directory 中找到 `package.json`
   - `frontend/web/package.json` 必须存在

## ✅ 修复步骤

### 步骤 1：检查 Root Directory

在 Vercel Dashboard：

1. 进入项目设置
2. 找到 **"Root Directory"** 设置
3. 确认值为：`frontend/web`
   - ✅ 正确：`frontend/web`
   - ❌ 错误：`/frontend/web`（不要开头斜杠）
   - ❌ 错误：`frontend/web/`（不要结尾斜杠）
   - ❌ 错误：`web`（不完整）

### 步骤 2：验证 package.json

确认 `frontend/web/package.json` 存在且包含：

```json
{
  "dependencies": {
    "next": "14.0.4",
    ...
  }
}
```

### 步骤 3：重新部署

1. 修改 Root Directory 后
2. 点击 **"Redeploy"**
3. 或等待自动重新部署

## 🎯 快速修复

### 在 Vercel Dashboard 中：

1. **进入项目设置**
   - 项目 → Settings → General

2. **检查 Root Directory**
   - 找到 "Root Directory" 字段
   - 设置为：`frontend/web`

3. **保存并重新部署**
   - 保存更改
   - 点击 "Redeploy"

## 📋 完整配置检查清单

在 Vercel 中确认：

- [ ] **Root Directory**: `frontend/web`
- [ ] **Framework Preset**: `Next.js`（自动检测）
- [ ] **Build Command**: `npm run build`（自动填充）
- [ ] **Output Directory**: `.next`（自动填充）
- [ ] **Install Command**: `npm install`（自动填充）

## 🐛 如果还是失败？

### 方法 1：删除并重新创建项目

1. 删除当前 Vercel 项目
2. 重新创建项目
3. 确保 Root Directory 设置为 `frontend/web`

### 方法 2：使用 vercel.json 配置

在 `frontend/web` 目录创建或更新 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### 方法 3：检查 Git 提交

确认最新的 commit 包含 `frontend/web/package.json`：

```bash
git log --oneline -5
git show HEAD:frontend/web/package.json | head -20
```

## ✅ 验证

修复后，构建日志应该显示：

```
✓ Detected Next.js version: 14.0.4
✓ Installing dependencies...
✓ Building...
```

而不是之前的错误。

## 📞 需要帮助？

如果修复后还是失败：

1. **检查构建日志**
   - 查看完整的错误信息
   - 确认 Root Directory 是否正确

2. **验证文件结构**
   - 确认 GitHub 仓库中有 `frontend/web/package.json`
   - 确认文件内容正确

3. **联系我**
   - 告诉我具体的错误信息
   - 或截图 Vercel 设置页面
