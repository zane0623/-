#!/bin/bash

# 钜园农业NFT平台 - 部署脚本
# 用法: ./scripts/deploy.sh [环境] [操作]
# 环境: dev | staging | production
# 操作: up | down | restart | logs | status

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认值
ENV=${1:-dev}
ACTION=${2:-up}

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/deployment/docker/docker-compose.yml"

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助
show_help() {
    echo "钜园农业NFT平台 - 部署脚本"
    echo ""
    echo "用法: $0 [环境] [操作]"
    echo ""
    echo "环境:"
    echo "  dev         开发环境 (默认)"
    echo "  staging     预发布环境"
    echo "  production  生产环境"
    echo ""
    echo "操作:"
    echo "  up          启动服务 (默认)"
    echo "  down        停止服务"
    echo "  restart     重启服务"
    echo "  logs        查看日志"
    echo "  status      查看状态"
    echo "  build       构建镜像"
    echo "  migrate     运行数据库迁移"
    echo "  seed        填充测试数据"
    echo ""
    echo "示例:"
    echo "  $0 dev up"
    echo "  $0 production restart"
    echo "  $0 staging logs"
}

# 检查依赖
check_dependencies() {
    print_info "检查依赖..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose 未安装"
        exit 1
    fi
    
    print_success "依赖检查通过"
}

# 加载环境变量
load_env() {
    local env_file="$PROJECT_ROOT/.env.$ENV"
    
    if [ -f "$env_file" ]; then
        print_info "加载环境变量: $env_file"
        export $(cat "$env_file" | grep -v '^#' | xargs)
    else
        print_warning "环境文件不存在: $env_file, 使用默认配置"
    fi
}

# 启动服务
start_services() {
    print_info "启动服务 (环境: $ENV)..."
    
    cd "$PROJECT_ROOT"
    
    if [ "$ENV" == "production" ]; then
        docker-compose -f "$DOCKER_COMPOSE_FILE" -f deployment/docker/docker-compose.prod.yml up -d
    else
        docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    fi
    
    print_success "服务已启动"
    show_status
}

# 停止服务
stop_services() {
    print_info "停止服务..."
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    print_success "服务已停止"
}

# 重启服务
restart_services() {
    print_info "重启服务..."
    stop_services
    start_services
}

# 查看日志
show_logs() {
    print_info "显示日志..."
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs -f --tail=100
}

# 查看状态
show_status() {
    print_info "服务状态:"
    echo ""
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    
    echo ""
    print_info "健康检查:"
    
    # 检查各服务健康状态
    services=("user-service:3001" "nft-service:3002" "payment-service:3004" "logistics-service:3006")
    
    for service in "${services[@]}"; do
        name="${service%%:*}"
        port="${service##*:}"
        
        if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} $name (端口 $port)"
        else
            echo -e "  ${RED}✗${NC} $name (端口 $port)"
        fi
    done
}

# 构建镜像
build_images() {
    print_info "构建Docker镜像..."
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    
    print_success "镜像构建完成"
}

# 数据库迁移
run_migrate() {
    print_info "运行数据库迁移..."
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec user-service npm run prisma:migrate
    
    print_success "数据库迁移完成"
}

# 填充测试数据
run_seed() {
    print_info "填充测试数据..."
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec user-service npm run prisma:seed
    
    print_success "测试数据填充完成"
}

# 主函数
main() {
    echo ""
    echo "=========================================="
    echo "   钜园农业NFT平台 - 部署脚本"
    echo "=========================================="
    echo ""
    
    case "$ACTION" in
        help|--help|-h)
            show_help
            ;;
        up|start)
            check_dependencies
            load_env
            start_services
            ;;
        down|stop)
            stop_services
            ;;
        restart)
            check_dependencies
            load_env
            restart_services
            ;;
        logs)
            show_logs
            ;;
        status)
            show_status
            ;;
        build)
            check_dependencies
            build_images
            ;;
        migrate)
            run_migrate
            ;;
        seed)
            run_seed
            ;;
        *)
            print_error "未知操作: $ACTION"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main

