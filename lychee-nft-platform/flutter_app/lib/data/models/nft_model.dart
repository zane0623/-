/// NFT数据模型
class NftModel {
  final String id;
  final String name;
  final String description;
  final String imageUrl;
  final double price;
  final String priceUnit; // ETH, BNB等
  final String category;
  final int totalSupply;
  final int availableSupply;
  final String contractAddress;
  final String creator;
  final String creatorAvatar;
  final DateTime createdAt;
  final DateTime? harvestDate; // 收获日期（荔枝特有）
  final String? origin; // 产地
  final Map<String, dynamic>? metadata; // 其他元数据
  final List<String>? images; // 多图
  final bool isFeatured; // 是否推荐
  final bool isActive; // 是否可售

  const NftModel({
    required this.id,
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.price,
    this.priceUnit = 'ETH',
    required this.category,
    required this.totalSupply,
    required this.availableSupply,
    required this.contractAddress,
    required this.creator,
    required this.creatorAvatar,
    required this.createdAt,
    this.harvestDate,
    this.origin,
    this.metadata,
    this.images,
    this.isFeatured = false,
    this.isActive = true,
  });

  /// 是否已售罄
  bool get isSoldOut => availableSupply <= 0;

  /// 售出百分比
  double get soldPercentage =>
      ((totalSupply - availableSupply) / totalSupply * 100);

  /// 从JSON创建
  factory NftModel.fromJson(Map<String, dynamic> json) {
    return NftModel(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String,
      price: (json['price'] as num).toDouble(),
      priceUnit: json['priceUnit'] as String? ?? 'ETH',
      category: json['category'] as String,
      totalSupply: json['totalSupply'] as int,
      availableSupply: json['availableSupply'] as int,
      contractAddress: json['contractAddress'] as String,
      creator: json['creator'] as String,
      creatorAvatar: json['creatorAvatar'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      harvestDate: json['harvestDate'] != null
          ? DateTime.parse(json['harvestDate'] as String)
          : null,
      origin: json['origin'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      images:
          (json['images'] as List<dynamic>?)?.map((e) => e as String).toList(),
      isFeatured: json['isFeatured'] as bool? ?? false,
      isActive: json['isActive'] as bool? ?? true,
    );
  }

  /// 转换为JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'imageUrl': imageUrl,
      'price': price,
      'priceUnit': priceUnit,
      'category': category,
      'totalSupply': totalSupply,
      'availableSupply': availableSupply,
      'contractAddress': contractAddress,
      'creator': creator,
      'creatorAvatar': creatorAvatar,
      'createdAt': createdAt.toIso8601String(),
      'harvestDate': harvestDate?.toIso8601String(),
      'origin': origin,
      'metadata': metadata,
      'images': images,
      'isFeatured': isFeatured,
      'isActive': isActive,
    };
  }

  /// 复制并修改
  NftModel copyWith({
    String? id,
    String? name,
    String? description,
    String? imageUrl,
    double? price,
    String? priceUnit,
    String? category,
    int? totalSupply,
    int? availableSupply,
    String? contractAddress,
    String? creator,
    String? creatorAvatar,
    DateTime? createdAt,
    DateTime? harvestDate,
    String? origin,
    Map<String, dynamic>? metadata,
    List<String>? images,
    bool? isFeatured,
    bool? isActive,
  }) {
    return NftModel(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      price: price ?? this.price,
      priceUnit: priceUnit ?? this.priceUnit,
      category: category ?? this.category,
      totalSupply: totalSupply ?? this.totalSupply,
      availableSupply: availableSupply ?? this.availableSupply,
      contractAddress: contractAddress ?? this.contractAddress,
      creator: creator ?? this.creator,
      creatorAvatar: creatorAvatar ?? this.creatorAvatar,
      createdAt: createdAt ?? this.createdAt,
      harvestDate: harvestDate ?? this.harvestDate,
      origin: origin ?? this.origin,
      metadata: metadata ?? this.metadata,
      images: images ?? this.images,
      isFeatured: isFeatured ?? this.isFeatured,
      isActive: isActive ?? this.isActive,
    );
  }
}
