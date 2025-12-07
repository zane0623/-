import 'package:equatable/equatable.dart';

/// 失败基类
///
/// 所有错误都继承自此类，便于统一处理
abstract class Failure extends Equatable {
  const Failure({
    required this.message,
    this.code,
  });
  final String message;
  final int? code;

  @override
  List<Object?> get props => [message, code];
}

/// 服务器错误
class ServerFailure extends Failure {
  const ServerFailure({
    required super.message,
    super.code,
  });
}

/// 网络连接错误
class NetworkFailure extends Failure {
  const NetworkFailure({
    super.message = '网络连接失败，请检查网络设置',
    super.code,
  });
}

/// 认证错误
class AuthFailure extends Failure {
  const AuthFailure({
    required super.message,
    super.code,
  });
}

/// 缓存错误
class CacheFailure extends Failure {
  const CacheFailure({
    required super.message,
    super.code,
  });
}

/// 数据解析错误
class ParseFailure extends Failure {
  const ParseFailure({
    super.message = '数据解析失败',
    super.code,
  });
}

/// 验证错误
class ValidationFailure extends Failure {
  const ValidationFailure({
    required super.message,
    super.code,
  });
}

/// 未知错误
class UnknownFailure extends Failure {
  const UnknownFailure({
    super.message = '未知错误',
    super.code,
  });
}

/// 超时错误
class TimeoutFailure extends Failure {
  const TimeoutFailure({
    super.message = '请求超时',
    super.code,
  });
}

/// 权限错误
class PermissionFailure extends Failure {
  const PermissionFailure({
    required super.message,
    super.code,
  });
}

/// 业务逻辑错误
class BusinessFailure extends Failure {
  const BusinessFailure({
    required super.message,
    super.code,
  });
}
