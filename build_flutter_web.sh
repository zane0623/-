#!/bin/bash

# Flutter Web 构建脚本
# 构建用于部署的生产版本

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_PATH="lychee-nft-platform/flutter_app"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  构建 Flutter Web 生产版本${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 进入项目目录
cd "$PROJECT_PATH" 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ 项目目录不存在: $PROJECT_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}项目路径: $(pwd)${NC}"
echo ""

# 清理旧构建
echo "步骤 1: 清理旧构建..."
flutter clean
flutter pub get
echo -e "${GREEN}✓ 清理完成${NC}"
echo ""

# 构建Web版本
echo "步骤 2: 构建Web版本..."
echo -e "${YELLOW}这可能需要几分钟...${NC}"
echo ""

flutter build web --release --web-renderer html

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  构建成功！${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "构建输出目录: build/web/"
    echo ""
    echo "部署方式："
    echo "1. 直接部署 build/web/ 目录到Web服务器"
    echo "2. 使用CDN托管静态文件"
    echo "3. 部署到Firebase Hosting、Vercel等平台"
    echo ""
    echo "本地预览："
    echo "  cd build/web && python3 -m http.server 8000"
    echo "  然后访问 http://localhost:8000"
    echo ""
else
    echo ""
    echo -e "${RED}✗ 构建失败${NC}"
    echo "请检查错误信息并修复后重试"
    exit 1
fi

