class Order {
  final String id;
  final String orderNumber;
  final String userId;
  final String presaleId;
  final Map<String, dynamic> productInfo;
  final Map<String, dynamic> amountInfo;
  final Map<String, dynamic> shippingInfo;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  Order({
    required this.id,
    required this.orderNumber,
    required this.userId,
    required this.presaleId,
    this.productInfo = const {},
    this.amountInfo = const {},
    this.shippingInfo = const {},
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] ?? '',
      orderNumber: json['order_number'] ?? '',
      userId: json['user_id'] ?? '',
      presaleId: json['presale_id'] ?? '',
      productInfo: json['product_info'] ?? {},
      amountInfo: json['amount_info'] ?? {},
      shippingInfo: json['shipping_info'] ?? {},
      status: json['status'] ?? 'PENDING',
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updated_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_number': orderNumber,
      'user_id': userId,
      'presale_id': presaleId,
      'product_info': productInfo,
      'amount_info': amountInfo,
      'shipping_info': shippingInfo,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  String get statusText {
    switch (status) {
      case 'PENDING':
        return '待支付';
      case 'PAID':
        return '已支付';
      case 'CONFIRMED':
        return '已确认';
      case 'SHIPPED':
        return '已发货';
      case 'DELIVERED':
        return '已送达';
      case 'COMPLETED':
        return '已完成';
      case 'CANCELLED':
        return '已取消';
      default:
        return status;
    }
  }

  double get totalAmount => (amountInfo['total'] ?? 0).toDouble();
}


