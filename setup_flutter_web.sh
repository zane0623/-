#!/bin/bash

# Flutter Web 开发环境配置脚本
# 钜园农业NFT平台 - 无需Xcode的Web端开发方案

echo "========================================="
echo "  Flutter Web 开发环境配置"
echo "========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_PATH="lychee-nft-platform/flutter_app"

# 检查Flutter是否已安装
echo "步骤 1: 检查Flutter安装状态..."
if command -v flutter &> /dev/null; then
    echo -e "${GREEN}✓ Flutter已安装${NC}"
    flutter --version
else
    echo -e "${RED}✗ Flutter未安装${NC}"
    echo ""
    echo "请先安装Flutter："
    echo "1. 访问 https://flutter.dev/docs/get-started/install/macos"
    echo "2. 下载Flutter SDK"
    echo "3. 解压并添加到PATH"
    echo "4. 运行 'flutter doctor' 验证安装"
    exit 1
fi

# 检查Chrome是否已安装
echo ""
echo "步骤 2: 检查Chrome浏览器..."
if [ -d "/Applications/Google Chrome.app" ]; then
    echo -e "${GREEN}✓ Chrome浏览器已安装${NC}"
else
    echo -e "${YELLOW}! Chrome浏览器未找到${NC}"
    echo "提示：Flutter Web建议使用Chrome进行开发"
    echo "可以从 https://www.google.com/chrome/ 下载"
fi

# 启用Flutter Web支持
echo ""
echo "步骤 3: 启用Flutter Web支持..."
flutter config --enable-web

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Flutter Web支持已启用${NC}"
else
    echo -e "${RED}✗ 启用Web支持失败${NC}"
    exit 1
fi

# 检查Web设备
echo ""
echo "步骤 4: 检查可用的Web设备..."
flutter devices | grep -i chrome
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Web设备可用${NC}"
else
    echo -e "${YELLOW}! 未检测到Chrome设备${NC}"
fi

# 进入项目目录
cd "$PROJECT_PATH" 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ 项目目录不存在: $PROJECT_PATH${NC}"
    exit 1
fi

echo ""
echo "步骤 5: 安装项目依赖..."
flutter pub get

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 依赖安装成功${NC}"
else
    echo -e "${RED}✗ 依赖安装失败${NC}"
    exit 1
fi

# 清理并获取依赖
echo ""
echo "步骤 6: 清理项目缓存..."
flutter clean
flutter pub get

# 运行Flutter doctor
echo ""
echo "========================================="
echo "  环境检查"
echo "========================================="
flutter doctor

# 检查Web特定的依赖兼容性
echo ""
echo "========================================="
echo "  依赖兼容性检查"
echo "========================================="
echo ""
echo -e "${YELLOW}注意：以下依赖在Web平台可能有限制：${NC}"
echo "  - sqflite: Web不支持（将使用IndexedDB替代）"
echo "  - flutter_secure_storage: Web有限支持"
echo "  - image_picker: Web支持有限"
echo "  - qr_code_scanner: Web不支持（仅扫码功能）"
echo "  - permission_handler: Web不支持"
echo ""

echo "========================================="
echo -e "${GREEN}  Flutter Web 环境配置完成！${NC}"
echo "========================================="
echo ""
echo -e "${BLUE}下一步操作：${NC}"
echo ""
echo "1. 启动开发服务器："
echo "   ${GREEN}cd $PROJECT_PATH && flutter run -d chrome${NC}"
echo ""
echo "2. 或使用便捷脚本："
echo "   ${GREEN}./run_flutter_web.sh${NC}"
echo ""
echo "3. 构建生产版本："
echo "   ${GREEN}cd $PROJECT_PATH && flutter build web${NC}"
echo ""
echo "4. 热重载快捷键："
echo "   - 按 'r' 热重载"
echo "   - 按 'R' 热重启"
echo "   - 按 'q' 退出"
echo ""
echo -e "${YELLOW}提示：首次启动可能需要几分钟编译${NC}"
echo ""

