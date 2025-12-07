import 'package:flutter/material.dart';
import 'failures.dart';
import 'exceptions.dart';
import '../../main.dart';

/// 全局错误处理器
class ErrorHandler {
  ErrorHandler._();

  /// 将Exception转换为Failure
  static Failure handleException(dynamic exception) {
    logger.e('处理异常: ${exception.runtimeType}');
    logger.e('异常详情: $exception');

    if (exception is ServerException) {
      return ServerFailure(
        message: exception.message,
        code: exception.code,
      );
    } else if (exception is NetworkException) {
      return NetworkFailure(
        message: exception.message,
        code: exception.code,
      );
    } else if (exception is AuthException) {
      return AuthFailure(
        message: exception.message,
        code: exception.code,
      );
    } else if (exception is CacheException) {
      return CacheFailure(
        message: exception.message,
        code: exception.code,
      );
    } else if (exception is ParseException) {
      return const ParseFailure();
    } else if (exception is TimeoutException) {
      return const TimeoutFailure();
    } else if (exception is PermissionException) {
      return PermissionFailure(
        message: exception.message,
        code: exception.code,
      );
    } else if (exception is AppException) {
      return ServerFailure(
        message: exception.message,
        code: exception.code,
      );
    } else {
      return UnknownFailure(message: exception.toString());
    }
  }

  /// 获取用户友好的错误消息
  static String getUserMessage(Failure failure) {
    if (failure is ServerFailure) {
      return failure.message;
    } else if (failure is NetworkFailure) {
      return failure.message;
    } else if (failure is AuthFailure) {
      return failure.message;
    } else if (failure is CacheFailure) {
      return failure.message;
    } else if (failure is ParseFailure) {
      return '数据解析失败，请稍后重试';
    } else if (failure is ValidationFailure) {
      return failure.message;
    } else if (failure is TimeoutFailure) {
      return '请求超时，请检查网络连接';
    } else if (failure is PermissionFailure) {
      return failure.message;
    } else if (failure is BusinessFailure) {
      return failure.message;
    } else {
      return '未知错误，请稍后重试';
    }
  }

  /// 显示错误提示
  static void showError(BuildContext context, Failure failure) {
    final message = getUserMessage(failure);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
        action: SnackBarAction(
          label: '确定',
          textColor: Colors.white,
          onPressed: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
          },
        ),
      ),
    );
  }

  /// 显示错误对话框
  static Future<void> showErrorDialog(
    BuildContext context,
    Failure failure, {
    VoidCallback? onRetry,
  }) async {
    final message = getUserMessage(failure);

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('错误'),
        content: Text(message),
        actions: [
          if (onRetry != null)
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                onRetry();
              },
              child: const Text('重试'),
            ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  /// 处理未捕获的Flutter错误
  static void handleFlutterError(FlutterErrorDetails details) {
    logger.e('Flutter错误: ${details.exception}');
    logger.e('堆栈: ${details.stack}');

    // 在非生产环境显示错误详情
    if (!details.silent) {
      FlutterError.presentError(details);
    }
  }

  /// 处理Zone错误
  static void handleZoneError(Object error, StackTrace stack) {
    logger.e('Zone错误: $error');
    logger.e('堆栈: $stack');
  }
}
