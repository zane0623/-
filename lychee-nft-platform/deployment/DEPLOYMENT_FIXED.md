# Docker 部署问题修复说明

## 问题描述

原始的 `docker-compose.yml` 文件引用了多个不存在的文件和配置，导致无法正常启动服务。

## 已修复的问题

### 1. ✅ 缺少 Dockerfile

**问题**: Frontend 和 Backend 目录下没有 Dockerfile

**解决方案**:
- 创建了 `/frontend/Dockerfile` - 使用 Next.js 的 standalone 模式构建
- 创建了 `/backend/Dockerfile` - 使用 TypeScript 编译构建
- 添加了多阶段构建优化镜像大小
- 使用非 root 用户运行提高安全性

### 2. ✅ 缺少数据库初始化脚本

**问题**: `docker-compose.yml` 引用了不存在的 `init.sql`

**解决方案**:
- 创建了 `/deployment/docker/init.sql`
- 包含完整的数据库表结构：
  - users (用户表)
  - nfts (NFT表)
  - orders (订单表)
  - production_data (生产溯源数据表)
  - transactions (交易记录表)
  - compliance_records (合规记录表)
- 添加了索引和触发器优化性能
- 包含初始管理员用户

### 3. ✅ 缺少 Nginx 配置文件

**问题**: `docker-compose.yml` 引用了不存在的 `nginx.conf`

**解决方案**:
- 创建了 `/deployment/docker/nginx.conf`
- 配置了前端和后端的反向代理
- 支持 HTTP 和 HTTPS
- 启用了 Gzip 压缩
- 配置了 WebSocket 支持
- 添加了安全头

### 4. ✅ 缺少 SSL 证书目录

**问题**: Nginx 配置需要 SSL 证书但目录不存在

**解决方案**:
- 创建了 `/deployment/docker/ssl/` 目录
- 添加了 `ssl/README.md` 说明如何生成证书
- 提供了开发环境自签名证书生成命令
- 提供了生产环境 Let's Encrypt 证书获取指南

### 5. ✅ 缺少环境变量配置

**问题**: 没有环境变量配置示例

**解决方案**:
- 创建了 `/deployment/docker/env.example`
- 包含所有必需的环境变量
- 添加了详细的注释说明

### 6. ✅ 缺少 .dockerignore 文件

**问题**: Docker 构建会包含不必要的文件

**解决方案**:
- 创建了 `/frontend/.dockerignore`
- 创建了 `/backend/.dockerignore`
- 排除 node_modules、.git 等不必要的文件

### 7. ✅ 缺少 Next.js 配置

**问题**: Next.js 需要配置 standalone 模式才能在 Docker 中运行

**解决方案**:
- 创建了 `/frontend/next.config.js`
- 启用 standalone 输出模式
- 配置环境变量
- 配置图片域名白名单

### 8. ✅ 缺少 TypeScript 配置

**问题**: Backend 需要 TypeScript 配置才能编译

**解决方案**:
- 创建了 `/backend/tsconfig.json`
- 配置了编译选项
- 设置了正确的输出目录

### 9. ✅ 缺少快速启动脚本

**问题**: 手动配置步骤繁琐

**解决方案**:
- 创建了 `/deployment/docker/setup.sh`
- 自动检查 Docker 环境
- 自动创建 .env 文件
- 自动生成 SSL 证书
- 一键启动所有服务

### 10. ✅ 缺少部署文档

**问题**: 没有详细的部署说明

**解决方案**:
- 创建了 `/deployment/docker/README.md`
- 包含快速开始指南
- 包含服务说明
- 包含常见问题解答
- 包含维护命令

## 文件清单

已创建的文件：

```
lychee-nft-platform/
├── frontend/
│   ├── Dockerfile ✅
│   ├── .dockerignore ✅
│   └── next.config.js ✅
├── backend/
│   ├── Dockerfile ✅
│   ├── .dockerignore ✅
│   └── tsconfig.json ✅
└── deployment/
    └── docker/
        ├── docker-compose.yml (已存在)
        ├── init.sql ✅
        ├── nginx.conf ✅
        ├── env.example ✅
        ├── setup.sh ✅
        ├── README.md ✅
        └── ssl/
            └── README.md ✅
```

## 快速开始

### 方法 1: 使用自动化脚本（推荐）

```bash
cd /Users/fancyfizzy/Downloads/RWA/lychee-nft-platform/deployment/docker
./setup.sh
```

### 方法 2: 手动启动

```bash
cd /Users/fancyfizzy/Downloads/RWA/lychee-nft-platform/deployment/docker

# 1. 创建环境变量文件
cp env.example .env
# 编辑 .env 文件，填入实际配置

# 2. 生成 SSL 证书（开发环境）
cd ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/C=CN/ST=Guangdong/L=Guangzhou/O=Lychee NFT/CN=localhost"
cd ..

# 3. 启动服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f
```

## 访问地址

启动成功后，可以通过以下地址访问：

- **前端应用**: http://localhost
- **后端 API**: http://localhost/api
- **数据库**: localhost:5432
- **Redis**: localhost:6379

## 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f [service_name]

# 重启服务
docker-compose restart [service_name]

# 停止服务
docker-compose down

# 停止并删除数据
docker-compose down -v

# 重新构建
docker-compose build --no-cache

# 进入容器
docker-compose exec [service_name] sh
```

## 注意事项

### 生产环境部署前必须：

1. ✅ 修改所有默认密码（数据库、JWT_SECRET）
2. ✅ 使用真实的 SSL 证书（Let's Encrypt）
3. ✅ 配置正确的域名和 CORS
4. ✅ 启用 Nginx 的 HTTPS 重定向
5. ✅ 配置防火墙规则
6. ✅ 设置日志轮转
7. ✅ 配置监控和告警
8. ✅ 定期备份数据库

### 开发环境注意：

1. 自签名证书会导致浏览器警告（正常现象）
2. 默认密码仅用于开发，不要在生产环境使用
3. 确保端口 80、443、3000、4000、5432、6379 未被占用

## 下一步

1. **配置环境变量**: 编辑 `.env` 文件，填入实际的配置值
2. **部署智能合约**: 使用 `/scripts/deploy/deploy-contracts.js` 部署合约
3. **更新合约地址**: 将部署的合约地址填入 `.env` 的 `CONTRACT_ADDRESS`
4. **测试服务**: 访问前端应用，测试各项功能
5. **配置域名**: 如果是生产环境，配置域名和 DNS
6. **监控告警**: 配置 Sentry、Prometheus 等监控工具

## 技术支持

如遇到问题，请检查：

1. Docker 和 Docker Compose 版本是否符合要求
2. 端口是否被占用
3. 环境变量是否配置正确
4. 查看日志排查具体错误

---

**修复完成时间**: 2025-10-05  
**修复状态**: ✅ 所有问题已解决，可以正常启动
