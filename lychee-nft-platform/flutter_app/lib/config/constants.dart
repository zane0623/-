/// 应用常量配置
///
/// 集中管理应用中所有的常量值
class AppConstants {
  // 私有构造函数，防止实例化
  AppConstants._();

  /// ========== 应用信息 ==========

  /// 应用名称
  static const String appName = '钜园农业NFT预售平台';

  /// 应用包名
  static const String packageName = 'com.juyuan.lychee_mobile';

  /// 应用版本
  static const String appVersion = '1.0.0';

  /// 应用构建号
  static const int buildNumber = 1;

  /// ========== 存储Key ==========

  /// Token存储key
  static const String keyAccessToken = 'access_token';
  static const String keyRefreshToken = 'refresh_token';

  /// 用户信息存储key
  static const String keyUserId = 'user_id';
  static const String keyUserInfo = 'user_info';
  static const String keyIsLoggedIn = 'is_logged_in';

  /// 偏好设置存储key
  static const String keyThemeMode = 'theme_mode';
  static const String keyLanguage = 'language';
  static const String keyIsFirstLaunch = 'is_first_launch';

  /// 钱包存储key
  static const String keyWalletAddress = 'wallet_address';
  static const String keyWalletConnected = 'wallet_connected';

  /// ========== 网络配置 ==========

  /// 连接超时时间（毫秒）
  static const int connectTimeout = 30000;

  /// 接收超时时间（毫秒）
  static const int receiveTimeout = 30000;

  /// 发送超时时间（毫秒）
  static const int sendTimeout = 30000;

  /// 最大重试次数
  static const int maxRetryCount = 3;

  /// ========== 分页配置 ==========

  /// 默认每页数量
  static const int defaultPageSize = 20;

  /// 最大每页数量
  static const int maxPageSize = 100;

  /// ========== UI配置 ==========

  /// 默认动画时长（毫秒）
  static const int defaultAnimationDuration = 300;

  /// Toast显示时长（秒）
  static const int toastDuration = 2;

  /// 图片占位符
  static const String imagePlaceholder = 'assets/images/placeholder.png';

  /// 用户头像占位符
  static const String avatarPlaceholder =
      'assets/images/avatar_placeholder.png';

  /// ========== 验证规则 ==========

  /// 手机号正则
  static const String phoneRegex = r'^1[3-9]\d{9}$';

  /// 邮箱正则
  static const String emailRegex =
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';

  /// 密码最小长度
  static const int minPasswordLength = 6;

  /// 密码最大长度
  static const int maxPasswordLength = 20;

  /// 用户名最小长度
  static const int minUsernameLength = 2;

  /// 用户名最大长度
  static const int maxUsernameLength = 20;

  /// ========== NFT配置 ==========

  /// NFT图片最大尺寸（MB）
  static const int maxNftImageSize = 10;

  /// NFT元数据IPFS网关
  static const String ipfsGateway = 'https://ipfs.io/ipfs/';

  /// NFT默认图片
  static const String defaultNftImage = 'assets/images/nft_placeholder.png';

  /// ========== 预售配置 ==========

  /// 预售状态
  static const String presaleStatusPending = 'pending'; // 待开始
  static const String presaleStatusActive = 'active'; // 进行中
  static const String presaleStatusCompleted = 'completed'; // 已结束
  static const String presaleStatusCancelled = 'cancelled'; // 已取消

  /// 最小购买数量
  static const int minPurchaseQuantity = 1;

  /// 最大购买数量
  static const int maxPurchaseQuantity = 99;

  /// ========== 订单配置 ==========

  /// 订单状态
  static const String orderStatusPending = 'pending'; // 待支付
  static const String orderStatusPaid = 'paid'; // 已支付
  static const String orderStatusShipped = 'shipped'; // 已发货
  static const String orderStatusCompleted = 'completed'; // 已完成
  static const String orderStatusCancelled = 'cancelled'; // 已取消
  static const String orderStatusRefunded = 'refunded'; // 已退款

  /// 订单自动取消时间（分钟）
  static const int orderAutoCancelMinutes = 30;

