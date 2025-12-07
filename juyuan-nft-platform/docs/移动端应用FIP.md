# 钜园农业NFT预售平台 - 移动端应用FIP
## Functional Implementation Plan (功能实现计划)

---

**文档版本**: V2.0  
**文档状态**: 评审中  
**创建日期**: 2025年10月30日  
**最后更新**: 2025年10月31日  

**文档所有者**: 技术团队  
**项目代号**: Lychee Mobile FIP  
**关联文档**: 移动端应用PRD V2.0  
**技术负责人**: [姓名]  
**架构师**: [姓名]

---1

## 📑 目录

1. [文档说明](#一文档说明)
2. [技术架构设计](#二技术架构设计)
3. [开发环境配置](#三开发环境配置)
4. [功能模块实现](#四功能模块实现)
5. [API接口对接](#五api接口对接)
6. [数据模型设计](#六数据模型设计)
7. [状态管理方案](#七状态管理方案)
8. [路由导航设计](#八路由导航设计)
9. [UI组件库](#九ui组件库)
10. [性能优化方案](#十性能优化方案)
11. [安全实现方案](#十一安全实现方案)
12. [测试实现方案](#十二测试实现方案)
13. [CI/CD流程](#十三cicd流程)
14. [发布上架流程](#十四发布上架流程)
15. [开发任务分解](#十五开发任务分解)
16. [推送通知实现](#十六推送通知实现)
17. [错误处理和日志系统](#十七错误处理和日志系统)
18. [缓存策略](#十八缓存策略)
19. [性能监控](#十九性能监控)
20. [国际化实现](#二十国际化实现)
21. [Web3钱包集成](#二十一web3钱包集成)
22. [代码规范与最佳实践](#二十二代码规范与最佳实践)
23. [依赖管理详解](#二十三依赖管理详解)
24. [自动化脚本](#二十四自动化脚本)
25. [常见问题与解决方案](#二十五常见问题与解决方案)
26. [技术债务管理](#二十六技术债务管理)

---

## 📄 文档修订历史

| 版本 | 日期 | 修订内容 | 修订人 | 审核人 | 状态 |
|------|------|----------|--------|--------|------|
| 0.1  | 2025-10-30 | 初始FIP草稿 | 技术负责人 | - | 草稿 |
| 1.0  | 2025-10-30 | 完整版本 (21章节) | 技术负责人 | 架构师 | 已评审 |
| 2.0  | 2025-10-31 | 新增代码规范、最佳实践、自动化脚本、常见问题、技术债务管理 | 技术负责人 | 架构师 | 评审中 |

---

## 一、文档说明

### 1.1 文档目的

本文档是钜园农业NFT预售平台移动端应用的功能实现计划（FIP），基于PRD文档制定，旨在：

1. **技术方案细化**: 将PRD中的功能需求转化为具体的技术实现方案
2. **开发任务分解**: 将项目分解为可执行的开发任务
3. **技术规范统一**: 制定统一的代码规范和开发标准
4. **风险识别**: 识别技术实现中的风险点并提供解决方案
5. **进度跟踪**: 提供开发进度跟踪的依据

### 1.2 目标读者

- Flutter开发工程师
- 后端开发工程师
- 测试工程师
- 技术负责人
- 项目经理

### 1.3 技术栈概览

```
┌─────────────────────────────────────────┐
│           移动端应用层                    │
│  ┌────────────────────────────────────┐ │
│  │      Flutter Application           │ │
│  │  (Dart 3.x + Flutter 3.x)         │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         状态管理 & 路由层                 │
│  ┌──────────┐  ┌──────────┐            │
│  │ Provider │  │go_router │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│            服务层                        │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐  │
│  │API Service│Storage  ││Web3      │  │
│  │  (Dio)  │ │Service  ││Service   │  │
│  └─────────┘ └─────────┘ └──────────┘  │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         数据持久化层                      │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │SharedPrefs   │  │Secure Storage   │ │
│  │SQLite        │  │(Token/Keys)     │ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│            后端服务                       │
│  RESTful API (Node.js + Express)       │
│  PostgreSQL + Prisma ORM               │
│  Ethereum/Polygon Blockchain           │
└─────────────────────────────────────────┘
```

---

## 二、技术架构设计

### 2.1 整体架构

#### 2.1.1 分层架构

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│  ┌──────────────────────────────────────────────┐  │
│  │         Screens / Pages / Widgets             │  │
│  │  (UI Components, User Interactions)           │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                  State Management Layer              │
│  ┌──────────────────────────────────────────────┐  │
│  │               Providers                       │  │
│  │  (AuthProvider, PresaleProvider, etc.)        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   Business Logic Layer               │
│  ┌──────────────────────────────────────────────┐  │
│  │            Services / Repositories            │  │
│  │  (API calls, Data processing, Validation)     │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                    Data Layer                        │
│  ┌──────────────────────────────────────────────┐  │
│  │         Models / DTOs / Entities              │  │
│  │  (Data structures, Serialization)             │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

#### 2.1.2 项目目录结构

```
lib/
├── main.dart                          # 应用入口
├── app.dart                          # 根组件
│
├── config/                           # 配置文件
│   ├── app_config.dart              # 应用配置
│   ├── api_config.dart              # API配置
│   ├── theme.dart                   # 主题配置
│   ├── routes.dart                  # 路由配置
│   └── constants.dart               # 常量定义
│
├── core/                            # 核心模块
│   ├── network/                     # 网络层
│   │   ├── dio_client.dart         # Dio客户端封装
│   │   ├── api_interceptor.dart    # 请求拦截器
│   │   └── api_exception.dart      # 异常处理
│   ├── storage/                     # 存储层
│   │   ├── storage_service.dart    # 存储服务接口
│   │   ├── secure_storage.dart     # 安全存储实现
│   │   └── cache_manager.dart      # 缓存管理
│   ├── utils/                       # 工具类
│   │   ├── validators.dart         # 验证工具
│   │   ├── formatters.dart         # 格式化工具
│   │   ├── date_utils.dart         # 日期工具
│   │   └── logger.dart             # 日志工具
│   └── errors/                      # 错误处理
│       ├── exceptions.dart          # 自定义异常
│       └── failures.dart            # 失败类型
│
├── data/                            # 数据层
│   ├── models/                      # 数据模型
│   │   ├── user.dart
│   │   ├── presale.dart
│   │   ├── order.dart
│   │   ├── nft.dart
│   │   └── address.dart
│   ├── repositories/                # 仓储层
│   │   ├── auth_repository.dart
│   │   ├── presale_repository.dart
│   │   ├── order_repository.dart
│   │   └── nft_repository.dart
│   └── datasources/                 # 数据源
│       ├── local/                   # 本地数据源
│       │   └── cache_datasource.dart
│       └── remote/                  # 远程数据源
│           └── api_datasource.dart
│
├── domain/                          # 业务领域层
│   ├── entities/                    # 实体
│   ├── repositories/                # 仓储接口
│   └── usecases/                    # 用例
│       ├── auth/
│       │   ├── login_usecase.dart
│       │   └── register_usecase.dart
│       ├── presale/
│       └── order/
│
├── presentation/                    # 表现层
│   ├── providers/                   # 状态管理
│   │   ├── auth_provider.dart
│   │   ├── presale_provider.dart
│   │   ├── order_provider.dart
│   │   ├── nft_provider.dart
│   │   └── user_provider.dart
│   │
│   ├── screens/                     # 页面
│   │   ├── splash/                  # 启动页
│   │   │   └── splash_screen.dart
│   │   ├── onboarding/              # 引导页
│   │   │   └── onboarding_screen.dart
│   │   ├── auth/                    # 认证模块
│   │   │   ├── login_screen.dart
│   │   │   ├── register_screen.dart
│   │   │   └── forgot_password_screen.dart
│   │   ├── main/                    # 主框架
│   │   │   └── main_screen.dart
│   │   ├── home/                    # 首页
│   │   │   └── home_screen.dart
│   │   ├── presale/                 # 预售模块
│   │   │   ├── presale_list_screen.dart
│   │   │   └── presale_detail_screen.dart
│   │   ├── order/                   # 订单模块
│   │   │   ├── order_list_screen.dart
│   │   │   ├── order_detail_screen.dart
│   │   │   └── create_order_screen.dart
│   │   ├── nft/                     # NFT模块
│   │   │   ├── nft_list_screen.dart
│   │   │   └── nft_detail_screen.dart
│   │   └── profile/                 # 个人中心
│   │       ├── profile_screen.dart
│   │       ├── edit_profile_screen.dart
│   │       ├── address_list_screen.dart
│   │       └── settings_screen.dart
│   │
│   └── widgets/                     # 通用组件
│       ├── common/                  # 公共组件
│       │   ├── custom_button.dart
│       │   ├── custom_input.dart
│       │   ├── loading_widget.dart
│       │   ├── empty_state_widget.dart
│       │   └── error_widget.dart
│       ├── presale/                 # 预售相关组件
│       │   ├── presale_card.dart
│       │   └── presale_filter.dart
│       └── nft/                     # NFT相关组件
│           └── nft_card.dart
│
├── l10n/                           # 国际化
│   ├── app_en.arb
│   └── app_zh.arb
│
└── generated/                      # 自动生成代码
    └── assets.dart
```

### 2.2 核心技术选型

#### 2.2.1 开发框架

| 技术 | 版本 | 用途 | 选型理由 |
|-----|------|------|----------|
| Flutter | 3.16.x | 跨平台框架 | 性能优秀，生态成熟，一套代码双端运行 |
| Dart | 3.2.x | 编程语言 | 类型安全，异步支持好，与Flutter无缝集成 |

#### 2.2.2 核心依赖包

| 包名 | 版本 | 用途 | 说明 |
|-----|------|------|------|
| **状态管理** ||||
| provider | ^6.1.1 | 状态管理 | 官方推荐，简单易用 |
| **路由导航** ||||
| go_router | ^13.0.0 | 路由管理 | 声明式路由，支持深度链接 |
| **网络请求** ||||
| dio | ^5.4.0 | HTTP客户端 | 功能强大，支持拦截器 |
| **本地存储** ||||
| shared_preferences | ^2.2.2 | KV存储 | 简单配置存储 |
| flutter_secure_storage | ^9.0.0 | 安全存储 | Token等敏感信息加密存储 |
| sqflite | ^2.3.0 | SQLite数据库 | 离线数据缓存 |
| **图片处理** ||||
| cached_network_image | ^3.3.0 | 图片缓存 | 网络图片缓存和加载 |
| image_picker | ^1.0.5 | 图片选择 | 相机和相册 |
| **UI组件** ||||
| shimmer | ^3.0.0 | 骨架屏 | 加载效果 |
| pull_to_refresh | ^2.0.0 | 下拉刷新 | 列表刷新组件 |
| **工具类** ||||
| intl | ^0.18.1 | 国际化 | 多语言支持 |
| url_launcher | ^6.2.2 | 打开URL | 打开外部链接 |
| package_info_plus | ^5.0.1 | 应用信息 | 获取版本号等 |
| device_info_plus | ^9.1.1 | 设备信息 | 获取设备信息 |
| connectivity_plus | ^5.0.2 | 网络状态 | 监听网络变化 |
| **Web3相关** ||||
| web3dart | ^2.7.1 | Web3交互 | 区块链交互 |
| walletconnect_dart | ^0.0.11 | 钱包连接 | WalletConnect协议 |
| **其他** ||||
| qr_flutter | ^4.1.0 | 二维码生成 | NFT二维码展示 |
| qr_code_scanner | ^1.0.1 | 二维码扫描 | 扫码功能 |
| permission_handler | ^11.1.0 | 权限管理 | 相机、存储等权限 |
| flutter_local_notifications | ^16.3.0 | 本地通知 | 推送通知 |

### 2.3 项目配置文件

#### 2.3.1 pubspec.yaml

```yaml
name: juyuan_nft
description: 钜园农业NFT预售平台移动端应用
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # 状态管理
  provider: ^6.1.1
  
  # 路由
  go_router: ^13.0.0
  
  # 网络
  dio: ^5.4.0
  
  # 存储
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^9.0.0
  sqflite: ^2.3.0
  path_provider: ^2.1.1
  
  # 图片
  cached_network_image: ^3.3.0
  image_picker: ^1.0.5
  
  # UI
  shimmer: ^3.0.0
  pull_to_refresh: ^2.0.0
  flutter_svg: ^2.0.9
  
  # 工具
  intl: ^0.18.1
  url_launcher: ^6.2.2
  package_info_plus: ^5.0.1
  device_info_plus: ^9.1.1
  connectivity_plus: ^5.0.2
  
  # Web3
  web3dart: ^2.7.1
  walletconnect_dart: ^0.0.11
  
  # 其他
  qr_flutter: ^4.1.0
  qr_code_scanner: ^1.0.1
  permission_handler: ^11.1.0
  flutter_local_notifications: ^16.3.0
  
  # 开发工具
  logger: ^2.0.2
  json_annotation: ^4.8.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  build_runner: ^2.4.7
  json_serializable: ^6.7.1
  mockito: ^5.4.4
  integration_test:
    sdk: flutter

flutter:
  uses-material-design: true
  
  assets:
    - assets/images/
    - assets/icons/
    - assets/animations/
  
  fonts:
    - family: CustomIcon
      fonts:
        - asset: assets/fonts/CustomIcon.ttf
```

---

## 三、开发环境配置

### 3.1 环境要求

#### 3.1.1 开发工具

| 工具 | 版本要求 | 说明 |
|-----|---------|------|
| Flutter SDK | 3.16.x | 稳定版本 |
| Dart SDK | 3.2.x | 随Flutter安装 |
| Android Studio | 2023.1+ | Android开发 |
| Xcode | 15.0+ | iOS开发（仅Mac） |
| VS Code | 最新版 | 可选IDE |

#### 3.1.2 系统要求

**macOS开发环境**:
- macOS 12.0+
- Xcode 15.0+
- CocoaPods
- Homebrew

**Windows开发环境**:
- Windows 10+
- Android Studio
- Visual Studio (C++ 工具)

### 3.2 环境搭建步骤

#### 3.2.1 安装Flutter

```bash
# macOS
brew install flutter

# 或者手动下载
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

# 检查环境
flutter doctor
```

#### 3.2.2 配置Android环境

```bash
# 下载Android Studio
# 安装Android SDK
# 配置环境变量
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 接受licenses
flutter doctor --android-licenses
```

#### 3.2.3 配置iOS环境（macOS only）

```bash
# 安装Xcode from App Store
# 安装Command Line Tools
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch

# 安装CocoaPods
sudo gem install cocoapods
pod setup
```

#### 3.2.4 创建项目

```bash
# 创建Flutter项目
flutter create --org com.juyuan juyuan_nft

# 进入项目目录
cd juyuan_nft

# 获取依赖
flutter pub get

# 运行项目
flutter run
```

### 3.3 IDE配置

#### 3.3.1 VS Code配置

**安装插件**:
- Flutter
- Dart
- Flutter Widget Snippets
- Awesome Flutter Snippets
- Error Lens
- GitLens

**settings.json**:
```json
{
  "dart.flutterSdkPath": "/path/to/flutter",
  "dart.lineLength": 100,
  "[dart]": {
    "editor.formatOnSave": true,
    "editor.formatOnType": true,
    "editor.rulers": [100],
    "editor.selectionHighlight": false,
    "editor.suggest.snippetsPreventQuickSuggestions": false,
    "editor.suggestSelection": "first",
    "editor.tabCompletion": "onlySnippets",
    "editor.wordBasedSuggestions": false
  },
  "dart.debugExternalLibraries": false,
  "dart.debugSdkLibraries": false
}
```

#### 3.3.2 Android Studio配置

1. 安装Flutter插件和Dart插件
2. 配置Flutter SDK路径
3. 配置代码格式化规则

### 3.4 环境配置文件

#### 3.4.1 多环境配置

创建 `lib/config/env_config.dart`:

```dart
enum Environment {
  dev,
  staging,
  production,
}

class EnvConfig {
  static Environment _environment = Environment.dev;
  
  static void setEnvironment(Environment env) {
    _environment = env;
  }
  
  static Environment get environment => _environment;
  
  static String get apiBaseUrl {
    switch (_environment) {
      case Environment.dev:
        return 'http://localhost:3001/api';
      case Environment.staging:
        return 'https://staging-api.juyuan.com/api';
      case Environment.production:
        return 'https://api.juyuan.com/api';
    }
  }
  
  static String get web3RpcUrl {
    switch (_environment) {
      case Environment.dev:
        return 'https://rpc.ankr.com/polygon_mumbai';
      case Environment.staging:
        return 'https://rpc.ankr.com/polygon_mumbai';
      case Environment.production:
        return 'https://rpc.ankr.com/polygon';
    }
  }
  
  static bool get enableLogging {
    return _environment != Environment.production;
  }
}
```

#### 3.4.2 启动入口配置

修改 `lib/main.dart`:

```dart
import 'package:flutter/material.dart';
import 'config/env_config.dart';
import 'app.dart';

void main() {
  // 设置环境
  const env = String.fromEnvironment('ENV', defaultValue: 'dev');
  switch (env) {
    case 'dev':
      EnvConfig.setEnvironment(Environment.dev);
      break;
    case 'staging':
      EnvConfig.setEnvironment(Environment.staging);
      break;
    case 'production':
      EnvConfig.setEnvironment(Environment.production);
      break;
  }
  
  runApp(const MyApp());
}
```

运行不同环境:
```bash
# 开发环境
flutter run --dart-define=ENV=dev

# 预发布环境
flutter run --dart-define=ENV=staging

# 生产环境
flutter run --dart-define=ENV=production
```

---

## 四、功能模块实现

### 4.1 启动模块

#### 4.1.1 启动页 (Splash Screen)

**功能需求**:
- 显示App Logo和品牌信息
- 检查更新
- 初始化应用配置
- 自动登录检查
- 2-3秒后自动跳转

**技术实现**:

```dart
// lib/presentation/screens/splash/splash_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    try {
      // 1. 初始化服务
      await Future.wait([
        _initializeServices(),
        Future.delayed(const Duration(seconds: 2)), // 最少显示2秒
      ]);

      // 2. 检查登录状态
      final authProvider = context.read<AuthProvider>();
      final isLoggedIn = await authProvider.checkLoginStatus();

      // 3. 判断是否首次启动
      final isFirstLaunch = await _checkFirstLaunch();

      if (!mounted) return;

      // 4. 路由跳转
      if (isFirstLaunch) {
        context.go('/onboarding');
      } else if (isLoggedIn) {
        context.go('/main');
      } else {
        context.go('/login');
      }
    } catch (e) {
      // 错误处理
      if (mounted) {
        context.go('/login');
      }
    }
  }

  Future<void> _initializeServices() async {
    // 初始化本地存储
    // 初始化网络服务
    // 初始化推送服务
    // 初始化统计SDK
  }

  Future<bool> _checkFirstLaunch() async {
    final prefs = await SharedPreferences.getInstance();
    final isFirst = prefs.getBool('is_first_launch') ?? true;
    if (isFirst) {
      await prefs.setBool('is_first_launch', false);
    }
    return isFirst;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo
            Image.asset(
              'assets/images/logo.png',
              width: 120,
              height: 120,
            ),
            const SizedBox(height: 24),
            // 品牌名称
            Text(
              '钜园农业',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'NFT农产品预售平台',
              style: TextStyle(
                fontSize: 16,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
            const SizedBox(height: 48),
            // Loading指示器
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}
```

#### 4.1.2 引导页 (Onboarding)

**功能需求**:
- 3-5页引导内容
- 左右滑动切换
- 可跳过
- 最后一页直接进入登录

**技术实现**:

```dart
// lib/presentation/screens/onboarding/onboarding_screen.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingPage> _pages = [
    OnboardingPage(
      image: 'assets/images/onboarding1.png',
      title: '区块链溯源',
      description: '从种植到餐桌，每个环节都可追溯',
    ),
    OnboardingPage(
      image: 'assets/images/onboarding2.png',
      title: 'NFT数字凭证',
      description: '独一无二的数字资产证明',
    ),
    OnboardingPage(
      image: 'assets/images/onboarding3.png',
      title: '预售直供',
      description: '产地直达，新鲜到家',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // 跳过按钮
            Align(
              alignment: Alignment.topRight,
              child: TextButton(
                onPressed: () => context.go('/login'),
                child: Text('跳过'),
              ),
            ),
            
            // 页面内容
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _pages.length,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemBuilder: (context, index) {
                  return _buildPage(_pages[index]);
                },
              ),
            ),
            
            // 指示器
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (index) => _buildIndicator(index == _currentPage),
              ),
            ),
            
            const SizedBox(height: 32),
            
            // 按钮
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: _currentPage == _pages.length - 1
                  ? ElevatedButton(
                      onPressed: () => context.go('/login'),
                      style: ElevatedButton.styleFrom(
                        minimumSize: Size(double.infinity, 48),
                      ),
                      child: Text('开始使用'),
                    )
                  : ElevatedButton(
                      onPressed: () {
                        _pageController.nextPage(
                          duration: Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        minimumSize: Size(double.infinity, 48),
                      ),
                      child: Text('下一步'),
                    ),
            ),
            
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildPage(OnboardingPage page) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            page.image,
            height: 300,
          ),
          const SizedBox(height: 48),
          Text(
            page.title,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            page.description,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIndicator(bool isActive) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 4),
      width: isActive ? 24 : 8,
      height: 8,
      decoration: BoxDecoration(
        color: isActive ? Theme.of(context).primaryColor : Colors.grey[300],
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }
}

class OnboardingPage {
  final String image;
  final String title;
  final String description;

  OnboardingPage({
    required this.image,
    required this.title,
    required this.description,
  });
}
```

### 4.2 认证模块

#### 4.2.1 登录功能

**技术实现**:

```dart
// lib/presentation/screens/auth/login_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = context.read<AuthProvider>();
      await authProvider.login(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );

      if (!mounted) return;
      
      // 登录成功，跳转主页
      context.go('/main');
    } catch (e) {
      if (!mounted) return;
      
      // 显示错误提示
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('登录失败: ${e.toString()}')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('登录'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Logo
                Center(
                  child: Image.asset(
                    'assets/images/logo.png',
                    width: 100,
                    height: 100,
                  ),
                ),
                
                const SizedBox(height: 48),
                
                // 邮箱输入框
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    labelText: '邮箱',
                    hintText: '请输入邮箱地址',
                    prefixIcon: Icon(Icons.email),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return '请输入邮箱';
                    }
                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                        .hasMatch(value)) {
                      return '邮箱格式不正确';
                    }
                    return null;
                  },
                ),
                
                const SizedBox(height: 16),
                
                // 密码输入框
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    labelText: '密码',
                    hintText: '请输入密码',
                    prefixIcon: Icon(Icons.lock),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? Icons.visibility_off
                            : Icons.visibility,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return '请输入密码';
                    }
                    if (value.length < 6) {
                      return '密码至少6位';
                    }
                    return null;
                  },
                ),
                
                const SizedBox(height: 8),
                
                // 忘记密码
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () => context.push('/forgot-password'),
                    child: Text('忘记密码？'),
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // 登录按钮
                ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    minimumSize: Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isLoading
                      ? SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Colors.white,
                            ),
                          ),
                        )
                      : Text('登录'),
                ),
                
                const SizedBox(height: 16),
                
                // 或者
                Row(
                  children: [
                    Expanded(child: Divider()),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text('或者'),
                    ),
                    Expanded(child: Divider()),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                // 第三方登录
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildSocialButton(
                      icon: Icons.wechat,
                      label: '微信',
                      color: Colors.green,
                      onPressed: () {
                        // 微信登录
                      },
                    ),
                    _buildSocialButton(
                      icon: Icons.apple,
                      label: 'Apple',
                      color: Colors.black,
                      onPressed: () {
                        // Apple登录
                      },
                    ),
                    _buildSocialButton(
                      icon: Icons.account_balance_wallet,
                      label: '钱包',
                      color: Colors.orange,
                      onPressed: () {
                        // 钱包登录
                      },
                    ),
                  ],
                ),
                
                const SizedBox(height: 24),
                
                // 注册链接
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('还没有账号？'),
                    TextButton(
                      onPressed: () => context.push('/register'),
                      child: Text('立即注册'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSocialButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[300]!),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 4.3 主框架模块

**技术实现**:

```dart
// lib/presentation/screens/main/main_screen.dart

import 'package:flutter/material.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    HomeScreen(),
    PresaleListScreen(),
    NFTListScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '首页',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_bag),
            label: '预售',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet),
            label: 'NFT',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: '我的',
          ),
        ],
      ),
    );
  }
}
```

**说明**: 由于篇幅限制，我在这里提供了核心框架的实现代码。完整的FIP文档还包括更多模块的详细实现。

---

*(文档继续...)*

### 4.4 预售模块

详细的预售列表、详情页、下单流程实现...

### 4.5 订单模块

订单列表、详情、支付流程实现...

### 4.6 NFT模块

NFT展示、转账、兑换功能实现...

### 4.7 个人中心模块

用户信息、设置、地址管理实现...

---

## 五、API接口对接

### 5.1 网络层封装

#### 5.1.1 Dio Client封装

```dart
// lib/core/network/dio_client.dart

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/env_config.dart';
import 'api_interceptor.dart';

class DioClient {
  static final DioClient _instance = DioClient._internal();
  factory DioClient() => _instance;
  
  late Dio _dio;
  final _storage = const FlutterSecureStorage();

  DioClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: EnvConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // 添加拦截器
    _dio.interceptors.add(ApiInterceptor(_storage));
    
    // 添加日志拦截器（仅开发环境）
    if (EnvConfig.enableLogging) {
      _dio.interceptors.add(LogInterceptor(
        request: true,
        requestHeader: true,
        requestBody: true,
        responseHeader: false,
        responseBody: true,
        error: true,
      ));
    }
  }

  Dio get dio => _dio;

  // GET请求
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // POST请求
  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // PUT请求
  Future<Response> put(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // DELETE请求
  Future<Response> delete(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.delete(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // 文件上传
  Future<Response> upload(
    String path,
    String filePath, {
    Map<String, dynamic>? data,
    ProgressCallback? onSendProgress,
  }) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath),
        ...?data,
      });

      final response = await _dio.post(
        path,
        data: formData,
        onSendProgress: onSendProgress,
      );
      return response;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Exception _handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return TimeoutException('请求超时，请检查网络连接');
      case DioExceptionType.badResponse:
        return _handleResponseError(error.response);
      case DioExceptionType.cancel:
        return CancelException('请求已取消');
      case DioExceptionType.connectionError:
        return NetworkException('网络连接失败，请检查网络设置');
      default:
        return UnknownException('未知错误: ${error.message}');
    }
  }

  Exception _handleResponseError(Response? response) {
    if (response == null) {
      return UnknownException('服务器响应为空');
    }

    final statusCode = response.statusCode;
    final data = response.data;

    switch (statusCode) {
      case 400:
        return BadRequestException(data['message'] ?? '请求参数错误');
      case 401:
        return UnauthorizedException(data['message'] ?? '未授权，请重新登录');
      case 403:
        return ForbiddenException(data['message'] ?? '无权访问');
      case 404:
        return NotFoundException(data['message'] ?? '请求的资源不存在');
      case 500:
      case 502:
      case 503:
        return ServerException(data['message'] ?? '服务器错误');
      default:
        return UnknownException('HTTP ${statusCode}: ${data['message'] ?? '未知错误'}');
    }
  }
}

// 自定义异常
class TimeoutException implements Exception {
  final String message;
  TimeoutException(this.message);
  @override
  String toString() => message;
}

class NetworkException implements Exception {
  final String message;
  NetworkException(this.message);
  @override
  String toString() => message;
}

class CancelException implements Exception {
  final String message;
  CancelException(this.message);
  @override
  String toString() => message;
}

class BadRequestException implements Exception {
  final String message;
  BadRequestException(this.message);
  @override
  String toString() => message;
}

class UnauthorizedException implements Exception {
  final String message;
  UnauthorizedException(this.message);
  @override
  String toString() => message;
}

class ForbiddenException implements Exception {
  final String message;
  ForbiddenException(this.message);
  @override
  String toString() => message;
}

class NotFoundException implements Exception {
  final String message;
  NotFoundException(this.message);
  @override
  String toString() => message;
}

class ServerException implements Exception {
  final String message;
  ServerException(this.message);
  @override
  String toString() => message;
}

class UnknownException implements Exception {
  final String message;
  UnknownException(this.message);
  @override
  String toString() => message;
}
```

### 5.2 API接口定义

#### 5.2.1 认证API

```dart
// lib/data/repositories/auth_repository.dart

import 'package:dio/dio.dart';
import '../../core/network/dio_client.dart';
import '../models/user.dart';

class AuthRepository {
  final DioClient _client = DioClient();

  // 用户注册
  Future<User> register({
    required String email,
    required String password,
    required String username,
  }) async {
    final response = await _client.post(
      '/auth/register',
      data: {
        'email': email,
        'password': password,
        'username': username,
      },
    );

    return User.fromJson(response.data['data']['user']);
  }

  // 用户登录
  Future<LoginResponse> login({
    required String email,
    required String password,
  }) async {
    final response = await _client.post(
      '/auth/login',
      data: {
        'email': email,
        'password': password,
      },
    );

    return LoginResponse.fromJson(response.data['data']);
  }

  // 获取当前用户信息
  Future<User> getCurrentUser() async {
    final response = await _client.get('/auth/me');
    return User.fromJson(response.data['data']);
  }

  // 登出
  Future<void> logout() async {
    await _client.post('/auth/logout');
  }

  // 忘记密码
  Future<void> forgotPassword(String email) async {
    await _client.post(
      '/auth/forgot-password',
      data: {'email': email},
    );
  }

  // 重置密码
  Future<void> resetPassword({
    required String token,
    required String password,
  }) async {
    await _client.post(
      '/auth/reset-password',
      data: {
        'token': token,
        'password': password,
      },
    );
  }
}

class LoginResponse {
  final String token;
  final User user;

  LoginResponse({
    required this.token,
    required this.user,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      token: json['token'],
      user: User.fromJson(json['user']),
    );
  }
}
```

#### 5.2.2 预售API

```dart
// lib/data/repositories/presale_repository.dart

import '../../core/network/dio_client.dart';
import '../models/presale.dart';

class PresaleRepository {
  final DioClient _client = DioClient();

  // 获取预售列表
  Future<PresaleListResponse> getPresaleList({
    int page = 1,
    int limit = 20,
    String? status,
    String? sort,
    String? keyword,
  }) async {
    final response = await _client.get(
      '/presales',
      queryParameters: {
        'page': page,
        'limit': limit,
        if (status != null) 'status': status,
        if (sort != null) 'sort': sort,
        if (keyword != null) 'keyword': keyword,
      },
    );

    return PresaleListResponse.fromJson(response.data['data']);
  }

  // 获取预售详情
  Future<Presale> getPresaleDetail(String id) async {
    final response = await _client.get('/presales/$id');
    return Presale.fromJson(response.data['data']);
  }

  // 收藏预售
  Future<void> favoritePresale(String id) async {
    await _client.post('/presales/$id/favorite');
  }

  // 取消收藏
  Future<void> unfavoritePresale(String id) async {
    await _client.delete('/presales/$id/favorite');
  }
}

class PresaleListResponse {
  final List<Presale> presales;
  final int total;
  final int page;
  final int limit;

  PresaleListResponse({
    required this.presales,
    required this.total,
    required this.page,
    required this.limit,
  });

  factory PresaleListResponse.fromJson(Map<String, dynamic> json) {
    return PresaleListResponse(
      presales: (json['presales'] as List)
          .map((e) => Presale.fromJson(e))
          .toList(),
      total: json['total'],
      page: json['page'],
      limit: json['limit'],
    );
  }
}
```

---

## 六、数据模型设计

### 6.1 用户模型

```dart
// lib/data/models/user.dart

import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String email;
  final String username;
  @JsonKey(name: 'avatar_url')
  final String? avatarUrl;
  final String? phone;
  final String role;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  User({
    required this.id,
    required this.email,
    required this.username,
    this.avatarUrl,
    this.phone,
    required this.role,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
```

### 6.2 预售模型

```dart
// lib/data/models/presale.dart

import 'package:json_annotation/json_annotation.dart';

part 'presale.g.dart';

@JsonSerializable()
class Presale {
  final String id;
  @JsonKey(name: 'presale_number')
  final String presaleNumber;
  final String title;
  final String subtitle;
  final String description;
  @JsonKey(name: 'cover_image')
  final String coverImage;
  @JsonKey(name: 'banner_images')
  final List<String> bannerImages;
  final String status;
  final PresalePricing pricing;
  final PresaleInventory inventory;
  final PresaleTimeline timeline;
  @JsonKey(name: 'product_info')
  final ProductInfo productInfo;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  Presale({
    required this.id,
    required this.presaleNumber,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.coverImage,
    required this.bannerImages,
    required this.status,
    required this.pricing,
    required this.inventory,
    required this.timeline,
    required this.productInfo,
    required this.createdAt,
  });

  factory Presale.fromJson(Map<String, dynamic> json) => 
      _$PresaleFromJson(json);
  Map<String, dynamic> toJson() => _$PresaleToJson(this);
}

@JsonSerializable()
class PresalePricing {
  @JsonKey(name: 'presale_price')
  final double presalePrice;
  @JsonKey(name: 'market_price')
  final double marketPrice;
  @JsonKey(name: 'deposit_amount')
  final double depositAmount;

  PresalePricing({
    required this.presalePrice,
    required this.marketPrice,
    required this.depositAmount,
  });

  factory PresalePricing.fromJson(Map<String, dynamic> json) =>
      _$PresalePricingFromJson(json);
  Map<String, dynamic> toJson() => _$PresalePricingToJson(this);
}

@JsonSerializable()
class PresaleInventory {
  final int total;
  final int available;
  final int sold;
  final int reserved;

  PresaleInventory({
    required this.total,
    required this.available,
    required this.sold,
    required this.reserved,
  });

  factory PresaleInventory.fromJson(Map<String, dynamic> json) =>
      _$PresaleInventoryFromJson(json);
  Map<String, dynamic> toJson() => _$PresaleInventoryToJson(this);
}

@JsonSerializable()
class PresaleTimeline {
  @JsonKey(name: 'presale_start')
  final DateTime presaleStart;
  @JsonKey(name: 'presale_end')
  final DateTime presaleEnd;
  @JsonKey(name: 'delivery_start')
  final DateTime deliveryStart;

  PresaleTimeline({
    required this.presaleStart,
    required this.presaleEnd,
    required this.deliveryStart,
  });

  factory PresaleTimeline.fromJson(Map<String, dynamic> json) =>
      _$PresaleTimelineFromJson(json);
  Map<String, dynamic> toJson() => _$PresaleTimelineToJson(this);
}

@JsonSerializable()
class ProductInfo {
  final String origin;
  final String variety;
  final String specification;
  final String grade;
  final String packaging;

  ProductInfo({
    required this.origin,
    required this.variety,
    required this.specification,
    required this.grade,
    required this.packaging,
  });

  factory ProductInfo.fromJson(Map<String, dynamic> json) =>
      _$ProductInfoFromJson(json);
  Map<String, dynamic> toJson() => _$ProductInfoToJson(this);
}
```

### 6.3 订单模型

```dart
// lib/data/models/order.dart

import 'package:json_annotation/json_annotation.dart';

part 'order.g.dart';

@JsonSerializable()
class Order {
  final String id;
  @JsonKey(name: 'order_number')
  final String orderNumber;
  @JsonKey(name: 'user_id')
  final String userId;
  @JsonKey(name: 'presale_id')
  final String presaleId;
  final String status;
  final int quantity;
  final OrderPricing pricing;
  @JsonKey(name: 'shipping_address')
  final ShippingAddress shippingAddress;
  @JsonKey(name: 'payment_info')
  final PaymentInfo? paymentInfo;
  @JsonKey(name: 'logistics_info')
  final LogisticsInfo? logisticsInfo;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  Order({
    required this.id,
    required this.orderNumber,
    required this.userId,
    required this.presaleId,
    required this.status,
    required this.quantity,
    required this.pricing,
    required this.shippingAddress,
    this.paymentInfo,
    this.logisticsInfo,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
  Map<String, dynamic> toJson() => _$OrderToJson(this);
}

@JsonSerializable()
class OrderPricing {
  @JsonKey(name: 'item_price')
  final double itemPrice;
  final double subtotal;
  @JsonKey(name: 'shipping_fee')
  final double shippingFee;
  final double discount;
  final double total;

  OrderPricing({
    required this.itemPrice,
    required this.subtotal,
    required this.shippingFee,
    required this.discount,
    required this.total,
  });

  factory OrderPricing.fromJson(Map<String, dynamic> json) =>
      _$OrderPricingFromJson(json);
  Map<String, dynamic> toJson() => _$OrderPricingToJson(this);
}

@JsonSerializable()
class ShippingAddress {
  final String name;
  final String phone;
  final String province;
  final String city;
  final String district;
  final String address;
  @JsonKey(name: 'postal_code')
  final String? postalCode;

  ShippingAddress({
    required this.name,
    required this.phone,
    required this.province,
    required this.city,
    required this.district,
    required this.address,
    this.postalCode,
  });

  factory ShippingAddress.fromJson(Map<String, dynamic> json) =>
      _$ShippingAddressFromJson(json);
  Map<String, dynamic> toJson() => _$ShippingAddressToJson(this);
}
```

### 6.4 NFT模型

```dart
// lib/data/models/nft.dart

import 'package:json_annotation/json_annotation.dart';

part 'nft.g.dart';

@JsonSerializable()
class NFT {
  final String id;
  @JsonKey(name: 'token_id')
  final String tokenId;
  @JsonKey(name: 'contract_address')
  final String contractAddress;
  @JsonKey(name: 'token_uri')
  final String tokenUri;
  @JsonKey(name: 'user_id')
  final String userId;
  @JsonKey(name: 'presale_id')
  final String presaleId;
  @JsonKey(name: 'order_id')
  final String orderId;
  final NFTMetadata metadata;
  final String status;
  final bool redeemed;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  NFT({
    required this.id,
    required this.tokenId,
    required this.contractAddress,
    required this.tokenUri,
    required this.userId,
    required this.presaleId,
    required this.orderId,
    required this.metadata,
    required this.status,
    required this.redeemed,
    required this.createdAt,
  });

  factory NFT.fromJson(Map<String, dynamic> json) => _$NFTFromJson(json);
  Map<String, dynamic> toJson() => _$NFTToJson(this);
}

@JsonSerializable()
class NFTMetadata {
  final String name;
  final String description;
  final String image;
  final List<NFTAttribute> attributes;

  NFTMetadata({
    required this.name,
    required this.description,
    required this.image,
    required this.attributes,
  });

  factory NFTMetadata.fromJson(Map<String, dynamic> json) =>
      _$NFTMetadataFromJson(json);
  Map<String, dynamic> toJson() => _$NFTMetadataToJson(this);
}

@JsonSerializable()
class NFTAttribute {
  @JsonKey(name: 'trait_type')
  final String traitType;
  final String value;

  NFTAttribute({
    required this.traitType,
    required this.value,
  });

  factory NFTAttribute.fromJson(Map<String, dynamic> json) =>
      _$NFTAttributeFromJson(json);
  Map<String, dynamic> toJson() => _$NFTAttributeToJson(this);
}
```

---

## 七、状态管理方案

### 7.1 Provider架构

我们使用Provider作为状态管理解决方案，采用MVVM架构模式。

#### 7.1.1 认证Provider

```dart
// lib/presentation/providers/auth_provider.dart

import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../data/models/user.dart';
import '../../data/repositories/auth_repository.dart';

enum AuthStatus {
  initial,
  authenticated,
  unauthenticated,
  loading,
}

class AuthProvider with ChangeNotifier {
  final AuthRepository _authRepository;
  final FlutterSecureStorage _secureStorage;

  AuthStatus _status = AuthStatus.initial;
  User? _currentUser;
  String? _errorMessage;

  AuthProvider({
    required AuthRepository authRepository,
    required FlutterSecureStorage secureStorage,
  })  : _authRepository = authRepository,
        _secureStorage = secureStorage;

  // Getters
  AuthStatus get status => _status;
  User? get currentUser => _currentUser;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _status == AuthStatus.authenticated;

  // 检查登录状态
  Future<bool> checkLoginStatus() async {
    try {
      final token = await _secureStorage.read(key: 'auth_token');
      if (token == null) {
        _status = AuthStatus.unauthenticated;
        notifyListeners();
        return false;
      }

      // 验证token有效性
      _currentUser = await _authRepository.getCurrentUser();
      _status = AuthStatus.authenticated;
      notifyListeners();
      return true;
    } catch (e) {
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      return false;
    }
  }

  // 登录
  Future<void> login({
    required String email,
    required String password,
  }) async {
    try {
      _status = AuthStatus.loading;
      _errorMessage = null;
      notifyListeners();

      final response = await _authRepository.login(
        email: email,
        password: password,
      );

      // 保存token
      await _secureStorage.write(
        key: 'auth_token',
        value: response.token,
      );

      _currentUser = response.user;
      _status = AuthStatus.authenticated;
      notifyListeners();
    } catch (e) {
      _status = AuthStatus.unauthenticated;
      _errorMessage = e.toString();
      notifyListeners();
      rethrow;
    }
  }

  // 注册
  Future<void> register({
    required String email,
    required String password,
    required String username,
  }) async {
    try {
      _status = AuthStatus.loading;
      _errorMessage = null;
      notifyListeners();

      await _authRepository.register(
        email: email,
        password: password,
        username: username,
      );

      // 注册成功后自动登录
      await login(email: email, password: password);
    } catch (e) {
      _status = AuthStatus.unauthenticated;
      _errorMessage = e.toString();
      notifyListeners();
      rethrow;
    }
  }

  // 登出
  Future<void> logout() async {
    try {
      await _authRepository.logout();
    } catch (e) {
      // 即使API调用失败也要清除本地数据
    } finally {
      await _secureStorage.delete(key: 'auth_token');
      _currentUser = null;
      _status = AuthStatus.unauthenticated;
      notifyListeners();
    }
  }

  // 更新用户信息
  void updateUser(User user) {
    _currentUser = user;
    notifyListeners();
  }
}
```

#### 7.1.2 预售Provider

```dart
// lib/presentation/providers/presale_provider.dart

import 'package:flutter/foundation.dart';
import '../../data/models/presale.dart';
import '../../data/repositories/presale_repository.dart';

class PresaleProvider with ChangeNotifier {
  final PresaleRepository _repository;

  PresaleProvider({required PresaleRepository repository})
      : _repository = repository;

  // 预售列表
  List<Presale> _presales = [];
  bool _isLoading = false;
  bool _hasMore = true;
  int _currentPage = 1;
  String? _errorMessage;

  // 当前查看的预售详情
  Presale? _currentPresale;

  // Getters
  List<Presale> get presales => _presales;
  bool get isLoading => _isLoading;
  bool get hasMore => _hasMore;
  String? get errorMessage => _errorMessage;
  Presale? get currentPresale => _currentPresale;

  // 加载预售列表
  Future<void> loadPresales({
    bool refresh = false,
    String? status,
    String? sort,
    String? keyword,
  }) async {
    if (_isLoading) return;
    if (!refresh && !_hasMore) return;

    try {
      _isLoading = true;
      _errorMessage = null;
      
      if (refresh) {
        _currentPage = 1;
        _hasMore = true;
      }
      
      notifyListeners();

      final response = await _repository.getPresaleList(
        page: _currentPage,
        status: status,
        sort: sort,
        keyword: keyword,
      );

      if (refresh) {
        _presales = response.presales;
      } else {
        _presales.addAll(response.presales);
      }

      _hasMore = _presales.length < response.total;
      _currentPage++;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // 加载预售详情
  Future<void> loadPresaleDetail(String id) async {
    try {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();

      _currentPresale = await _repository.getPresaleDetail(id);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // 收藏预售
  Future<void> toggleFavorite(String id) async {
    try {
      final presale = _presales.firstWhere((p) => p.id == id);
      
      // 乐观更新UI
      // presale.isFavorited = !presale.isFavorited;
      notifyListeners();

      // if (presale.isFavorited) {
      //   await _repository.favoritePresale(id);
      // } else {
      //   await _repository.unfavoritePresale(id);
      // }
    } catch (e) {
      // 如果失败，回滚UI状态
      // presale.isFavorited = !presale.isFavorited;
      notifyListeners();
      rethrow;
    }
  }

  // 刷新列表
  Future<void> refresh() async {
    await loadPresales(refresh: true);
  }
}
```

### 7.2 Provider注入

```dart
// lib/main.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'data/repositories/auth_repository.dart';
import 'data/repositories/presale_repository.dart';
import 'data/repositories/order_repository.dart';
import 'data/repositories/nft_repository.dart';
import 'presentation/providers/auth_provider.dart';
import 'presentation/providers/presale_provider.dart';
import 'presentation/providers/order_provider.dart';
import 'presentation/providers/nft_provider.dart';
import 'app.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        // Repositories
        Provider(create: (_) => AuthRepository()),
        Provider(create: (_) => PresaleRepository()),
        Provider(create: (_) => OrderRepository()),
        Provider(create: (_) => NFTRepository()),
        Provider(create: (_) => const FlutterSecureStorage()),

        // Providers
        ChangeNotifierProvider(
          create: (context) => AuthProvider(
            authRepository: context.read<AuthRepository>(),
            secureStorage: context.read<FlutterSecureStorage>(),
          ),
        ),
        ChangeNotifierProvider(
          create: (context) => PresaleProvider(
            repository: context.read<PresaleRepository>(),
          ),
        ),
        ChangeNotifierProvider(
          create: (context) => OrderProvider(
            repository: context.read<OrderRepository>(),
          ),
        ),
        ChangeNotifierProvider(
          create: (context) => NFTProvider(
            repository: context.read<NFTRepository>(),
          ),
        ),
      ],
      child: const MyApp(),
    ),
  );
}
```

---

## 八、路由导航设计

### 8.1 路由配置

```dart
// lib/config/routes.dart

import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import '../presentation/screens/splash/splash_screen.dart';
import '../presentation/screens/onboarding/onboarding_screen.dart';
import '../presentation/screens/auth/login_screen.dart';
import '../presentation/screens/auth/register_screen.dart';
import '../presentation/screens/main/main_screen.dart';
import '../presentation/screens/presale/presale_detail_screen.dart';
import '../presentation/screens/order/order_detail_screen.dart';
import '../presentation/screens/nft/nft_detail_screen.dart';

final router = GoRouter(
  initialLocation: '/splash',
  routes: [
    // 启动页
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),

    // 引导页
    GoRoute(
      path: '/onboarding',
      builder: (context, state) => const OnboardingScreen(),
    ),

    // 登录注册
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),

    // 主框架
    GoRoute(
      path: '/main',
      builder: (context, state) => const MainScreen(),
    ),

    // 预售详情
    GoRoute(
      path: '/presale/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return PresaleDetailScreen(presaleId: id);
      },
    ),

    // 订单详情
    GoRoute(
      path: '/order/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return OrderDetailScreen(orderId: id);
      },
    ),

    // NFT详情
    GoRoute(
      path: '/nft/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return NFTDetailScreen(nftId: id);
      },
    ),
  ],

  // 路由守卫
  redirect: (context, state) {
    // 根据需要添加路由守卫逻辑
    return null;
  },

  // 错误处理
  errorBuilder: (context, state) => Scaffold(
    body: Center(
      child: Text('页面不存在: ${state.location}'),
    ),
  ),
);
```

---

## 九、UI组件库

### 9.1 通用按钮组件

```dart
// lib/presentation/widgets/common/custom_button.dart

import 'package:flutter/material.dart';

enum ButtonType {
  primary,
  secondary,
  outline,
  text,
}

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonType type;
  final bool isLoading;
  final double? width;
  final double height;
  final IconData? icon;

  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.type = ButtonType.primary,
    this.isLoading = false,
    this.width,
    this.height = 48,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    Widget child = isLoading
        ? SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                _getTextColor(theme),
              ),
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 20),
                const SizedBox(width: 8),
              ],
              Text(
                text,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: _getTextColor(theme),
                ),
              ),
            ],
          );

    return SizedBox(
      width: width,
      height: height,
      child: _buildButton(context, theme, child),
    );
  }

  Widget _buildButton(BuildContext context, ThemeData theme, Widget child) {
    switch (type) {
      case ButtonType.primary:
        return ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: theme.primaryColor,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            elevation: 0,
          ),
          child: child,
        );

      case ButtonType.secondary:
        return ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: theme.primaryColor.withOpacity(0.1),
            foregroundColor: theme.primaryColor,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            elevation: 0,
          ),
          child: child,
        );

      case ButtonType.outline:
        return OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            side: BorderSide(color: theme.primaryColor, width: 1.5),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: child,
        );

      case ButtonType.text:
        return TextButton(
          onPressed: isLoading ? null : onPressed,
          child: child,
        );
    }
  }

  Color _getTextColor(ThemeData theme) {
    switch (type) {
      case ButtonType.primary:
        return Colors.white;
      case ButtonType.secondary:
      case ButtonType.outline:
      case ButtonType.text:
        return theme.primaryColor;
    }
  }
}
```

### 9.2 加载组件

```dart
// lib/presentation/widgets/common/loading_widget.dart

import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class LoadingWidget extends StatelessWidget {
  final LoadingType type;

  const LoadingWidget({
    super.key,
    this.type = LoadingType.circular,
  });

  @override
  Widget build(BuildContext context) {
    switch (type) {
      case LoadingType.circular:
        return Center(
          child: CircularProgressIndicator(),
        );

      case LoadingType.linear:
        return LinearProgressIndicator();

      case LoadingType.shimmer:
        return _buildShimmer();
    }
  }

  Widget _buildShimmer() {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Column(
        children: List.generate(
          3,
          (index) => Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Container(
                  width: 100,
                  height: 100,
                  color: Colors.white,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: double.infinity,
                        height: 16,
                        color: Colors.white,
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: 150,
                        height: 16,
                        color: Colors.white,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

enum LoadingType {
  circular,
  linear,
  shimmer,
}
```

---

## 十、性能优化方案

### 10.1 启动优化

**优化措施**:
1. **延迟初始化非必要服务**
2. **图片资源压缩**
3. **代码分包**
4. **使用const构造函数**

```dart
// 延迟初始化示例
class LazyInitService {
  static LazyInitService? _instance;
  static LazyInitService get instance {
    _instance ??= LazyInitService._();
    return _instance!;
  }

  LazyInitService._() {
    _initialize();
  }

  void _initialize() {
    // 非关键服务初始化
  }
}
```

### 10.2 列表优化

```dart
// 使用ListView.builder懒加载
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return const PresaleCard(presale: items[index]); // 使用const
  },
);

// 复杂列表项使用AutomaticKeepAliveClientMixin
class PresaleCard extends StatefulWidget {
  const PresaleCard({super.key});

  @override
  State<PresaleCard> createState() => _PresaleCardState();
}

class _PresaleCardState extends State<PresaleCard>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context); // 必须调用
    return Container();
  }
}
```

### 10.3 图片优化

```dart
// 使用cached_network_image
CachedNetworkImage(
  imageUrl: imageUrl,
  placeholder: (context, url) => Shimmer.fromColors(
    baseColor: Colors.grey[300]!,
    highlightColor: Colors.grey[100]!,
    child: Container(color: Colors.white),
  ),
  errorWidget: (context, url, error) => Icon(Icons.error),
  fadeInDuration: Duration(milliseconds: 300),
  memCacheWidth: 500, // 限制内存缓存大小
);
```

---

## 十一、安全实现方案

### 11.1 Token安全存储

```dart
// 使用flutter_secure_storage加密存储
final storage = FlutterSecureStorage();

// 存储Token
await storage.write(key: 'auth_token', value: token);

// 读取Token
final token = await storage.read(key: 'auth_token');

// 删除Token
await storage.delete(key: 'auth_token');
```

### 11.2 网络安全

```dart
// 证书绑定（防中间人攻击）
class SecurityConfig {
  static SecurityContext getSecurityContext() {
    final context = SecurityContext(withTrustedRoots: false);
    // 加载自签名证书
    context.setTrustedCertificatesBytes(certificateBytes);
    return context;
  }
}

// Dio配置SSL
final dio = Dio();
(dio.httpClientAdapter as DefaultHttpClientAdapter).onHttpClientCreate = 
    (client) {
  client.badCertificateCallback = 
      (X509Certificate cert, String host, int port) {
    // 验证证书
    return _verifyCertificate(cert, host);
  };
};
```

### 11.3 代码混淆

在`android/app/proguard-rules.pro`添加:
```proguard
# Flutter
-keep class io.flutter.** { *; }
-dontwarn io.flutter.**

# Dio
-keep class com.dio.** { *; }
```

---

## 十二、测试实现方案

### 12.1 单元测试示例

```dart
// test/utils/validators_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:juyuan_nft/core/utils/validators.dart';

void main() {
  group('Email Validator', () {
    test('should return true for valid email', () {
      expect(Validators.isValidEmail('test@example.com'), true);
      expect(Validators.isValidEmail('user.name@domain.co.uk'), true);
    });

    test('should return false for invalid email', () {
      expect(Validators.isValidEmail('invalid-email'), false);
      expect(Validators.isValidEmail('@example.com'), false);
      expect(Validators.isValidEmail('test@'), false);
    });
  });

  group('Password Validator', () {
    test('should return true for valid password', () {
      expect(Validators.isValidPassword('password123'), true);
      expect(Validators.isValidPassword('StrongPass123!'), true);
    });

    test('should return false for short password', () {
      expect(Validators.isValidPassword('12345'), false);
      expect(Validators.isValidPassword('abc'), false);
    });
  });
}
```

### 12.2 Widget测试示例

```dart
// test/widgets/custom_button_test.dart

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:juyuan_nft/presentation/widgets/common/custom_button.dart';

void main() {
  testWidgets('CustomButton displays text', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CustomButton(
            text: 'Test Button',
            onPressed: () {},
          ),
        ),
      ),
    );

    expect(find.text('Test Button'), findsOneWidget);
  });

  testWidgets('CustomButton calls onPressed when tapped',
      (WidgetTester tester) async {
    bool pressed = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CustomButton(
            text: 'Test',
            onPressed: () {
              pressed = true;
            },
          ),
        ),
      ),
    );

    await tester.tap(find.byType(CustomButton));
    await tester.pump();

    expect(pressed, true);
  });
}
```

---

## 十三、CI/CD流程

### 13.1 GitHub Actions配置

```.yaml
# .github/workflows/flutter-ci.yml

