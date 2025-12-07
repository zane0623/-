/// 异常基类
class AppException implements Exception {
  AppException({
    required this.message,
    this.code,
    this.data,
  });
  final String message;
  final int? code;
  final dynamic data;

  @override
  String toString() => 'AppException: $message (code: $code)';
}

/// 服务器异常
class ServerException extends AppException {
  ServerException({
    required super.message,
    super.code,
    super.data,
  });
}

/// 网络异常
class NetworkException extends AppException {
  NetworkException({
    super.message = '网络连接失败',
    super.code,
    super.data,
  });
}

/// 认证异常
class AuthException extends AppException {
  AuthException({
    required super.message,
    super.code,
    super.data,
  });
}

/// 缓存异常
class CacheException extends AppException {
  CacheException({
    required super.message,
    super.code,
    super.data,
  });
}

/// 数据解析异常
class ParseException extends AppException {
  ParseException({
    super.message = '数据解析失败',
    super.code,
    super.data,
  });
}

/// 超时异常
class TimeoutException extends AppException {
  TimeoutException({
    super.message = '请求超时',
    super.code,
    super.data,
  });
}

/// 权限异常
class PermissionException extends AppException {
  PermissionException({
    required super.message,
    super.code,
    super.data,
  });
}
