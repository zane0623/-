# 🎯 Vercel Application Preset 选择指南

## ✅ 正确答案

### Application Preset（应用预设）

选择：**`Next.js`**

---

## 📋 为什么选择 Next.js？

### 项目技术栈

你的项目使用的是：
- ✅ **Next.js 14**（从 `package.json` 可以看到）
- ✅ **React 18**
- ✅ **TypeScript**

所以应该选择 **Next.js** 预设。

---

## 🔍 如何确认

### 方法 1：Vercel 自动检测

Vercel 通常会**自动检测**你的项目类型：

1. 当你导入 GitHub 仓库时
2. Vercel 会扫描项目文件
3. 如果检测到 `next.config.js` 或 `package.json` 中有 Next.js
4. 会自动选择 **Next.js** 预设

### 方法 2：手动选择

如果自动检测失败，手动选择：

1. 在项目配置页面
2. 找到 **"Framework Preset"** 或 **"Application Preset"**
3. 从下拉菜单中选择：**`Next.js`**

---

## 📝 完整的配置示例

### Web 前端配置

```
Project Name: juyuan-nft-web
Framework Preset: Next.js ← 选择这个
Root Directory: frontend/web
Build Command: npm run build（自动填充）
Output Directory: .next（自动填充）
Install Command: npm install（自动填充）
```

### Admin 后台配置

```
Project Name: juyuan-nft-admin
Framework Preset: Next.js ← 选择这个
Root Directory: frontend/admin
Build Command: npm run build（自动填充）
Output Directory: .next（自动填充）
Install Command: npm install（自动填充）
```

---

## ⚠️ 其他预设选项（不要选）

### ❌ 不要选择这些：

- **React** - 这是纯 React，不是 Next.js
- **Vite** - 这是 Vite 构建工具
- **Create React App** - 这是旧的 React 模板
- **Other** - 除非你知道自己在做什么

### ✅ 只选择：

- **Next.js** - 这是正确的选择

---

## 🎯 选择 Next.js 后的自动配置

当你选择 Next.js 后，Vercel 会自动：

- ✅ 设置正确的 Build Command: `npm run build`
- ✅ 设置正确的 Output Directory: `.next`
- ✅ 配置正确的路由和 API 路由
- ✅ 启用自动优化（图片、字体等）
- ✅ 配置正确的缓存策略

---

## 🔍 验证配置

选择 Next.js 后，你应该看到：

1. **Build Command**: `npm run build`（或 `next build`）
2. **Output Directory**: `.next`
3. **Install Command**: `npm install`（或 `yarn install`）

这些通常会自动填充，不需要手动修改。

---

## 🐛 如果找不到 Next.js 选项？

### 可能的原因：

1. **项目结构问题**
   - 确认 Root Directory 设置为 `frontend/web`
   - Vercel 需要能找到 `package.json` 和 `next.config.js`

2. **自动检测失败**
   - 手动选择 Next.js
   - 或检查项目文件是否正确

3. **Vercel 界面更新**
   - 选项名称可能略有不同
   - 寻找类似 "Next.js"、"Next.js (App Router)" 等选项

---

## ✅ 快速检查清单

- [ ] Framework Preset / Application Preset: **Next.js**
- [ ] Root Directory: `frontend/web`（Web 前端）或 `frontend/admin`（Admin 后台）
- [ ] Build Command: `npm run build`（自动填充）
- [ ] Output Directory: `.next`（自动填充）

---

## 🎉 完成！

选择 **Next.js** 后，Vercel 会自动配置所有必要的设置，你只需要：

1. 设置 Root Directory
2. 添加环境变量
3. 点击 Deploy

就这么简单！
