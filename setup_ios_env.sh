#!/bin/bash

# iOS开发环境配置脚本
# 钜园农业NFT平台 - 移动端开发环境配置

echo "========================================="
echo "  iOS开发环境配置脚本"
echo "========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查Xcode是否已安装
echo "步骤 1: 检查Xcode安装状态..."
if [ -d "/Applications/Xcode.app" ]; then
    echo -e "${GREEN}✓ Xcode已安装${NC}"
    
    # 配置Xcode命令行工具路径
    echo ""
    echo "步骤 2: 配置Xcode命令行工具..."
    sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Xcode路径配置成功${NC}"
    else
        echo -e "${RED}✗ Xcode路径配置失败${NC}"
        exit 1
    fi
    
    # 运行首次启动设置
    echo ""
    echo "步骤 3: 运行Xcode首次启动设置..."
    echo "提示：这可能需要几分钟时间"
    sudo xcodebuild -runFirstLaunch
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Xcode首次启动设置完成${NC}"
    else
        echo -e "${RED}✗ Xcode首次启动设置失败${NC}"
        exit 1
    fi
    
    # 接受许可协议
    echo ""
    echo "步骤 4: 接受Xcode许可协议..."
    sudo xcodebuild -license accept
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 许可协议已接受${NC}"
    else
        echo -e "${YELLOW}! 请手动接受许可协议: sudo xcodebuild -license${NC}"
    fi
    
else
    echo -e "${RED}✗ Xcode未安装${NC}"
    echo ""
    echo "请先安装Xcode："
    echo "1. 打开App Store"
    echo "2. 搜索 'Xcode'"
    echo "3. 点击'获取'并等待下载完成"
    echo "4. 安装完成后重新运行此脚本"
    exit 1
fi

# 检查CocoaPods是否已安装
echo ""
echo "步骤 5: 检查CocoaPods安装状态..."
if command -v pod &> /dev/null; then
    echo -e "${GREEN}✓ CocoaPods已安装${NC}"
    pod --version
else
    echo -e "${YELLOW}! CocoaPods未安装，开始安装...${NC}"
    
    # 安装CocoaPods
    echo "正在安装CocoaPods（这可能需要几分钟）..."
    sudo gem install cocoapods
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ CocoaPods安装成功${NC}"
        
        # 初始化CocoaPods
        echo ""
        echo "步骤 6: 初始化CocoaPods..."
        echo "提示：首次运行可能需要10-15分钟"
        pod setup
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ CocoaPods初始化完成${NC}"
        else
            echo -e "${YELLOW}! CocoaPods初始化可能遇到问题，但可以继续${NC}"
        fi
    else
        echo -e "${RED}✗ CocoaPods安装失败${NC}"
        echo "请尝试手动安装: sudo gem install cocoapods"
        exit 1
    fi
fi

# 验证安装
echo ""
echo "========================================="
echo "  验证安装"
echo "========================================="
echo ""

echo "Xcode版本:"
xcodebuild -version

echo ""
echo "CocoaPods版本:"
pod --version

echo ""
echo "Flutter doctor检查:"
flutter doctor

echo ""
echo "========================================="
echo -e "${GREEN}  iOS开发环境配置完成！${NC}"
echo "========================================="
echo ""
echo "下一步："
echo "1. 打开Xcode并同意所有提示"
echo "2. 在Xcode中配置你的Apple Developer账号"
echo "3. 运行 'flutter doctor' 验证配置"
echo ""

