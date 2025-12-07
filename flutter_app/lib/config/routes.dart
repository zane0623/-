import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../screens/main_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/presale/presale_list_screen.dart';
import '../screens/presale/presale_detail_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/order/order_list_screen.dart';
import '../screens/nft/nft_list_screen.dart';

class AppRoutes {
  static const String home = '/';
  static const String presales = '/presales';
  static const String presaleDetail = '/presales/:id';
  static const String login = '/login';
  static const String register = '/register';
  static const String profile = '/profile';
  static const String orders = '/orders';
  static const String nfts = '/nfts';

  static final GoRouter router = GoRouter(
    initialLocation: home,
    routes: [
      ShellRoute(
        builder: (context, state, child) => MainScreen(child: child),
        routes: [
          GoRoute(
            path: home,
            pageBuilder: (context, state) => NoTransitionPage(
              key: state.pageKey,
              child: const HomeScreen(),
            ),
          ),
          GoRoute(
            path: presales,
            pageBuilder: (context, state) => NoTransitionPage(
              key: state.pageKey,
              child: const PresaleListScreen(),
            ),
          ),
          GoRoute(
            path: profile,
            pageBuilder: (context, state) => NoTransitionPage(
              key: state.pageKey,
              child: const ProfileScreen(),
            ),
          ),
          GoRoute(
            path: orders,
            pageBuilder: (context, state) => NoTransitionPage(
              key: state.pageKey,
              child: const OrderListScreen(),
            ),
          ),
          GoRoute(
            path: nfts,
            pageBuilder: (context, state) => NoTransitionPage(
              key: state.pageKey,
              child: const NFTListScreen(),
            ),
          ),
        ],
      ),
      GoRoute(
        path: presaleDetail,
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return PresaleDetailScreen(presaleId: id);
        },
      ),
      GoRoute(
        path: login,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: register,
        builder: (context, state) => const RegisterScreen(),
      ),
    ],
  );
}


