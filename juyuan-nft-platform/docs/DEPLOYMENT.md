# 钜园农业NFT平台 - 部署指南

本指南详细说明如何在生产环境部署钜园农业NFT平台。

## 目录

- [系统要求](#系统要求)
- [Docker部署](#docker部署)
- [Kubernetes部署](#kubernetes部署)
- [云平台部署](#云平台部署)
- [数据库配置](#数据库配置)
- [环境变量配置](#环境变量配置)
- [SSL证书配置](#ssl证书配置)
- [监控和日志](#监控和日志)
- [备份策略](#备份策略)
- [故障排除](#故障排除)

---

## 系统要求

### 最低配置

- **CPU**: 4核
- **内存**: 8GB RAM
- **存储**: 100GB SSD
- **网络**: 100Mbps带宽

### 推荐配置

- **CPU**: 8核
- **内存**: 16GB RAM
- **存储**: 500GB SSD
- **网络**: 1Gbps带宽

### 软件要求

- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / macOS
- **Docker**: 24.0+
- **Docker Compose**: 2.0+
- **Node.js**: 18.0+
- **PostgreSQL**: 15+
- **Redis**: 7+
- **Nginx**: 1.20+

---

## Docker部署

### 1. 准备工作

克隆代码仓库：

```bash
git clone https://github.com/juyuan-nft/platform.git
cd juyuan-nft-platform
```

### 2. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env.production
```

编辑 `.env.production` 文件：

```env
# 数据库配置
DATABASE_URL=postgresql://juyuan_admin:secure_password@postgres:5432/juyuan_nft
REDIS_URL=redis://redis:6379

# 区块链配置
BLOCKCHAIN_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
NFT_CONTRACT_ADDRESS=0xYourNFTContractAddress
PRESALE_CONTRACT_ADDRESS=0xYourPresaleContractAddress
ESCROW_CONTRACT_ADDRESS=0xYourEscrowContractAddress

# JWT配置
JWT_SECRET=your_very_secure_jwt_secret_here

# 支付配置
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
WECHAT_APP_ID=wxXXXXXXXXXXXXXX
WECHAT_APP_SECRET=your_wechat_secret

# IPFS配置
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret
IPFS_GATEWAY=https://gateway.pinata.cloud

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# 前端配置
NEXT_PUBLIC_API_URL=https://api.juyuan-nft.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 3. 构建Docker镜像

```bash
docker-compose -f deployment/docker/docker-compose.yml build
```

### 4. 启动服务

```bash
docker-compose -f deployment/docker/docker-compose.yml up -d
```

### 5. 检查服务状态

```bash
docker-compose -f deployment/docker/docker-compose.yml ps
```

### 6. 查看日志

```bash
# 查看所有服务日志
docker-compose -f deployment/docker/docker-compose.yml logs -f

# 查看特定服务日志
docker-compose -f deployment/docker/docker-compose.yml logs -f user-service
```

### 7. 数据库迁移

```bash
docker-compose -f deployment/docker/docker-compose.yml exec user-service npm run prisma:migrate
```

---

## Kubernetes部署

### 1. 准备Kubernetes集群

确保你有一个运行的Kubernetes集群（GKE、EKS、AKS或自建）。

### 2. 创建命名空间

```bash
kubectl create namespace juyuan-nft
```

### 3. 配置Secrets

创建包含敏感信息的Secret：

```bash
kubectl create secret generic juyuan-secrets \
  --from-literal=database-url='postgresql://...' \
  --from-literal=jwt-secret='your_jwt_secret' \
  --from-literal=stripe-secret='sk_live_xxx' \
  --from-literal=private-key='your_private_key' \
  -n juyuan-nft
```

### 4. 配置ConfigMap

```bash
kubectl create configmap juyuan-config \
  --from-file=deployment/kubernetes/config/ \
  -n juyuan-nft
```

### 5. 部署数据库

```bash
kubectl apply -f deployment/kubernetes/postgres.yaml
kubectl apply -f deployment/kubernetes/redis.yaml
```

### 6. 部署后端服务

```bash
kubectl apply -f deployment/kubernetes/user-service.yaml
kubectl apply -f deployment/kubernetes/nft-service.yaml
kubectl apply -f deployment/kubernetes/payment-service.yaml
kubectl apply -f deployment/kubernetes/logistics-service.yaml
```

### 7. 部署前端

```bash
kubectl apply -f deployment/kubernetes/frontend.yaml
```

### 8. 配置Ingress

```bash
kubectl apply -f deployment/kubernetes/ingress.yaml
```

### 9. 检查部署状态

```bash
kubectl get pods -n juyuan-nft
kubectl get services -n juyuan-nft
kubectl get ingress -n juyuan-nft
```

### 10. 自动扩展

配置HPA（水平Pod自动扩展器）：

```bash
kubectl apply -f deployment/kubernetes/hpa.yaml
```

---

## 云平台部署

### AWS部署

#### 1. 使用ECS部署

```bash
# 安装AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 配置AWS CLI
aws configure

# 创建ECR仓库
aws ecr create-repository --repository-name juyuan-nft/user-service
aws ecr create-repository --repository-name juyuan-nft/nft-service

# 构建并推送镜像
./scripts/deploy-aws-ecs.sh
```

#### 2. 使用EKS部署

```bash
# 创建EKS集群
eksctl create cluster \
  --name juyuan-nft-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 5

# 配置kubectl
aws eks update-kubeconfig --region us-east-1 --name juyuan-nft-cluster

# 部署应用
kubectl apply -f deployment/kubernetes/
```

### Google Cloud Platform部署

#### 使用GKE部署

```bash
# 创建GKE集群
gcloud container clusters create juyuan-nft-cluster \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --region=us-central1

# 获取凭证
gcloud container clusters get-credentials juyuan-nft-cluster --region us-central1

# 部署应用
kubectl apply -f deployment/kubernetes/
```

### Azure部署

#### 使用AKS部署

```bash
# 创建资源组
az group create --name juyuan-nft-rg --location eastus

# 创建AKS集群
az aks create \
  --resource-group juyuan-nft-rg \
  --name juyuan-nft-cluster \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# 获取凭证
az aks get-credentials --resource-group juyuan-nft-rg --name juyuan-nft-cluster

# 部署应用
kubectl apply -f deployment/kubernetes/
```

---

## 数据库配置

### PostgreSQL优化

编辑 `postgresql.conf`:

```conf
# 连接设置
max_connections = 200
shared_buffers = 4GB
effective_cache_size = 12GB
maintenance_work_mem = 1GB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
```

### Redis配置

编辑 `redis.conf`:

```conf
# 持久化配置
save 900 1
save 300 10
save 60 10000

# 内存配置
maxmemory 2gb
maxmemory-policy allkeys-lru

# 网络配置
timeout 300
tcp-keepalive 60

# 安全配置
requirepass your_redis_password
```

### 数据库备份

设置自动备份：

```bash
# PostgreSQL备份脚本
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U juyuan_admin juyuan_nft | gzip > $BACKUP_DIR/juyuan_nft_$DATE.sql.gz

# 删除30天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

添加到crontab：

```bash
# 每天凌晨2点备份
0 2 * * * /opt/scripts/backup-postgres.sh
```

---

## 环境变量配置

### 生产环境变量清单

| 变量名 | 说明 | 是否必需 | 示例值 |
|--------|------|----------|--------|
| DATABASE_URL | 数据库连接URL | 是 | postgresql://user:pass@host:5432/db |
| REDIS_URL | Redis连接URL | 是 | redis://host:6379 |
| JWT_SECRET | JWT密钥 | 是 | your_secret_here |
| BLOCKCHAIN_RPC_URL | 区块链RPC URL | 是 | https://polygon-mainnet... |
| PRIVATE_KEY | 部署钱包私钥 | 是 | 0x... |
| STRIPE_SECRET_KEY | Stripe密钥 | 是 | sk_live_... |
| NODE_ENV | 运行环境 | 是 | production |

### 环境变量管理最佳实践

1. **使用密钥管理服务**
   - AWS Secrets Manager
   - Google Cloud Secret Manager
   - Azure Key Vault
   - HashiCorp Vault

2. **不要在代码中硬编码**
   - 使用 `.env` 文件（不要提交到Git）
   - 使用环境变量注入

3. **定期轮换密钥**
   - 建议每90天轮换一次
   - 使用自动化工具管理

---

## SSL证书配置

### 使用Let's Encrypt

```bash
# 安装Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d juyuan-nft.com -d www.juyuan-nft.com

# 自动续期
sudo certbot renew --dry-run
```

### Nginx SSL配置

```nginx
server {
    listen 443 ssl http2;
    server_name juyuan-nft.com;

    ssl_certificate /etc/letsencrypt/live/juyuan-nft.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/juyuan-nft.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 监控和日志

### Prometheus监控

部署Prometheus：

```bash
kubectl apply -f deployment/kubernetes/monitoring/prometheus.yaml
```

### Grafana仪表板

```bash
kubectl apply -f deployment/kubernetes/monitoring/grafana.yaml
```

访问Grafana：`http://your-domain/grafana`

### ELK日志收集

部署Elasticsearch、Logstash、Kibana：

```bash
kubectl apply -f deployment/kubernetes/logging/elasticsearch.yaml
kubectl apply -f deployment/kubernetes/logging/logstash.yaml
kubectl apply -f deployment/kubernetes/logging/kibana.yaml
```

### 告警配置

配置Alertmanager规则：

```yaml
groups:
- name: juyuan-nft-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }} requests/second"
```

---

## 备份策略

### 自动备份脚本

```bash
#!/bin/bash
# /opt/scripts/backup-all.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/$DATE"

mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump -h localhost -U juyuan_admin juyuan_nft | gzip > $BACKUP_DIR/database.sql.gz

# 备份Redis
redis-cli --rdb $BACKUP_DIR/redis.rdb

# 备份配置文件
tar -czf $BACKUP_DIR/configs.tar.gz /opt/juyuan-nft/config

# 上传到云存储
aws s3 cp $BACKUP_DIR s3://juyuan-nft-backups/$DATE/ --recursive

# 删除本地文件（保留7天）
find /backups -name "*" -mtime +7 -delete
```

### 灾难恢复计划

1. **定期测试恢复流程**（每月一次）
2. **多地域备份**（至少3个不同区域）
3. **文档化恢复步骤**
4. **RTO目标**: 4小时
5. **RPO目标**: 1小时

---

## 故障排除

### 常见问题

#### 1. 服务无法启动

```bash
# 检查日志
docker-compose logs service-name

# 检查端口占用
netstat -tulpn | grep :3001

# 检查环境变量
docker-compose exec service-name env
```

#### 2. 数据库连接失败

```bash
# 检查数据库状态
docker-compose exec postgres pg_isready

# 测试连接
psql -h localhost -U juyuan_admin -d juyuan_nft
```

#### 3. 内存不足

```bash
# 检查内存使用
free -h

# 增加swap空间
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### 4. 区块链连接问题

```bash
# 测试RPC连接
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  $BLOCKCHAIN_RPC_URL
```

### 性能优化

1. **启用CDN**（CloudFlare、AWS CloudFront）
2. **数据库连接池**（配置合理的连接数）
3. **Redis缓存**（热点数据缓存）
4. **负载均衡**（Nginx、HAProxy）
5. **静态资源优化**（压缩、懒加载）

---

## 安全检查清单

- [ ] 所有密钥使用密钥管理服务
- [ ] 启用SSL/TLS加密
- [ ] 配置防火墙规则
- [ ] 启用DDoS防护
- [ ] 定期更新依赖包
- [ ] 配置CORS策略
- [ ] 启用速率限制
- [ ] 实施RBAC权限控制
- [ ] 定期安全审计
- [ ] 备份加密存储

---

## 扩展阅读

- [Docker官方文档](https://docs.docker.com/)
- [Kubernetes官方文档](https://kubernetes.io/docs/)
- [Nginx配置指南](https://nginx.org/en/docs/)
- [PostgreSQL性能调优](https://www.postgresql.org/docs/current/performance-tips.html)

---

**最后更新**: 2024-11-21  
**维护者**: 钜园农业技术团队