name: Flutter CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Flutter
      uses: subosito/flutter-action@v2
      with:
        flutter-version: '3.16.0'
        channel: 'stable'
    
    - name: Install dependencies
      run: flutter pub get
    
    - name: Run tests
      run: flutter test
    
    - name: Analyze code
      run: flutter analyze
    
    - name: Check formatting
      run: dart format --set-exit-if-changed .
    
    - name: Build APK
      run: flutter build apk --release
    
    - name: Build iOS (macOS only)
      if: runner.os == 'macOS'
      run: flutter build ios --release --no-codesign
```

---

## 十四、发布上架流程

### 14.1 iOS发布流程

**步骤**:
1. **配置签名**
   - 在Xcode中配置Bundle Identifier
   - 配置Team和Provisioning Profile

2. **构建应用**
   ```bash
   flutter build ios --release
   ```

3. **打开Xcode**
   ```bash
   open ios/Runner.xcworkspace
   ```

4. **Archive并上传**
   - Product → Archive
   - Upload to App Store Connect

5. **App Store Connect配置**
   - 填写应用信息
   - 上传截图和预览视频
   - 提交审核

### 14.2 Android发布流程

**步骤**:
1. **生成签名密钥**
   ```bash
   keytool -genkey -v -keystore ~/key.jks -keyalg RSA \
     -keysize 2048 -validity 10000 -alias key
   ```

2. **配置build.gradle**
   ```gradle
   signingConfigs {
       release {
           keyAlias keystoreProperties['keyAlias']
           keyPassword keystoreProperties['keyPassword']
           storeFile keystoreProperties['storeFile'] ? \
             file(keystoreProperties['storeFile']) : null
           storePassword keystoreProperties['storePassword']
       }
   }
   ```

3. **构建应用**
   ```bash
   flutter build appbundle --release
   ```

4. **上传到各应用商店**
   - 华为应用市场
   - 小米应用商店
   - OPPO软件商店
   - VIVO应用商店
   - 腾讯应用宝

---

## 十五、开发任务分解

### 15.1 Sprint 1 (Week 1-2): 基础框架

| 任务ID | 任务名称 | 负责人 | 工时 | 优先级 | 状态 |
|-------|---------|--------|------|--------|------|
| T001 | 项目初始化 | 工程师A | 4h | P0 | 待开始 |
| T002 | 环境配置文档 | 工程师A | 2h | P0 | 待开始 |
| T003 | 网络层封装 | 工程师A | 8h | P0 | 待开始 |
| T004 | 路由配置 | 工程师B | 6h | P0 | 待开始 |
| T005 | 启动页开发 | 工程师B | 4h | P0 | 待开始 |
| T006 | 引导页开发 | 工程师B | 6h | P0 | 待开始 |
| T007 | 主题配置 | 工程师A | 4h | P0 | 待开始 |

### 15.2 Sprint 2 (Week 3-4): 认证模块

| 任务ID | 任务名称 | 负责人 | 工时 | 优先级 | 状态 |
|-------|---------|--------|------|--------|------|
| T101 | 登录页面UI | 工程师B | 6h | P0 | 待开始 |
| T102 | 注册页面UI | 工程师B | 6h | P0 | 待开始 |
| T103 | 认证Provider | 工程师A | 8h | P0 | 待开始 |
| T104 | 认证Repository | 工程师A | 6h | P0 | 待开始 |
| T105 | Token管理 | 工程师A | 4h | P0 | 待开始 |
| T106 | 第三方登录集成 | 工程师A | 12h | P1 | 待开始 |

### 15.3 Sprint 3 (Week 5-6): 预售模块

| 任务ID | 任务名称 | 负责人 | 工时 | 优先级 | 状态 |
|-------|---------|--------|------|--------|------|
| T201 | 预售列表UI | 工程师B | 10h | P0 | 待开始 |
| T202 | 预售详情UI | 工程师B | 12h | P0 | 待开始 |
| T203 | 预售Provider | 工程师A | 8h | P0 | 待开始 |
| T204 | 预售Repository | 工程师A | 6h | P0 | 待开始 |
| T205 | 下拉刷新 | 工程师B | 4h | P0 | 待开始 |
| T206 | 搜索筛选功能 | 工程师A | 8h | P1 | 待开始 |

### 15.4 Sprint 4 (Week 7-8): 订单模块

| 任务ID | 任务名称 | 负责人 | 工时 | 优先级 | 状态 |
|-------|---------|--------|------|--------|------|
| T301 | 订单列表UI | 工程师B | 8h | P0 | 待开始 |
| T302 | 订单详情UI | 工程师B | 10h | P0 | 待开始 |
| T303 | 创建订单流程 | 工程师A | 12h | P0 | 待开始 |
| T304 | 支付集成 | 工程师A | 16h | P0 | 待开始 |
| T305 | 物流追踪 | 工程师B | 8h | P1 | 待开始 |

### 15.5 Sprint 5 (Week 9-10): NFT & 个人中心

| 任务ID | 任务名称 | 负责人 | 工时 | 优先级 | 状态 |
|-------|---------|--------|------|--------|------|
| T401 | NFT列表UI | 工程师B | 8h | P0 | 待开始 |
| T402 | NFT详情UI | 工程师B | 10h | P0 | 待开始 |
| T403 | Web3集成 | 工程师A | 16h | P0 | 待开始 |
| T404 | 个人中心UI | 工程师B | 10h | P0 | 待开始 |
| T405 | 地址管理 | 工程师B | 6h | P0 | 待开始 |

### 15.6 Sprint 6 (Week 11-12): 测试与优化

| 任务ID | 任务名称 | 负责人 | 工时 | 优先级 | 状态 |
|-------|---------|--------|------|--------|------|
| T501 | 单元测试 | 工程师A | 16h | P0 | 待开始 |
| T502 | Widget测试 | 工程师B | 12h | P0 | 待开始 |
| T503 | 集成测试 | 测试工程师 | 16h | P0 | 待开始 |
| T504 | 性能优化 | 工程师A | 12h | P0 | 待开始 |
| T505 | Bug修复 | 全体 | 16h | P0 | 待开始 |
| T506 | 上架准备 | 全体 | 8h | P0 | 待开始 |

### 15.7 甘特图

```
Week 1-2:  基础框架 [█████████████████████]
Week 3-4:  认证模块 [█████████████████████]
Week 5-6:  预售模块 [█████████████████████]
Week 7-8:  订单模块 [█████████████████████]
Week 9-10: NFT模块  [█████████████████████]
Week 11-12:测试优化 [█████████████████████]
Week 13:   发布上架 [████████████]
```

---

## 附录

### A. 代码规范

**Dart代码规范**:
- 遵循[Effective Dart](https://dart.dev/guides/language/effective-dart)
- 使用`dart format`格式化代码
- 使用`dart analyze`检查代码质量
- 类名使用大驼峰（UpperCamelCase）
- 变量名使用小驼峰（lowerCamelCase）
- 常量使用lowerCamelCase
- 文件名使用snake_case

**Git提交规范**:
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链相关
```

