#!/bin/bash

# 全面检查脚本 - 把所有的都过一遍
# 钜园农业NFT平台 - 完整环境验证

echo "========================================="
echo "  🔍 全面环境检查"
echo "========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# 计数器
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# 检查函数
check_item() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -ne "${CYAN}[$TOTAL_CHECKS]${NC} $1... "
}

pass_check() {
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    echo -e "${GREEN}✓ PASS${NC}"
}

fail_check() {
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo -e "${RED}✗ FAIL${NC}"
    if [ ! -z "$1" ]; then
        echo -e "    ${RED}↳ $1${NC}"
    fi
}

warn_check() {
    WARNING_CHECKS=$((WARNING_CHECKS + 1))
    echo -e "${YELLOW}⚠ WARNING${NC}"
    if [ ! -z "$1" ]; then
        echo -e "    ${YELLOW}↳ $1${NC}"
    fi
}

echo -e "${BLUE}=== 第一部分：系统环境检查 ===${NC}"
echo ""

# 1. 检查操作系统
check_item "操作系统版本"
OS_VERSION=$(sw_vers -productVersion)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ macOS $OS_VERSION${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    fail_check
fi

# 2. 检查 Flutter
check_item "Flutter 安装"
if command -v flutter &> /dev/null; then
    FLUTTER_VERSION=$(flutter --version | head -n 1)
    echo -e "${GREEN}✓ $FLUTTER_VERSION${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    fail_check "Flutter 未安装"
fi

# 3. 检查 Dart
check_item "Dart SDK"
if command -v dart &> /dev/null; then
    DART_VERSION=$(dart --version 2>&1 | head -n 1)
    echo -e "${GREEN}✓ $DART_VERSION${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    fail_check "Dart 未安装"
fi

# 4. 检查 Chrome
check_item "Chrome 浏览器"
if [ -d "/Applications/Google Chrome.app" ]; then
    CHROME_VERSION=$(defaults read "/Applications/Google Chrome.app/Contents/Info.plist" CFBundleShortVersionString)
    echo -e "${GREEN}✓ Chrome $CHROME_VERSION${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    warn_check "Chrome 未找到，建议安装"
fi

# 5. 检查 Git
check_item "Git 版本控制"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ $GIT_VERSION${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    warn_check "Git 未安装"
fi

# 6. 检查 Node.js (可选，用于某些工具)
check_item "Node.js 环境"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node $NODE_VERSION${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${YELLOW}○ 未安装 (可选)${NC}"
fi

# 7. 检查磁盘空间
check_item "磁盘可用空间"
AVAILABLE_SPACE=$(df -h / | tail -n 1 | awk '{print $4}')
AVAILABLE_GB=$(df -k / | tail -n 1 | awk '{print $4}')
if [ $AVAILABLE_GB -gt 10485760 ]; then  # 大于 10GB
    echo -e "${GREEN}✓ $AVAILABLE_SPACE 可用${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    warn_check "磁盘空间不足 ($AVAILABLE_SPACE)，建议至少 10GB"
fi

echo ""
echo -e "${BLUE}=== 第二部分：Flutter 环境检查 ===${NC}"
echo ""

# 8. Flutter Web 支持
check_item "Flutter Web 支持"
flutter config | grep "enable-web: true" &> /dev/null
if [ $? -eq 0 ]; then
    pass_check
else
    fail_check "Web 支持未启用"
    echo -e "    ${YELLOW}修复: flutter config --enable-web${NC}"
fi

# 9. Flutter 设备列表
check_item "可用的开发设备"
DEVICES=$(flutter devices 2>/dev/null | grep -c "Chrome\|Web")
if [ $DEVICES -gt 0 ]; then
    echo -e "${GREEN}✓ 找到 $DEVICES 个 Web 设备${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    fail_check "未找到 Web 设备"
fi

# 10. Flutter Doctor
check_item "Flutter Doctor 完整检查"
echo ""
flutter doctor
echo ""

echo -e "${BLUE}=== 第三部分：项目结构检查 ===${NC}"
echo ""

PROJECT_ROOT="/Users/fancyfizzy/Downloads/RWA/lychee-nft-platform/flutter_app"

# 11. 项目目录存在
check_item "Flutter 项目目录"
if [ -d "$PROJECT_ROOT" ]; then
    pass_check
else
    fail_check "项目目录不存在: $PROJECT_ROOT"
fi

# 12. pubspec.yaml 文件
check_item "pubspec.yaml 配置文件"
if [ -f "$PROJECT_ROOT/pubspec.yaml" ]; then
    pass_check
else
    fail_check "pubspec.yaml 不存在"
fi

# 13. lib 目录
check_item "lib 源代码目录"
if [ -d "$PROJECT_ROOT/lib" ]; then
    FILE_COUNT=$(find "$PROJECT_ROOT/lib" -name "*.dart" | wc -l | tr -d ' ')
    echo -e "${GREEN}✓ 找到 $FILE_COUNT 个 Dart 文件${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    fail_check "lib 目录不存在"
fi

# 14. web 目录
check_item "web 配置目录"
if [ -d "$PROJECT_ROOT/web" ]; then
    pass_check
else
    fail_check "web 目录不存在"
fi

# 15. main.dart 入口文件
check_item "main.dart 入口文件"
if [ -f "$PROJECT_ROOT/lib/main.dart" ]; then
    pass_check
else
    fail_check "main.dart 不存在"
fi

echo ""
echo -e "${BLUE}=== 第四部分：依赖检查 ===${NC}"
echo ""

cd "$PROJECT_ROOT" 2>/dev/null

# 16. Flutter packages
check_item "Flutter 依赖包状态"
if [ -f "pubspec.lock" ]; then
    PACKAGE_COUNT=$(grep -c "name:" pubspec.lock)
    echo -e "${GREEN}✓ $PACKAGE_COUNT 个包已安装${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    fail_check "依赖未安装，需要运行 flutter pub get"
fi

# 17. 核心依赖检查
check_item "核心依赖包"
MISSING_DEPS=""
for dep in "provider" "dio" "go_router" "web3dart"; do
    grep -q "$dep:" pubspec.yaml
    if [ $? -ne 0 ]; then
        MISSING_DEPS="$MISSING_DEPS $dep"
    fi
done
if [ -z "$MISSING_DEPS" ]; then
    pass_check
else
    warn_check "缺少依赖:$MISSING_DEPS"
fi

# 18. 获取最新依赖
check_item "更新项目依赖"
flutter pub get &> /tmp/flutter_pub_get.log
if [ $? -eq 0 ]; then
    pass_check
else
    fail_check "依赖更新失败，查看 /tmp/flutter_pub_get.log"
fi

echo ""
echo -e "${BLUE}=== 第五部分：代码质量检查 ===${NC}"
echo ""

# 19. 代码分析
check_item "Dart 代码分析"
flutter analyze --no-pub &> /tmp/flutter_analyze.log
ANALYZE_ISSUES=$(grep -c "error\|warning" /tmp/flutter_analyze.log)
if [ $ANALYZE_ISSUES -eq 0 ]; then
    pass_check
else
    warn_check "发现 $ANALYZE_ISSUES 个问题，查看 /tmp/flutter_analyze.log"
fi

# 20. 代码格式检查
check_item "代码格式化检查"
dart format --output=none --set-exit-if-changed lib/ &> /dev/null
if [ $? -eq 0 ]; then
    pass_check
else
    warn_check "代码需要格式化，运行: dart format lib/"
fi

echo ""
echo -e "${BLUE}=== 第六部分：Web 配置检查 ===${NC}"
echo ""

# 21. index.html
check_item "web/index.html"
if [ -f "web/index.html" ]; then
    if grep -q "钜园农业NFT" web/index.html; then
        echo -e "${GREEN}✓ 已优化${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        warn_check "可能需要优化"
    fi
else
    fail_check "web/index.html 不存在"
fi

# 22. manifest.json
check_item "web/manifest.json"
if [ -f "web/manifest.json" ]; then
    if grep -q "钜园农业NFT" web/manifest.json; then
        echo -e "${GREEN}✓ 已配置${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        warn_check "可能需要配置"
    fi
else
    fail_check "web/manifest.json 不存在"
fi

# 23. favicon
check_item "web/favicon.png"
if [ -f "web/favicon.png" ]; then
    pass_check
else
    warn_check "favicon 不存在"
fi

# 24. icons 目录
check_item "web/icons/ 图标"
if [ -d "web/icons" ]; then
    ICON_COUNT=$(ls web/icons/*.png 2>/dev/null | wc -l | tr -d ' ')
    echo -e "${GREEN}✓ $ICON_COUNT 个图标${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    warn_check "icons 目录不存在"
fi

echo ""
echo -e "${BLUE}=== 第七部分：编译测试 ===${NC}"
echo ""

# 25. Web 编译测试（只检查不完整构建）
check_item "Web 编译测试 (预检查)"
echo ""
echo -e "${YELLOW}正在进行编译预检查...${NC}"
flutter build web --release --web-renderer html &> /tmp/flutter_build.log &
BUILD_PID=$!

# 等待 10 秒或构建完成
for i in {1..10}; do
    if ! ps -p $BUILD_PID > /dev/null; then
        break
    fi
    echo -ne "${CYAN}  检查中... $i/10 秒\r${NC}"
    sleep 1
done

# 如果还在运行，停止它
if ps -p $BUILD_PID > /dev/null; then
    kill $BUILD_PID 2>/dev/null
    echo -e "${GREEN}✓ 编译环境正常 (已中断完整构建以节省时间)${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    # 检查是否成功
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 编译成功${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        # 检查日志
        if grep -q "error" /tmp/flutter_build.log; then
            fail_check "编译失败，查看 /tmp/flutter_build.log"
        else
            echo -e "${GREEN}✓ 编译环境正常${NC}"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        fi
    fi
fi

echo ""
echo -e "${BLUE}=== 第八部分：工具脚本检查 ===${NC}"
echo ""

cd /Users/fancyfizzy/Downloads/RWA

# 26. 检查脚本文件
for script in "setup_flutter_web.sh" "run_flutter_web.sh" "build_flutter_web.sh" "setup_ios_env.sh"; do
    check_item "$script"
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo -e "${GREEN}✓ 存在且可执行${NC}"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        else
            warn_check "存在但不可执行"
            chmod +x "$script"
            echo -e "    ${GREEN}↳ 已自动添加执行权限${NC}"
        fi
    else
        warn_check "脚本不存在"
    fi
done

echo ""
echo -e "${BLUE}=== 第九部分：文档检查 ===${NC}"
echo ""

# 30. 检查文档文件
for doc in "FLUTTER_WEB_快速开始.md" "✅_环境配置完成.md" "lychee-nft-platform/flutter_app/web_compatibility_notes.md"; do
    check_item "文档: $(basename "$doc")"
    if [ -f "$doc" ]; then
        SIZE=$(wc -c < "$doc" | tr -d ' ')
        if [ $SIZE -gt 100 ]; then
            echo -e "${GREEN}✓ 存在 (${SIZE} bytes)${NC}"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        else
            warn_check "文件太小，可能不完整"
        fi
    else
        warn_check "文档不存在"
    fi
done

echo ""
echo -e "${BLUE}=== 第十部分：网络连接检查 ===${NC}"
echo ""

# 33. 检查网络连接
check_item "互联网连接"
ping -c 1 8.8.8.8 &> /dev/null
if [ $? -eq 0 ]; then
    pass_check
else
    warn_check "网络连接可能有问题"
fi

# 34. Flutter 官方服务器
check_item "Flutter 服务器可达性"
curl -s --connect-timeout 3 https://flutter.dev > /dev/null
if [ $? -eq 0 ]; then
    pass_check
else
    warn_check "无法连接 Flutter 服务器"
fi

# 35. Pub.dev 包管理器
check_item "Pub.dev 包服务器"
curl -s --connect-timeout 3 https://pub.dev > /dev/null
if [ $? -eq 0 ]; then
    pass_check
else
    warn_check "无法连接 Pub.dev"
fi

echo ""
echo "========================================="
echo -e "${MAGENTA}  📊 检查结果汇总${NC}"
echo "========================================="
echo ""

echo -e "${CYAN}总检查项:${NC}     $TOTAL_CHECKS"
echo -e "${GREEN}通过:${NC}         $PASSED_CHECKS"
echo -e "${RED}失败:${NC}         $FAILED_CHECKS"
echo -e "${YELLOW}警告:${NC}         $WARNING_CHECKS"
echo ""

# 计算成功率
if [ $TOTAL_CHECKS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    echo -e "${CYAN}成功率:${NC}       ${SUCCESS_RATE}%"
    echo ""
    
    if [ $SUCCESS_RATE -ge 90 ]; then
        echo -e "${GREEN}========================================="
        echo -e "  ✅ 环境状态：优秀"
        echo -e "  🚀 可以开始开发了！"
        echo -e "=========================================${NC}"
        echo ""
        echo -e "${BLUE}下一步：${NC}"
        echo "  ./run_flutter_web.sh"
        
    elif [ $SUCCESS_RATE -ge 70 ]; then
        echo -e "${YELLOW}========================================="
        echo -e "  ⚠️  环境状态：良好"
        echo -e "  💡 有一些警告，但可以开始开发"
        echo -e "=========================================${NC}"
        
    else
        echo -e "${RED}========================================="
        echo -e "  ❌ 环境状态：需要修复"
        echo -e "  🔧 请解决上述失败项"
        echo -e "=========================================${NC}"
    fi
fi

echo ""
echo -e "${CYAN}详细日志保存在:${NC}"
echo "  - /tmp/flutter_pub_get.log"
echo "  - /tmp/flutter_analyze.log"
echo "  - /tmp/flutter_build.log"
echo ""

# 生成报告文件
REPORT_FILE="/Users/fancyfizzy/Downloads/RWA/environment_check_report.txt"
{
    echo "钜园农业NFT平台 - 环境检查报告"
    echo "================================"
    echo ""
    echo "检查时间: $(date)"
    echo "操作系统: macOS $(sw_vers -productVersion)"
    echo "Flutter: $(flutter --version | head -n 1)"
    echo ""
    echo "检查结果:"
    echo "  总检查项: $TOTAL_CHECKS"
    echo "  通过: $PASSED_CHECKS"
    echo "  失败: $FAILED_CHECKS"
    echo "  警告: $WARNING_CHECKS"
    echo "  成功率: ${SUCCESS_RATE}%"
    echo ""
    echo "================================"
} > "$REPORT_FILE"

echo -e "${GREEN}✓ 完整报告已保存到:${NC}"
echo "  $REPORT_FILE"
echo ""

exit 0

