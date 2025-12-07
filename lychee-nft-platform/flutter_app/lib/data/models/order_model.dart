/// 订单状态
enum OrderStatus {
  pending, // 待支付
  processing, // 处理中
  completed, // 已完成
  cancelled, // 已取消
  failed, // 失败
}

/// 订单数据模型
class OrderModel {
  final String id;
  final String userId;
  final String nftId;
  final String nftName;
  final String nftImage;
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final String priceUnit;
  final OrderStatus status;
  final String? transactionHash;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final DateTime? completedAt;
  final Map<String, dynamic>? metadata;

  const OrderModel({
    required this.id,
    required this.userId,
    required this.nftId,
    required this.nftName,
    required this.nftImage,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    required this.priceUnit,
    required this.status,
    this.transactionHash,
    required this.createdAt,
    this.updatedAt,
    this.completedAt,
    this.metadata,
  });

  /// 是否可以取消
  bool get canCancel => status == OrderStatus.pending;

  /// 状态显示文本
  String get statusText {
    switch (status) {
      case OrderStatus.pending:
        return '待支付';
      case OrderStatus.processing:
        return '处理中';
      case OrderStatus.completed:
        return '已完成';
      case OrderStatus.cancelled:
        return '已取消';
      case OrderStatus.failed:
        return '失败';
    }
  }

  /// 从JSON创建
  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      nftId: json['nftId'] as String,
      nftName: json['nftName'] as String,
      nftImage: json['nftImage'] as String,
      quantity: json['quantity'] as int,
      unitPrice: (json['unitPrice'] as num).toDouble(),
      totalPrice: (json['totalPrice'] as num).toDouble(),
      priceUnit: json['priceUnit'] as String,
      status: OrderStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => OrderStatus.pending,
      ),
      transactionHash: json['transactionHash'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
      completedAt: json['completedAt'] != null
          ? DateTime.parse(json['completedAt'] as String)
          : null,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  /// 转换为JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'nftId': nftId,
      'nftName': nftName,
      'nftImage': nftImage,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'totalPrice': totalPrice,
      'priceUnit': priceUnit,
      'status': status.name,
      'transactionHash': transactionHash,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
      'metadata': metadata,
    };
  }

  /// 复制并修改
  OrderModel copyWith({
    String? id,
    String? userId,
    String? nftId,
    String? nftName,
    String? nftImage,
    int? quantity,
    double? unitPrice,
    double? totalPrice,
    String? priceUnit,
    OrderStatus? status,
    String? transactionHash,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? completedAt,
    Map<String, dynamic>? metadata,
  }) {
    return OrderModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      nftId: nftId ?? this.nftId,
      nftName: nftName ?? this.nftName,
      nftImage: nftImage ?? this.nftImage,
      quantity: quantity ?? this.quantity,
      unitPrice: unitPrice ?? this.unitPrice,
      totalPrice: totalPrice ?? this.totalPrice,
      priceUnit: priceUnit ?? this.priceUnit,
      status: status ?? this.status,
      transactionHash: transactionHash ?? this.transactionHash,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      completedAt: completedAt ?? this.completedAt,
      metadata: metadata ?? this.metadata,
    );
  }
}
