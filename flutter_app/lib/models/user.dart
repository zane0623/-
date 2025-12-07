class User {
  final String id;
  final String? email;
  final String? phone;
  final String username;
  final String? fullName;
  final String? avatarUrl;
  final String? walletAddress;
  final String role;
  final String status;
  final DateTime createdAt;

  User({
    required this.id,
    this.email,
    this.phone,
    required this.username,
    this.fullName,
    this.avatarUrl,
    this.walletAddress,
    this.role = 'USER',
    this.status = 'ACTIVE',
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'],
      phone: json['phone'],
      username: json['username'] ?? '',
      fullName: json['full_name'],
      avatarUrl: json['avatar_url'] ?? json['avatar'],
      walletAddress: json['wallet_address'],
      role: json['role'] ?? 'USER',
      status: json['status'] ?? 'ACTIVE',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'phone': phone,
      'username': username,
      'full_name': fullName,
      'avatar_url': avatarUrl,
      'wallet_address': walletAddress,
      'role': role,
      'status': status,
      'created_at': createdAt.toIso8601String(),
    };
  }

  String get displayName => fullName ?? username;
  
  String get avatar => avatarUrl ?? 
      'https://ui-avatars.com/api/?name=${Uri.encodeComponent(username)}&background=10b981&color=fff';
}


