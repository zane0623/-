#!/bin/bash

# 钜园农业NFT平台 - 数据备份脚本
# 用法: ./scripts/backup.sh [类型]
# 类型: all | database | redis | configs

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
BACKUP_TYPE=${1:-all}
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/backups}"

# 数据库配置
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-juyuan_admin}"
DB_NAME="${DB_NAME:-juyuan_nft}"

# S3配置（可选）
S3_BUCKET="${S3_BUCKET:-}"
S3_PREFIX="${S3_PREFIX:-juyuan-nft-backups}"

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 创建备份目录
create_backup_dir() {
    local backup_path="$BACKUP_DIR/$DATE"
    mkdir -p "$backup_path"
    echo "$backup_path"
}

# 备份PostgreSQL数据库
backup_database() {
    print_info "备份 PostgreSQL 数据库..."
    
    local backup_path=$1
    local backup_file="$backup_path/database_$DATE.sql.gz"
    
    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --format=custom \
        --compress=9 \
        -f "$backup_file"
    
    if [ -f "$backup_file" ]; then
        local size=$(du -h "$backup_file" | cut -f1)
        print_success "数据库备份完成: $backup_file ($size)"
    else
        print_error "数据库备份失败"
        return 1
    fi
}

# 备份Redis数据
backup_redis() {
    print_info "备份 Redis 数据..."
    
    local backup_path=$1
    local backup_file="$backup_path/redis_$DATE.rdb"
    
    # 触发Redis BGSAVE
    redis-cli BGSAVE
    sleep 2
    
    # 复制RDB文件
    local redis_dir=$(redis-cli CONFIG GET dir | tail -1)
    local redis_file=$(redis-cli CONFIG GET dbfilename | tail -1)
    
    if [ -f "$redis_dir/$redis_file" ]; then
        cp "$redis_dir/$redis_file" "$backup_file"
        gzip "$backup_file"
        print_success "Redis备份完成: $backup_file.gz"
    else
        print_error "Redis RDB文件不存在"
        return 1
    fi
}

# 备份配置文件
backup_configs() {
    print_info "备份配置文件..."
    
    local backup_path=$1
    local backup_file="$backup_path/configs_$DATE.tar.gz"
    
    # 需要备份的配置文件
    local configs=(
        ".env"
        ".env.production"
        "deployment/docker/docker-compose.yml"
        "deployment/kubernetes/"
    )
    
    local existing_configs=()
    for config in "${configs[@]}"; do
        if [ -e "$PROJECT_ROOT/$config" ]; then
            existing_configs+=("$config")
        fi
    done
    
    if [ ${#existing_configs[@]} -gt 0 ]; then
        cd "$PROJECT_ROOT"
        tar -czf "$backup_file" "${existing_configs[@]}"
        print_success "配置文件备份完成: $backup_file"
    else
        print_error "没有找到配置文件"
        return 1
    fi
}

# 上传到S3
upload_to_s3() {
    if [ -z "$S3_BUCKET" ]; then
        print_info "S3未配置，跳过上传"
        return 0
    fi
    
    print_info "上传备份到 S3..."
    
    local backup_path=$1
    
    aws s3 cp "$backup_path" "s3://$S3_BUCKET/$S3_PREFIX/$DATE/" --recursive
    
    print_success "已上传到 S3: s3://$S3_BUCKET/$S3_PREFIX/$DATE/"
}

# 清理旧备份
cleanup_old_backups() {
    print_info "清理30天前的备份..."
    
    find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true
    
    print_success "旧备份清理完成"
}

# 显示帮助
show_help() {
    echo "钜园农业NFT平台 - 数据备份脚本"
    echo ""
    echo "用法: $0 [类型]"
    echo ""
    echo "类型:"
    echo "  all       备份所有内容 (默认)"
    echo "  database  仅备份数据库"
    echo "  redis     仅备份Redis"
    echo "  configs   仅备份配置文件"
    echo ""
    echo "环境变量:"
    echo "  BACKUP_DIR    备份目录 (默认: ./backups)"
    echo "  DB_HOST       数据库主机"
    echo "  DB_PORT       数据库端口"
    echo "  DB_USER       数据库用户"
    echo "  DB_NAME       数据库名称"
    echo "  DB_PASSWORD   数据库密码"
    echo "  S3_BUCKET     S3存储桶 (可选)"
    echo ""
    echo "示例:"
    echo "  $0 all"
    echo "  DB_PASSWORD=xxx $0 database"
}

# 主函数
main() {
    echo ""
    echo "=========================================="
    echo "   钜园农业NFT平台 - 数据备份"
    echo "=========================================="
    echo ""
    echo "备份时间: $DATE"
    echo "备份类型: $BACKUP_TYPE"
    echo ""
    
    case "$BACKUP_TYPE" in
        help|--help|-h)
            show_help
            ;;
        all)
            local backup_path=$(create_backup_dir)
            backup_database "$backup_path"
            backup_redis "$backup_path" || true
            backup_configs "$backup_path"
            upload_to_s3 "$backup_path"
            cleanup_old_backups
            ;;
        database)
            local backup_path=$(create_backup_dir)
            backup_database "$backup_path"
            ;;
        redis)
            local backup_path=$(create_backup_dir)
            backup_redis "$backup_path"
            ;;
        configs)
            local backup_path=$(create_backup_dir)
            backup_configs "$backup_path"
            ;;
        *)
            print_error "未知备份类型: $BACKUP_TYPE"
            show_help
            exit 1
            ;;
    esac
    
    echo ""
    print_success "备份任务完成!"
    echo ""
}

main

