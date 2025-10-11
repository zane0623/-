# 增强功能说明

## 🎉 新增功能概览

本次增强为 Lychee NFT Platform 的 Docker 部署系统添加了企业级功能，包括监控、日志、备份、多环境支持等。

---

## 📊 监控系统

### Prometheus + Grafana

完整的监控解决方案，实时追踪系统性能和健康状态。

**服务组件**:
- **Prometheus** (端口 9090) - 指标收集和存储
- **Grafana** (端口 3001) - 数据可视化仪表板
- **Node Exporter** (端口 9100) - 系统级指标
- **Postgres Exporter** (端口 9187) - 数据库指标
- **Redis Exporter** (端口 9121) - 缓存指标

**访问方式**:
```bash
# Grafana 仪表板
http://localhost:3001
默认账号: admin / admin

# Prometheus
http://localhost:9090
```

**监控指标**:
- CPU、内存、磁盘使用率
- 数据库连接数、查询性能
- Redis 缓存命中率
- API 响应时间
- 错误率统计

---

## 🛠️ 管理工具

### pgAdmin - 数据库管理

可视化的 PostgreSQL 数据库管理工具。

**访问**: http://localhost:5050  
**默认账号**: admin@lychee.com / admin

**功能**:
- SQL 查询编辑器
- 数据库备份/恢复
- 表结构可视化
- 性能分析

### Redis Commander - 缓存管理

Redis 数据可视化和管理工具。

**访问**: http://localhost:8081

**功能**:
- 键值查看和编辑
- 实时监控
- 命令行界面
- 数据导入/导出

---

## 💾 自动备份系统

### 定时备份

自动备份服务每天凌晨 2 点执行数据库备份。

**配置**:
```bash
BACKUP_KEEP_DAYS=7        # 保留 7 天的备份
BACKUP_SCHEDULE=0 2 * * * # 每天 2:00 AM
```

**手动备份**:
```bash
# 使用管理脚本
./scripts/manage.sh backup

# 使用 Makefile
make db-backup
```

**恢复数据库**:
```bash
# 使用管理脚本
./scripts/manage.sh restore /path/to/backup.sql.gz

# 使用 Makefile
make db-restore FILE=/path/to/backup.sql.gz
```

**备份文件位置**: `./backups/`

---

## 🌍 多环境支持

### 开发环境

针对开发优化，支持热重载和调试。

**启动**:
```bash
# 方式 1: 使用 Makefile
make dev

# 方式 2: 使用 docker-compose
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

**特性**:
- 代码热重载
- 详细日志输出
- 使用测试网 (Mumbai)
- 默认禁用监控服务（节省资源）

### 生产环境

针对生产优化，注重性能和稳定性。

**启动**:
```bash
# 方式 1: 使用 Makefile
make prod

# 方式 2: 使用 docker-compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**特性**:
- 资源限制和预留
- 优化的数据库参数
- 自动重启策略
- 使用主网 (Polygon)
- 完整的监控和日志

---

## 🔧 管理脚本

### manage.sh - 统一管理工具

功能强大的命令行管理工具。

**使用方式**:
```bash
cd deployment/docker
./scripts/manage.sh <command>
```

**可用命令**:

| 命令 | 说明 |
|------|------|
| `start` | 启动所有服务 |
| `stop` | 停止所有服务 |
| `restart [service]` | 重启服务 |
| `status` | 查看服务状态 |
| `logs [service]` | 查看日志 |
| `exec <service>` | 进入容器 |
| `backup` | 备份数据库 |
| `restore <file>` | 恢复数据库 |
| `update` | 更新服务 |
| `cleanup` | 清理资源 |
| `resources` | 查看资源使用 |
| `health` | 健康检查 |
| `urls` | 显示访问地址 |

**示例**:
```bash
# 查看后端日志
./scripts/manage.sh logs backend

# 进入数据库容器
./scripts/manage.sh exec postgres

# 健康检查
./scripts/manage.sh health
```

### Makefile - 快捷命令

提供简洁的命令接口。

**使用方式**:
```bash
cd deployment/docker
make <command>
```

**常用命令**:
```bash
make help           # 显示帮助
make dev            # 启动开发环境
make prod           # 启动生产环境
make status         # 查看状态
make logs           # 查看日志
make db-backup      # 备份数据库
make health         # 健康检查
make urls           # 显示访问地址
```

---

## 🏥 健康检查

所有核心服务都配置了健康检查。

**检查间隔**: 30 秒  
**超时时间**: 10 秒  
**重试次数**: 3 次

**手动检查**:
```bash
# 使用管理脚本
./scripts/manage.sh health

# 使用 Makefile
make health

# 查看容器健康状态
docker-compose ps
```

---

## 📝 日志管理

### 日志配置

所有服务使用 JSON 格式日志，自动轮转。

**配置**:
- 最大文件大小: 10MB
- 保留文件数: 3 个
- 格式: JSON

**查看日志**:
```bash
# 查看所有日志
docker-compose logs -f

# 查看特定服务
docker-compose logs -f backend

# 查看最近 100 行
docker-compose logs -f --tail=100 backend

# 查看 Nginx 日志
docker-compose exec nginx tail -f /var/log/nginx/access.log
```

