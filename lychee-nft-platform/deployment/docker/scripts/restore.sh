#!/bin/sh
# 数据库恢复脚本
# Lychee NFT Platform Database Restore Script

set -e

# 日志函数
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# 检查参数
if [ -z "$1" ]; then
    log "错误: 请指定备份文件"
    log "用法: $0 <backup_file>"
    log "示例: $0 /backups/lychee_db_20231001_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# 检查备份文件是否存在
if [ ! -f "${BACKUP_FILE}" ]; then
    log "错误: 备份文件不存在: ${BACKUP_FILE}"
    exit 1
fi

log "准备恢复数据库..."
log "备份文件: ${BACKUP_FILE}"

# 确认操作
read -p "警告: 此操作将覆盖现有数据库! 确认继续? (yes/no): " CONFIRM
if [ "${CONFIRM}" != "yes" ]; then
    log "操作已取消"
    exit 0
fi

log "开始恢复数据库..."

# 解压并恢复
gunzip -c ${BACKUP_FILE} | PGPASSWORD="${POSTGRES_PASSWORD}" psql \
    -h ${POSTGRES_HOST} \
    -U ${POSTGRES_USER} \
    -d ${POSTGRES_DB} \
    --verbose

# 检查恢复是否成功
if [ $? -eq 0 ]; then
    log "数据库恢复成功!"
else
    log "数据库恢复失败!"
    exit 1
fi

log "恢复完成!"
