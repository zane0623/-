# 🔧 Render Root Directory 错误修复

## ❌ 当前错误

```
Root directory "user" does not exist
error: invalid local resolve 1stat /opt/render/project/src/backend: no such file or directory
```

**原因**：Root Directory 设置错误，应该是 `backend/services/user` 而不是 `user`

---

## ✅ 修复步骤

### 步骤 1：进入服务设置

1. 在 Render Dashboard，点击你的服务 **"-RWA"**
2. 点击左侧的 **"Settings"** 标签

### 步骤 2：找到 Root Directory

在 Settings 页面中：

1. 向下滚动找到 **"General"** 部分
2. 找到 **"Root Directory"** 字段
3. 当前值可能是：`user` ❌

### 步骤 3：修改 Root Directory

将 Root Directory 改为：

```
backend/services/user
```

**重要提示：**
- ✅ 正确：`backend/services/user`
- ❌ 错误：`user`
- ❌ 错误：`/backend/services/user`（不要开头斜杠）
- ❌ 错误：`backend/services/user/`（不要结尾斜杠）

### 步骤 4：保存并重新部署

1. 点击 **"Save Changes"**（或自动保存）
2. 点击 **"Manual Deploy"** → **"Deploy latest commit"**
3. 等待重新部署

---

## 📋 各服务的正确 Root Directory

| 服务 | Root Directory |
|------|----------------|
| User Service | `backend/services/user` |
| NFT Service | `backend/services/nft` |
| Presale Service | `backend/services/presale` |
| Payment Service | `backend/services/payment` |
| Traceability Service | `backend/services/traceability` |
| Logistics Service | `backend/services/logistics` |
| Compliance Service | `backend/services/compliance` |
| Notification Service | `backend/services/notification` |
| i18n Service | `backend/services/i18n` |
| Currency Service | `backend/services/currency` |

---

## 🎯 快速修复

1. **进入 Settings**
   - 服务页面 → Settings 标签

2. **修改 Root Directory**
   - 找到 "Root Directory" 字段
   - 改为：`backend/services/user`

3. **保存并部署**
   - 保存更改
   - 手动触发部署

---

## ✅ 验证

修复后，部署日志应该显示：

```
==> Cloning from https://github.com/zane0623/-
==> Checking out commit 2316530...
==> Building...
==> Installing dependencies...
==> Building application...
==> Starting...
```

而不是之前的错误信息。

---

## 🐛 如果还是失败？

检查：

1. **Root Directory 拼写**
   - 确认是 `backend/services/user`（小写，无斜杠）

2. **仓库结构**
   - 确认 GitHub 仓库中有 `backend/services/user` 目录

3. **分支**
   - 确认分支是 `main` 且包含最新代码

4. **查看完整日志**
   - 在 Logs 标签中查看详细错误信息

---

## 📞 需要帮助？

如果修复后还有问题，告诉我：
1. 新的错误信息
2. Root Directory 的当前值
3. 部署日志的内容
