import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// 辅助函数工具类
class Helpers {
  Helpers._();

  /// 显示SnackBar
  static void showSnackBar(
    BuildContext context,
    String message, {
    Duration duration = const Duration(seconds: 2),
    SnackBarAction? action,
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: duration,
        action: action,
      ),
    );
  }

  /// 显示成功提示
  static void showSuccess(BuildContext context, String message) {
    showSnackBar(
      context,
      message,
      duration: const Duration(seconds: 2),
    );
  }

  /// 显示错误提示
  static void showError(BuildContext context, String message) {
    showSnackBar(
      context,
      message,
      duration: const Duration(seconds: 3),
    );
  }

  /// 显示加载对话框
  static void showLoadingDialog(BuildContext context, {String? message}) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => PopScope(
        canPop: false,
        child: Center(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(),
                  if (message != null) ...[
                    const SizedBox(height: 16),
                    Text(message),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  /// 关闭加载对话框
  static void hideLoadingDialog(BuildContext context) {
    Navigator.of(context).pop();
  }

  /// 显示确认对话框
  static Future<bool> showConfirmDialog(
    BuildContext context, {
    required String title,
    required String content,
    String confirmText = '确定',
    String cancelText = '取消',
  }) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text(cancelText),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: Text(confirmText),
          ),
        ],
      ),
    );
    return result ?? false;
  }

  /// 显示底部选择器
  static Future<T?> showBottomSheet<T>(
    BuildContext context, {
    required Widget child,
    bool isScrollControlled = false,
  }) {
    return showModalBottomSheet<T>(
      context: context,
      isScrollControlled: isScrollControlled,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => child,
    );
  }

  /// 复制到剪贴板
  static Future<void> copyToClipboard(
    BuildContext context,
    String text, {
    String? successMessage,
  }) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (context.mounted) {
      showSuccess(context, successMessage ?? '已复制到剪贴板');
    }
  }

  /// 隐藏键盘
  static void hideKeyboard(BuildContext context) {
    FocusScope.of(context).unfocus();
  }

  /// 延迟执行
  static Future<void> delay(int milliseconds) {
    return Future.delayed(Duration(milliseconds: milliseconds));
  }

  /// 防抖函数
  static Function debounce(
    Function function, {
    Duration duration = const Duration(milliseconds: 300),
  }) {
    DateTime? lastActionTime;
    return () {
      final now = DateTime.now();
      if (lastActionTime == null ||
          now.difference(lastActionTime!) > duration) {
        lastActionTime = now;
        function();
      }
    };
  }

  /// 节流函数
  static Function throttle(
    Function function, {
    Duration duration = const Duration(milliseconds: 300),
  }) {
    var isThrottled = false;
    return () {
      if (!isThrottled) {
        function();
        isThrottled = true;
        Future.delayed(duration, () {
          isThrottled = false;
        });
      }
    };
  }

  /// 安全获取颜色
  static Color? parseColor(String? colorString) {
    if (colorString == null || colorString.isEmpty) return null;

    try {
      // 移除#号
      final hexColor = colorString.replaceAll('#', '');

      // 处理RGB和RGBA
      if (hexColor.length == 6) {
        return Color(int.parse('FF$hexColor', radix: 16));
      } else if (hexColor.length == 8) {
        return Color(int.parse(hexColor, radix: 16));
      }
    } catch (e) {
      debugPrint('解析颜色失败: $colorString');
    }

    return null;
  }

  /// 生成随机字符串
  static String generateRandomString(int length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return String.fromCharCodes(
      Iterable.generate(
        length,
        (_) => chars.codeUnitAt(
          DateTime.now().microsecondsSinceEpoch % chars.length,
        ),
      ),
    );
  }

  /// 判断是否为空字符串
  static bool isNullOrEmpty(String? str) {
    return str == null || str.isEmpty;
  }

  /// 判断列表是否为空
  static bool isListEmpty(List? list) {
    return list == null || list.isEmpty;
  }

  /// 安全获取列表元素
  static T? safeGet<T>(List<T>? list, int index) {
    if (list == null || index < 0 || index >= list.length) {
      return null;
    }
    return list[index];
  }

  /// 格式化异常消息
  static String formatError(dynamic error) {
    if (error == null) return '未知错误';

    if (error is String) return error;

    if (error is Exception) {
      return error.toString().replaceAll('Exception: ', '');
    }

    return error.toString();
  }

  /// 获取屏幕宽度
  static double getScreenWidth(BuildContext context) {
    return MediaQuery.of(context).size.width;
  }

  /// 获取屏幕高度
  static double getScreenHeight(BuildContext context) {
    return MediaQuery.of(context).size.height;
  }

  /// 判断是否为深色模式
  static bool isDarkMode(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark;
  }
}
