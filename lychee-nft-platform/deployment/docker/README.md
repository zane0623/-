# Docker 部署指南 🐳

> 企业级 Docker 部署方案，包含监控、日志、备份、多环境支持等完整功能

## 📋 目录

- [快速开始](#快速开始)
- [服务架构](#服务架构)
- [环境配置](#环境配置)
- [管理命令](#管理命令)
- [监控和日志](#监控和日志)
- [备份和恢复](#备份和恢复)
- [故障排查](#故障排查)
- [生产部署](#生产部署)

---

## 🚀 快速开始

### 方式一：自动化脚本（推荐）

```bash
cd deployment/docker
./setup.sh
```

脚本会自动：
- ✅ 检查 Docker 环境
- ✅ 创建环境配置文件
- ✅ 生成 SSL 证书
- ✅ 启动所有服务

### 方式二：使用 Makefile

```bash
cd deployment/docker

# 开发环境
make dev

# 生产环境
make prod

# 查看帮助
make help
```

### 方式三：手动启动

```bash
cd deployment/docker

# 1. 准备环境变量
cp env.example .env
vim .env  # 编辑配置

# 2. 生成 SSL 证书（开发环境）
cd ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/C=CN/ST=Guangdong/L=Guangzhou/O=Lychee NFT/CN=localhost"
cd ..

# 3. 启动服务
docker-compose up -d

# 4. 查看状态
docker-compose ps
```

---

## 🏗️ 服务架构

### 核心服务

| 服务 | 端口 | 说明 |
|------|------|------|
| **Frontend** | 3000 | Next.js 前端应用 |
| **Backend** | 4000 | Express.js API 服务 |
| **PostgreSQL** | 5432 | 主数据库 |
| **Redis** | 6379 | 缓存和会话存储 |
| **Nginx** | 80, 443 | 反向代理和负载均衡 |

### 监控服务

| 服务 | 端口 | 说明 |
|------|------|------|
| **Prometheus** | 9090 | 指标收集和存储 |
| **Grafana** | 3001 | 数据可视化仪表板 |
| **Node Exporter** | 9100 | 系统指标导出器 |
| **Postgres Exporter** | 9187 | 数据库指标导出器 |
| **Redis Exporter** | 9121 | Redis 指标导出器 |

### 管理工具

| 服务 | 端口 | 说明 |
|------|------|------|
| **pgAdmin** | 5050 | PostgreSQL 管理工具 |
| **Redis Commander** | 8081 | Redis 管理工具 |

### 访问地址

```
🌐 前端应用:          http://localhost
🔌 后端 API:          http://localhost/api
📊 Grafana 监控:      http://localhost:3001
📈 Prometheus:        http://localhost:9090
🗄️  pgAdmin:          http://localhost:5050
🔴 Redis Commander:   http://localhost:8081
```

---

## ⚙️ 环境配置

### 开发环境

```bash
# 使用开发环境配置
cp env.development .env

# 启动开发环境
make dev
```

**特点**:
- 代码热重载
- 详细日志输出
- 使用测试网络
- 默认禁用监控（节省资源）

### 生产环境

```bash
# 使用生产环境配置
cp env.production .env

# ⚠️ 必须修改所有密码！
vim .env

# 启动生产环境
make prod
```

**特点**:
- 资源限制和优化
- 自动重启策略
- 完整的监控和日志
- 使用主网络

### 环境变量说明

```bash
# 数据库配置
POSTGRES_DB=lychee_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password  # ⚠️ 生产环境必须修改

# JWT 配置
JWT_SECRET=secret-key  # ⚠️ 生产环境必须修改

# 区块链配置
BLOCKCHAIN_RPC=https://polygon-rpc.com
CHAIN_ID=137
CONTRACT_ADDRESS=0x...  # 部署后的合约地址

# Redis 配置
REDIS_PASSWORD=  # ⚠️ 生产环境建议设置

# 监控配置
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin  # ⚠️ 生产环境必须修改
```

---

## 🎮 管理命令

### 使用 Makefile（推荐）

```bash
# 查看所有命令
make help

# 开发环境
make dev              # 启动开发环境
make dev-stop         # 停止开发环境
make dev-logs         # 查看开发日志

# 生产环境
make prod             # 启动生产环境
make prod-stop        # 停止生产环境
make prod-logs        # 查看生产日志

# 通用命令
make start            # 启动服务
make stop             # 停止服务
make restart          # 重启服务
make status           # 查看状态
make logs             # 查看日志

# 数据库
make db-backup        # 备份数据库
make db-restore FILE=<file>  # 恢复数据库
make db-shell         # 进入数据库

# 维护
make clean            # 清理资源
make update           # 更新服务
make health           # 健康检查
make urls             # 显示访问地址
```

### 使用管理脚本

```bash
# 查看所有命令
./scripts/manage.sh help

# 服务管理
./scripts/manage.sh start
./scripts/manage.sh stop
./scripts/manage.sh restart [service]
./scripts/manage.sh status

# 日志查看
./scripts/manage.sh logs [service]

# 容器操作
./scripts/manage.sh exec <service>

# 数据库操作
./scripts/manage.sh backup
./scripts/manage.sh restore <file>

# 系统维护
./scripts/manage.sh update
./scripts/manage.sh cleanup
./scripts/manage.sh resources
./scripts/manage.sh health
```

### 使用 Docker Compose

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f [service]

# 重启服务
docker-compose restart [service]

# 查看状态
docker-compose ps

# 进入容器
docker-compose exec <service> sh
```

---

## 📊 监控和日志

### Grafana 仪表板

访问 http://localhost:3001

**默认账号**: admin / admin

**监控指标**:
- CPU、内存、磁盘使用率
- 数据库连接数和查询性能
- Redis 缓存命中率
- API 响应时间和错误率
- 系统负载和网络流量

### Prometheus

访问 http://localhost:9090

**功能**:
- 指标查询和可视化
- 告警规则配置
- 服务发现

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend

# 查看最近 100 行
docker-compose logs -f --tail=100 backend

# 查看 Nginx 访问日志
docker-compose exec nginx tail -f /var/log/nginx/access.log

# 查看 Nginx 错误日志
docker-compose exec nginx tail -f /var/log/nginx/error.log
```

---

## 💾 备份和恢复

### 自动备份

系统每天凌晨 2 点自动备份数据库。

**配置**:
```bash
BACKUP_KEEP_DAYS=7        # 保留天数
BACKUP_SCHEDULE=0 2 * * * # Cron 表达式
```

### 手动备份

```bash
# 方式 1: 使用 Makefile
make db-backup

# 方式 2: 使用管理脚本
./scripts/manage.sh backup

# 方式 3: 使用 Docker Compose
docker-compose exec postgres pg_dump -U user lychee_db | gzip > backup.sql.gz
```

### 恢复数据库

```bash
# 方式 1: 使用 Makefile
make db-restore FILE=./backups/backup.sql.gz

# 方式 2: 使用管理脚本
./scripts/manage.sh restore ./backups/backup.sql.gz

# 方式 3: 使用 Docker Compose
gunzip -c backup.sql.gz | docker-compose exec -T postgres psql -U user lychee_db
```

**备份文件位置**: `./backups/`

---

## 🔍 故障排查

### 健康检查

```bash
# 全面健康检查
make health

# 或使用管理脚本
./scripts/manage.sh health

# 查看容器健康状态
docker-compose ps
```

### 常见问题

#### 1. 端口冲突

```bash
# 检查端口占用
lsof -i :80
lsof -i :5432

# 解决方案：修改 .env 中的端口
HTTP_PORT=8080
POSTGRES_PORT=5433
```

#### 2. 容器无法启动

```bash
# 查看日志
docker-compose logs <service>

# 检查配置
docker-compose config

# 重新构建
docker-compose build --no-cache <service>
```

#### 3. 数据库连接失败

```bash
# 检查数据库状态
docker-compose exec postgres pg_isready -U user

# 查看数据库日志
docker-compose logs postgres

# 进入数据库检查
docker-compose exec postgres psql -U user lychee_db
```

#### 4. 内存不足

```bash
# 查看资源使用
docker stats

# 解决方案：调整资源限制
# 编辑 docker-compose.prod.yml 中的 resources 配置
```

#### 5. SSL 证书问题

```bash
# 检查证书文件
ls -la ssl/

# 重新生成证书
cd ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/C=CN/ST=Guangdong/L=Guangzhou/O=Lychee NFT/CN=localhost"
```

### 查看资源使用

```bash
# 实时监控
docker stats

# 使用管理脚本
./scripts/manage.sh resources
```

---

## 🚀 生产部署

### 部署前检查清单

- [ ] 修改所有默认密码
- [ ] 配置真实的 SSL 证书
- [ ] 设置正确的域名和 CORS
- [ ] 配置防火墙规则
- [ ] 设置日志轮转
- [ ] 配置监控告警
- [ ] 设置自动备份
- [ ] 进行压力测试
- [ ] 准备回滚方案

### 生产环境部署步骤

```bash
# 1. 准备服务器
# - 安装 Docker 和 Docker Compose
# - 配置防火墙
# - 设置域名 DNS

# 2. 克隆代码
git clone <repository>
cd lychee-nft-platform/deployment/docker

# 3. 配置环境
cp env.production .env
vim .env  # 修改所有密码和配置

# 4. 配置 SSL 证书
# 使用 Let's Encrypt
certbot certonly --standalone -d yourdomain.com
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem

# 5. 启动服务
make prod

# 6. 验证部署
make health
make status

# 7. 配置监控告警
# 访问 Grafana 配置告警规则

# 8. 测试备份恢复
make db-backup
```

### 安全加固

```bash
# 1. 生成强密码
openssl rand -base64 32

# 2. 配置防火墙
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 3. 启用 HTTPS 重定向
# 编辑 nginx.conf，取消 HTTPS 重定向注释

# 4. 定期更新
make update

# 5. 配置自动备份
# 备份会自动运行，确保 BACKUP_KEEP_DAYS 设置合理
```

### 性能优化

生产环境已预配置优化参数：

- PostgreSQL: 优化连接池和缓存
- Redis: 配置内存限制和淘汰策略
- Nginx: 启用 Gzip 压缩和缓存
- 容器: 设置资源限制和预留

### 监控告警

配置 Grafana 告警规则：

1. 访问 http://your-domain:3001
2. 进入 Alerting > Alert rules
3. 配置告警条件和通知渠道

---

## 📚 相关文档

- [增强功能说明](./ENHANCED_FEATURES.md) - 详细的功能介绍
- [部署问题修复](./DEPLOYMENT_FIXED.md) - 已修复的问题列表
- [备份脚本](./scripts/backup.sh) - 自动备份脚本
- [恢复脚本](./scripts/restore.sh) - 数据恢复脚本
- [管理脚本](./scripts/manage.sh) - 统一管理工具

---

## 🆘 获取帮助

如遇到问题：

1. 查看 [故障排查](#故障排查) 章节
2. 检查服务日志: `make logs`
3. 运行健康检查: `make health`
4. 查看增强功能文档: [ENHANCED_FEATURES.md](./ENHANCED_FEATURES.md)

---

**版本**: 2.0  
**更新日期**: 2025-10-05  
**维护者**: Lychee NFT Platform Team
