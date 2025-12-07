/// 用户数据模型
class UserModel {
  final String id;
  final String username;
  final String? email;
  final String? phone;
  final String? avatar;
  final String? walletAddress;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final bool isVerified;
  final Map<String, dynamic>? metadata;

  const UserModel({
    required this.id,
    required this.username,
    this.email,
    this.phone,
    this.avatar,
    this.walletAddress,
    required this.createdAt,
    this.updatedAt,
    this.isVerified = false,
    this.metadata,
  });

  /// 是否已连接钱包
  bool get hasWallet => walletAddress != null && walletAddress!.isNotEmpty;

  /// 显示名称
  String get displayName => username;

  /// 从JSON创建
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      username: json['username'] as String,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      avatar: json['avatar'] as String?,
      walletAddress: json['walletAddress'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
      isVerified: json['isVerified'] as bool? ?? false,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  /// 转换为JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'phone': phone,
      'avatar': avatar,
      'walletAddress': walletAddress,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'isVerified': isVerified,
      'metadata': metadata,
    };
  }

  /// 复制并修改
  UserModel copyWith({
    String? id,
    String? username,
    String? email,
    String? phone,
    String? avatar,
    String? walletAddress,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isVerified,
    Map<String, dynamic>? metadata,
  }) {
    return UserModel(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatar: avatar ?? this.avatar,
      walletAddress: walletAddress ?? this.walletAddress,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isVerified: isVerified ?? this.isVerified,
      metadata: metadata ?? this.metadata,
    );
  }
}
