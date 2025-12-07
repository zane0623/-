/// 表单验证器工具类
class Validators {
  Validators._();

  /// 手机号正则
  static final _phoneRegex = RegExp(r'^1[3-9]\d{9}$');

  /// 邮箱正则
  static final _emailRegex = RegExp(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  );

  /// 密码正则（至少包含字母和数字）
  static final _passwordRegex = RegExp(r'^(?=.*[A-Za-z])(?=.*\d).{6,}$');

  /// 以太坊地址正则
  static final _ethereumAddressRegex = RegExp(r'^0x[a-fA-F0-9]{40}$');

  /// 验证手机号
  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return '请输入手机号';
    }
    if (!_phoneRegex.hasMatch(value)) {
      return '请输入正确的手机号';
    }
    return null;
  }

  /// 验证邮箱
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return '请输入邮箱';
    }
    if (!_emailRegex.hasMatch(value)) {
      return '请输入正确的邮箱格式';
    }
    return null;
  }

  /// 验证密码
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return '请输入密码';
    }
    if (value.length < 6) {
      return '密码长度不能少于6位';
    }
    if (value.length > 20) {
      return '密码长度不能超过20位';
    }
    if (!_passwordRegex.hasMatch(value)) {
      return '密码必须包含字母和数字';
    }
    return null;
  }

  /// 验证确认密码
  static String? validateConfirmPassword(String? value, String? password) {
    if (value == null || value.isEmpty) {
      return '请再次输入密码';
    }
    if (value != password) {
      return '两次输入的密码不一致';
    }
    return null;
  }

  /// 验证用户名
  static String? validateUsername(String? value) {
    if (value == null || value.isEmpty) {
      return '请输入用户名';
    }
    if (value.length < 2) {
      return '用户名长度不能少于2位';
    }
    if (value.length > 20) {
      return '用户名长度不能超过20位';
    }
    return null;
  }

  /// 验证验证码
  static String? validateCode(String? value, {int length = 6}) {
    if (value == null || value.isEmpty) {
      return '请输入验证码';
    }
    if (value.length != length) {
      return '验证码长度应为$length位';
    }
    return null;
  }

  /// 验证必填项
  static String? validateRequired(String? value, {String? fieldName}) {
    if (value == null || value.isEmpty) {
      return '请输入${fieldName ?? '内容'}';
    }
    return null;
  }

  /// 验证数字
  static String? validateNumber(String? value, {String? fieldName}) {
    if (value == null || value.isEmpty) {
      return '请输入${fieldName ?? '数字'}';
    }
    final number = num.tryParse(value);
    if (number == null) {
      return '请输入有效的数字';
    }
    return null;
  }

  /// 验证正整数
  static String? validatePositiveInteger(
    String? value, {
    String? fieldName,
  }) {
    if (value == null || value.isEmpty) {
      return '请输入${fieldName ?? '数量'}';
    }
    final number = int.tryParse(value);
    if (number == null || number <= 0) {
      return '请输入大于0的整数';
    }
    return null;
  }

  /// 验证价格（金额）
  static String? validatePrice(String? value) {
    if (value == null || value.isEmpty) {
      return '请输入价格';
    }
    final price = double.tryParse(value);
    if (price == null || price <= 0) {
      return '请输入有效的价格';
    }
    return null;
  }

  /// 验证以太坊地址
  static String? validateEthereumAddress(String? value) {
    if (value == null || value.isEmpty) {
      return '请输入钱包地址';
    }
    if (!_ethereumAddressRegex.hasMatch(value)) {
      return '请输入正确的以太坊地址格式';
    }
    return null;
  }

  /// 验证最小长度
  static String? validateMinLength(
    String? value,
    int minLength, {
    String? fieldName,
  }) {
    if (value == null || value.isEmpty) {
      return '请输入${fieldName ?? '内容'}';
    }
    if (value.length < minLength) {
      return '${fieldName ?? '内容'}长度不能少于$minLength位';
    }
    return null;
  }

  /// 验证最大长度
  static String? validateMaxLength(
    String? value,
    int maxLength, {
    String? fieldName,
  }) {
    if (value == null || value.isEmpty) {
      return null; // 空值不验证最大长度
    }
    if (value.length > maxLength) {
      return '${fieldName ?? '内容'}长度不能超过$maxLength位';
    }
    return null;
  }

  /// 验证范围
  static String? validateRange(
    String? value,
    num min,
    num max, {
    String? fieldName,
  }) {
    if (value == null || value.isEmpty) {
      return '请输入${fieldName ?? '数值'}';
    }
    final number = num.tryParse(value);
    if (number == null) {
      return '请输入有效的数字';
    }
    if (number < min || number > max) {
      return '${fieldName ?? '数值'}应在$min-$max之间';
    }
    return null;
  }

  /// 组合多个验证器
  static String? combineValidators(
    String? value,
    List<String? Function(String?)> validators,
  ) {
    for (final validator in validators) {
      final error = validator(value);
      if (error != null) {
        return error;
      }
    }
    return null;
  }
}
