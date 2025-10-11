# Lychee NFT Platform Makefile
# 提供便捷的命令行接口

.PHONY: help dev prod start stop restart status logs clean backup restore update health

# 默认目标
.DEFAULT_GOAL := help

# 颜色定义
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## 显示帮助信息
	@echo "$(BLUE)Lychee NFT Platform - 管理命令$(NC)"
	@echo ""
	@echo "$(GREEN)开发环境:$(NC)"
	@echo "  make dev              启动开发环境"
	@echo "  make dev-stop         停止开发环境"
	@echo "  make dev-logs         查看开发环境日志"
	@echo ""
	@echo "$(GREEN)生产环境:$(NC)"
	@echo "  make prod             启动生产环境"
	@echo "  make prod-stop        停止生产环境"
	@echo "  make prod-logs        查看生产环境日志"
	@echo ""
	@echo "$(GREEN)通用命令:$(NC)"
	@echo "  make start            启动服务"
	@echo "  make stop             停止服务"
	@echo "  make restart          重启服务"
	@echo "  make status           查看服务状态"
	@echo "  make logs             查看日志"
	@echo "  make ps               查看容器列表"
	@echo ""
	@echo "$(GREEN)数据库:$(NC)"
	@echo "  make db-backup        备份数据库"
	@echo "  make db-restore FILE=<file>  恢复数据库"
	@echo "  make db-shell         进入数据库"
	@echo ""
	@echo "$(GREEN)维护:$(NC)"
	@echo "  make clean            清理未使用的资源"
	@echo "  make update           更新服务"
	@echo "  make health           健康检查"
	@echo "  make urls             显示访问地址"
	@echo ""

# ==================== 开发环境 ====================

dev: ## 启动开发环境
	@echo "$(GREEN)启动开发环境...$(NC)"
	@cp -n .env.development .env 2>/dev/null || true
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "$(GREEN)开发环境启动成功!$(NC)"
	@make urls

dev-stop: ## 停止开发环境
	@echo "$(YELLOW)停止开发环境...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

dev-logs: ## 查看开发环境日志
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

dev-build: ## 重新构建开发环境
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache

# ==================== 生产环境 ====================

prod: ## 启动生产环境
	@echo "$(GREEN)启动生产环境...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)警告: .env 文件不存在，使用生产环境模板$(NC)"; \
		cp .env.production .env; \
		echo "$(YELLOW)请编辑 .env 文件并修改所有密码!$(NC)"; \
		exit 1; \
	fi
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
	@echo "$(GREEN)生产环境启动成功!$(NC)"
	@make urls

prod-stop: ## 停止生产环境
	@echo "$(YELLOW)停止生产环境...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

prod-logs: ## 查看生产环境日志
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

prod-build: ## 重新构建生产环境
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

# ==================== 通用命令 ====================

start: ## 启动服务
	@echo "$(GREEN)启动服务...$(NC)"
	docker-compose up -d

stop: ## 停止服务
	@echo "$(YELLOW)停止服务...$(NC)"
	docker-compose down

restart: ## 重启服务
	@echo "$(YELLOW)重启服务...$(NC)"
	docker-compose restart

status: ## 查看服务状态
	@docker-compose ps

logs: ## 查看日志
	@docker-compose logs -f --tail=100

ps: ## 查看容器列表
	@docker-compose ps -a

# ==================== 数据库 ====================

db-backup: ## 备份数据库
	@echo "$(GREEN)备份数据库...$(NC)"
	@./scripts/manage.sh backup

db-restore: ## 恢复数据库 (使用 FILE=<file>)
	@if [ -z "$(FILE)" ]; then \
		echo "$(YELLOW)请指定备份文件: make db-restore FILE=<file>$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)恢复数据库...$(NC)"
	@./scripts/manage.sh restore $(FILE)

db-shell: ## 进入数据库
	@docker-compose exec postgres psql -U user lychee_db

# ==================== 维护 ====================

clean: ## 清理未使用的资源
	@echo "$(YELLOW)清理 Docker 资源...$(NC)"
	@docker system prune -f
	@echo "$(GREEN)清理完成!$(NC)"

update: ## 更新服务
	@echo "$(GREEN)更新服务...$(NC)"
	@git pull
	@docker-compose build --no-cache
	@docker-compose up -d
	@echo "$(GREEN)更新完成!$(NC)"

health: ## 健康检查
	@echo "$(GREEN)执行健康检查...$(NC)"
	@./scripts/manage.sh health

urls: ## 显示访问地址
	@echo ""
	@echo "$(BLUE)========================================$(NC)"
	@echo "$(BLUE)服务访问地址$(NC)"
	@echo "$(BLUE)========================================$(NC)"
	@echo "🌐 前端应用:          http://localhost"
	@echo "🔌 后端 API:          http://localhost/api"
	@echo "📊 Grafana 监控:      http://localhost:3001"
	@echo "📈 Prometheus:        http://localhost:9090"
	@echo "🗄️  pgAdmin:          http://localhost:5050"
	@echo "🔴 Redis Commander:   http://localhost:8081"
	@echo "$(BLUE)========================================$(NC)"
	@echo ""

# ==================== 容器操作 ====================

shell-frontend: ## 进入前端容器
	@docker-compose exec frontend sh

shell-backend: ## 进入后端容器
	@docker-compose exec backend sh

shell-postgres: ## 进入数据库容器
	@docker-compose exec postgres sh

shell-redis: ## 进入 Redis 容器
	@docker-compose exec redis sh

# ==================== 监控 ====================

monitoring-start: ## 启动监控服务
	@echo "$(GREEN)启动监控服务...$(NC)"
	@docker-compose --profile monitoring up -d prometheus grafana node-exporter postgres-exporter redis-exporter

monitoring-stop: ## 停止监控服务
	@echo "$(YELLOW)停止监控服务...$(NC)"
	@docker-compose stop prometheus grafana node-exporter postgres-exporter redis-exporter