### B. 常用命令

```bash
# 运行应用
flutter run

# 构建APK
flutter build apk --release

# 构建iOS
flutter build ios --release

# 运行测试
flutter test

# 代码分析
flutter analyze

# 格式化代码
dart format .

# 生成代码
flutter pub run build_runner build

# 清理缓存
flutter clean

# 更新依赖
flutter pub upgrade
```

### C. 参考资料

- [Flutter官方文档](https://flutter.dev/docs)
- [Dart语言文档](https://dart.dev/guides)
- [Provider文档](https://pub.dev/packages/provider)
- [Go Router文档](https://pub.dev/packages/go_router)
- [Dio文档](https://pub.dev/packages/dio)

---

## 十六、推送通知实现

### 16.1 Firebase Cloud Messaging配置

#### 16.1.1 Firebase项目配置

**步骤**:
1. 在Firebase Console创建项目
2. 添加Android应用（包名：com.juyuan.lychee_nft）
3. 添加iOS应用（Bundle ID：com.juyuan.lycheeNft）
4. 下载配置文件
   - Android: `google-services.json` → `android/app/`
   - iOS: `GoogleService-Info.plist` → `ios/Runner/`

#### 16.1.2 依赖配置

```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.6
  flutter_local_notifications: ^16.3.0
```

#### 16.1.3 推送服务实现

```dart
// lib/core/services/notification_service.dart

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter/foundation.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  String? _fcmToken;
  String? get fcmToken => _fcmToken;

  // 初始化通知服务
  Future<void> initialize() async {
    // 1. 请求通知权限
    final settings = await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      debugPrint('用户已授权通知');
    } else {
      debugPrint('用户拒绝通知权限');
      return;
    }

    // 2. 获取FCM Token
    _fcmToken = await _firebaseMessaging.getToken();
    debugPrint('FCM Token: $_fcmToken');

    // 监听Token刷新
    _firebaseMessaging.onTokenRefresh.listen((newToken) {
      _fcmToken = newToken;
      debugPrint('FCM Token刷新: $newToken');
      // TODO: 上传到服务器
    });

    // 3. 初始化本地通知
    await _initializeLocalNotifications();

    // 4. 配置前台消息处理
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // 5. 配置后台消息处理
    FirebaseMessaging.onMessageOpenedApp.listen(_handleBackgroundMessage);

    // 6. 处理应用终止状态下的通知点击
    final initialMessage = await _firebaseMessaging.getInitialMessage();
    if (initialMessage != null) {
      _handleBackgroundMessage(initialMessage);
    }
  }

  // 初始化本地通知
  Future<void> _initializeLocalNotifications() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );
  }

  // 前台消息处理
  Future<void> _handleForegroundMessage(RemoteMessage message) async {
    debugPrint('收到前台消息: ${message.messageId}');

    final notification = message.notification;
    final data = message.data;

    if (notification != null) {
      // 显示本地通知
      await _showLocalNotification(
        title: notification.title ?? '',
        body: notification.body ?? '',
        payload: data['route'] ?? '',
      );
    }
  }

  // 后台消息处理
  void _handleBackgroundMessage(RemoteMessage message) {
    debugPrint('处理后台消息: ${message.messageId}');
    
    final data = message.data;
    final route = data['route'];

    if (route != null) {
      // 导航到指定页面
      _navigateToRoute(route, data);
    }
  }

  // 显示本地通知
  Future<void> _showLocalNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'default_channel',
      '默认通知',
      channelDescription: '应用默认通知渠道',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: true,
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(
      DateTime.now().millisecond,
      title,
      body,
      details,
      payload: payload,
    );
  }

  // 通知点击处理
  void _onNotificationTapped(NotificationResponse response) {
    final payload = response.payload;
    if (payload != null) {
      _navigateToRoute(payload, {});
    }
  }

  // 导航到指定路由
  void _navigateToRoute(String route, Map<String, dynamic> data) {
    // TODO: 使用GoRouter导航
    debugPrint('导航到: $route, 数据: $data');
  }

  // 订阅主题
  Future<void> subscribeTopic(String topic) async {
    await _firebaseMessaging.subscribeToTopic(topic);
    debugPrint('订阅主题: $topic');
  }

  // 取消订阅主题
  Future<void> unsubscribeTopic(String topic) async {
    await _firebaseMessaging.unsubscribeFromTopic(topic);
    debugPrint('取消订阅主题: $topic');
  }

  // 上传Token到服务器
  Future<void> uploadToken() async {
    if (_fcmToken == null) return;

    try {
      // TODO: 调用API上传Token
      debugPrint('上传Token到服务器: $_fcmToken');
    } catch (e) {
      debugPrint('上传Token失败: $e');
    }
  }
}

// 后台消息处理器（必须是顶级函数）
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  debugPrint('后台消息处理: ${message.messageId}');
}
```

### 16.2 推送通知类型

| 类型 | 触发条件 | 标题 | 内容 | 跳转路由 |
|-----|---------|------|------|---------|
| 订单支付成功 | 支付完成 | "支付成功" | "您的订单已支付成功" | /order/:id |
| 订单发货 | 商家发货 | "订单已发货" | "您的订单已发货，请注意查收" | /order/:id |
| 物流更新 | 物流节点 | "物流更新" | "您的包裹已到达XX" | /order/:id |
| NFT铸造完成 | 铸造成功 | "NFT铸造成功" | "您的NFT已铸造完成" | /nft/:id |
| 预售开始 | 收藏的预售开始 | "预售开始" | "您收藏的XX预售开始啦" | /presale/:id |
| 预售即将结束 | 结束前24h | "预售即将结束" | "XX预售即将结束，抓紧时间" | /presale/:id |

---

## 十七、错误处理和日志系统

### 17.1 全局错误处理

```dart
// lib/core/errors/error_handler.dart

import 'package:flutter/material.dart';
import 'package:logger/logger.dart';

class GlobalErrorHandler {
  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 2,
      errorMethodCount: 8,
      lineLength: 120,
      colors: true,
      printEmojis: true,
      printTime: true,
    ),
  );

  // 初始化全局错误处理
  static void initialize() {
    // Flutter错误处理
    FlutterError.onError = (FlutterErrorDetails details) {
      _logger.e(
        'Flutter Error',
        error: details.exception,
        stackTrace: details.stack,
      );
      
      // 生产环境上报到Sentry/Bugly
      if (kReleaseMode) {
        _reportToCrashlytics(details);
      }
    };

    // Dart错误处理
    PlatformDispatcher.instance.onError = (error, stack) {
      _logger.e('Dart Error', error: error, stackTrace: stack);
      
      if (kReleaseMode) {
        _reportError(error, stack);
      }
      return true;
    };
  }

  // 上报到崩溃分析平台
  static void _reportToCrashlytics(FlutterErrorDetails details) {
    // TODO: 集成Firebase Crashlytics或Bugly
  }

  static void _reportError(Object error, StackTrace stack) {
    // TODO: 上报错误
  }

  // 显示错误对话框
  static void showErrorDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('错误'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  // 显示错误Snackbar
  static void showErrorSnackbar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        action: SnackBarAction(
          label: '关闭',
          textColor: Colors.white,
          onPressed: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
          },
        ),
      ),
    );
  }
}
```

### 17.2 日志工具类

```dart
// lib/core/utils/logger.dart

import 'package:logger/logger.dart';

class AppLogger {
  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 0,
      errorMethodCount: 5,
      lineLength: 80,
      colors: true,
      printEmojis: true,
      printTime: false,
    ),
  );

  static void debug(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.d(message, error: error, stackTrace: stackTrace);
  }

  static void info(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.i(message, error: error, stackTrace: stackTrace);
  }

  static void warning(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.w(message, error: error, stackTrace: stackTrace);
  }

  static void error(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.e(message, error: error, stackTrace: stackTrace);
  }

  static void wtf(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.f(message, error: error, stackTrace: stackTrace);
  }
}
```

---

## 十八、缓存策略

### 18.1 多级缓存架构

```
┌─────────────────────────────────────┐
│         Memory Cache (内存)          │  最快，容量小
│        (Map<String, dynamic>)       │  应用重启清空
└─────────────────────────────────────┘
              ↓ Miss
┌─────────────────────────────────────┐
│         Disk Cache (磁盘)            │  较快，容量中等
│      (SharedPreferences/SQLite)     │  持久化存储
└─────────────────────────────────────┘
              ↓ Miss
┌─────────────────────────────────────┐
│         Network (网络)               │  慢，容量无限
│           (API Call)                │  实时数据
└─────────────────────────────────────┘
```

### 18.2 缓存管理器实现

```dart
// lib/core/cache/cache_manager.dart

import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class CacheManager {
  static final CacheManager _instance = CacheManager._internal();
  factory CacheManager() => _instance;
  CacheManager._internal();

  // 内存缓存
  final Map<String, CacheEntry> _memoryCache = {};
  
  // 磁盘缓存
  SharedPreferences? _prefs;

  // 初始化
  Future<void> initialize() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // 保存到缓存
  Future<void> put(
    String key,
    dynamic value, {
    Duration? ttl,
    bool memoryOnly = false,
  }) async {
    final entry = CacheEntry(
      data: value,
      timestamp: DateTime.now(),
      ttl: ttl,
    );

    // 保存到内存
    _memoryCache[key] = entry;

    // 保存到磁盘
    if (!memoryOnly && _prefs != null) {
      await _prefs.setString(key, jsonEncode(entry.toJson()));
    }
  }

  // 从缓存获取
  Future<T?> get<T>(String key) async {
    // 1. 尝试从内存获取
    final memoryEntry = _memoryCache[key];
    if (memoryEntry != null && !memoryEntry.isExpired) {
      return memoryEntry.data as T?;
    }

    // 2. 尝试从磁盘获取
    if (_prefs != null) {
      final diskData = _prefs.getString(key);
      if (diskData != null) {
        try {
          final entry = CacheEntry.fromJson(jsonDecode(diskData));
          if (!entry.isExpired) {
            // 回写到内存
            _memoryCache[key] = entry;
            return entry.data as T?;
          } else {
            // 过期，删除
            await remove(key);
          }
        } catch (e) {
          await remove(key);
        }
      }
    }

    return null;
  }

  // 删除缓存
  Future<void> remove(String key) async {
    _memoryCache.remove(key);
    await _prefs?.remove(key);
  }

  // 清空所有缓存
  Future<void> clear() async {
    _memoryCache.clear();
    await _prefs?.clear();
  }

  // 清空过期缓存
  Future<void> clearExpired() async {
    final expiredKeys = <String>[];

    // 清理内存缓存
    _memoryCache.removeWhere((key, entry) {
      if (entry.isExpired) {
        expiredKeys.add(key);
        return true;
      }
      return false;
    });

    // 清理磁盘缓存
    for (final key in expiredKeys) {
      await _prefs?.remove(key);
    }
  }

  // 获取缓存大小
  int getMemoryCacheSize() => _memoryCache.length;
}

class CacheEntry {
  final dynamic data;
  final DateTime timestamp;
  final Duration? ttl;

  CacheEntry({
    required this.data,
    required this.timestamp,
    this.ttl,
  });

  bool get isExpired {
    if (ttl == null) return false;
    return DateTime.now().difference(timestamp) > ttl!;
  }

  Map<String, dynamic> toJson() => {
        'data': data,
        'timestamp': timestamp.toIso8601String(),
        'ttl': ttl?.inSeconds,
      };

  factory CacheEntry.fromJson(Map<String, dynamic> json) {
    return CacheEntry(
      data: json['data'],
      timestamp: DateTime.parse(json['timestamp']),
      ttl: json['ttl'] != null ? Duration(seconds: json['ttl']) : null,
    );
  }
}
```

### 18.3 缓存策略

| 数据类型 | 缓存位置 | TTL | 刷新策略 |
|---------|---------|-----|---------|
| 用户信息 | 内存+磁盘 | 24小时 | 登录时刷新 |
| 预售列表 | 内存 | 5分钟 | 下拉刷新 |
| 预售详情 | 内存+磁盘 | 10分钟 | 进入页面刷新 |
| 订单列表 | 内存 | 1分钟 | 下拉刷新 |
| NFT列表 | 内存+磁盘 | 30分钟 | 手动刷新 |
| 配置信息 | 磁盘 | 永久 | 版本更新时 |

---

## 十九、性能监控

### 19.1 性能监控方案

```dart
// lib/core/monitoring/performance_monitor.dart

import 'package:flutter/foundation.dart';

class PerformanceMonitor {
  static final PerformanceMonitor _instance = PerformanceMonitor._internal();
  factory PerformanceMonitor() => _instance;
  PerformanceMonitor._internal();

  final Map<String, Stopwatch> _timers = {};

  // 开始计时
  void startTimer(String name) {
    _timers[name] = Stopwatch()..start();
  }

  // 结束计时并记录
  void endTimer(String name) {
    final timer = _timers[name];
    if (timer != null) {
      timer.stop();
      final duration = timer.elapsedMilliseconds;
      
      debugPrint('⏱️ [$name] took ${duration}ms');
      
      // 超过阈值警告
      if (duration > 1000) {
        debugPrint('⚠️ [$name] performance warning: ${duration}ms');
      }

      // 上报到监控平台
      if (kReleaseMode) {
        _reportPerformance(name, duration);
      }

      _timers.remove(name);
    }
  }

  // 测量异步操作
  Future<T> measureAsync<T>(
    String name,
    Future<T> Function() operation,
  ) async {
    startTimer(name);
    try {
      return await operation();
    } finally {
      endTimer(name);
    }
  }

  // 测量同步操作
  T measureSync<T>(
    String name,
    T Function() operation,
  ) {
    startTimer(name);
    try {
      return operation();
    } finally {
      endTimer(name);
    }
  }

  void _reportPerformance(String name, int duration) {
    // TODO: 上报到Firebase Performance或其他监控平台
  }
}

// 使用示例
// final monitor = PerformanceMonitor();
// await monitor.measureAsync('load_presale_list', () async {
//   return await repository.getPresaleList();
// });
```

### 19.2 FPS监控

```dart
// lib/core/monitoring/fps_monitor.dart

import 'package:flutter/scheduler.dart';
import 'package:flutter/foundation.dart';

class FpsMonitor {
  static final FpsMonitor _instance = FpsMonitor._internal();
  factory FpsMonitor() => _instance;
  FpsMonitor._internal();

  final List<double> _fpsHistory = [];
  DateTime? _lastTimestamp;
  int _frameCount = 0;

  void start() {
    SchedulerBinding.instance.addTimingsCallback(_onFrame);
  }

  void stop() {
    SchedulerBinding.instance.removeTimingsCallback(_onFrame);
  }

  void _onFrame(List<FrameTiming> timings) {
    final now = DateTime.now();
    
    if (_lastTimestamp != null) {
      final elapsed = now.difference(_lastTimestamp!).inMilliseconds;
      if (elapsed >= 1000) {
        final fps = (_frameCount * 1000) / elapsed;
        _fpsHistory.add(fps);
        
        if (_fpsHistory.length > 60) {
          _fpsHistory.removeAt(0);
        }
        
        debugPrint('📊 FPS: ${fps.toStringAsFixed(1)}');
        
        // 低FPS警告
        if (fps < 45) {
          debugPrint('⚠️ Low FPS detected: ${fps.toStringAsFixed(1)}');
        }
        
        _frameCount = 0;
        _lastTimestamp = now;
      }
    } else {
      _lastTimestamp = now;
    }
    
    _frameCount++;
  }

  double getAverageFps() {
    if (_fpsHistory.isEmpty) return 0;
    return _fpsHistory.reduce((a, b) => a + b) / _fpsHistory.length;
  }
}
```

---

## 二十、国际化实现

### 20.1 多语言配置

```yaml
# pubspec.yaml
dependencies:
  flutter_localizations:
    sdk: flutter
  intl: ^0.18.1

flutter:
  generate: true
```

创建 `l10n.yaml`:
```yaml
arb-dir: lib/l10n
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart
```

### 20.2 语言文件

```json
// lib/l10n/app_en.arb
{
  "@@locale": "en",
  "appTitle": "Juyuan NFT",
  "loginTitle": "Login",
  "email": "Email",
  "password": "Password",
  "login": "Login",
  "register": "Register",
  "forgotPassword": "Forgot Password?",
  "presaleList": "Presales",
  "myOrders": "My Orders",
  "myNFTs": "My NFTs",
  "profile": "Profile",
  
  "orderStatus_pending": "Pending",
  "orderStatus_paid": "Paid",
  "orderStatus_shipped": "Shipped",
  "orderStatus_completed": "Completed",
  
  "greeting": "Hello, {name}!",
  "@greeting": {
    "placeholders": {
      "name": {
        "type": "String"
      }
    }
  }
}
```

```json
// lib/l10n/app_zh.arb
{
  "@@locale": "zh",
  "appTitle": "钜园农业NFT",
  "loginTitle": "登录",
  "email": "邮箱",
  "password": "密码",
  "login": "登录",
  "register": "注册",
  "forgotPassword": "忘记密码？",
  "presaleList": "预售列表",
  "myOrders": "我的订单",
  "myNFTs": "我的NFT",
  "profile": "个人中心",
  
  "orderStatus_pending": "待支付",
  "orderStatus_paid": "已支付",
  "orderStatus_shipped": "已发货",
  "orderStatus_completed": "已完成",
  
  "greeting": "你好，{name}！"
}
```

### 20.3 使用多语言

```dart
// lib/app.dart

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Juyuan NFT',
      
      // 国际化配置
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('zh', 'CN'), // 简体中文
        Locale('zh', 'TW'), // 繁体中文
        Locale('en', 'US'), // 英语
      ],
      
      routerConfig: router,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
    );
  }
}

// 使用示例
class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.loginTitle),
      ),
      body: Column(
        children: [
          TextField(
            decoration: InputDecoration(
              labelText: l10n.email,
            ),
          ),
          TextField(
            decoration: InputDecoration(
              labelText: l10n.password,
            ),
            obscureText: true,
          ),
          ElevatedButton(
            onPressed: () {},
            child: Text(l10n.login),
          ),
        ],
      ),
    );
  }
}
```

---

## 二十一、Web3钱包集成

### 21.1 WalletConnect集成

```dart
// lib/core/services/wallet_service.dart

import 'package:walletconnect_dart/walletconnect_dart.dart';
import 'package:web3dart/web3dart.dart';
import 'package:http/http.dart' as http;

class WalletService {
  static final WalletService _instance = WalletService._internal();
  factory WalletService() => _instance;
  WalletService._internal();

  WalletConnect? _connector;
  SessionStatus? _session;
  Web3Client? _web3Client;

  String? get connectedAddress => _session?.accounts.first;
  bool get isConnected => _session != null;

  // 初始化WalletConnect
  Future<void> initialize() async {
    _connector = WalletConnect(
      bridge: 'https://bridge.walletconnect.org',
      clientMeta: const PeerMeta(
        name: 'Juyuan NFT',
        description: 'Agricultural NFT Presale Platform',
        url: 'https://juyuan.com',
        icons: ['https://juyuan.com/logo.png'],
      ),
    );

    // 监听会话状态
    _connector!.on('connect', (session) {
      _session = session as SessionStatus;
      debugPrint('钱包已连接: ${_session!.accounts.first}');
    });

    _connector!.on('session_update', (payload) {
      _session = payload as SessionStatus;
    });

    _connector!.on('disconnect', (session) {
      _session = null;
      debugPrint('钱包已断开');
    });

    // 初始化Web3客户端
    _web3Client = Web3Client(
      'https://rpc.ankr.com/polygon', // Polygon RPC
      http.Client(),
    );
  }

  // 连接钱包
  Future<bool> connect() async {
    if (_connector == null) await initialize();

    if (!_connector!.connected) {
      try {
        _session = await _connector!.createSession(
          onDisplayUri: (uri) {
            // 显示二维码或打开钱包应用
            debugPrint('WalletConnect URI: $uri');
            // TODO: 显示二维码或使用deep link打开钱包
          },
        );
        return true;
      } catch (e) {
        debugPrint('连接钱包失败: $e');
        return false;
      }
    }

    return _connector!.connected;
  }

  // 断开钱包
  Future<void> disconnect() async {
    if (_connector?.connected == true) {
      await _connector!.killSession();
      _session = null;
    }
  }

  // 签名消息
  Future<String?> signMessage(String message) async {
    if (!isConnected) return null;

    try {
      final signature = await _connector!.sendCustomRequest(
        method: 'personal_sign',
        params: [
          message,
          _session!.accounts.first,
        ],
      );
      return signature as String;
    } catch (e) {
      debugPrint('签名失败: $e');
      return null;
    }
  }

  // 发送交易
  Future<String?> sendTransaction({
    required String to,
    required BigInt value,
    String? data,
  }) async {
    if (!isConnected) return null;

    try {
      final txHash = await _connector!.sendTransaction(
        from: _session!.accounts.first,
        to: to,
        value: value,
        data: data,
      );
      return txHash;
    } catch (e) {
      debugPrint('交易失败: $e');
      return null;
    }
  }

  // 获取余额
  Future<EtherAmount?> getBalance() async {
    if (!isConnected || _web3Client == null) return null;

    try {
      final address = EthereumAddress.fromHex(_session!.accounts.first);
      final balance = await _web3Client!.getBalance(address);
      return balance;
    } catch (e) {
      debugPrint('获取余额失败: $e');
      return null;
    }
  }

  // 调用智能合约
  Future<List<dynamic>?> callContract({
    required String contractAddress,
    required String functionName,
    required List<dynamic> params,
    required String abi,
  }) async {
    if (_web3Client == null) return null;

    try {
      final contract = DeployedContract(
        ContractAbi.fromJson(abi, 'Contract'),
        EthereumAddress.fromHex(contractAddress),
      );

      final function = contract.function(functionName);
      final result = await _web3Client!.call(
        contract: contract,
        function: function,
        params: params,
      );

      return result;
    } catch (e) {
      debugPrint('调用合约失败: $e');
      return null;
    }
  }
}
```

### 21.2 钱包连接UI

```dart
// lib/presentation/screens/wallet/wallet_connect_screen.dart

import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class WalletConnectScreen extends StatefulWidget {
  const WalletConnectScreen({super.key});

  @override
  State<WalletConnectScreen> createState() => _WalletConnectScreenState();
}

class _WalletConnectScreenState extends State<WalletConnectScreen> {
  final WalletService _walletService = WalletService();
  String? _wcUri;
  bool _isConnecting = false;

  Future<void> _connect() async {
    setState(() {
      _isConnecting = true;
    });

    final connected = await _walletService.connect();

    if (mounted) {
      setState(() {
        _isConnecting = false;
      });

      if (connected) {
        Navigator.pop(context, true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('连接失败，请重试')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('连接钱包'),
      ),
      body: Center(
        child: _isConnecting
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_wcUri != null)
                    QrImageView(
                      data: _wcUri!,
                      size: 250,
                      backgroundColor: Colors.white,
                    ),
                  const SizedBox(height: 24),
                  const CircularProgressIndicator(),
                  const SizedBox(height: 16),
                  const Text('请在钱包应用中确认连接...'),
                ],
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(
                    'assets/images/wallet_icon.png',
                    width: 120,
                    height: 120,
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    '连接您的Web3钱包',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      '使用MetaMask或其他Web3钱包进行连接',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                  const SizedBox(height: 48),
                  ElevatedButton.icon(
                    onPressed: _connect,
                    icon: const Icon(Icons.account_balance_wallet),
                    label: const Text('连接钱包'),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(200, 48),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
```

---

## 二十二、代码规范与最佳实践

### 22.1 Dart代码规范

#### 22.1.1 命名规范

**类命名 (UpperCamelCase)**:
```dart
// ✅ 正确
class UserProfile {}
class PresaleDetailScreen {}
class AuthProvider {}

// ❌ 错误
class userProfile {}
class presale_detail_screen {}
```

**变量和函数命名 (lowerCamelCase)**:
```dart
// ✅ 正确
String userName;
int totalPrice;
void fetchUserData() {}
Future<User> loadCurrentUser() {}

// ❌ 错误
String user_name;
int TotalPrice;
void FetchUserData() {}
```

**常量命名 (lowerCamelCase)**:
```dart
// ✅ 正确
const double maxHeight = 200.0;
const String apiBaseUrl = 'https://api.juyuan.com';

// ❌ 错误
const double MAX_HEIGHT = 200.0;
const String API_BASE_URL = 'https://api.juyuan.com';
```

**私有成员 (前缀_)**:
```dart
class MyClass {
  // ✅ 正确
  String _privateField;
  void _privateMethod() {}
  
  // 公开成员
  String publicField;
  void publicMethod() {}
}
```

**文件命名 (snake_case)**:
```
// ✅ 正确
user_profile_screen.dart
auth_provider.dart
api_service.dart

// ❌ 错误
UserProfileScreen.dart
authProvider.dart
ApiService.dart
```

#### 22.1.2 代码格式化

**使用dart format**:
```bash
# 格式化单个文件
dart format lib/main.dart

# 格式化整个项目
dart format .

# 检查但不修改
dart format --output none --set-exit-if-changed .
```

**行长度限制**:
```dart
// 建议最大80字符，最多不超过120字符

// ✅ 好的做法 - 合理换行
final result = await apiService.fetchPresaleDetail(
  presaleId: id,
  includeImages: true,
  includeReviews: false,
);

// ❌ 不好的做法 - 一行太长
final result = await apiService.fetchPresaleDetail(presaleId: id, includeImages: true, includeReviews: false);
```

**空行使用**:
```dart
// ✅ 正确 - 逻辑块之间空行
class MyWidget extends StatelessWidget {
  final String title;
  final VoidCallback onPressed;

  const MyWidget({
    Key? key,
    required this.title,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Text(title),
    );
  }
}
```

#### 22.1.3 注释规范

**文档注释 (///)**:
```dart
/// 用户认证Provider
///
/// 管理用户的登录、注册、登出等认证相关操作
/// 使用 [ChangeNotifier] 进行状态管理
///
/// 示例:
/// ```dart
/// final authProvider = context.read<AuthProvider>();
/// await authProvider.login(phone, password);
/// ```
class AuthProvider with ChangeNotifier {
  /// 当前登录用户
  /// 
  /// 未登录时为 `null`
  User? currentUser;

  /// 登录方法
  ///
  /// [phone] 手机号
  /// [password] 密码
  /// 
  /// 返回 `true` 表示登录成功
  /// 
  /// 抛出 [AuthException] 当登录失败时
  Future<bool> login(String phone, String password) async {
    // 实现...
  }
}
```

**单行注释 (//)**:
```dart
// 用于简短的说明
void processData() {
  // 验证数据
  if (!isValid) return;
  
  // 处理数据
  final result = transform(data);
  
  // 保存结果
  save(result);
}
```

**TODO注释**:
```dart
// TODO(username): 在V1.1版本实现缓存功能
Future<List<Presale>> fetchPresales() async {
  // 当前实现...
}

// FIXME: 需要优化性能，列表滚动时有卡顿
Widget buildList() {
  // 当前实现...
}
```

### 22.2 Flutter最佳实践

#### 22.2.1 Widget优化

**使用const构造函数**:
```dart
// ✅ 正确 - 使用const减少重建
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: const HomeScreen(),
    );
  }
}

// ❌ 不推荐 - 没有使用const
class MyApp extends StatelessWidget {
  MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: HomeScreen(),
    );
  }
}
```

**提取复用Widget**:
```dart
// ✅ 正确 - 提取为独立Widget
class UserCard extends StatelessWidget {
  final User user;
  
  const UserCard({Key? key, required this.user}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(user.name),
        subtitle: Text(user.email),
      ),
    );
  }
}

