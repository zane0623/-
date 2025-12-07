import 'package:flutter/material.dart';
import '../../data/models/nft_model.dart';
import '../../main.dart' show logger;

/// NFT加载状态
enum NftLoadingState {
  initial,
  loading,
  loaded,
  error,
}

/// NFT Provider
class NftProvider extends ChangeNotifier {
  NftLoadingState _state = NftLoadingState.initial;
  List<NftModel> _nfts = [];
  List<NftModel> _featuredNfts = [];
  NftModel? _selectedNft;
  String? _error;
  String? _selectedCategory;

  NftLoadingState get state => _state;
  List<NftModel> get nfts => _nfts;
  List<NftModel> get featuredNfts => _featuredNfts;
  NftModel? get selectedNft => _selectedNft;
  String? get error => _error;
  String? get selectedCategory => _selectedCategory;

  bool get isLoading => _state == NftLoadingState.loading;
  bool get hasError => _state == NftLoadingState.error;

  /// 加载NFT列表
  Future<void> loadNfts({String? category}) async {
    try {
      _state = NftLoadingState.loading;
      _selectedCategory = category;
      _error = null;
      notifyListeners();

      logger.i('加载NFT列表, category: $category');

      // TODO: 调用API获取NFT列表
      await Future.delayed(const Duration(seconds: 1));

      // 模拟数据
      _nfts = _generateMockNfts();

      // 筛选分类
      if (category != null && category.isNotEmpty) {
        _nfts = _nfts.where((nft) => nft.category == category).toList();
      }

      _state = NftLoadingState.loaded;
      logger.i('NFT列表加载成功, 数量: ${_nfts.length}');
      notifyListeners();
    } catch (e) {
      logger.e('加载NFT列表失败', error: e);
      _error = e.toString();
      _state = NftLoadingState.error;
      notifyListeners();
    }
  }

  /// 加载推荐NFT
  Future<void> loadFeaturedNfts() async {
    try {
      logger.i('加载推荐NFT');

      // TODO: 调用API获取推荐NFT
      await Future.delayed(const Duration(milliseconds: 500));

      _featuredNfts =
          _generateMockNfts().where((nft) => nft.isFeatured).take(5).toList();

      logger.i('推荐NFT加载成功, 数量: ${_featuredNfts.length}');
      notifyListeners();
    } catch (e) {
      logger.e('加载推荐NFT失败', error: e);
    }
  }

  /// 获取NFT详情
  Future<NftModel?> getNftDetail(String nftId) async {
    try {
      logger.i('获取NFT详情: $nftId');

      // TODO: 调用API获取详情
      await Future.delayed(const Duration(milliseconds: 500));

      _selectedNft = _nfts.firstWhere(
        (nft) => nft.id == nftId,
        orElse: () => _generateMockNfts().first,
      );

      notifyListeners();
      return _selectedNft;
    } catch (e) {
      logger.e('获取NFT详情失败', error: e);
      return null;
    }
  }

  /// 搜索NFT
  List<NftModel> searchNfts(String query) {
    if (query.isEmpty) return _nfts;

    return _nfts.where((nft) {
      return nft.name.toLowerCase().contains(query.toLowerCase()) ||
          nft.description.toLowerCase().contains(query.toLowerCase()) ||
          nft.category.toLowerCase().contains(query.toLowerCase());
    }).toList();
  }

  /// 按类别筛选
  void filterByCategory(String? category) {
    _selectedCategory = category;
    loadNfts(category: category);
  }

  /// 刷新
  Future<void> refresh() async {
    await Future.wait([
      loadNfts(category: _selectedCategory),
      loadFeaturedNfts(),
    ]);
  }

  /// 生成模拟数据
  List<NftModel> _generateMockNfts() {
    return List.generate(20, (index) {
      final categories = ['恐龙蛋荔枝', '桂味荔枝', '糯米糍', '妃子笑'];
      final category = categories[index % categories.length];

      return NftModel(
        id: 'nft_${index + 1}',
        name: '$category #${index + 1}',
        description: '来自岭南的优质荔枝，采用区块链技术确保品质可追溯。'
            '每一颗荔枝都经过精心挑选，保证新鲜度和口感。',
        imageUrl: 'https://picsum.photos/400/400?random=$index',
        price: 0.1 + (index * 0.05),
        priceUnit: 'ETH',
        category: category,
        totalSupply: 100,
        availableSupply: 100 - (index * 3),
        contractAddress: '0x${index.toString().padLeft(40, '0')}',
        creator: '钜园农业',
        creatorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JY',
        createdAt: DateTime.now().subtract(Duration(days: index)),
        harvestDate: DateTime.now().add(Duration(days: 30 + index)),
        origin: '广东省茂名市',
        images: List.generate(
          3,
          (i) => 'https://picsum.photos/400/400?random=${index}_$i',
        ),
        isFeatured: index < 5,
        isActive: true,
      );
    });
  }
}
