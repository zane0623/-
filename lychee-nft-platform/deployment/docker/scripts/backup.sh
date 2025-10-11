#!/bin/sh
# 数据库自动备份脚本
# Lychee NFT Platform Database Backup Script

set -e

# 配置
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/lychee_db_${TIMESTAMP}.sql.gz"
KEEP_DAYS=${BACKUP_KEEP_DAYS:-7}

# 日志函数
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# 创建备份目录
mkdir -p ${BACKUP_DIR}

log "开始备份数据库..."

# 执行备份
PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
    -h ${POSTGRES_HOST} \
    -U ${POSTGRES_USER} \
    -d ${POSTGRES_DB} \
    --format=plain \
    --no-owner \
    --no-acl \
    --verbose \
    2>&1 | gzip > ${BACKUP_FILE}

# 检查备份是否成功
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
    log "备份成功! 文件: ${BACKUP_FILE} (大小: ${BACKUP_SIZE})"
else
    log "备份失败!"
    exit 1
fi

# 清理旧备份
log "清理 ${KEEP_DAYS} 天前的备份..."
find ${BACKUP_DIR} -name "lychee_db_*.sql.gz" -type f -mtime +${KEEP_DAYS} -delete

# 列出当前备份
log "当前备份列表:"
ls -lh ${BACKUP_DIR}/lychee_db_*.sql.gz 2>/dev/null || log "没有找到备份文件"

log "备份完成!"
