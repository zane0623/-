#!/bin/bash

# 钜园农业NFT平台 - 服务健康检查脚本
# 用法: ./scripts/health-check.sh [--json] [--alert]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
BASE_URL="${BASE_URL:-http://localhost}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
JSON_OUTPUT=false
ALERT_ON_FAILURE=false

# 解析参数
for arg in "$@"; do
    case $arg in
        --json)
            JSON_OUTPUT=true
            ;;
        --alert)
            ALERT_ON_FAILURE=true
            ;;
    esac
done

# 服务配置
declare -A SERVICES=(
    ["user-service"]="3001"
    ["nft-service"]="3002"
    ["presale-service"]="3003"
    ["payment-service"]="3004"
    ["traceability-service"]="3005"
    ["logistics-service"]="3006"
    ["compliance-service"]="3007"
    ["notification-service"]="3008"
    ["i18n-service"]="3009"
    ["currency-service"]="3010"
)

# 检查结果
declare -A RESULTS
FAILED_COUNT=0
SUCCESS_COUNT=0

# 检查单个服务
check_service() {
    local name=$1
    local port=$2
    local url="${BASE_URL}:${port}/health"
    
    local start_time=$(date +%s%N)
    local response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>/dev/null || echo "000")
    local end_time=$(date +%s%N)
    
    local latency=$(( (end_time - start_time) / 1000000 ))
    
    if [ "$response" == "200" ]; then
        RESULTS[$name]="healthy:$latency"
        ((SUCCESS_COUNT++))
        return 0
    else
        RESULTS[$name]="unhealthy:$response"
        ((FAILED_COUNT++))
        return 1
    fi
}

# 发送告警
send_alert() {
    local message=$1
    
    if [ -z "$SLACK_WEBHOOK" ]; then
        return
    fi
    
    curl -s -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚨 钜园农业NFT平台健康检查告警\n$message\"}" \
        "$SLACK_WEBHOOK" > /dev/null
}

# JSON格式输出
output_json() {
    echo "{"
    echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
    echo "  \"total\": ${#SERVICES[@]},"
    echo "  \"healthy\": $SUCCESS_COUNT,"
    echo "  \"unhealthy\": $FAILED_COUNT,"
    echo "  \"services\": {"
    
    local first=true
    for name in "${!RESULTS[@]}"; do
        IFS=':' read -r status value <<< "${RESULTS[$name]}"
        
        if [ "$first" = true ]; then
            first=false
        else
            echo ","
        fi
        
        if [ "$status" == "healthy" ]; then
            echo -n "    \"$name\": {\"status\": \"healthy\", \"latency_ms\": $value}"
        else
            echo -n "    \"$name\": {\"status\": \"unhealthy\", \"error_code\": \"$value\"}"
        fi
    done
    
    echo ""
    echo "  }"
    echo "}"
}

# 表格格式输出
output_table() {
    echo ""
    echo "=========================================="
    echo "   钜园农业NFT平台 - 服务健康检查"
    echo "=========================================="
    echo ""
    echo "检查时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    printf "%-25s %-10s %-15s\n" "服务" "状态" "响应时间/错误"
    printf "%-25s %-10s %-15s\n" "------------------------" "----------" "---------------"
    
    for name in $(echo "${!RESULTS[@]}" | tr ' ' '\n' | sort); do
        IFS=':' read -r status value <<< "${RESULTS[$name]}"
        
        if [ "$status" == "healthy" ]; then
            printf "%-25s ${GREEN}%-10s${NC} %-15s\n" "$name" "✓ 健康" "${value}ms"
        else
            printf "%-25s ${RED}%-10s${NC} %-15s\n" "$name" "✗ 异常" "HTTP $value"
        fi
    done
    
    echo ""
    echo "----------------------------------------"
    echo "总计: ${#SERVICES[@]} | 健康: $SUCCESS_COUNT | 异常: $FAILED_COUNT"
    echo "----------------------------------------"
    
    if [ $FAILED_COUNT -gt 0 ]; then
        echo ""
        echo -e "${RED}⚠️  有 $FAILED_COUNT 个服务异常!${NC}"
    else
        echo ""
        echo -e "${GREEN}✅ 所有服务运行正常!${NC}"
    fi
    
    echo ""
}

# 主函数
main() {
    # 检查所有服务
    for name in "${!SERVICES[@]}"; do
        check_service "$name" "${SERVICES[$name]}" || true
    done
    
    # 输出结果
    if [ "$JSON_OUTPUT" = true ]; then
        output_json
    else
        output_table
    fi
    
    # 发送告警
    if [ "$ALERT_ON_FAILURE" = true ] && [ $FAILED_COUNT -gt 0 ]; then
        local failed_services=""
        for name in "${!RESULTS[@]}"; do
            IFS=':' read -r status value <<< "${RESULTS[$name]}"
            if [ "$status" == "unhealthy" ]; then
                failed_services="$failed_services\n• $name (HTTP $value)"
            fi
        done
        send_alert "以下服务异常:$failed_services"
    fi
    
    # 返回码
    if [ $FAILED_COUNT -gt 0 ]; then
        exit 1
    fi
    exit 0
}

main