---

## 🔒 安全加固

### 容器安全

- 使用非 root 用户运行应用
- 只读文件系统挂载
- 资源限制防止 DoS
- 网络隔离

### 密码管理

**生产环境必须修改的密码**:
- `POSTGRES_PASSWORD` - 数据库密码
- `REDIS_PASSWORD` - Redis 密码
- `JWT_SECRET` - JWT 密钥
- `GRAFANA_PASSWORD` - Grafana 密码
- `PGADMIN_PASSWORD` - pgAdmin 密码

**生成强密码**:
```bash
# 生成随机密码
openssl rand -base64 32
```

### SSL/TLS

生产环境必须使用真实的 SSL 证书。

**获取 Let's Encrypt 证书**:
```bash
# 安装 certbot
sudo apt-get install certbot

# 获取证书
sudo certbot certonly --standalone -d yourdomain.com

# 复制证书到 ssl 目录
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
```

---

## ⚡ 性能优化

### 数据库优化

生产环境使用优化的 PostgreSQL 参数：

```yaml
max_connections: 300
shared_buffers: 512MB
effective_cache_size: 2GB
work_mem: 5242kB
```

### Redis 优化

配置了内存限制和淘汰策略：

```yaml
maxmemory: 1gb
maxmemory-policy: allkeys-lru
appendonly: yes
```

### Nginx 优化

启用了 Gzip 压缩和缓存：

```nginx
gzip on
gzip_comp_level 6
client_max_body_size 20M
```

---

## 📦 资源管理

### 资源限制

生产环境为每个服务设置了资源限制：

| 服务 | CPU 限制 | 内存限制 |
|------|----------|----------|
| Frontend | 1.0 | 1GB |
| Backend | 2.0 | 2GB |
| Postgres | 2.0 | 4GB |
| Redis | 1.0 | 1GB |
| Nginx | 1.0 | 512MB |

### 查看资源使用

```bash
# 实时监控
docker stats

# 使用管理脚本
./scripts/manage.sh resources

# 查看特定容器
docker stats lychee-backend
```

---

## 🔄 更新和维护

### 更新服务

```bash
# 拉取最新代码
git pull

# 重新构建
docker-compose build --no-cache

# 重启服务
docker-compose up -d

# 或使用一键更新
make update
```

### 清理资源

```bash
# 清理未使用的镜像、容器、网络
docker system prune -f

# 或使用管理脚本
./scripts/manage.sh cleanup

# 或使用 Makefile
make clean
```

---

## 📋 服务端口总览

| 服务 | 端口 | 说明 |
|------|------|------|
| Nginx | 80, 443 | Web 服务器 |
| Frontend | 3000 | Next.js 应用 |
| Backend | 4000 | Express API |
| PostgreSQL | 5432 | 数据库 |
| Redis | 6379 | 缓存 |
| Prometheus | 9090 | 监控 |
| Grafana | 3001 | 仪表板 |
| pgAdmin | 5050 | 数据库管理 |
| Redis Commander | 8081 | Redis 管理 |
| Node Exporter | 9100 | 系统指标 |
| Postgres Exporter | 9187 | 数据库指标 |
| Redis Exporter | 9121 | Redis 指标 |

---

## 🚀 快速开始

### 1. 开发环境

```bash
cd deployment/docker

# 自动设置并启动
./setup.sh

# 或使用 Makefile
make dev
```

### 2. 生产环境

```bash
cd deployment/docker

# 复制并编辑环境配置
cp env.production .env
vim .env  # 修改所有密码

# 生成 SSL 证书
cd ssl
# 使用 Let's Encrypt 或自签名证书
cd ..

# 启动服务
make prod

# 检查状态
make status
make health
```

---

## 🐛 故障排查

### 常见问题

**1. 容器无法启动**
```bash
# 查看日志
docker-compose logs <service>

# 检查配置
docker-compose config
```

**2. 数据库连接失败**
```bash
# 检查数据库状态
docker-compose exec postgres pg_isready

# 查看数据库日志
docker-compose logs postgres
```

**3. 端口冲突**
```bash
# 检查端口占用
lsof -i :80
lsof -i :5432

# 修改 .env 中的端口配置
```

**4. 内存不足**
```bash
# 查看资源使用
docker stats

# 调整资源限制
# 编辑 docker-compose.prod.yml
```

---

## 📚 相关文档

- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Prometheus 文档](https://prometheus.io/docs/)
- [Grafana 文档](https://grafana.com/docs/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Redis 文档](https://redis.io/documentation)
- [Nginx 文档](https://nginx.org/en/docs/)

---

## 🎯 下一步

1. ✅ 配置环境变量
2. ✅ 生成 SSL 证书
3. ✅ 启动服务
4. ✅ 配置监控告警
5. ✅ 设置自动备份
6. ✅ 配置域名和 DNS
7. ✅ 进行压力测试
8. ✅ 配置 CI/CD

---

**文档版本**: 1.0  
**更新日期**: 2025-10-05  
**维护者**: Lychee NFT Platform Team
