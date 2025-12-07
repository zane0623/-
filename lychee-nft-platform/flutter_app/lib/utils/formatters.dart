import 'package:intl/intl.dart';

/// 格式化工具类
class Formatters {
  Formatters._();

  /// 日期格式化器
  static final _dateFormat = DateFormat('yyyy-MM-dd');
  static final _timeFormat = DateFormat('HH:mm:ss');
  static final _dateTimeFormat = DateFormat('yyyy-MM-dd HH:mm:ss');
  static final _shortDateTimeFormat = DateFormat('MM-dd HH:mm');

  /// 货币格式化器（人民币）
  static final _currencyFormat = NumberFormat.currency(
    locale: 'zh_CN',
    symbol: '¥',
    decimalDigits: 2,
  );

  /// 数字格式化器
  static final _numberFormat = NumberFormat('#,##0.##', 'zh_CN');

  /// 格式化日期
  static String formatDate(DateTime? dateTime) {
    if (dateTime == null) return '--';
    return _dateFormat.format(dateTime);
  }

  /// 格式化时间
  static String formatTime(DateTime? dateTime) {
    if (dateTime == null) return '--';
    return _timeFormat.format(dateTime);
  }

  /// 格式化日期时间
  static String formatDateTime(DateTime? dateTime) {
    if (dateTime == null) return '--';
    return _dateTimeFormat.format(dateTime);
  }

  /// 格式化短日期时间（MM-dd HH:mm）
  static String formatShortDateTime(DateTime? dateTime) {
    if (dateTime == null) return '--';
    return _shortDateTimeFormat.format(dateTime);
  }

  /// 格式化相对时间（如：刚刚、5分钟前、昨天）
  static String formatRelativeTime(DateTime? dateTime) {
    if (dateTime == null) return '--';

    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inSeconds < 60) {
      return '刚刚';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}分钟前';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}小时前';
    } else if (difference.inDays == 1) {
      return '昨天';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}天前';
    } else {
      return formatDate(dateTime);
    }
  }

  /// 格式化货币（人民币）
  static String formatCurrency(num? amount) {
    if (amount == null) return '¥0.00';
    return _currencyFormat.format(amount);
  }

  /// 格式化数字（添加千分位）
  static String formatNumber(num? number) {
    if (number == null) return '0';
    return _numberFormat.format(number);
  }

  /// 格式化大数字（如：10000 -> 1万）
  static String formatLargeNumber(num? number) {
    if (number == null) return '0';

    if (number >= 100000000) {
      return '${(number / 100000000).toStringAsFixed(1)}亿';
    } else if (number >= 10000) {
      return '${(number / 10000).toStringAsFixed(1)}万';
    } else {
      return number.toString();
    }
  }

  /// 格式化百分比
  static String formatPercentage(num? value, {int decimals = 2}) {
    if (value == null) return '0%';
    return '${(value * 100).toStringAsFixed(decimals)}%';
  }

  /// 格式化手机号（隐藏中间4位）
  static String formatPhone(String? phone) {
    if (phone == null || phone.length != 11) return phone ?? '--';
    return '${phone.substring(0, 3)}****${phone.substring(7)}';
  }

  /// 格式化钱包地址（显示前6位和后4位）
  static String formatWalletAddress(String? address) {
    if (address == null || address.length < 10) return address ?? '--';
    return '${address.substring(0, 6)}...${address.substring(address.length - 4)}';
  }

  /// 格式化文件大小
  static String formatFileSize(int? bytes) {
    if (bytes == null || bytes <= 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    var size = bytes.toDouble();
    var unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return '${size.toStringAsFixed(2)} ${units[unitIndex]}';
  }

  /// 格式化倒计时（秒数转换为 HH:mm:ss）
  static String formatCountdown(int? seconds) {
    if (seconds == null || seconds <= 0) return '00:00:00';

    final hours = seconds ~/ 3600;
    final minutes = (seconds % 3600) ~/ 60;
    final secs = seconds % 60;

    return '${hours.toString().padLeft(2, '0')}:'
        '${minutes.toString().padLeft(2, '0')}:'
        '${secs.toString().padLeft(2, '0')}';
  }

  /// 格式化订单编号（每4位添加一个空格）
  static String formatOrderNo(String? orderNo) {
    if (orderNo == null || orderNo.isEmpty) return '--';

    final result = StringBuffer();
    for (var i = 0; i < orderNo.length; i++) {
      if (i > 0 && i % 4 == 0) {
        result.write(' ');
      }
      result.write(orderNo[i]);
    }
    return result.toString();
  }

  /// 格式化状态文本
  static String formatStatus(String? status) {
    if (status == null || status.isEmpty) return '--';

    const statusMap = {
      'pending': '待处理',
      'paid': '已支付',
      'shipped': '已发货',
      'completed': '已完成',
      'cancelled': '已取消',
      'refunded': '已退款',
      'active': '进行中',
    };

    return statusMap[status] ?? status;
  }

  /// 自定义日期格式
  static String customFormat(DateTime? dateTime, String pattern) {
    if (dateTime == null) return '--';
    return DateFormat(pattern).format(dateTime);
  }
}
