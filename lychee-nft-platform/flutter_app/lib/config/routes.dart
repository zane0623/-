import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../presentation/screens/splash_screen.dart';
import '../presentation/screens/home/home_screen.dart';
import '../presentation/screens/nft/nft_list_screen.dart';
import '../presentation/screens/nft/nft_detail_screen.dart';
import '../presentation/screens/auth/login_screen.dart';
import '../presentation/screens/auth/register_screen.dart';
import '../presentation/screens/profile/profile_screen.dart';
import '../presentation/screens/profile/my_nfts_screen.dart';
import '../presentation/screens/profile/my_orders_screen.dart';
import '../presentation/screens/wallet/wallet_connect_screen.dart';
import '../presentation/screens/order/order_confirmation_screen.dart';

/// 路由路径常量
class RoutePaths {
  static const String splash = '/';
  static const String home = '/home';
  static const String nftList = '/nft-list';
  static const String nftDetail = '/nft-detail/:id';
  static const String login = '/login';
  static const String register = '/register';
  static const String profile = '/profile';
  static const String myNfts = '/my-nfts';
  static const String myOrders = '/my-orders';
  static const String walletConnect = '/wallet-connect';
  static const String orderConfirmation = '/order-confirmation';

  /// 获取NFT详情路径
  static String getNftDetailPath(String nftId) => '/nft-detail/$nftId';
}

/// 路由配置
class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: RoutePaths.splash,
    debugLogDiagnostics: true,
    routes: [
      // 启动页
      GoRoute(
        path: RoutePaths.splash,
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),

      // 首页
      GoRoute(
        path: RoutePaths.home,
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),

      // NFT列表
      GoRoute(
        path: RoutePaths.nftList,
        name: 'nftList',
        builder: (context, state) => const NftListScreen(),
      ),

      // NFT详情
      GoRoute(
        path: RoutePaths.nftDetail,
        name: 'nftDetail',
        builder: (context, state) {
          final nftId = state.pathParameters['id']!;
          return NftDetailScreen(nftId: nftId);
        },
      ),

      // 登录
      GoRoute(
        path: RoutePaths.login,
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),

      // 注册
      GoRoute(
        path: RoutePaths.register,
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),

      // 个人中心
      GoRoute(
        path: RoutePaths.profile,
        name: 'profile',
        builder: (context, state) => const ProfileScreen(),
      ),

      // 我的NFT
      GoRoute(
        path: RoutePaths.myNfts,
        name: 'myNfts',
        builder: (context, state) => const MyNftsScreen(),
      ),

      // 我的订单
      GoRoute(
        path: RoutePaths.myOrders,
        name: 'myOrders',
        builder: (context, state) => const MyOrdersScreen(),
      ),

      // 钱包连接
      GoRoute(
        path: RoutePaths.walletConnect,
        name: 'walletConnect',
        builder: (context, state) => const WalletConnectScreen(),
      ),

      // 订单确认
      GoRoute(
        path: RoutePaths.orderConfirmation,
        name: 'orderConfirmation',
        builder: (context, state) {
          final nftId = state.uri.queryParameters['nftId'] ?? '';
          final quantity = int.parse(
            state.uri.queryParameters['quantity'] ?? '1',
          );
          return OrderConfirmationScreen(
            nftId: nftId,
            quantity: quantity,
          );
        },
      ),
    ],

    // 错误页面
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(
        title: const Text('页面未找到'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            const Text(
              '404 - 页面未找到',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '路径: ${state.uri}',
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () => context.go(RoutePaths.home),
              child: const Text('返回首页'),
            ),
          ],
        ),
      ),
    ),
  );
}
