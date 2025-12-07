import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../config/constants.dart';

/// 本地存储服务
///
/// 提供安全存储和普通存储功能
class StorageService {
  factory StorageService() => _instance;
  StorageService._internal();
  static final StorageService _instance = StorageService._internal();

  final _secureStorage = const FlutterSecureStorage();
  SharedPreferences? _prefs;

  /// 初始化
  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // ========== 安全存储（用于敏感数据） ==========

  /// 保存Token
  Future<void> saveToken(String token) async {
    await _secureStorage.write(
      key: AppConstants.keyAccessToken,
      value: token,
    );
  }

  /// 获取Token
  Future<String?> getToken() async {
    return await _secureStorage.read(key: AppConstants.keyAccessToken);
  }

  /// 删除Token
  Future<void> deleteToken() async {
    await _secureStorage.delete(key: AppConstants.keyAccessToken);
  }

  /// 保存RefreshToken
  Future<void> saveRefreshToken(String token) async {
    await _secureStorage.write(
      key: AppConstants.keyRefreshToken,
      value: token,
    );
  }

  /// 获取RefreshToken
  Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: AppConstants.keyRefreshToken);
  }

  /// 删除RefreshToken
  Future<void> deleteRefreshToken() async {
    await _secureStorage.delete(key: AppConstants.keyRefreshToken);
  }

  /// 保存钱包地址
  Future<void> saveWalletAddress(String address) async {
    await _secureStorage.write(
      key: AppConstants.keyWalletAddress,
      value: address,
    );
  }

  /// 获取钱包地址
  Future<String?> getWalletAddress() async {
    return await _secureStorage.read(key: AppConstants.keyWalletAddress);
  }

  /// 删除钱包地址
  Future<void> deleteWalletAddress() async {
    await _secureStorage.delete(key: AppConstants.keyWalletAddress);
  }

  /// 清除所有安全存储
  Future<void> clearSecureStorage() async {
    await _secureStorage.deleteAll();
  }

  // ========== 普通存储 ==========

  /// 保存字符串
  Future<bool> setString(String key, String value) async {
    return await _prefs!.setString(key, value);
  }

  /// 获取字符串
  String? getString(String key, {String? defaultValue}) {
    return _prefs!.getString(key) ?? defaultValue;
  }

  /// 保存整数
  Future<bool> setInt(String key, int value) async {
    return await _prefs!.setInt(key, value);
  }

  /// 获取整数
  int? getInt(String key, {int? defaultValue}) {
    return _prefs!.getInt(key) ?? defaultValue;
  }

  /// 保存布尔值
  Future<bool> setBool(String key, bool value) async {
    return await _prefs!.setBool(key, value);
  }

  /// 获取布尔值
  bool? getBool(String key, {bool? defaultValue}) {
    return _prefs!.getBool(key) ?? defaultValue;
  }

  /// 保存双精度浮点数
  Future<bool> setDouble(String key, double value) async {
    return await _prefs!.setDouble(key, value);
  }

  /// 获取双精度浮点数
  double? getDouble(String key, {double? defaultValue}) {
    return _prefs!.getDouble(key) ?? defaultValue;
  }

  /// 保存字符串列表
  Future<bool> setStringList(String key, List<String> value) async {
    return await _prefs!.setStringList(key, value);
  }

  /// 获取字符串列表
  List<String>? getStringList(String key) {
    return _prefs!.getStringList(key);
  }

  /// 删除指定key
  Future<bool> remove(String key) async {
    return await _prefs!.remove(key);
  }

  /// 清除所有数据
  Future<bool> clear() async {
    return await _prefs!.clear();
  }

  /// 检查key是否存在
  bool containsKey(String key) {
    return _prefs!.containsKey(key);
  }

  /// 获取所有keys
  Set<String> getKeys() {
    return _prefs!.getKeys();
  }

  // ========== 业务相关存储 ==========

  /// 保存用户ID
  Future<bool> saveUserId(String userId) {
    return setString(AppConstants.keyUserId, userId);
  }

  /// 获取用户ID
  String? getUserId() {
    return getString(AppConstants.keyUserId);
  }

  /// 保存登录状态
  Future<bool> setLoggedIn(bool isLoggedIn) {
    return setBool(AppConstants.keyIsLoggedIn, isLoggedIn);
  }

  /// 获取登录状态
  bool isLoggedIn() {
    return getBool(AppConstants.keyIsLoggedIn) ?? false;
  }

  /// 保存首次启动标记
  Future<bool> setFirstLaunch(bool isFirst) {
    return setBool(AppConstants.keyIsFirstLaunch, isFirst);
  }

  /// 是否首次启动
  bool isFirstLaunch() {
    return getBool(AppConstants.keyIsFirstLaunch) ?? true;
  }

  /// 保存主题模式
  Future<bool> setThemeMode(String mode) {
    return setString(AppConstants.keyThemeMode, mode);
  }

  /// 获取主题模式
  String? getThemeMode() {
    return getString(AppConstants.keyThemeMode);
  }

  /// 保存语言
  Future<bool> setLanguage(String language) {
    return setString(AppConstants.keyLanguage, language);
  }

  /// 获取语言
  String? getLanguage() {
    return getString(AppConstants.keyLanguage);
  }

  /// 保存钱包连接状态
  Future<bool> setWalletConnected(bool connected) {
    return setBool(AppConstants.keyWalletConnected, connected);
  }

  /// 获取钱包连接状态
  bool isWalletConnected() {
    return getBool(AppConstants.keyWalletConnected) ?? false;
  }

  /// 登出（清除用户相关数据）
  Future<void> logout() async {
    await deleteToken();
    await deleteRefreshToken();
    await deleteWalletAddress();
    await remove(AppConstants.keyUserId);
    await remove(AppConstants.keyUserInfo);
    await setLoggedIn(false);
    await setWalletConnected(false);
  }
}
