# 钜园农业NFT预售平台 - Flutter项目结构

## 📂 目录结构说明

本项目采用分层架构（Clean Architecture），确保代码的可维护性和可测试性。

```
lib/
├── main.dart                    # 应用程序入口
├── presentation/                # 表现层（UI）
│   ├── screens/                # 页面
│   ├── widgets/                # 可复用组件
│   └── providers/              # 状态管理（Provider）
├── domain/                      # 领域层（业务逻辑）
│   ├── entities/               # 领域实体
│   └── use_cases/              # 用例（业务逻辑）
├── data/                        # 数据层
│   ├── models/                 # 数据模型
│   ├── repositories/           # 仓储实现
│   └── services/               # 数据服务（API、本地存储等）
├── config/                      # 配置文件
│   ├── routes.dart             # 路由配置
│   ├── theme.dart              # 主题配置
│   └── constants.dart          # 常量定义
├── core/                        # 核心功能
│   ├── error/                  # 错误处理
│   ├── network/                # 网络配置
│   └── utils/                  # 工具函数
└── utils/                       # 通用工具类
    ├── validators.dart         # 表单验证
    ├── formatters.dart         # 格式化工具
    └── helpers.dart            # 辅助函数
```

## 🏗️ 分层架构说明

### 1. Presentation Layer（表现层）
- **职责**: UI渲染、用户交互、状态管理
- **包含**: Screens、Widgets、Providers
- **依赖**: Domain Layer

### 2. Domain Layer（领域层）
- **职责**: 业务逻辑、业务规则
- **包含**: Entities、Use Cases
- **依赖**: 无（最独立的一层）

### 3. Data Layer（数据层）
- **职责**: 数据获取、数据持久化
- **包含**: Models、Repositories、Services
- **依赖**: Domain Layer

## 📝 命名规范

- **文件命名**: 使用小写+下划线，如 `user_profile_screen.dart`
- **类命名**: 使用大驼峰，如 `UserProfileScreen`
- **变量/函数命名**: 使用小驼峰，如 `userName`
- **常量命名**: 使用小驼峰，如 `apiBaseUrl`
- **私有成员**: 前缀下划线，如 `_privateMethod()`

## 🔄 数据流向

```
User Action
    ↓
Screen (Presentation)
    ↓
Provider (State Management)
    ↓
Use Case (Domain)
    ↓
Repository (Data)
    ↓
Service (API/Storage)
    ↓
Model → Entity
    ↓
Provider → UI Update
```

## 📦 主要依赖

- **状态管理**: Provider
- **路由导航**: go_router
- **网络请求**: Dio
- **本地存储**: SharedPreferences、flutter_secure_storage
- **JSON序列化**: json_annotation/json_serializable
- **Web3**: web3dart、walletconnect_dart

## 🚀 快速开始

```bash
# 获取依赖
flutter pub get

# 运行代码生成
flutter pub run build_runner build --delete-conflicting-outputs

# 运行应用（Debug模式）
flutter run

# 运行应用（指定设备）
flutter run -d macos      # macOS桌面
flutter run -d chrome     # Chrome浏览器
flutter run -d ios        # iOS模拟器（需要Xcode）
flutter run -d android    # Android模拟器（需要Android Studio）

# 运行测试
flutter test

# 代码分析
flutter analyze

# 格式化代码
dart format .
```

## 📖 开发指南

1. **创建新页面**: 在 `presentation/screens/` 下创建
2. **创建新组件**: 在 `presentation/widgets/` 下创建
3. **添加状态管理**: 在 `presentation/providers/` 下创建
4. **添加数据模型**: 在 `data/models/` 下创建
5. **添加API接口**: 在 `data/services/` 下实现

## 🔗 相关文档

- [PRD文档](../../docs/移动端应用PRD.md)
- [FIP文档](../../docs/移动端应用FIP.md)
- [Flutter官方文档](https://docs.flutter.dev/)

---

**版本**: V1.0.0  
**更新日期**: 2025-11-03  
**维护者**: 钜园农业技术团队

