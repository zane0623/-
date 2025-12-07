import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../../config/routes.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/loading_widget.dart';

class MyNftsScreen extends StatefulWidget {
  const MyNftsScreen({super.key});

  @override
  State<MyNftsScreen> createState() => _MyNftsScreenState();
}

class _MyNftsScreenState extends State<MyNftsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadMyNfts();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadMyNfts() async {
    setState(() => _isLoading = true);
    // TODO: 调用API加载我的NFT
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    if (!authProvider.isAuthenticated) {
      return Scaffold(
        appBar: AppBar(title: const Text('我的NFT')),
        body: EmptyStateWidget(
          icon: Icons.account_circle_outlined,
          title: '请先登录',
          message: '登录后可以查看您拥有的NFT',
          actionText: '去登录',
          onAction: () => context.push(RoutePaths.login),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('我的NFT'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: '全部'),
            Tab(text: '持有中'),
            Tab(text: '预售中'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildNftList('all'),
          _buildNftList('holding'),
          _buildNftList('presale'),
        ],
      ),
    );
  }

  Widget _buildNftList(String type) {
    if (_isLoading) {
      return const ListLoadingSkeleton();
    }

    // 模拟空数据
    return EmptyStateWidget(
      icon: Icons.inventory_2_outlined,
      title: '暂无NFT',
      message: type == 'all'
          ? '您还没有购买任何NFT'
          : type == 'holding'
              ? '您还没有持有的NFT'
              : '您还没有参与预售的NFT',
      actionText: '去市场看看',
      onAction: () => context.push(RoutePaths.nftList),
    );

    // TODO: 当有数据时显示NFT列表
    /* return RefreshIndicator(
      onRefresh: _loadMyNfts,
      child: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: myNfts.length,
        itemBuilder: (context, index) {
          return NftCard(
            nft: myNfts[index],
            onTap: () => context.push(RoutePaths.getNftDetailPath(myNfts[index].id)),
          );
        },
      ),
    ); */
  }
}
