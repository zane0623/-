import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../../config/routes.dart';
import '../../../config/theme.dart';
import '../../../data/models/nft_model.dart';
import '../../providers/nft_provider.dart';
import '../../widgets/loading_widget.dart';

class NftDetailScreen extends StatefulWidget {
  final String nftId;

  const NftDetailScreen({super.key, required this.nftId});

  @override
  State<NftDetailScreen> createState() => _NftDetailScreenState();
}

class _NftDetailScreenState extends State<NftDetailScreen> {
  NftModel? _nft;
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    _loadDetail();
  }

  Future<void> _loadDetail() async {
    final nft = await context.read<NftProvider>().getNftDetail(widget.nftId);
    if (mounted) {
      setState(() => _nft = nft);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_nft == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('NFT详情')),
        body: const LoadingWidget(message: '加载中...'),
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: CachedNetworkImage(
                imageUrl: _nft!.imageUrl,
                fit: BoxFit.cover,
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_nft!.name,
                      style: const TextStyle(
                          fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(_nft!.category,
                      style: const TextStyle(color: Colors.grey)),
                  const SizedBox(height: 16),
                  _buildPriceCard(),
                  const SizedBox(height: 16),
                  _buildInfoSection(),
                  const SizedBox(height: 16),
                  const Text('描述',
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(_nft!.description),
                  const SizedBox(height: 100), // 为底部按钮留空间
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildPriceCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('价格', style: TextStyle(color: Colors.grey)),
                Text('${_nft!.price} ${_nft!.priceUnit}',
                    style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primaryGreen)),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Text('库存', style: TextStyle(color: Colors.grey)),
                Text('${_nft!.availableSupply}/${_nft!.totalSupply}',
                    style: const TextStyle(fontSize: 16)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('详细信息',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const Divider(),
            _buildInfoRow('产地', _nft!.origin ?? '未知'),
            _buildInfoRow('创建者', _nft!.creator),
            _buildInfoRow(
                '合约地址', '${_nft!.contractAddress.substring(0, 10)}...'),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value),
        ],
      ),
    );
  }

  Widget _buildBottomBar() {
    return SafeArea(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          boxShadow: [
            BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, -2))
          ],
        ),
        child: Row(
          children: [
            _buildQuantitySelector(),
            const SizedBox(width: 16),
            Expanded(
              child: ElevatedButton(
                onPressed: _nft!.isSoldOut ? null : _handleBuy,
                child: Text(_nft!.isSoldOut ? '已售罄' : '立即购买'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuantitySelector() {
    return Row(
      children: [
        IconButton(
          icon: const Icon(Icons.remove_circle_outline),
          onPressed: _quantity > 1 ? () => setState(() => _quantity--) : null,
        ),
        Text('$_quantity', style: const TextStyle(fontSize: 18)),
        IconButton(
          icon: const Icon(Icons.add_circle_outline),
          onPressed: _quantity < _nft!.availableSupply
              ? () => setState(() => _quantity++)
              : null,
        ),
      ],
    );
  }

  void _handleBuy() {
    context.push(
        '${RoutePaths.orderConfirmation}?nftId=${_nft!.id}&quantity=$_quantity');
  }
}
