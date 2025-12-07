import 'package:flutter/material.dart';
import '../../main.dart' show storageService, logger;

/// 主题Provider
class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.light;

  ThemeMode get themeMode => _themeMode;
  bool get isDarkMode => _themeMode == ThemeMode.dark;

  /// 初始化 - 从本地存储读取主题设置
  Future<void> init() async {
    try {
      final savedTheme = storageService.getString('theme_mode');
      if (savedTheme != null) {
        _themeMode = ThemeMode.values.firstWhere(
          (e) => e.name == savedTheme,
          orElse: () => ThemeMode.light,
        );
        logger.i('加载主题设置: $_themeMode');
        notifyListeners();
      }
    } catch (e) {
      logger.e('加载主题设置失败', error: e);
    }
  }

  /// 切换主题
  Future<void> toggleTheme() async {
    try {
      _themeMode =
          _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;

      await storageService.setString('theme_mode', _themeMode.name);
      logger.i('主题已切换: $_themeMode');
      notifyListeners();
    } catch (e) {
      logger.e('切换主题失败', error: e);
    }
  }

  /// 设置主题
  Future<void> setThemeMode(ThemeMode mode) async {
    try {
      _themeMode = mode;
      await storageService.setString('theme_mode', _themeMode.name);
      logger.i('主题已设置: $_themeMode');
      notifyListeners();
    } catch (e) {
      logger.e('设置主题失败', error: e);
    }
  }
}
