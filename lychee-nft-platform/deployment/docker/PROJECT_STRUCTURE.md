# 项目结构说明

## 📁 完整目录结构

```
lychee-nft-platform/
├── deployment/
│   └── docker/
│       ├── docker-compose.yml          # 主配置文件（增强版）
│       ├── docker-compose.dev.yml      # 开发环境覆盖配置
│       ├── docker-compose.prod.yml     # 生产环境覆盖配置
│       ├── init.sql                    # 数据库初始化脚本
│       ├── nginx.conf                  # Nginx 配置文件
│       ├── setup.sh                    # 快速设置脚本
│       ├── Makefile                    # 便捷命令接口
│       ├── .gitignore                  # Git 忽略文件
│       ├── env.example                 # 环境变量示例
│       ├── env.development             # 开发环境配置
│       ├── env.production              # 生产环境配置
│       ├── README.md                   # 部署指南（增强版）
│       ├── DEPLOYMENT_FIXED.md         # 问题修复说明
│       ├── ENHANCED_FEATURES.md        # 增强功能说明
│       ├── PROJECT_STRUCTURE.md        # 本文档
│       ├── monitoring/                 # 监控配置
│       │   ├── prometheus.yml          # Prometheus 配置
│       │   └── grafana/
│       │       ├── dashboards/
│       │       │   └── dashboard.yml   # 仪表板配置
│       │       └── datasources/
│       │           └── prometheus.yml  # 数据源配置
│       ├── scripts/                    # 管理脚本
│       │   ├── backup.sh               # 备份脚本
│       │   ├── restore.sh              # 恢复脚本
│       │   └── manage.sh               # 统一管理工具
│       ├── ssl/                        # SSL 证书目录
│       │   └── README.md               # 证书说明
│       └── backups/                    # 备份文件目录
│           └── .gitkeep
├── frontend/
│   ├── Dockerfile                      # 前端 Docker 配置
│   ├── .dockerignore                   # Docker 忽略文件
│   ├── next.config.js                  # Next.js 配置
│   ├── package.json
│   ├── src/
│   ├── components/
│   └── public/
├── backend/
│   ├── Dockerfile                      # 后端 Docker 配置
│   ├── .dockerignore                   # Docker 忽略文件
│   ├── tsconfig.json                   # TypeScript 配置
│   ├── package.json
│   ├── src/
│   ├── config/
│   └── models/
└── contracts/
    ├── src/
    │   └── DragonEggLycheeNFT.sol
    ├── artifacts/
    ├── test/
    └── package.json
```

## 📝 文件说明

### Docker 配置文件

#### docker-compose.yml
**主配置文件**，包含所有服务定义：
- ✅ 核心应用服务（Frontend, Backend, Postgres, Redis, Nginx）
- ✅ 监控服务（Prometheus, Grafana, Exporters）
- ✅ 管理工具（pgAdmin, Redis Commander）
- ✅ 备份服务
- ✅ 健康检查配置
- ✅ 日志管理配置
- ✅ 网络和卷配置

#### docker-compose.dev.yml
**开发环境覆盖配置**：
- 代码热重载
- 开发模式启动
- 禁用监控服务（节省资源）
- 挂载本地代码目录

#### docker-compose.prod.yml
**生产环境覆盖配置**：
- 资源限制和预留
- 优化的数据库参数
- 优化的 Redis 配置
- 自动重启策略

### 应用配置文件

#### frontend/Dockerfile
**前端 Docker 镜像**：
- 多阶段构建
- Next.js standalone 模式
- 非 root 用户运行
- 优化的镜像大小

#### backend/Dockerfile
**后端 Docker 镜像**：
- TypeScript 编译
- 多阶段构建
- 非 root 用户运行
- 生产环境优化

#### init.sql
**数据库初始化脚本**：
- 创建所有表结构
- 设置索引和触发器
- 插入初始数据
- 配置扩展

#### nginx.conf
**Nginx 配置**：
- HTTP/HTTPS 支持
- 反向代理配置
- Gzip 压缩
- WebSocket 支持
- 安全头配置

### 监控配置

#### monitoring/prometheus.yml
**Prometheus 监控配置**：
- 抓取配置
- 目标服务定义
- 告警规则（可选）

#### monitoring/grafana/
**Grafana 配置**：
- 数据源配置
- 仪表板定义
- 自动加载配置

### 管理脚本

#### scripts/backup.sh
**自动备份脚本**：
- 定时备份数据库
- 压缩备份文件
- 清理旧备份
- 日志记录

#### scripts/restore.sh
**数据库恢复脚本**：
- 恢复备份数据
- 安全确认机制
- 错误处理

#### scripts/manage.sh
**统一管理工具**：
- 服务管理（启动/停止/重启）
- 日志查看
- 容器操作
- 数据库操作
- 系统维护
- 健康检查

#### setup.sh
**快速设置脚本**：
- 环境检查
- 配置初始化
- SSL 证书生成
- 一键启动

#### Makefile
**便捷命令接口**：
- 简化的命令行接口
- 开发/生产环境切换
- 常用操作快捷方式

### 环境配置

#### env.example
**环境变量示例**：
- 所有可配置项
- 详细注释说明
- 默认值参考

