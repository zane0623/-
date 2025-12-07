import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/nft_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/nft_card.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/animations.dart';

/// 首页
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // 加载推荐NFT
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<NftProvider>().loadNfts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: FadeInAnimation(
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.agriculture,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              const Text('钜园农业NFT'),
            ],
          ),
        ),
        actions: [
          // 搜索按钮
          ScaleAnimation(
            delay: const Duration(milliseconds: 100),
            child: IconButton(
              icon: const Icon(Icons.search),
              onPressed: () => context.push('/nft/list'),
            ),
          ),
          // 通知按钮
          ScaleAnimation(
            delay: const Duration(milliseconds: 200),
            child: IconButton(
              icon: Stack(
                children: [
                  const Icon(Icons.notifications_outlined),
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
                // TODO: 打开通知页面
              },
            ),
          ),
          // 个人中心按钮
          ScaleAnimation(
            delay: const Duration(milliseconds: 300),
            child: IconButton(
              icon: CircleAvatar(
                radius: 16,
                backgroundColor: Theme.of(context).primaryColor,
                child: authProvider.isAuthenticated && authProvider.user != null
                    ? Text(
                        authProvider.user!.username
                            .substring(0, 1)
                            .toUpperCase(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      )
                    : const Icon(
                        Icons.person,
                        color: Colors.white,
                        size: 16,
                      ),
              ),
              onPressed: () => context.push('/profile'),
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => context.read<NftProvider>().refresh(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Banner轮播图
            FadeInAnimation(
              child: _BannerCarousel(),
            ),
            const SizedBox(height: 24),

            // 快速入口
            SlideInAnimation(
              delay: const Duration(milliseconds: 200),
              child: _QuickActions(),
            ),
            const SizedBox(height: 24),

            // 热门NFT标题
            SlideInAnimation(
              delay: const Duration(milliseconds: 300),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '🔥 热门推荐',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () => context.push('/nft/list'),
                    child: const Text('查看更多 →'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 热门NFT列表
            Consumer<NftProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading && provider.nfts.isEmpty) {
                  return const LoadingWidget(message: '加载中...');
                }

                final displayNfts = provider.nfts.take(4).toList();

                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.7,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  itemCount: displayNfts.length,
                  itemBuilder: (context, index) {
                    return AnimatedListItem(
                      index: index,
                      child: NftCard(nft: displayNfts[index]),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

/// Banner轮播图
class _BannerCarousel extends StatefulWidget {
  @override
  State<_BannerCarousel> createState() => _BannerCarouselState();
}

class _BannerCarouselState extends State<_BannerCarousel> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<_BannerData> _banners = [
    _BannerData(
      title: '恐龙蛋荔枝 NFT',
      subtitle: '正宗徐闻品质保证',
      image: 'https://picsum.photos/800/400?random=1',
      color: Colors.green,
    ),
    _BannerData(
      title: '限时预售中',
      subtitle: '早鸟优惠 8折起',
      image: 'https://picsum.photos/800/400?random=2',
      color: Colors.orange,
    ),
    _BannerData(
      title: '区块链溯源',
      subtitle: '每一颗都有身份证',
      image: 'https://picsum.photos/800/400?random=3',
      color: Colors.blue,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 180,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemCount: _banners.length,
            itemBuilder: (context, index) {
              final banner = _banners[index];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: LinearGradient(
                    colors: [
                      banner.color.withOpacity(0.8),
                      banner.color,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Stack(
                  children: [
                    // 背景图片
                    Positioned.fill(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.network(
                          banner.image,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(color: banner.color);
                          },
                        ),
                      ),
                    ),
                    // 渐变遮罩
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          gradient: LinearGradient(
                            colors: [
                              Colors.black.withOpacity(0.6),
                              Colors.transparent,
                            ],
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                          ),
                        ),
                      ),
                    ),
                    // 文字内容
                    Positioned(
                      left: 20,
                      bottom: 20,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            banner.title,
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            banner.subtitle,
                            style: const TextStyle(
                              fontSize: 16,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 12),
        // 指示器
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            _banners.length,
            (index) => Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: _currentPage == index ? 24 : 8,
              height: 8,
              decoration: BoxDecoration(
                color: _currentPage == index
                    ? Theme.of(context).primaryColor
                    : Colors.grey[300],
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _BannerData {
  final String title;
  final String subtitle;
  final String image;
  final Color color;

  _BannerData({
    required this.title,
    required this.subtitle,
    required this.image,
    required this.color,
  });
}

/// 快速入口
class _QuickActions extends StatelessWidget {
  final List<_QuickAction> _actions = [
    _QuickAction(Icons.shopping_bag, 'NFT市场', '/nft/list', Colors.blue),
    _QuickAction(
        Icons.account_balance_wallet, '我的钱包', '/wallet/connect', Colors.green),
    _QuickAction(Icons.receipt_long, '我的订单', '/profile/orders', Colors.orange),
    _QuickAction(Icons.image, '我的NFT', '/profile/nfts', Colors.purple),
  ];

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(
        _actions.length,
        (index) {
          final action = _actions[index];
          return Expanded(
            child: ScaleAnimation(
              delay: Duration(milliseconds: 100 * index),
              child: RippleAnimation(
                onTap: () => context.push(action.route),
                child: Column(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: action.color.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(
                        action.icon,
                        color: action.color,
                        size: 28,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      action.label,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _QuickAction {
  final IconData icon;
  final String label;
  final String route;
  final Color color;

  _QuickAction(this.icon, this.label, this.route, this.color);
}
