import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService;
  User? _user;
  bool _isLoading = true;
  String? _error;

  AuthProvider(this._apiService) {
    _initialize();
  }

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  String? get error => _error;

  Future<void> _initialize() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token != null && token.isNotEmpty) {
        _apiService.setToken(token);
        final user = await _apiService.getCurrentUser();
        if (user != null) {
          _user = user;
        } else {
          await prefs.remove('token');
          _apiService.setToken(null);
        }
      }
    } catch (e) {
      print('Initialize auth error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final result = await _apiService.login(email, password);

      if (result['success']) {
        _user = result['user'];
        final token = result['token'];

        // 保存token到本地
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', token);

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = result['error'] ?? '登录失败';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String email, String password, String? username) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final result = await _apiService.register(email, password, username);

      if (result['success']) {
        _user = result['user'];
        final token = result['token'];

        // 保存token到本地
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', token);

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = result['error'] ?? '注册失败';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await _apiService.logout();
      
      // 清除本地存储的token
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('token');

      _user = null;
      _error = null;
      notifyListeners();
    } catch (e) {
      print('Logout error: $e');
    }
  }

  Future<void> refreshUser() async {
    try {
      final user = await _apiService.getCurrentUser();
      if (user != null) {
        _user = user;
        notifyListeners();
      }
    } catch (e) {
      print('Refresh user error: $e');
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}


