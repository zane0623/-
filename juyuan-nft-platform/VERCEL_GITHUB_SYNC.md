# 🔄 Vercel 与 GitHub 同步指南

## 📋 概述

Vercel 与 GitHub 的集成有两种方式：
1. **GitHub → Vercel**（自动部署）：当你推送代码到 GitHub 时，Vercel 自动部署
2. **Vercel → GitHub**（手动同步）：将 Vercel 的更改同步回 GitHub（不常用）

---

## 🚀 方式一：GitHub → Vercel（推荐）

### 自动部署流程

当你推送代码到 GitHub 时，Vercel 会自动检测并部署：

```bash
# 1. 修改代码
git add .
git commit -m "你的更改说明"
git push origin main
```

**Vercel 会自动：**
- ✅ 检测到 GitHub 的新提交
- ✅ 自动触发构建
- ✅ 部署到生产环境

### 查看部署状态

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 在 **"Deployments"** 标签页查看部署历史
4. 点击部署查看构建日志

---

## 🔧 方式二：手动触发部署

### 在 Vercel Dashboard 中

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击 **"Deployments"** 标签页
4. 点击右上角的 **"Redeploy"** 按钮
5. 选择要重新部署的版本

### 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

---

## 🔄 方式三：Vercel → GitHub（不常用）

### 场景说明

通常不需要将 Vercel 的更改同步回 GitHub，因为：
- Vercel 是部署平台，代码应该在 GitHub 管理
- Vercel 的环境变量和配置不会自动同步到 GitHub

### 如果需要同步配置

**环境变量：**
- Vercel 的环境变量不会自动同步到 GitHub
- 需要手动在 GitHub 仓库中创建 `.env.example` 文件

**配置文件：**
- `vercel.json` 等配置文件应该在 GitHub 中管理
- 修改后推送到 GitHub，Vercel 会自动读取

---

## 📝 常见操作

### 1. 检查 GitHub 连接

1. 进入 Vercel Dashboard
2. 选择项目 → **Settings** → **Git**
3. 确认 **"Connected Git Repository"** 显示正确的 GitHub 仓库

### 2. 重新连接 GitHub

如果连接断开：

1. 进入 **Settings** → **Git**
2. 点击 **"Disconnect"**
3. 点击 **"Connect Git Repository"**
4. 选择你的 GitHub 仓库
5. 授权访问

### 3. 配置自动部署分支

1. 进入 **Settings** → **Git**
2. 在 **"Production Branch"** 设置主分支（通常是 `main`）
3. 在 **"Deploy Hooks"** 可以创建自定义部署钩子

### 4. 查看部署日志

1. 进入 **Deployments** 标签页
2. 点击任意部署
3. 查看 **"Build Logs"** 和 **"Function Logs"**

---

## 🎯 推荐工作流程

### 标准开发流程

```bash
# 1. 本地开发
git checkout -b feature/new-feature
# ... 修改代码 ...

# 2. 提交到 GitHub
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature

# 3. 创建 Pull Request（可选）
# 在 GitHub 上创建 PR，Vercel 会自动创建预览部署

# 4. 合并到主分支
git checkout main
git merge feature/new-feature
git push origin main

# 5. Vercel 自动部署到生产环境
```

### 预览部署

- ✅ 每个 Pull Request 会自动创建预览部署
- ✅ 预览 URL 会在 PR 中显示
- ✅ 合并 PR 后，预览部署会自动删除

---

## ⚙️ 配置选项

### 在 `vercel.json` 中配置

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["hkg1"]
}
```

### 在 Vercel Dashboard 中配置

1. **Settings** → **General**
   - Framework Preset: Next.js
   - Root Directory: `frontend/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

2. **Settings** → **Environment Variables**
   - 添加所有需要的环境变量
   - 可以为不同环境（Production/Preview/Development）设置不同值

---

## 🔍 故障排查

### 问题1：部署失败

**检查：**
1. 查看部署日志中的错误信息
2. 确认环境变量已正确设置
3. 检查 `package.json` 中的构建脚本
4. 确认 Root Directory 设置正确

### 问题2：GitHub 没有触发部署

**检查：**
1. 确认 GitHub 仓库已连接
2. 检查分支名称是否正确
3. 查看 Vercel 的 Webhook 是否正常（Settings → Git → Webhooks）

### 问题3：环境变量未生效

**检查：**
1. 确认环境变量名称正确（注意大小写）
2. 确认已选择正确的环境（Production/Preview）
3. 重新部署以应用新的环境变量

---

## 📚 相关文档

- [Vercel 文档](https://vercel.com/docs)
- [GitHub 集成](https://vercel.com/docs/concepts/git)
- [环境变量](https://vercel.com/docs/concepts/projects/environment-variables)
- [部署配置](https://vercel.com/docs/concepts/projects/overview)

---

## ✅ 快速检查清单

- [ ] GitHub 仓库已连接到 Vercel
- [ ] Root Directory 设置正确（`frontend/web`）
- [ ] 环境变量已配置
- [ ] 构建命令正确
- [ ] 主分支设置正确（`main`）

---

## 🎉 总结

**推荐流程：**
1. ✅ 在 GitHub 中管理代码
2. ✅ 推送到 GitHub 自动触发 Vercel 部署
3. ✅ 在 Vercel Dashboard 查看部署状态
4. ✅ 使用预览部署测试 PR

**不需要：**
- ❌ 手动将 Vercel 配置同步到 GitHub（配置文件应该在 GitHub 中）
- ❌ 在 Vercel 中直接修改代码（应该在本地修改后推送到 GitHub）

---

**记住：GitHub 是代码源，Vercel 是部署平台！** 🚀
