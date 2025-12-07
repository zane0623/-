import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:logger/logger.dart';
import 'config/environment.dart';
import 'config/routes.dart';
import 'config/theme.dart';
import 'core/error/error_handler.dart';
import 'core/network/dio_client.dart';
import 'data/services/storage_service.dart';
import 'data/services/api_service.dart';
import 'presentation/providers/auth_provider.dart';
import 'presentation/providers/nft_provider.dart';
import 'presentation/providers/order_provider.dart';
import 'presentation/providers/theme_provider.dart';

/// 全局Logger实例
final logger = Logger(
  printer: PrettyPrinter(
    methodCount: 2,
    errorMethodCount: 8,
    lineLength: 120,
    colors: true,
    printEmojis: true,
    dateTimeFormat: DateTimeFormat.onlyTimeAndSinceStart,
  ),
  level: Environment.enableLogging ? Level.debug : Level.warning,
);

/// 全局服务实例
late final StorageService storageService;
late final DioClient dioClient;
late final ApiService apiService;

void main() async {
  // 运行在Zone中以捕获所有错误
  runZonedGuarded(
    () async {
      // 确保Flutter绑定初始化
      WidgetsFlutterBinding.ensureInitialized();

      // 设置Flutter错误处理
      FlutterError.onError = ErrorHandler.handleFlutterError;

      // 打印环境配置
      Environment.printConfig();
      logger.i('应用启动中...');
      logger.i('当前环境: ${Environment.environmentName}');

      // 初始化服务
      await _initServices();
      logger.i('服务初始化完成');

      runApp(const MyApp());
    },
    ErrorHandler.handleZoneError,
  );
}

/// 初始化服务
Future<void> _initServices() async {
  try {
    // 初始化本地存储
    logger.d('初始化存储服务...');
    storageService = StorageService();
    await storageService.init();

    // 初始化网络客户端
    logger.d('初始化网络客户端...');
    dioClient = DioClient();

    // 初始化API服务
    logger.d('初始化API服务...');
    apiService = ApiService(dioClient.dio);

    logger.i('所有服务初始化成功');
  } catch (e, stackTrace) {
    logger.e('服务初始化失败', error: e, stackTrace: stackTrace);
    rethrow;
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // 主题Provider
        ChangeNotifierProvider(
          create: (_) => ThemeProvider()..init(),
        ),

        // 认证Provider
        ChangeNotifierProvider(
          create: (_) => AuthProvider()..init(),
        ),

        // NFT Provider
        ChangeNotifierProvider(
          create: (_) => NftProvider(),
        ),

        // 订单Provider
        ChangeNotifierProvider(
          create: (_) => OrderProvider(),
        ),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp.router(
            title: '钜园农业NFT平台',
            debugShowCheckedModeBanner: !Environment.isProduction,

            // 主题配置
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.themeMode,

            // 路由配置
            routerConfig: AppRouter.router,
          );
        },
      ),
    );
  }
}