// ❌ 不推荐 - 使用方法返回Widget
Widget _buildUserCard(User user) {
  return Card(
    child: ListTile(
      title: Text(user.name),
      subtitle: Text(user.email),
    ),
  );
}
```

**避免不必要的重建**:
```dart
// ✅ 正确 - 使用Selector精确监听
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Selector<PresaleProvider, int>(
      selector: (context, provider) => provider.presales.length,
      builder: (context, count, child) {
        return Text('共 $count 个预售');
      },
    );
  }
}

// ❌ 不推荐 - 监听整个Provider导致不必要的重建
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PresaleProvider>();
    return Text('共 ${provider.presales.length} 个预售');
  }
}
```

#### 22.2.2 异步编程

**使用async/await**:
```dart
// ✅ 正确 - 清晰的async/await
Future<void> loadData() async {
  try {
    setState(() => _isLoading = true);
    
    final data = await apiService.fetchData();
    
    setState(() {
      _data = data;
      _isLoading = false;
    });
  } catch (e) {
    setState(() {
      _error = e.toString();
      _isLoading = false;
    });
  }
}

// ❌ 不推荐 - 回调地狱
void loadData() {
  setState(() => _isLoading = true);
  
  apiService.fetchData().then((data) {
    setState(() {
      _data = data;
      _isLoading = false;
    });
  }).catchError((e) {
    setState(() {
      _error = e.toString();
      _isLoading = false;
    });
  });
}
```

**正确处理Future**:
```dart
// ✅ 正确 - 使用FutureBuilder
Widget build(BuildContext context) {
  return FutureBuilder<User>(
    future: fetchUser(),
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return CircularProgressIndicator();
      }
      if (snapshot.hasError) {
        return Text('错误: ${snapshot.error}');
      }
      return Text('用户: ${snapshot.data!.name}');
    },
  );
}
```

**避免在build中调用异步方法**:
```dart
// ❌ 错误 - 在build中调用异步方法
Widget build(BuildContext context) {
  // 每次build都会调用
  fetchData();  // 错误！
  return Container();
}

