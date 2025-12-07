# Flutter Web 兼容性说明

## 概述
本文档说明在Web平台开发时需要注意的兼容性问题和解决方案。

## ✅ 完全支持的功能

### 核心功能
- [x] UI渲染和动画
- [x] 网络请求（Dio, HTTP）
- [x] 状态管理（Provider）
- [x] 路由导航（GoRouter）
- [x] 图片加载和缓存
- [x] SVG图标
- [x] Web3集成（web3dart）

### UI组件
- [x] Material Design组件
- [x] Cupertino组件（部分）
- [x] 自定义Widget
- [x] Shimmer效果
- [x] 图片展示

## ⚠️ 部分支持的功能

### 本地存储
- **SharedPreferences**: ✅ 使用LocalStorage
- **FlutterSecureStorage**: ⚠️ Web使用SessionStorage，安全性较低
- **SQLite**: ❌ 不支持，需要使用IndexedDB或Hive替代

**解决方案：**
```dart
// 检测平台并使用不同的存储方案
import 'package:flutter/foundation.dart' show kIsWeb;

if (kIsWeb) {
  // 使用Web兼容的存储方案
  // 例如：Hive或IndexedDB
} else {
  // 使用SQLite
}
```

### 文件和媒体
- **ImagePicker**: ⚠️ 仅支持从文件选择器选择
- **PathProvider**: ⚠️ 返回Web临时存储路径
- **CachedNetworkImage**: ✅ 支持（使用浏览器缓存）

**解决方案：**
```dart
import 'dart:html' as html;
import 'package:flutter/foundation.dart' show kIsWeb;

Future<void> pickImage() async {
  if (kIsWeb) {
    // Web特定的图片选择实现
    final html.FileUploadInputElement uploadInput = 
        html.FileUploadInputElement();
    uploadInput.click();
  } else {
    // 移动端使用ImagePicker
  }
}
```

### 设备功能
- **QrCodeScanner**: ❌ 摄像头扫码不支持，可显示二维码
- **PermissionHandler**: ❌ 不支持，浏览器自动处理权限
- **DeviceInfo**: ⚠️ 返回浏览器信息而非设备信息

## ❌ 不支持的功能

以下功能在Web平台完全不可用：

1. **SQLite数据库**
   - 原因：需要原生文件系统
   - 替代：IndexedDB、Hive、在线数据库

2. **二维码扫描**
   - 原因：需要摄像头原生访问
   - 替代：仅显示二维码，或使用Web API

3. **推送通知**
   - 原因：需要原生Push服务
   - 替代：Web Push API（需单独实现）

4. **生物识别**
   - 原因：需要原生设备功能
   - 替代：传统密码认证

## 🔧 Web特定优化

### 1. 条件导入
```dart
// storage_service.dart
import 'storage_service_mobile.dart' 
  if (dart.library.html) 'storage_service_web.dart';
```

### 2. 平台检测
```dart
import 'package:flutter/foundation.dart' show kIsWeb;

void someFunction() {
  if (kIsWeb) {
    // Web特定代码
  } else {
    // 移动端代码
  }
}
```

### 3. 依赖配置
在 `pubspec.yaml` 中注释掉Web不支持的依赖：

```yaml
dependencies:
  # sqflite: ^2.3.0  # Web不支持
  # qr_code_scanner: ^1.0.1  # Web不支持
  # permission_handler: ^11.0.1  # Web不支持
```

## 📝 开发建议

### 渐进式开发
1. **第一阶段**：使用Web开发UI和基础功能
   - 页面布局
   - 路由导航
   - 网络请求
   - 状态管理

2. **第二阶段**：添加平台特定功能
   - 使用条件编译分离平台代码
   - 实现Web和移动端不同的存储方案

3. **第三阶段**：移动端特定功能
   - 安装Xcode后开发iOS特定功能
   - 生物识别、推送通知等

### 测试策略
- **Web测试**：在Chrome DevTools中测试响应式布局
- **功能测试**：确保核心业务逻辑在Web端正常工作
- **兼容性测试**：测试Safari、Firefox等浏览器

### 性能优化
```dart
// 延迟加载大型资源
import 'package:flutter/foundation.dart';

Future<void> loadHeavyResource() async {
  if (!kIsWeb) {
    // 移动端可以立即加载
    await loadFullResource();
  } else {
    // Web端延迟或分块加载
    await loadLightResource();
  }
}
```

## 🚀 Web部署

### 构建命令
```bash
# 开发构建
flutter run -d chrome

# 生产构建
flutter build web --release

# 指定渲染器（推荐html）
flutter build web --web-renderer html
```

### 部署平台
- **Vercel**: `vercel deploy build/web`
- **Firebase Hosting**: `firebase deploy`
- **Nginx**: 将 `build/web` 目录复制到服务器
- **GitHub Pages**: 推送到 gh-pages 分支

## 📚 参考资源

- [Flutter Web官方文档](https://docs.flutter.dev/platform-integration/web)
- [Web平台差异](https://docs.flutter.dev/platform-integration/web/faq)
- [Flutter Web性能](https://docs.flutter.dev/perf/web-performance)

## 🔄 更新日志

- 2024-11-13: 创建文档，记录Web兼容性注意事项

