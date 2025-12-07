class NFT {
  final String id;
  final String tokenId;
  final String userId;
  final String presaleId;
  final String contractAddress;
  final String tokenUri;
  final Map<String, dynamic> metadata;
  final String status;
  final bool redeemed;
  final DateTime createdAt;

  NFT({
    required this.id,
    required this.tokenId,
    required this.userId,
    required this.presaleId,
    required this.contractAddress,
    required this.tokenUri,
    this.metadata = const {},
    required this.status,
    this.redeemed = false,
    required this.createdAt,
  });

  factory NFT.fromJson(Map<String, dynamic> json) {
    return NFT(
      id: json['id'] ?? '',
      tokenId: json['token_id'] ?? '',
      userId: json['user_id'] ?? '',
      presaleId: json['presale_id'] ?? '',
      contractAddress: json['contract_address'] ?? '',
      tokenUri: json['token_uri'] ?? '',
      metadata: json['metadata'] ?? {},
      status: json['status'] ?? 'ACTIVE',
      redeemed: json['redeemed'] ?? false,
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'token_id': tokenId,
      'user_id': userId,
      'presale_id': presaleId,
      'contract_address': contractAddress,
      'token_uri': tokenUri,
      'metadata': metadata,
      'status': status,
      'redeemed': redeemed,
      'created_at': createdAt.toIso8601String(),
    };
  }

  String? get name => metadata['name'];
  String? get description => metadata['description'];
  String? get image => metadata['image'];
}


