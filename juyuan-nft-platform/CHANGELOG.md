# 更新日志

所有重要的变更都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- 添加错误边界组件 (ErrorBoundary)
- 集成 Sentry 错误监控
- 添加 API 速率限制中间件
- 创建 Swagger API 文档
- 添加 SEO 优化（sitemap.xml, robots.txt）
- 添加 PWA 支持（manifest.json）
- 完善 GitHub Actions CI/CD 工作流
- 添加 CONTRIBUTING.md 贡献指南
- 添加 CHANGELOG.md 更新日志

### 改进
- 优化错误处理机制
- 增强 API 安全性（速率限制）
- 改进 SEO 元数据
- 完善项目文档

### 修复
- 修复 TypeScript 类型错误
- 修复构建配置问题
- 清理生产代码中的 console 语句

## [1.0.0] - 2025-01-24

### 新增
- 初始版本发布
- 智能合约（AgriProductNFT, PresaleManager, EscrowManager）
- 后端微服务架构（10个服务）
- 前端 Web 应用（Next.js）
- 管理后台（Admin Panel）
- 数据库 Schema（Prisma）
- Docker 部署配置
- Kubernetes 部署配置
- 基础测试套件

### 功能
- 用户注册/登录（邮箱和钱包）
- NFT 铸造和管理
- 预售功能
- 支付集成（Stripe, 微信, 支付宝, 加密货币）
- 供应链溯源
- 物流跟踪
- KYC/AML 合规
- 多语言支持（i18n）
- 多币种支持

---

## 版本说明

- **主版本号**: 不兼容的 API 修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

## 链接

- [GitHub Releases](https://github.com/zane0623/-/releases)
- [项目文档](https://github.com/zane0623/-/tree/main/docs)