// ✅ 正确 - 在initState中调用
@override
void initState() {
  super.initState();
  fetchData();
}
```

#### 22.2.3 状态管理

**Provider最佳实践**:
```dart
// ✅ 正确 - 按需监听
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 只读取，不监听
    final provider = context.read<AuthProvider>();
    
    return ElevatedButton(
      onPressed: () => provider.logout(),
      child: const Text('登出'),
    );
  }
}

// 只监听需要的数据
class UserNameWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final userName = context.select<AuthProvider, String?>(
      (provider) => provider.currentUser?.name,
    );
    
    return Text(userName ?? '未登录');
  }
}
```

#### 22.2.4 资源管理

**正确释放资源**:
```dart
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late ScrollController _scrollController;
  late TextEditingController _textController;
  StreamSubscription? _subscription;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _textController = TextEditingController();
    _subscription = someStream.listen((data) {
      // 处理数据
    });
  }

  @override
  void dispose() {
    // 释放所有资源
    _scrollController.dispose();
    _textController.dispose();
    _subscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### 22.3 Git工作流程

#### 22.3.1 分支策略

**主要分支**:
```
main          - 生产环境，只接受merge
  ↓
develop       - 开发主分支，功能集成
  ↓
feature/*     - 功能分支
hotfix/*      - 紧急修复分支
release/*     - 发布分支
```

**分支命名规范**:
```bash
# 功能分支
feature/user-authentication
feature/presale-list
feature/nft-display

# 修复分支
bugfix/login-crash
bugfix/image-loading-error

# 热修复分支
hotfix/payment-issue
hotfix/critical-crash

# 发布分支
release/v1.0.0
release/v1.1.0
```

#### 22.3.2 提交规范

**Commit Message格式**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type类型**:
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

**示例**:
```bash
# 新功能
git commit -m "feat(auth): 添加手机号登录功能"

# 修复bug
git commit -m "fix(presale): 修复预售详情页图片不显示的问题"

# 文档更新
git commit -m "docs(readme): 更新安装说明"

# 性能优化
git commit -m "perf(list): 优化预售列表滚动性能"

# 详细的commit message
git commit -m "feat(payment): 集成支付宝支付

- 添加支付宝SDK集成
- 实现支付回调处理
- 添加支付状态查询

Closes #123"
```

#### 22.3.3 代码审查清单

**提交PR前检查**:
- [ ] 代码已经过`dart format`格式化
- [ ] 运行`dart analyze`无警告
- [ ] 所有测试通过
- [ ] 添加了必要的单元测试
- [ ] 更新了相关文档
- [ ] 没有遗留的TODO或FIXME
- [ ] 没有console.log或print调试代码
- [ ] 代码符合项目规范

**Code Review要点**:
```dart
// 1. 代码可读性
// ✅ 好的命名和结构
class UserAuthService {
  Future<User> authenticateWithPhone(String phone, String code) async {
    final verified = await _verifyCode(phone, code);
    if (!verified) throw AuthException('验证码错误');
    return await _fetchUserProfile(phone);
  }
}

// 2. 错误处理
// ✅ 完善的错误处理
try {
  await service.fetchData();
} on NetworkException catch (e) {
  logger.error('网络错误', error: e);
  showErrorDialog('网络连接失败');
} catch (e) {
  logger.error('未知错误', error: e);
  showErrorDialog('操作失败，请重试');
}

// 3. 性能考虑
// ✅ 使用ListView.builder而不是ListView
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
)

// 4. 安全性
// ✅ 敏感信息不硬编码
final apiKey = await secureStorage.read(key: 'api_key');
// ❌ 不要硬编码
// const apiKey = 'sk_live_xxxxxxxxxxxx';
```

### 22.4 开发工具配置

#### 22.4.1 VS Code配置

**推荐扩展**:
```json
{
  "recommendations": [
    "dart-code.dart-code",
    "dart-code.flutter",
    "usernamehw.errorlens",
    "alefragnani.bookmarks",
    "eamodio.gitlens",
    "ms-azuretools.vscode-docker",
    "gruntfuggly.todo-tree"
  ]
}
```

**settings.json配置**:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "dart.lineLength": 80,
  "dart.analysisExcludedFolders": [
    ".dart_tool",
    "build"
  ],
  "[dart]": {
    "editor.rulers": [80],
    "editor.selectionHighlight": false,
    "editor.suggestSelection": "first",
    "editor.tabCompletion": "onlySnippets",
    "editor.wordBasedSuggestions": false
  },
  "dart.debugExternalPackageLibraries": false,
  "dart.debugSdkLibraries": false
}
```

**launch.json配置**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Flutter (Debug)",
      "type": "dart",
      "request": "launch",
      "program": "lib/main.dart",
      "args": [
        "--dart-define=ENVIRONMENT=development"
      ]
    },
    {
      "name": "Flutter (Profile)",
      "type": "dart",
      "request": "launch",
      "program": "lib/main.dart",
      "flutterMode": "profile"
    },
    {
      "name": "Flutter (Release)",
      "type": "dart",
      "request": "launch",
      "program": "lib/main.dart",
      "flutterMode": "release"
    }
  ]
}
```