#### env.development
**开发环境配置**：
- 开发数据库配置
- 测试网络配置
- 宽松的安全设置

#### env.production
**生产环境配置**：
- 生产数据库配置
- 主网配置
- 严格的安全设置
- 密码提醒

### 文档文件

#### README.md
**部署指南**：
- 快速开始
- 服务架构
- 管理命令
- 故障排查
- 生产部署

#### DEPLOYMENT_FIXED.md
**问题修复说明**：
- 已修复的问题列表
- 解决方案说明
- 文件清单

#### ENHANCED_FEATURES.md
**增强功能说明**：
- 监控系统
- 管理工具
- 备份系统
- 多环境支持
- 性能优化

#### PROJECT_STRUCTURE.md
**项目结构说明**（本文档）：
- 完整目录结构
- 文件说明
- 使用指南

## 🎯 使用指南

### 开发环境

```bash
# 1. 进入部署目录
cd deployment/docker

# 2. 使用开发环境配置
cp env.development .env

# 3. 启动开发环境
make dev

# 4. 查看日志
make dev-logs
```

### 生产环境

```bash
# 1. 进入部署目录
cd deployment/docker

# 2. 使用生产环境配置
cp env.production .env

# 3. 修改所有密码
vim .env

# 4. 配置 SSL 证书
# 参考 ssl/README.md

# 5. 启动生产环境
make prod

# 6. 验证部署
make health
```

### 日常维护

```bash
# 查看服务状态
make status

# 查看日志
make logs

# 备份数据库
make db-backup

# 重启服务
make restart

# 健康检查
make health

# 查看资源使用
./scripts/manage.sh resources
```

## 📊 服务端口映射

| 服务 | 容器端口 | 主机端口 | 说明 |
|------|----------|----------|------|
| Frontend | 3000 | 3000 | Next.js 应用 |
| Backend | 4000 | 4000 | Express API |
| Postgres | 5432 | 5432 | 数据库 |
| Redis | 6379 | 6379 | 缓存 |
| Nginx | 80, 443 | 80, 443 | Web 服务器 |
| Prometheus | 9090 | 9090 | 监控 |
| Grafana | 3000 | 3001 | 仪表板 |
| pgAdmin | 80 | 5050 | 数据库管理 |
| Redis Commander | 8081 | 8081 | Redis 管理 |
| Node Exporter | 9100 | 9100 | 系统指标 |
| Postgres Exporter | 9187 | 9187 | 数据库指标 |
| Redis Exporter | 9121 | 9121 | Redis 指标 |

## 🔄 数据卷

| 卷名 | 用途 | 说明 |
|------|------|------|
| postgres_data | 数据库数据 | 持久化数据库 |
| redis_data | Redis 数据 | 持久化缓存 |
| backend_uploads | 文件上传 | 用户上传的文件 |
| backend_logs | 应用日志 | 后端日志文件 |
| prometheus_data | 监控数据 | Prometheus 时序数据 |
| grafana_data | Grafana 数据 | 仪表板和配置 |
| pgadmin_data | pgAdmin 数据 | 数据库管理工具数据 |
| nginx_cache | Nginx 缓存 | Web 服务器缓存 |
| nginx_logs | Nginx 日志 | Web 服务器日志 |

## 🌐 网络配置

### lychee-network
**自定义桥接网络**：
- 子网: 172.28.0.0/16
- 服务间通信
- DNS 解析
- 网络隔离

## 🔐 安全特性

### 容器安全
- ✅ 非 root 用户运行
- ✅ 只读文件系统（部分）
- ✅ 资源限制
- ✅ 健康检查
- ✅ 自动重启

### 网络安全
- ✅ 内部网络隔离
- ✅ SSL/TLS 支持
- ✅ 安全头配置
- ✅ CORS 配置

### 数据安全
- ✅ 自动备份
- ✅ 数据加密（传输层）
- ✅ 访问控制
- ✅ 日志审计

## 📈 监控指标

### 系统指标
- CPU 使用率
- 内存使用率
- 磁盘使用率
- 网络流量

### 应用指标
- API 响应时间
- 请求成功率
- 错误率
- 并发连接数

### 数据库指标
- 连接数
- 查询性能
- 缓存命中率
- 慢查询

### Redis 指标
- 内存使用
- 命中率
- 操作延迟
- 连接数

## 🚀 性能优化

### 数据库优化
- 连接池配置
- 查询缓存
- 索引优化
- 参数调优

### 缓存优化
- Redis 配置
- 缓存策略
- 过期策略
- 内存管理

### Web 优化
- Gzip 压缩
- 静态资源缓存
- 负载均衡
- 连接复用

### 容器优化
- 多阶段构建
- 镜像分层
- 资源限制
- 健康检查

## 📚 相关技术栈

### 前端
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

### 后端
- Node.js 18
- Express.js
- TypeScript
- Prisma ORM

### 数据库
- PostgreSQL 15
- Redis 7

### 监控
- Prometheus
- Grafana
- Node Exporter
- Postgres Exporter
- Redis Exporter

### 工具
- Docker
- Docker Compose
- Nginx
- pgAdmin
- Redis Commander

---

**文档版本**: 1.0  
**更新日期**: 2025-10-05  
**维护者**: Lychee NFT Platform Team
