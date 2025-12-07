# 环境配置说明

## 📚 概述

本项目支持三种运行环境：
- **Development（开发环境）**: 用于本地开发和调试
- **Staging（预发布环境）**: 用于测试和验收
- **Production（生产环境）**: 用于正式发布

## 🚀 使用方法

### 运行应用

```bash
# 开发环境
flutter run --dart-define=ENVIRONMENT=development

# 预发布环境
flutter run --dart-define=ENVIRONMENT=staging

# 生产环境（一般不在本地运行）
flutter run --dart-define=ENVIRONMENT=production
```

### 构建应用

```bash
# Android - 开发环境
flutter build apk --dart-define=ENVIRONMENT=development

# Android - 生产环境
flutter build apk --dart-define=ENVIRONMENT=production --release

# iOS - 开发环境
flutter build ios --dart-define=ENVIRONMENT=development

# iOS - 生产环境
flutter build ios --dart-define=ENVIRONMENT=production --release
```

## ⚙️ 环境配置

所有环境配置在 `lib/config/environment.dart` 中定义。

### 开发环境（Development）

```dart
API Base URL: http://localhost:3000/api
WebSocket URL: ws://localhost:3000
区块链网络: localhost
RPC URL: http://localhost:8545
```

### 预发布环境（Staging）

```dart
API Base URL: https://staging-api.juyuan-nft.com/api
WebSocket URL: wss://staging-api.juyuan-nft.com
区块链网络: goerli (测试网)
RPC URL: https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

### 生产环境（Production）

```dart
API Base URL: https://api.juyuan-nft.com/api
WebSocket URL: wss://api.juyuan-nft.com
区块链网络: mainnet (主网)
RPC URL: https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

## 📝 配置清单

在部署到不同环境前，请确保以下配置已正确设置：

### API配置
- [ ] API Base URL
- [ ] WebSocket URL
- [ ] 超时时间设置

### 区块链配置
- [ ] 区块链网络（localhost/goerli/mainnet）
- [ ] RPC URL（Infura或Alchemy）
- [ ] NFT合约地址
- [ ] 预售合约地址
- [ ] 托管合约地址

### 第三方服务
- [ ] Firebase配置（推送通知、分析）
- [ ] Sentry DSN（错误追踪）
- [ ] Google Analytics ID
- [ ] 支付宝配置
- [ ] 微信支付配置

### 功能开关
- [ ] 日志启用状态
- [ ] 网络日志启用状态
- [ ] 调试模式启用状态

## 🔒 安全注意事项

1. **不要提交敏感信息**: 私钥、API密钥等敏感信息不应直接写在代码中
2. **使用环境变量**: 敏感配置应通过 `--dart-define` 传递
3. **区分环境**: 确保生产环境使用生产配置，测试环境使用测试配置
4. **合约地址验证**: 部署前务必验证合约地址是否正确

## 📋 部署检查清单

### 预发布环境部署

- [ ] 更新API URL为预发布服务器
- [ ] 更新区块链网络为测试网（goerli）
- [ ] 更新合约地址为测试网合约
- [ ] 启用日志和调试模式
- [ ] 配置Firebase测试项目
- [ ] 测试支付功能（沙箱环境）

### 生产环境部署

- [ ] 更新API URL为生产服务器
- [ ] 更新区块链网络为主网（mainnet）
- [ ] 更新合约地址为主网合约
- [ ] 关闭调试模式和详细日志
- [ ] 配置Firebase生产项目
- [ ] 配置生产环境支付参数
- [ ] 启用代码混淆
- [ ] 完成安全审计
- [ ] 配置Sentry错误追踪

## 🛠️ 修改环境配置

如需修改环境配置，请编辑 `lib/config/environment.dart` 文件：

```dart
// 修改API URL
static String get apiBaseUrl {
  switch (type) {
    case EnvironmentType.development:
      return 'http://your-dev-api.com/api';  // 修改这里
    // ...
  }
}
```

## 📞 联系方式

如有问题，请联系：
- 技术负责人：tech@juyuan-nft.com
- 运维团队：ops@juyuan-nft.com

---

**最后更新**: 2025-11-03  
**维护者**: 钜园农业技术团队