  /// ========== 支付配置 ==========

  /// 支付方式
  static const String paymentMethodAlipay = 'alipay'; // 支付宝
  static const String paymentMethodWechat = 'wechat'; // 微信支付
  static const String paymentMethodCrypto = 'crypto'; // 加密货币

  /// ========== 区块链配置 ==========

  /// Gas限制
  static const int gasLimit = 300000;

  /// Gas价格（Gwei）
  static const int gasPrice = 20;

  /// 确认区块数
  static const int confirmationBlocks = 6;

  /// ========== 文件上传配置 ==========

  /// 最大文件大小（MB）
  static const int maxFileSize = 10;

  /// 允许的图片格式
  static const List<String> allowedImageFormats = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp'
  ];

  /// 图片压缩质量（0-100）
  static const int imageQuality = 85;

  /// ========== 缓存配置 ==========

  /// 图片缓存最大数量
  static const int maxCacheCount = 200;

  /// 图片缓存最大大小（MB）
  static const int maxCacheSize = 100;

  /// 缓存过期时间（天）
  static const int cacheMaxAge = 7;

  /// ========== 外部链接 ==========

  /// 官方网站
  static const String officialWebsite = 'https://www.juyuan-nft.com';

  /// 服务条款
  static const String termsOfService = 'https://www.juyuan-nft.com/terms';

  /// 隐私政策
  static const String privacyPolicy = 'https://www.juyuan-nft.com/privacy';

  /// 帮助中心
  static const String helpCenter = 'https://help.juyuan-nft.com';

  /// 客服邮箱
  static const String supportEmail = 'support@juyuan-nft.com';

  /// 客服电话
  static const String supportPhone = '400-123-4567';

  /// ========== 社交媒体 ==========

  /// 微信公众号
  static const String wechatOfficialAccount = 'juyuan_nft';

  /// 微博
  static const String weiboAccount = '@钜园农业NFT';

  /// Twitter
  static const String twitterAccount = '@JuyuanNFT';

  /// Discord
  static const String discordInvite = 'https://discord.gg/juyuan';

  /// ========== 第三方服务 ==========

  /// Sentry DSN（错误追踪）
  static const String sentryDsn = '';

  /// Google Analytics ID
  static const String gaTrackingId = '';

  /// Firebase项目ID
  static const String firebaseProjectId = '';
}

/// API路径常量
class ApiPaths {
  ApiPaths._();

  /// ========== 认证相关 ==========
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String verifyCode = '/auth/verify-code';
  static const String resetPassword = '/auth/reset-password';

  /// ========== 用户相关 ==========
  static const String userProfile = '/user/profile';
  static const String updateProfile = '/user/update';
  static const String userAddresses = '/user/addresses';
  static const String addAddress = '/user/addresses/add';
  static const String updateAddress = '/user/addresses/update';
  static const String deleteAddress = '/user/addresses/delete';

  /// ========== 预售相关 ==========
  static const String presaleList = '/presales';
  static const String presaleDetail = '/presales/:id';
  static const String presaleSearch = '/presales/search';
  static const String presaleCategories = '/presales/categories';

  /// ========== 订单相关 ==========
  static const String createOrder = '/orders/create';
  static const String orderList = '/orders';
  static const String orderDetail = '/orders/:id';
  static const String cancelOrder = '/orders/:id/cancel';
  static const String confirmReceipt = '/orders/:id/confirm';

  /// ========== NFT相关 ==========
  static const String nftList = '/nfts';
  static const String nftDetail = '/nfts/:id';
  static const String mintNft = '/nfts/mint';
  static const String transferNft = '/nfts/transfer';
  static const String nftMetadata = '/nfts/:id/metadata';

  /// ========== 支付相关 ==========
  static const String createPayment = '/payments/create';
  static const String paymentCallback = '/payments/callback';
  static const String paymentStatus = '/payments/:id/status';

  /// ========== 文件上传 ==========
  static const String uploadImage = '/upload/image';
  static const String uploadFile = '/upload/file';
}

// 注意：路由路径已迁移到 config/routes.dart 中的 RoutePaths 类