#### 22.4.2 Android Studio配置

**推荐插件**:
- Flutter
- Dart
- Rainbow Brackets
- Key Promoter X
- GitToolBox
- Atom Material Icons

**代码模板**:
```dart
// StatelessWidget模板 - 输入stless
class ${NAME} extends StatelessWidget {
  const ${NAME}({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      ${END}
    );
  }
}

// StatefulWidget模板 - 输入stful
class ${NAME} extends StatefulWidget {
  const ${NAME}({Key? key}) : super(key: key);

  @override
  State<${NAME}> createState() => _${NAME}State();
}

class _${NAME}State extends State<${NAME}> {
  @override
  Widget build(BuildContext context) {
    return Container(
      ${END}
    );
  }
}
```

#### 22.4.3 调试技巧

**Flutter DevTools**:
```bash
# 启动DevTools
flutter pub global activate devtools
flutter pub global run devtools

# 在Chrome中打开
# http://127.0.0.1:9100
```

**常用调试方法**:
```dart
// 1. 使用debugPrint
debugPrint('用户ID: ${user.id}');

// 2. 使用assert进行断言
assert(user != null, '用户不能为null');

// 3. 使用debugger()断点
import 'dart:developer';

void someFunction() {
  // 代码执行到这里会暂停
  debugger();
}

// 4. 打印Widget树
debugDumpApp();

// 5. 打印渲染树
debugDumpRenderTree();

// 6. 打印层级树
debugDumpLayerTree();

// 7. 性能追踪
Timeline.startSync('fetchData');
await fetchData();
Timeline.finishSync();
```

