import 'package:flutter/material.dart';
import '../../data/models/user_model.dart';
import '../../main.dart' show storageService, logger;

/// 认证状态
enum AuthState {
  initial,
  loading,
  authenticated,
  unauthenticated,
}

/// 认证Provider
class AuthProvider extends ChangeNotifier {
  AuthState _state = AuthState.initial;
  UserModel? _user;
  String? _token;
  String? _error;

  AuthState get state => _state;
  UserModel? get user => _user;
  String? get token => _token;
  String? get error => _error;

  bool get isAuthenticated => _state == AuthState.authenticated;
  bool get isLoading => _state == AuthState.loading;

  /// 初始化 - 检查本地存储的登录信息
  Future<void> init() async {
    try {
      _state = AuthState.loading;
      notifyListeners();

      // 从本地存储读取token和用户信息
      final savedToken = storageService.getString('auth_token');
      final savedUserJson = storageService.getString('user_data');

      if (savedToken != null && savedUserJson != null) {
        // TODO: 验证token是否有效
        _token = savedToken;
        // _user = UserModel.fromJson(jsonDecode(savedUserJson));
        _state = AuthState.authenticated;
        logger.i('用户已登录: ${_user?.username}');
      } else {
        _state = AuthState.unauthenticated;
      }

      notifyListeners();
    } catch (e) {
      logger.e('初始化认证状态失败', error: e);
      _state = AuthState.unauthenticated;
      notifyListeners();
    }
  }

  /// 登录
  Future<bool> login(String username, String password) async {
    try {
      _state = AuthState.loading;
      _error = null;
      notifyListeners();

      logger.i('尝试登录: $username');

      // TODO: 调用API进行登录
      await Future.delayed(const Duration(seconds: 2)); // 模拟网络请求

      // 模拟登录成功
      _token = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';
      _user = UserModel(
        id: '1',
        username: username,
        email: '$username@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=$username',
        createdAt: DateTime.now(),
        isVerified: true,
      );

      // 保存到本地存储
      await storageService.setString('auth_token', _token!);
      // await storageService.setString('user_data', jsonEncode(_user!.toJson()));

      _state = AuthState.authenticated;
      logger.i('登录成功: ${_user?.username}');
      notifyListeners();

      return true;
    } catch (e) {
      logger.e('登录失败', error: e);
      _error = e.toString();
      _state = AuthState.unauthenticated;
      notifyListeners();
      return false;
    }
  }

  /// 注册
  Future<bool> register({
    required String username,
    required String password,
    String? email,
    String? phone,
  }) async {
    try {
      _state = AuthState.loading;
      _error = null;
      notifyListeners();

      logger.i('尝试注册: $username');

      // TODO: 调用API进行注册
      await Future.delayed(const Duration(seconds: 2));

      // 模拟注册成功，自动登录
      return await login(username, password);
    } catch (e) {
      logger.e('注册失败', error: e);
      _error = e.toString();
      _state = AuthState.unauthenticated;
      notifyListeners();
      return false;
    }
  }

  /// 登出
  Future<void> logout() async {
    try {
      logger.i('用户登出: ${_user?.username}');

      // 清除本地存储
      await storageService.remove('auth_token');
      await storageService.remove('user_data');

      // 清除状态
      _token = null;
      _user = null;
      _state = AuthState.unauthenticated;
      _error = null;

      notifyListeners();
    } catch (e) {
      logger.e('登出失败', error: e);
      rethrow;
    }
  }

  /// 连接钱包
  Future<bool> connectWallet(String walletAddress) async {
    try {
      logger.i('连接钱包: $walletAddress');

      // TODO: 验证钱包地址并绑定到用户账户

      if (_user != null) {
        _user = _user!.copyWith(walletAddress: walletAddress);
        notifyListeners();
        return true;
      }

      return false;
    } catch (e) {
      logger.e('连接钱包失败', error: e);
      return false;
    }
  }

  /// 断开钱包
  Future<void> disconnectWallet() async {
    try {
      logger.i('断开钱包');

      if (_user != null) {
        _user = _user!.copyWith(walletAddress: null);
        notifyListeners();
      }
    } catch (e) {
      logger.e('断开钱包失败', error: e);
    }
  }

  /// 更新用户信息
  void updateUser(UserModel user) {
    _user = user;
    notifyListeners();
  }
}
