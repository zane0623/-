/// 环境配置
///
/// 支持三种环境：开发（development）、预发布（staging）、生产（production）
/// 使用方式：
/// - 运行时：flutter run --dart-define=ENVIRONMENT=development
/// - 构建时：flutter build apk --dart-define=ENVIRONMENT=production
class Environment {
  // 从启动参数获取环境变量，默认为开发环境
  static const String _environment = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'development',
  );

  /// 当前环境类型
  static EnvironmentType get type {
    switch (_environment) {
      case 'production':
        return EnvironmentType.production;
      case 'staging':
        return EnvironmentType.staging;
      case 'development':
      default:
        return EnvironmentType.development;
    }
  }

  /// 是否为开发环境
  static bool get isDevelopment => type == EnvironmentType.development;

  /// 是否为预发布环境
  static bool get isStaging => type == EnvironmentType.staging;

  /// 是否为生产环境
  static bool get isProduction => type == EnvironmentType.production;

  /// API基础URL
  static String get apiBaseUrl {
    switch (type) {
      case EnvironmentType.development:
        return 'http://localhost:3000/api';
      case EnvironmentType.staging:
        return 'https://staging-api.juyuan-nft.com/api';
      case EnvironmentType.production:
        return 'https://api.juyuan-nft.com/api';
    }
  }

  /// WebSocket URL
  static String get wsBaseUrl {
    switch (type) {
      case EnvironmentType.development:
        return 'ws://localhost:3000';
      case EnvironmentType.staging:
        return 'wss://staging-api.juyuan-nft.com';
      case EnvironmentType.production:
        return 'wss://api.juyuan-nft.com';
    }
  }

  /// 区块链网络（以太坊/Polygon等）
  static String get blockchainNetwork {
    switch (type) {
      case EnvironmentType.development:
        return 'localhost';
      case EnvironmentType.staging:
        return 'goerli'; // 测试网
      case EnvironmentType.production:
        return 'mainnet'; // 主网
    }
  }

  /// 区块链RPC URL
  static String get rpcUrl {
    switch (type) {
      case EnvironmentType.development:
        return 'http://localhost:8545';
      case EnvironmentType.staging:
        return 'https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID';
      case EnvironmentType.production:
        return 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
    }
  }

  /// NFT合约地址
  static String get nftContractAddress {
    switch (type) {
      case EnvironmentType.development:
        return '0x0000000000000000000000000000000000000000';
      case EnvironmentType.staging:
        return '0x0000000000000000000000000000000000000000'; // 测试网合约地址
      case EnvironmentType.production:
        return '0x0000000000000000000000000000000000000000'; // 主网合约地址
    }
  }

  /// 预售合约地址
  static String get presaleContractAddress {
    switch (type) {
      case EnvironmentType.development:
        return '0x0000000000000000000000000000000000000000';
      case EnvironmentType.staging:
        return '0x0000000000000000000000000000000000000000';
      case EnvironmentType.production:
        return '0x0000000000000000000000000000000000000000';
    }
  }

  /// 托管合约地址
  static String get escrowContractAddress {
    switch (type) {
      case EnvironmentType.development:
        return '0x0000000000000000000000000000000000000000';
      case EnvironmentType.staging:
        return '0x0000000000000000000000000000000000000000';
      case EnvironmentType.production:
        return '0x0000000000000000000000000000000000000000';
    }
  }

  /// 是否启用日志
  static bool get enableLogging {
    return !isProduction;
  }

  /// 是否启用网络日志
  static bool get enableNetworkLogging {
    return isDevelopment;
  }

  /// 是否启用调试模式
  static bool get enableDebugMode {
    return !isProduction;
  }

  /// 获取环境名称（用于显示）
  static String get environmentName {
    switch (type) {
      case EnvironmentType.development:
        return '开发环境';
      case EnvironmentType.staging:
        return '预发布环境';
      case EnvironmentType.production:
        return '生产环境';
    }
  }

  /// 打印当前环境配置（仅在非生产环境）
  static void printConfig() {
    if (isProduction) return;

    print('==========================================');
    print('当前环境: $environmentName');
    print('API Base URL: $apiBaseUrl');
    print('WebSocket URL: $wsBaseUrl');
    print('区块链网络: $blockchainNetwork');
    print('RPC URL: $rpcUrl');
    print('日志启用: $enableLogging');
    print('网络日志: $enableNetworkLogging');
    print('==========================================');
  }
}

/// 环境类型枚举
enum EnvironmentType {
  /// 开发环境
  development,

  /// 预发布环境
  staging,

  /// 生产环境
  production,
}
