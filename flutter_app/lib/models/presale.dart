class Presale {
  final String id;
  final String presaleNumber;
  final String title;
  final String? subtitle;
  final String description;
  final String? coverImage;
  final List<String> bannerImages;
  final Map<String, dynamic> productInfo;
  final PricingInfo? pricing;
  final InventoryInfo? inventory;
  final Map<String, dynamic> timeline;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  Presale({
    required this.id,
    required this.presaleNumber,
    required this.title,
    this.subtitle,
    required this.description,
    this.coverImage,
    this.bannerImages = const [],
    this.productInfo = const {},
    this.pricing,
    this.inventory,
    this.timeline = const {},
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Presale.fromJson(Map<String, dynamic> json) {
    return Presale(
      id: json['id'] ?? '',
      presaleNumber: json['presale_number'] ?? '',
      title: json['title'] ?? '',
      subtitle: json['subtitle'],
      description: json['description'] ?? '',
      coverImage: json['cover_image'],
      bannerImages: json['banner_images'] != null
          ? List<String>.from(json['banner_images'])
          : [],
      productInfo: json['product_info'] ?? {},
      pricing: json['pricing'] != null
          ? PricingInfo.fromJson(json['pricing'])
          : null,
      inventory: json['inventory'] != null
          ? InventoryInfo.fromJson(json['inventory'])
          : null,
      timeline: json['timeline'] ?? {},
      status: json['status'] ?? 'DRAFT',
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updated_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'presale_number': presaleNumber,
      'title': title,
      'subtitle': subtitle,
      'description': description,
      'cover_image': coverImage,
      'banner_images': bannerImages,
      'product_info': productInfo,
      'pricing': pricing?.toJson(),
      'inventory': inventory?.toJson(),
      'timeline': timeline,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

class PricingInfo {
  final double presalePrice;
  final double? marketPrice;
  final double? depositAmount;

  PricingInfo({
    required this.presalePrice,
    this.marketPrice,
    this.depositAmount,
  });

  factory PricingInfo.fromJson(Map<String, dynamic> json) {
    return PricingInfo(
      presalePrice: (json['presale_price'] ?? 0).toDouble(),
      marketPrice: json['market_price']?.toDouble(),
      depositAmount: json['deposit_amount']?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'presale_price': presalePrice,
      'market_price': marketPrice,
      'deposit_amount': depositAmount,
    };
  }
}

class InventoryInfo {
  final int total;
  final int available;
  final int sold;
  final int reserved;

  InventoryInfo({
    required this.total,
    required this.available,
    this.sold = 0,
    this.reserved = 0,
  });

  factory InventoryInfo.fromJson(Map<String, dynamic> json) {
    return InventoryInfo(
      total: json['total'] ?? 0,
      available: json['available'] ?? 0,
      sold: json['sold'] ?? 0,
      reserved: json['reserved'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'total': total,
      'available': available,
      'sold': sold,
      'reserved': reserved,
    };
  }

  double get soldPercentage => total > 0 ? (sold / total) * 100 : 0;
}


