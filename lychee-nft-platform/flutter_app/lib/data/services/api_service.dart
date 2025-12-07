import 'package:dio/dio.dart';
import '../../core/error/exceptions.dart';
import '../../main.dart';

/// API服务基类
///
/// 封装所有HTTP请求方法
class ApiService {
  ApiService(this._dio);
  late final Dio _dio;

  /// GET请求
  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      logger.d('GET请求: $path');
      logger.d('参数: $queryParameters');

      final response = await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );

      logger.d('响应: ${response.data}');
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// POST请求
  Future<T> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      logger.d('POST请求: $path');
      logger.d('数据: $data');

      final response = await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );

      logger.d('响应: ${response.data}');
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// PUT请求
  Future<T> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      logger.d('PUT请求: $path');
      logger.d('数据: $data');

      final response = await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );

      logger.d('响应: ${response.data}');
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// DELETE请求
  Future<T> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      logger.d('DELETE请求: $path');
      logger.d('数据: $data');

      final response = await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );

      logger.d('响应: ${response.data}');
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// PATCH请求
  Future<T> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      logger.d('PATCH请求: $path');
      logger.d('数据: $data');

      final response = await _dio.patch<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );

      logger.d('响应: ${response.data}');
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// 文件上传
  Future<T> upload<T>(
    String path, {
    required FormData formData,
    Options? options,
    CancelToken? cancelToken,
    ProgressCallback? onSendProgress,
  }) async {
    try {
      logger.d('上传文件: $path');

      final response = await _dio.post<T>(
        path,
        data: formData,
        options: options,
        cancelToken: cancelToken,
        onSendProgress: onSendProgress,
      );

      logger.d('响应: ${response.data}');
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// 文件下载
  Future<void> download(
    String urlPath,
    String savePath, {
    ProgressCallback? onReceiveProgress,
    CancelToken? cancelToken,
  }) async {
    try {
      logger.d('下载文件: $urlPath -> $savePath');

      await _dio.download(
        urlPath,
        savePath,
        onReceiveProgress: onReceiveProgress,
        cancelToken: cancelToken,
      );

      logger.d('下载完成');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// 错误处理
  AppException _handleError(DioException error) {
    logger.e('请求错误: ${error.type}');
    logger.e('错误消息: ${error.message}');
    logger.e('响应数据: ${error.response?.data}');

    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return TimeoutException(message: '请求超时，请稍后重试');

      case DioExceptionType.badResponse:
        return _handleResponseError(error.response!);

      case DioExceptionType.cancel:
        return NetworkException(message: '请求已取消');

      case DioExceptionType.connectionError:
        return NetworkException(message: '网络连接失败，请检查网络设置');

      case DioExceptionType.badCertificate:
        return NetworkException(message: '证书验证失败');

      case DioExceptionType.unknown:
        return NetworkException(
          message: error.message ?? '网络请求失败',
        );
    }
  }

  /// 响应错误处理
  AppException _handleResponseError(Response response) {
    final statusCode = response.statusCode;
    final data = response.data;

    var message = '请求失败';
    if (data is Map && data.containsKey('message')) {
      message = data['message'].toString();
    }

    switch (statusCode) {
      case 400:
        return ServerException(
          message: message.isEmpty ? '请求参数错误' : message,
          code: statusCode,
        );
      case 401:
        return AuthException(
          message: message.isEmpty ? '未授权，请重新登录' : message,
          code: statusCode,
        );
      case 403:
        return PermissionException(
          message: message.isEmpty ? '没有访问权限' : message,
          code: statusCode,
        );
      case 404:
        return ServerException(
          message: message.isEmpty ? '请求的资源不存在' : message,
          code: statusCode,
        );
      case 500:
      case 502:
      case 503:
        return ServerException(
          message: message.isEmpty ? '服务器错误，请稍后重试' : message,
          code: statusCode,
        );
      default:
        return ServerException(
          message: message.isEmpty ? '请求失败($statusCode)' : message,
          code: statusCode,
        );
    }
  }
}
