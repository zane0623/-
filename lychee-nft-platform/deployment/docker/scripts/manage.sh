#!/bin/bash
# Lychee NFT Platform 管理脚本
# 提供常用的运维管理命令

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_title() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# 检查 Docker 环境
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安装"
        exit 1
    fi
    
    log_info "Docker 环境检查通过"
}

# 启动服务
start_services() {
    log_title "启动服务"
    docker-compose up -d
    log_info "服务启动成功"
    show_status
}

# 停止服务
stop_services() {
    log_title "停止服务"
    docker-compose down
    log_info "服务已停止"
}

# 重启服务
restart_services() {
    log_title "重启服务"
    if [ -z "$1" ]; then
        docker-compose restart
        log_info "所有服务已重启"
    else
        docker-compose restart $1
        log_info "服务 $1 已重启"
    fi
}

# 查看服务状态
show_status() {
    log_title "服务状态"
    docker-compose ps
}

# 查看日志
show_logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f --tail=100
    else
        docker-compose logs -f --tail=100 $1
    fi
}

# 进入容器
enter_container() {
    if [ -z "$1" ]; then
        log_error "请指定容器名称"
        log_info "可用容器: frontend, backend, postgres, redis, nginx"
        exit 1
    fi
    
    log_info "进入容器: $1"
    docker-compose exec $1 sh
}

# 数据库备份
backup_database() {
    log_title "数据库备份"
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="./backups/manual_backup_${TIMESTAMP}.sql.gz"
    
    log_info "开始备份..."
    docker-compose exec -T postgres pg_dump -U user lychee_db | gzip > ${BACKUP_FILE}
    
    if [ $? -eq 0 ]; then
        BACKUP_SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
        log_info "备份成功! 文件: ${BACKUP_FILE} (大小: ${BACKUP_SIZE})"
    else
        log_error "备份失败!"
        exit 1
    fi
}

# 数据库恢复
restore_database() {
    if [ -z "$1" ]; then
        log_error "请指定备份文件"
        log_info "用法: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$1" ]; then
        log_error "备份文件不存在: $1"
        exit 1
    fi
    
    log_title "数据库恢复"
    log_warn "警告: 此操作将覆盖现有数据库!"
    read -p "确认继续? (yes/no): " CONFIRM
    
    if [ "${CONFIRM}" != "yes" ]; then
        log_info "操作已取消"
        exit 0
    fi
    
    log_info "开始恢复..."
    gunzip -c $1 | docker-compose exec -T postgres psql -U user lychee_db
    
    if [ $? -eq 0 ]; then
        log_info "恢复成功!"
    else
        log_error "恢复失败!"
        exit 1
    fi
}

# 清理系统
cleanup() {
    log_title "清理系统"
    log_warn "这将删除所有未使用的 Docker 资源"
    read -p "确认继续? (yes/no): " CONFIRM
    
    if [ "${CONFIRM}" != "yes" ]; then
        log_info "操作已取消"
        exit 0
    fi
    
    log_info "清理 Docker 镜像..."
    docker image prune -f
    
    log_info "清理 Docker 容器..."
    docker container prune -f
    
    log_info "清理 Docker 网络..."
    docker network prune -f
    
    log_info "清理 Docker 卷..."
    docker volume prune -f
    
    log_info "清理完成!"
}

# 更新服务
update_services() {
    log_title "更新服务"
    
    log_info "拉取最新代码..."
    git pull
    
    log_info "重新构建镜像..."
    docker-compose build --no-cache
    
    log_info "重启服务..."
    docker-compose up -d
    
    log_info "更新完成!"
    show_status
}

# 查看系统资源
show_resources() {
    log_title "系统资源使用情况"
    docker stats --no-stream
}

# 健康检查
health_check() {
    log_title "健康检查"
    
    log_info "检查前端服务..."
    curl -f http://localhost:3000/api/health || log_warn "前端服务异常"
    
    log_info "检查后端服务..."
    curl -f http://localhost:4000/health || log_warn "后端服务异常"
    
    log_info "检查数据库..."
    docker-compose exec postgres pg_isready -U user || log_warn "数据库异常"
    
    log_info "检查 Redis..."
    docker-compose exec redis redis-cli ping || log_warn "Redis 异常"
    
    log_info "健康检查完成!"
}

# 显示访问地址
show_urls() {
    log_title "服务访问地址"
    echo ""
    echo "🌐 前端应用:          http://localhost"
    echo "🔌 后端 API:          http://localhost/api"
    echo "📊 Grafana 监控:      http://localhost:3001"
    echo "📈 Prometheus:        http://localhost:9090"
    echo "🗄️  pgAdmin:          http://localhost:5050"
    echo "🔴 Redis Commander:   http://localhost:8081"
    echo ""
}

# 显示帮助信息
show_help() {
    log_title "Lychee NFT Platform 管理工具"
    echo ""
    echo "用法: $0 <command> [options]"
    echo ""
    echo "命令:"
    echo "  start              启动所有服务"
    echo "  stop               停止所有服务"
    echo "  restart [service]  重启服务 (不指定则重启所有)"
    echo "  status             查看服务状态"
    echo "  logs [service]     查看日志 (不指定则查看所有)"
    echo "  exec <service>     进入容器"
    echo "  backup             备份数据库"
    echo "  restore <file>     恢复数据库"
    echo "  update             更新服务"
    echo "  cleanup            清理未使用的 Docker 资源"
    echo "  resources          查看系统资源使用情况"
    echo "  health             健康检查"
    echo "  urls               显示服务访问地址"
    echo "  help               显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 start                          # 启动所有服务"
    echo "  $0 restart backend                # 重启后端服务"
    echo "  $0 logs backend                   # 查看后端日志"
    echo "  $0 exec postgres                  # 进入数据库容器"
    echo "  $0 backup                         # 备份数据库"
    echo "  $0 restore ./backups/backup.sql.gz # 恢复数据库"
    echo ""
}

# 主函数
main() {
    check_docker
    
    case "$1" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services $2
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs $2
            ;;
        exec)
            enter_container $2
            ;;
        backup)
            backup_database
            ;;
        restore)
            restore_database $2
            ;;
        update)
            update_services
            ;;
        cleanup)
            cleanup
            ;;
        resources)
            show_resources
            ;;
        health)
            health_check
            ;;
        urls)
            show_urls
            ;;
        help|--help|-h|"")
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