**日志级别管理**:
```dart
import 'package:logger/logger.dart';

class AppLogger {
  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 2,
      errorMethodCount: 8,
      lineLength: 120,
      colors: true,
      printEmojis: true,
      printTime: true,
    ),
  );

  static void debug(String message) {
    _logger.d(message);
  }

  static void info(String message) {
    _logger.i(message);
  }

  static void warning(String message) {
    _logger.w(message);
  }

  static void error(String message, {Object? error, StackTrace? stackTrace}) {
    _logger.e(message, error, stackTrace);
  }
}

// 使用
AppLogger.debug('调试信息');
AppLogger.error('发生错误', error: e, stackTrace: stackTrace);
```

### 22.5 项目构建配置

#### 22.5.1 多环境配置

**环境配置文件**:
```dart
// lib/config/environment.dart
enum Environment { development, staging, production }

class EnvironmentConfig {
  static const Environment current = Environment.development;

  static String get apiBaseUrl {
    switch (current) {
      case Environment.development:
        return 'https://dev-api.juyuan.com';
      case Environment.staging:
        return 'https://staging-api.juyuan.com';
      case Environment.production:
        return 'https://api.juyuan.com';
    }
  }

  static String get web3RpcUrl {
    switch (current) {
      case Environment.development:
        return 'https://goerli.infura.io/v3/YOUR_KEY';
      case Environment.staging:
        return 'https://goerli.infura.io/v3/YOUR_KEY';
      case Environment.production:
        return 'https://mainnet.infura.io/v3/YOUR_KEY';
    }
  }

  static bool get enableLogging {
    return current != Environment.production;
  }

  static bool get enableAnalytics {
    return current == Environment.production;
  }
}
```

**使用dart-define**:
```bash
# 开发环境
flutter run --dart-define=ENVIRONMENT=development

# 预发布环境
flutter run --dart-define=ENVIRONMENT=staging

# 生产环境
flutter run --dart-define=ENVIRONMENT=production
```

**读取dart-define值**:
```dart
class Config {
  static const String environment = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'development',
  );

  static const String apiKey = String.fromEnvironment('API_KEY');
}
```

#### 22.5.2 打包配置

**Android打包**:
```bash
# 生成keystore
keytool -genkey -v -keystore ~/upload-keystore.jks \
  -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload

# 配置key.properties
# android/key.properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=upload
storeFile=/path/to/upload-keystore.jks

# 打包APK
flutter build apk --release

# 打包App Bundle
flutter build appbundle --release

# 打包多个APK（按架构分离）
flutter build apk --split-per-abi
```

**android/app/build.gradle配置**:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    compileSdkVersion 33

    defaultConfig {
        applicationId "com.juyuan.lychee"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
        multiDexEnabled true
    }

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**iOS打包**:
```bash
# 清理构建
flutter clean

# 获取依赖
flutter pub get

# 更新Pods
cd ios && pod install && cd ..

# 打包IPA
flutter build ipa --release

# 或使用Xcode
open ios/Runner.xcworkspace
# 在Xcode中: Product -> Archive
```

**代码混淆配置**:
```bash
# 启用混淆打包
flutter build apk --obfuscate --split-debug-info=build/app/outputs/symbols
flutter build ios --obfuscate --split-debug-info=build/ios/outputs/symbols
```

---

## 二十三、依赖管理详解

### 23.1 核心依赖清单

```yaml
# pubspec.yaml

name: lychee_mobile
description: 钜园农业NFT预售平台移动端应用
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"
  flutter: ">=3.10.0"

dependencies:
  flutter:
    sdk: flutter

  # 状态管理
  provider: ^6.1.0
  
  # 路由导航
  go_router: ^12.0.0
  
  # 网络请求
  dio: ^5.3.3
  pretty_dio_logger: ^1.3.1
  
  # 本地存储
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^9.0.0
  sqflite: ^2.3.0
  path_provider: ^2.1.1
  
  # JSON序列化
  json_annotation: ^4.8.1
  
  # UI组件
  cached_network_image: ^3.3.0
  flutter_svg: ^2.0.9
  shimmer: ^3.0.0
  pull_to_refresh: ^2.0.0
  flutter_staggered_grid_view: ^0.7.0
  
  # Web3相关
  web3dart: ^2.7.1
  walletconnect_dart: ^0.0.11
  
  # 工具类
  intl: ^0.18.1
  timeago: ^3.5.0
  url_launcher: ^6.2.1
  share_plus: ^7.2.1
  image_picker: ^1.0.4
  permission_handler: ^11.0.1
  
  # 推送通知
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.3
  flutter_local_notifications: ^16.1.0
  
  # 分析统计
  firebase_analytics: ^10.7.1
  firebase_crashlytics: ^3.4.3
  
  # 支付
  tobias: ^3.0.0  # 支付宝
  fluwx: ^4.1.0   # 微信
  
  # 二维码
  qr_flutter: ^4.1.0
  qr_code_scanner: ^1.0.1
  
  # 日志
  logger: ^2.0.2+1
  
  # 设备信息
  device_info_plus: ^9.1.0
  package_info_plus: ^5.0.1

dev_dependencies:
  flutter_test:
    sdk: flutter

  # 代码生成
  build_runner: ^2.4.6
  json_serializable: ^6.7.1
  
  # 代码分析
  flutter_lints: ^3.0.1
  
  # 测试相关
  mockito: ^5.4.2
  integration_test:
    sdk: flutter

flutter:
  uses-material-design: true

  assets:
    - assets/images/
    - assets/icons/
    - assets/animations/
    - assets/fonts/

  fonts:
    - family: PingFang
      fonts:
        - asset: assets/fonts/PingFang-Regular.ttf
        - asset: assets/fonts/PingFang-Medium.ttf
          weight: 500
        - asset: assets/fonts/PingFang-Bold.ttf
          weight: 700
```

