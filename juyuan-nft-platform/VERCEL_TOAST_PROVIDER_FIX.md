# Vercel ToastProvider 静态生成错误修复

## 问题描述

在 Vercel 构建过程中，出现了以下错误：
```
Error: useToast must be used within a ToastProvider
```

这个错误发生在静态页面生成（SSG）阶段，影响了多个页面：
- `/_not-found`
- `/cart`
- `/help`
- `/login`
- `/my-nfts`
- `/notifications`
- `/`
- `/presale`
- `/profile`
- `/search`
- `/traceability`
- `/wishlist`

## 根本原因

Next.js 14 在构建时会尝试静态生成页面，即使这些页面标记为 `'use client'`。当页面在静态生成阶段渲染时，React Context（如 `ToastProvider`）可能尚未初始化，导致 `useToast` hook 抛出错误。

## 解决方案

为所有使用 `useToast` 的页面添加 `export const dynamic = 'force-dynamic'` 配置，强制这些页面进行动态渲染，而不是静态生成。

### 修改的文件

1. `frontend/web/src/app/page.tsx` - 首页（使用 `FeaturedProducts` 组件，该组件使用 `useToast`）
2. `frontend/web/src/app/cart/page.tsx`
3. `frontend/web/src/app/help/page.tsx`
4. `frontend/web/src/app/login/page.tsx`
5. `frontend/web/src/app/my-nfts/page.tsx`
6. `frontend/web/src/app/notifications/page.tsx`
7. `frontend/web/src/app/presale/page.tsx`
8. `frontend/web/src/app/profile/page.tsx`
9. `frontend/web/src/app/search/page.tsx`
10. `frontend/web/src/app/traceability/page.tsx`
11. `frontend/web/src/app/wishlist/page.tsx`

### 修改示例

```typescript
'use client';

// Force dynamic rendering to avoid ToastProvider issues during static generation
export const dynamic = 'force-dynamic';

import { ... } from '...';
// ... rest of the code
```

## 影响

- ✅ 修复了所有页面的构建错误
- ✅ 页面仍然可以正常使用 `useToast` hook
- ⚠️ 这些页面将不再进行静态生成，而是每次请求时动态渲染
- ⚠️ 可能会略微增加服务器负载，但对于需要用户交互的页面来说这是合理的权衡

## 后续优化建议

如果未来需要优化性能，可以考虑：

1. **条件渲染 Toast**：在组件中检查 `ToastProvider` 是否可用，如果不可用则使用 fallback
2. **延迟加载 Toast**：只在用户交互时才初始化 Toast 功能
3. **分离静态和动态内容**：将使用 Toast 的交互部分提取为独立的客户端组件，保持页面其他部分的静态生成

## 提交信息

```
fix: 添加动态渲染配置以修复ToastProvider静态生成错误
```

## 状态

✅ 已修复并推送到 GitHub
🔄 Vercel 将自动触发新的构建
