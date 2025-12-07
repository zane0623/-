#!/bin/bash

# Flutter Web 快速启动脚本
# 在浏览器中运行钜园农业NFT平台

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_PATH="lychee-nft-platform/flutter_app"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  启动 Flutter Web 开发服务器${NC}"
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
echo -e "${YELLOW}提示：${NC}"
echo "  - 应用将在Chrome浏览器中打开"
echo "  - 按 'r' 进行热重载"
echo "  - 按 'R' 进行热重启"
echo "  - 按 'q' 退出应用"
echo ""
echo -e "${BLUE}正在启动...${NC}"
echo ""

# 运行Flutter Web
flutter run -d chrome --web-port 8080 --web-hostname localhost

echo ""
echo -e "${GREEN}应用已关闭${NC}"