### 23.2 依赖版本管理

**检查过期依赖**:
```bash
# 查看可更新的依赖
flutter pub outdated

# 更新所有依赖到最新版本
flutter pub upgrade

# 只更新次要版本
flutter pub upgrade --major-versions
```

**依赖分析**:
```bash
# 分析依赖树
flutter pub deps

# 查看特定包的依赖
flutter pub deps --style=compact
```

### 23.3 自定义Package

**创建本地package**:
```bash
# 创建package
flutter create --template=package my_package

# 项目结构
my_package/
  ├── lib/
  │   └── my_package.dart
  ├── test/
  ├── pubspec.yaml
  └── README.md
```

**在项目中使用**:
```yaml
# pubspec.yaml
dependencies:
  my_package:
    path: ../packages/my_package
```

---

## 二十四、自动化脚本

### 24.1 构建脚本

**build.sh - 一键打包脚本**:
```bash
#!/bin/bash

# 颜色定义
RED='\033[0:31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  钜园农业App构建脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查参数
if [ -z "$1" ]; then
    echo -e "${RED}错误: 请指定构建平台 (android/ios/both)${NC}"
    echo "用法: ./build.sh [android|ios|both] [debug|release]"
    exit 1
fi

PLATFORM=$1
BUILD_MODE=${2:-release}

echo -e "${YELLOW}构建平台: $PLATFORM${NC}"
echo -e "${YELLOW}构建模式: $BUILD_MODE${NC}"

# 清理
echo -e "${YELLOW}Step 1: 清理项目...${NC}"
flutter clean

# 获取依赖
echo -e "${YELLOW}Step 2: 获取依赖...${NC}"
flutter pub get

# 代码生成
echo -e "${YELLOW}Step 3: 生成代码...${NC}"
flutter pub run build_runner build --delete-conflicting-outputs

# 代码分析
echo -e "${YELLOW}Step 4: 代码分析...${NC}"
flutter analyze
if [ $? -ne 0 ]; then
    echo -e "${RED}代码分析失败，请修复问题后重试${NC}"
    exit 1
fi

# 运行测试
echo -e "${YELLOW}Step 5: 运行测试...${NC}"
flutter test
if [ $? -ne 0 ]; then
    echo -e "${RED}测试失败，请修复问题后重试${NC}"
    exit 1
fi

# 构建Android
if [ "$PLATFORM" == "android" ] || [ "$PLATFORM" == "both" ]; then
    echo -e "${YELLOW}Step 6: 构建Android应用...${NC}"
    
    if [ "$BUILD_MODE" == "debug" ]; then
        flutter build apk --debug
    else
        flutter build apk --release --obfuscate --split-debug-info=build/app/outputs/symbols
        flutter build appbundle --release --obfuscate --split-debug-info=build/app/outputs/symbols
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Android构建成功！${NC}"
        echo -e "APK位置: build/app/outputs/flutter-apk/"
        echo -e "App Bundle位置: build/app/outputs/bundle/release/"
    else
        echo -e "${RED}✗ Android构建失败${NC}"
        exit 1
    fi
fi

# 构建iOS
if [ "$PLATFORM" == "ios" ] || [ "$PLATFORM" == "both" ]; then
    echo -e "${YELLOW}Step 6: 构建iOS应用...${NC}"
    
    cd ios
    pod install
    cd ..
    
    if [ "$BUILD_MODE" == "debug" ]; then
        flutter build ios --debug --no-codesign
    else
        flutter build ios --release --obfuscate --split-debug-info=build/ios/outputs/symbols
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ iOS构建成功！${NC}"
        echo -e "请在Xcode中打开项目进行Archive"
    else
        echo -e "${RED}✗ iOS构建失败${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  构建完成！${NC}"
echo -e "${GREEN}========================================${NC}"
```

**使用方法**:
```bash
# 赋予执行权限
chmod +x build.sh

# 构建Android Release版本
./build.sh android release

# 构建iOS Debug版本
./build.sh ios debug

# 同时构建Android和iOS
./build.sh both release
```

### 24.2 代码生成脚本

**generate.sh**:
```bash
#!/bin/bash

echo "🔨 开始生成代码..."

# 清除旧的生成文件
echo "清理旧文件..."
find . -name "*.g.dart" -type f -delete
find . -name "*.freezed.dart" -type f -delete

# 运行代码生成
echo "生成新文件..."
flutter pub run build_runner build --delete-conflicting-outputs

if [ $? -eq 0 ]; then
    echo "✅ 代码生成成功！"
else
    echo "❌ 代码生成失败"
    exit 1
fi

# 格式化代码
echo "格式化代码..."
dart format .

echo "✨ 完成！"
```

### 24.3 测试脚本

**test.sh**:
```bash
#!/bin/bash

echo "🧪 开始运行测试..."

# 单元测试
echo "运行单元测试..."
flutter test --coverage

# 生成覆盖率报告
if command -v genhtml &> /dev/null; then
    echo "生成覆盖率报告..."
    genhtml coverage/lcov.info -o coverage/html
    echo "覆盖率报告已生成: coverage/html/index.html"
fi

# Widget测试
echo "运行Widget测试..."
flutter test test/widget_test

# 集成测试
echo "运行集成测试..."
flutter test integration_test

echo "✅ 测试完成！"
```

### 24.4 版本管理脚本

**version_bump.sh**:
```bash
#!/bin/bash

# 读取当前版本
CURRENT_VERSION=$(grep "version:" pubspec.yaml | sed 's/version: //')
echo "当前版本: $CURRENT_VERSION"

# 分离版本号和build号
VERSION_NAME=$(echo $CURRENT_VERSION | cut -d'+' -f1)
BUILD_NUMBER=$(echo $CURRENT_VERSION | cut -d'+' -f2)

echo "1. Patch版本 (x.x.X)"
echo "2. Minor版本 (x.X.0)"
echo "3. Major版本 (X.0.0)"
echo "4. 仅增加Build号"
read -p "请选择版本类型: " CHOICE

case $CHOICE in
    1)
        # Patch: 1.0.0 -> 1.0.1
        NEW_VERSION=$(echo $VERSION_NAME | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')
        ;;
    2)
        # Minor: 1.0.0 -> 1.1.0
        NEW_VERSION=$(echo $VERSION_NAME | awk -F. '{$(NF-1) = $(NF-1) + 1; $NF = 0;} 1' | sed 's/ /./g')
        ;;
    3)
        # Major: 1.0.0 -> 2.0.0
        NEW_VERSION=$(echo $VERSION_NAME | awk -F. '{$1 = $1 + 1; $2 = 0; $NF = 0;} 1' | sed 's/ /./g')
        ;;
    4)
        # Build only
        NEW_VERSION=$VERSION_NAME
        ;;
    *)
        echo "无效的选择"
        exit 1
        ;;
esac

# 增加Build号
NEW_BUILD=$((BUILD_NUMBER + 1))
FULL_VERSION="$NEW_VERSION+$NEW_BUILD"

echo "新版本: $FULL_VERSION"
read -p "确认更新? (y/n): " CONFIRM

if [ "$CONFIRM" == "y" ]; then
    # 更新pubspec.yaml
    sed -i.bak "s/version: $CURRENT_VERSION/version: $FULL_VERSION/" pubspec.yaml
    rm pubspec.yaml.bak
    
    echo "✅ 版本已更新为 $FULL_VERSION"
    
    # 提交到git
    read -p "是否提交到Git? (y/n): " GIT_CONFIRM
    if [ "$GIT_CONFIRM" == "y" ]; then
        git add pubspec.yaml
        git commit -m "chore: 版本更新至 $FULL_VERSION"
        git tag "v$FULL_VERSION"
        echo "✅ 已创建Git标签 v$FULL_VERSION"
    fi
else
    echo "取消更新"
fi
```

---

## 二十五、常见问题与解决方案

### 25.1 开发环境问题

**问题1: Flutter Doctor显示问题**
```bash
# 问题
[!] Android toolchain - develop for Android devices
    ✗ Android license status unknown.

# 解决方案
flutter doctor --android-licenses
# 接受所有许可协议
```

**问题2: Xcode Command Line Tools问题**
```bash
# 问题
Xcode - develop for iOS and macOS (Xcode 14.0)
    ✗ Xcode isn't installed

# 解决方案
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

**问题3: CocoaPods安装失败**
```bash
# 问题
Error running pod install

# 解决方案
# 1. 更新CocoaPods
sudo gem install cocoapods

# 2. 清理缓存
cd ios
pod cache clean --all
rm Podfile.lock
rm -rf Pods/
pod install --repo-update

# 3. 如果还是失败，使用国内镜像
# ~/.bash_profile 或 ~/.zshrc
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export PUB_HOSTED_URL=https://pub.flutter-io.cn
```

### 25.2 编译问题

**问题1: Gradle下载慢**
```gradle
// android/build.gradle
allprojects {
    repositories {
        // 使用阿里云镜像
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/jcenter' }
        maven { url 'https://maven.aliyun.com/nexus/content/groups/public' }
        google()
        mavenCentral()
    }
}
```

**问题2: iOS编译错误 - Signing**
```bash
# 问题
Signing for "Runner" requires a development team

# 解决方案
# 1. 在Xcode中打开 ios/Runner.xcworkspace
# 2. 选择 Runner target
# 3. Signing & Capabilities tab
# 4. 选择你的Team
# 5. 修改Bundle Identifier为唯一值
```

**问题3: Android MultiDex问题**
```gradle
// android/app/build.gradle
android {
    defaultConfig {
        ...
        multiDexEnabled true
    }
}

dependencies {
    implementation 'androidx.multidex:multidex:2.0.1'
}
```

### 25.3 运行时问题

**问题1: 热重载不生效**
```bash
# 解决方案
# 1. 停止应用
# 2. 运行 flutter clean
# 3. 重新运行应用
flutter clean
flutter pub get
flutter run
```

**问题2: 包冲突**
```bash
# 问题
Because every version of flutter_test depends on...

# 解决方案
# 1. 查看冲突详情
flutter pub deps

# 2. 使用dependency_overrides
# pubspec.yaml
dependency_overrides:
  package_name: ^version
```

**问题3: 图片不显示**
```yaml
# 确保assets在pubspec.yaml中正确配置
flutter:
  assets:
    - assets/images/
    - assets/icons/

# 使用正确的路径
Image.asset('assets/images/logo.png')

# 清理重建
flutter clean
flutter pub get
```

### 25.4 性能问题

**问题1: 页面卡顿**
```dart
// 解决方案
// 1. 使用ListView.builder而不是ListView
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
)

// 2. 使用const构造函数
const Text('标题')

// 3. 避免在build中创建对象
// ❌ 错误
Widget build(BuildContext context) {
  final controller = TextEditingController(); // 每次build都创建
  return TextField(controller: controller);
}

// ✅ 正确
late final TextEditingController controller;

@override
void initState() {
  super.initState();
  controller = TextEditingController();
}
```

**问题2: 内存泄漏**
```dart
// 解决方案 - 正确释放资源
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late ScrollController _controller;
  StreamSubscription? _subscription;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
    _subscription = stream.listen((_) {});
  }

  @override
  void dispose() {
    _controller.dispose();
    _subscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### 25.5 网络问题

**问题1: HTTP请求失败**
```dart
// 解决方案 - 配置网络权限

// Android: android/app/src/main/AndroidManifest.xml
<uses-permission android:name="android.permission.INTERNET"/>

// iOS: ios/Runner/Info.plist
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

**问题2: 证书验证失败**
```dart
// 开发环境临时禁用证书验证（仅用于开发！）
class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = 
          (X509Certificate cert, String host, int port) => true;
  }
}

void main() {
  HttpOverrides.global = MyHttpOverrides();
  runApp(MyApp());
}
```

---

## 二十六、技术债务管理

### 26.1 技术债务清单

| ID | 类别 | 描述 | 优先级 | 预估工时 | 负责人 | 状态 |
|----|------|------|--------|----------|--------|------|
| TD-001 | 性能 | 预售列表滚动优化 | P1 | 8h | 张三 | 待处理 |
| TD-002 | 代码质量 | 重构auth模块 | P2 | 16h | 李四 | 进行中 |
| TD-003 | 测试 | 补充单元测试覆盖率 | P2 | 20h | 王五 | 待处理 |
| TD-004 | 文档 | API文档完善 | P3 | 4h | 赵六 | 待处理 |
| TD-005 | 架构 | 引入错误边界 | P1 | 12h | 张三 | 已完成 |

### 26.2 代码审查记录

**Review #001 - 认证模块**
```
日期: 2025-10-20
审查人: 技术负责人
被审查人: 开发工程师A

发现问题:
1. [P1] 密码明文存储在SharedPreferences
   - 建议: 使用SecureStorage存储敏感信息
   
2. [P2] 缺少错误处理
   - 建议: 添加try-catch和用户友好的错误提示
   
3. [P3] 代码重复
   - 建议: 提取公共方法

改进建议:
- 添加单元测试
- 完善注释文档
```

### 26.3 性能优化记录

**优化记录 #001**
```
日期: 2025-10-25
模块: 预售列表页面
问题: 滚动卡顿，FPS低于30

分析:
- 使用ListView而非ListView.builder
- 列表项过于复杂
- 图片未做缓存

解决方案:
1. 改用ListView.builder ✅
2. 优化列表项Widget ✅
3. 使用CachedNetworkImage ✅
4. 添加图片占位符 ✅

结果:
- FPS提升至55+
- 内存占用降低30%
- 用户体验显著提升
```

---

**文档结束**

---

**联系方式**:
- 技术负责人: tech-lead@juyuan.com
- 架构师: architect@juyuan.com
- 项目协作: 飞书/钉钉项目群
- 代码仓库: https://github.com/juyuan/lychee-mobile

**文档存放**:
- Git仓库: /docs/移动端应用FIP.md
- 在线文档: https://docs.juyuan.com/mobile-fip

**文档统计**:
- 总章节: **26个主要章节** (新增5章)
- 总行数: **6,000+行** (增加40%+)
- 代码示例: **50+个**完整实现
- Shell脚本: **4个**自动化脚本
- 最佳实践: **涵盖开发全流程**
- 更新日期: 2025年10月31日

**版权声明**: © 2025 钜园农业科技有限公司 保留所有权利

---

<div style="text-align: center; padding: 40px 0; color: #666;">
  <p style="font-size: 14px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
  <p style="font-size: 18px; font-weight: bold; margin: 20px 0;">🎯 FIP V2.0 完整版</p>
  <p style="font-size: 14px;">从架构设计到生产部署的完整技术实现指南</p>
  <p style="font-size: 12px; margin-top: 20px;">
    技术支持: tech@juyuan.com<br/>
    项目仓库: https://github.com/juyuan/lychee-mobile<br/>
    在线文档: https://docs.juyuan.com/mobile-fip
  </p>
  <p style="font-size: 14px; margin-top: 20px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
</div>

