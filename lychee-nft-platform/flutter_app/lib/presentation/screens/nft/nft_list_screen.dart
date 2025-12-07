import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/nft_provider.dart';
import '../../widgets/nft_card.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/search_bar_widget.dart';
import '../../widgets/filter_bottom_sheet.dart';
import '../../widgets/animations.dart';

/// NFT列表页面
class NftListScreen extends StatefulWidget {
  const NftListScreen({super.key});

  @override
  State<NftListScreen> createState() => _NftListScreenState();
}

class _NftListScreenState extends State<NftListScreen> {
  final TextEditingController _searchController = TextEditingController();
  FilterOptions? _currentFilter;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    // 加载NFT列表
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<NftProvider>().loadNfts();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String query) {
    setState(() {
      _searchQuery = query.toLowerCase();
    });
  }

  void _onFilter(FilterOptions options) {
    setState(() {
      _currentFilter = options;
    });
  }

  List<dynamic> _filterNfts(List<dynamic> nfts) {
    var filtered = nfts;

    // 搜索过滤
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((nft) {
        final name = nft.name?.toLowerCase() ?? '';
        final description = nft.description?.toLowerCase() ?? '';
        return name.contains(_searchQuery) ||
            description.contains(_searchQuery);
      }).toList();
    }

    // 分类过滤
    if (_currentFilter?.category != null) {
      filtered = filtered.where((nft) {
        // TODO: 实现分类过滤逻辑
        return true;
      }).toList();
    }

    // 价格过滤
    if (_currentFilter?.minPrice != null) {
      filtered = filtered.where((nft) {
        return nft.price >= (_currentFilter!.minPrice ?? 0);
      }).toList();
    }

    if (_currentFilter?.maxPrice != null) {
      filtered = filtered.where((nft) {
        return nft.price <= (_currentFilter!.maxPrice ?? double.infinity);
      }).toList();
    }

    // 排序
    if (_currentFilter?.sortBy != null) {
      switch (_currentFilter!.sortBy) {
        case '价格从低到高':
          filtered.sort((a, b) => a.price.compareTo(b.price));
          break;
        case '价格从高到低':
          filtered.sort((a, b) => b.price.compareTo(a.price));
          break;
        case '最新发布':
          // TODO: 实现按时间排序
          break;
      }
    }

    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('NFT市场'),
        elevation: 0,
      ),
      body: Column(
        children: [
          // 搜索和筛选栏
          Container(
            padding: const EdgeInsets.all(16),
            color: Theme.of(context).appBarTheme.backgroundColor,
            child: FadeInAnimation(
              child: Row(
                children: [
                  Expanded(
                    child: SearchBarWidget(
                      controller: _searchController,
                      onChanged: _onSearch,
                      hintText: '搜索NFT名称或描述...',
                    ),
                  ),
                  const SizedBox(width: 12),
                  ScaleAnimation(
                    delay: const Duration(milliseconds: 200),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: IconButton(
                        icon: Stack(
                          children: [
                            const Icon(Icons.filter_list, color: Colors.white),
                            if (_currentFilter != null)
                              Positioned(
                                right: 0,
                                top: 0,
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.red,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        onPressed: () {
                          showFilterBottomSheet(
                            context,
                            initialOptions: _currentFilter,
                            onApply: _onFilter,
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // NFT列表
          Expanded(
            child: Consumer<NftProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading && provider.nfts.isEmpty) {
                  return const LoadingWidget(message: '加载NFT中...');
                }

                if (provider.hasError) {
                  return EmptyStateWidget(
                    icon: Icons.error_outline,
                    title: '加载失败',
                    message: provider.error ?? '未知错误',
                    actionText: '重试',
                    onAction: () => provider.loadNfts(),
                  );
                }

                final filteredNfts = _filterNfts(provider.nfts);

                if (filteredNfts.isEmpty) {
                  return EmptyStateWidget(
                    icon: Icons.search_off,
                    title: '未找到NFT',
                    message: _searchQuery.isNotEmpty
                        ? '没有找到"$_searchQuery"相关的NFT'
                        : '当前没有可用的NFT',
                    actionText: _searchQuery.isNotEmpty ? '清除搜索' : null,
                    onAction: _searchQuery.isNotEmpty
                        ? () {
                            _searchController.clear();
                            _onSearch('');
                          }
                        : null,
                  );
                }

                return RefreshIndicator(
                  onRefresh: () => provider.refresh(),
                  child: GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.7,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: filteredNfts.length,
                    itemBuilder: (context, index) {
                      final nft = filteredNfts[index];
                      return AnimatedListItem(
                        index: index,
                        child: NftCard(nft: nft),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
