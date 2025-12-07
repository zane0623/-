import 'dart:convert';
import 'package:dio/dio.dart';
import '../models/presale.dart';
import '../models/order.dart';
import '../models/nft.dart';
import '../models/user.dart';

class ApiService {
  late final Dio _dio;
  final String baseUrl;
  String? _token;

  ApiService({this.baseUrl = 'http://localhost:3001/api'}) {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    // 添加拦截器
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_token != null) {
          options.headers['Authorization'] = 'Bearer $_token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        print('API Error: ${error.message}');
        return handler.next(error);
      },
    ));
  }

  void setToken(String? token) {
    _token = token;
  }

  String? getToken() => _token;

  // ============================================
  // 健康检查
  // ============================================
  Future<Map<String, dynamic>?> checkHealth() async {
    try {
      final response = await _dio.get('/health');
      return response.data;
    } catch (e) {
      print('Health check failed: $e');
      return null;
    }
  }

  // ============================================
  // 认证相关API
  // ============================================
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.data['success']) {
        final data = response.data['data'];
        _token = data['token'];
        return {
          'success': true,
          'token': data['token'],
          'user': User.fromJson(data['user']),
        };
      }

      return {
        'success': false,
        'error': response.data['message'] ?? '登录失败',
      };
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  Future<Map<String, dynamic>> register(
      String email, String password, String? username) async {
    try {
      final response = await _dio.post('/auth/register', data: {
        'email': email,
        'password': password,
        'username': username,
      });

      if (response.data['success']) {
        final data = response.data['data'];
        _token = data['token'];
        return {
          'success': true,
          'token': data['token'],
          'user': User.fromJson(data['user']),
        };
      }

      return {
        'success': false,
        'error': response.data['message'] ?? '注册失败',
      };
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post('/auth/logout');
    } catch (e) {
      print('Logout error: $e');
    } finally {
      _token = null;
    }
  }

  Future<User?> getCurrentUser() async {
    try {
      final response = await _dio.get('/auth/me');
      if (response.data['success']) {
        return User.fromJson(response.data['data']);
      }
      return null;
    } catch (e) {
      print('Get current user error: $e');
      return null;
    }
  }

  // ============================================
  // 预售相关API
  // ============================================
  Future<List<Presale>> getPresales() async {
    try {
      final response = await _dio.get('/presales');
      
      if (response.data is List) {
        return (response.data as List)
            .map((json) => Presale.fromJson(json))
            .toList();
      } else if (response.data['success'] && response.data['data'] is List) {
        return (response.data['data'] as List)
            .map((json) => Presale.fromJson(json))
            .toList();
      }
      
      return [];
    } catch (e) {
      print('Get presales error: $e');
      return [];
    }
  }

  Future<Presale?> getPresaleById(String id) async {
    try {
      final response = await _dio.get('/presales/$id');
      
      if (response.data['success']) {
        return Presale.fromJson(response.data['data']);
      } else if (response.data is Map) {
        return Presale.fromJson(response.data);
      }
      
      return null;
    } catch (e) {
      print('Get presale by id error: $e');
      return null;
    }
  }

  // ============================================
  // 订单相关API
  // ============================================
  Future<List<Order>> getMyOrders() async {
    try {
      final response = await _dio.get('/orders/my');
      
      if (response.data is List) {
        return (response.data as List)
            .map((json) => Order.fromJson(json))
            .toList();
      } else if (response.data['success'] && response.data['data'] is List) {
        return (response.data['data'] as List)
            .map((json) => Order.fromJson(json))
            .toList();
      }
      
      return [];
    } catch (e) {
      print('Get my orders error: $e');
      return [];
    }
  }

  Future<Order?> getOrderById(String id) async {
    try {
      final response = await _dio.get('/orders/$id');
      
      if (response.data['success']) {
        return Order.fromJson(response.data['data']);
      }
      
      return null;
    } catch (e) {
      print('Get order by id error: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>> createOrder(Map<String, dynamic> orderData) async {
    try {
      final response = await _dio.post('/orders', data: orderData);
      
      if (response.data['success']) {
        return {
          'success': true,
          'order': Order.fromJson(response.data['data']),
        };
      }
      
      return {
        'success': false,
        'error': response.data['message'] ?? '创建订单失败',
      };
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  // ============================================
  // NFT相关API
  // ============================================
  Future<List<NFT>> getMyNFTs() async {
    try {
      final response = await _dio.get('/nfts/my');
      
      if (response.data is List) {
        return (response.data as List)
            .map((json) => NFT.fromJson(json))
            .toList();
      } else if (response.data['success'] && response.data['data'] is List) {
        return (response.data['data'] as List)
            .map((json) => NFT.fromJson(json))
            .toList();
      }
      
      return [];
    } catch (e) {
      print('Get my NFTs error: $e');
      return [];
    }
  }

  Future<NFT?> getNFTById(String id) async {
    try {
      final response = await _dio.get('/nfts/$id');
      
      if (response.data['success']) {
        return NFT.fromJson(response.data['data']);
      }
      
      return null;
    } catch (e) {
      print('Get NFT by id error: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>> redeemNFT(String id) async {
    try {
      final response = await _dio.post('/nfts/$id/redeem');
      
      return {
        'success': response.data['success'] ?? false,
        'message': response.data['message'] ?? '兑换成功',
      };
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  // ============================================
  // 支付相关API
  // ============================================
  Future<Map<String, dynamic>> createPayment(
      String orderId, String paymentMethod, double amount) async {
    try {
      final response = await _dio.post('/payments', data: {
        'order_id': orderId,
        'payment_method': paymentMethod,
        'amount': amount,
      });

      return {
        'success': response.data['success'] ?? false,
        'data': response.data['data'],
      };
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  Future<Map<String, dynamic>> confirmPayment(String paymentId, String? txHash) async {
    try {
      final response = await _dio.post('/payments/$paymentId/confirm', data: {
        'tx_hash': txHash,
      });

      return {
        'success': response.data['success'] ?? false,
        'message': response.data['message'] ?? '支付确认成功',
      };
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }
}


