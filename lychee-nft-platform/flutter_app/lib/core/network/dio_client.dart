import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import '../../config/constants.dart';
import '../../config/environment.dart';
import '../../data/services/storage_service.dart';
import '../../main.dart';

/// Dio客户端配置
class DioClient {
  DioClient() {
    _dio = Dio(_baseOptions);
    _setupInterceptors();
  }
  late final Dio _dio;

  Dio get dio => _dio;

  /// 基础配置
  BaseOptions get _baseOptions => BaseOptions(
        baseUrl: Environment.apiBaseUrl,
        connectTimeout:
            const Duration(milliseconds: AppConstants.connectTimeout),
        receiveTimeout:
            const Duration(milliseconds: AppConstants.receiveTimeout),
        sendTimeout: const Duration(milliseconds: AppConstants.sendTimeout),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      );

  /// 设置拦截器
  void _setupInterceptors() {
    _dio.interceptors.addAll([
      // 认证拦截器
      _AuthInterceptor(),
      // 日志拦截器（仅在非生产环境）
      if (Environment.enableNetworkLogging)
        PrettyDioLogger(
          requestHeader: true,
          requestBody: true,
          responseBody: true,
          responseHeader: false,
          error: true,
          compact: true,
          maxWidth: 90,
        ),
      // 错误处理拦截器
      _ErrorInterceptor(),
    ]);
  }
}

/// 认证拦截器
class _AuthInterceptor extends Interceptor {
  final _storage = StorageService();

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // 获取Token并添加到请求头
    final token = await _storage.getToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
      logger.d('添加Token到请求头');
    }

    // 添加设备信息
    options.headers['X-Device-Platform'] = 'mobile';
    options.headers['X-App-Version'] = AppConstants.appVersion;

    super.onRequest(options, handler);
  }

  @override
  void onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    // 401错误，尝试刷新Token
    if (err.response?.statusCode == 401) {
      logger.w('Token过期，尝试刷新...');

      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken != null) {
        try {
          // TODO: 调用刷新Token接口
          // final newToken = await _refreshToken(refreshToken);
          // await _storage.saveToken(newToken);

          // 重试原请求
          // final options = err.requestOptions;
          // options.headers['Authorization'] = 'Bearer $newToken';
          // final response = await Dio().fetch(options);
          // return handler.resolve(response);

          logger.e('Token刷新未实现');
        } catch (e) {
          logger.e('Token刷新失败: $e');
          // 清除登录状态
          await _storage.logout();
        }
      }
    }

    super.onError(err, handler);
  }
}

/// 错误处理拦截器
class _ErrorInterceptor extends Interceptor {
  @override
  void onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) {
    logger.e('网络请求错误:');
    logger.e('请求URL: ${err.requestOptions.uri}');
    logger.e('错误类型: ${err.type}');
    logger.e('错误消息: ${err.message}');
    logger.e('响应码: ${err.response?.statusCode}');
    logger.e('响应数据: ${err.response?.data}');

    super.onError(err, handler);
  }

  @override
  void onResponse(
    Response response,
    ResponseInterceptorHandler handler,
  ) {
    // 可以在这里统一处理响应格式
    // 例如：检查响应中的业务状态码
    if (response.data is Map) {
      final data = response.data as Map;

      // 假设后端返回格式: { code: 200, message: 'success', data: {} }
      if (data.containsKey('code') && data['code'] != 200) {
        logger.w('业务错误: ${data['message']}');
        // 可以转换为DioException
        // return handler.reject(
        //   DioException(
        //     requestOptions: response.requestOptions,
        //     response: response,
        //     type: DioExceptionType.badResponse,
        //     error: data['message'],
        //   ),
        // );
      }
    }

    super.onResponse(response, handler);
  }
}

/// 重试拦截器
class RetryInterceptor extends Interceptor {
  RetryInterceptor({
    this.maxRetries = AppConstants.maxRetryCount,
    this.retryableStatusCodes = const [408, 500, 502, 503, 504],
  });
  final int maxRetries;
  final List<int> retryableStatusCodes;

  @override
  void onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final requestOptions = err.requestOptions;
    final retryCount = requestOptions.extra['retry_count'] as int? ?? 0;

    // 检查是否应该重试
    if (retryCount < maxRetries &&
        (err.type == DioExceptionType.connectionTimeout ||
            err.type == DioExceptionType.receiveTimeout ||
            err.type == DioExceptionType.sendTimeout ||
            (err.response != null &&
                retryableStatusCodes.contains(err.response!.statusCode)))) {
      logger.w('请求失败，开始第${retryCount + 1}次重试...');

      // 增加重试次数
      requestOptions.extra['retry_count'] = retryCount + 1;

      // 延迟后重试
      await Future.delayed(Duration(seconds: retryCount + 1));

      try {
        final response = await Dio().fetch(requestOptions);
        return handler.resolve(response);
      } catch (e) {
        return handler.next(err);
      }
    }

    super.onError(err, handler);
  }
}
