import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../../data/models/order_model.dart';
import '../../providers/order_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/animations.dart';
import '../../widgets/custom_dialogs.dart';

/// 我的订单页面
class MyOrdersScreen extends StatefulWidget {
  const MyOrdersScreen({super.key});

  @override
  State<MyOrdersScreen> createState() => _MyOrdersScreenState();
}

class _MyOrdersScreenState extends State<MyOrdersScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<_OrderTab> _tabs = [
    _OrderTab('全部', null),
    _OrderTab('待支付', OrderStatus.pending),
    _OrderTab('处理中', OrderStatus.processing),
    _OrderTab('已完成', OrderStatus.completed),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);

    // 加载订单列表
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = context.read<AuthProvider>();
      if (authProvider.isAuthenticated) {
        context.read<OrderProvider>().loadOrders();
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    // 检查登录状态
    if (!authProvider.isAuthenticated) {
      return Scaffold(
        appBar: AppBar(title: const Text('我的订单')),
        body: EmptyStateWidget(
          icon: Icons.login,
          title: '请先登录',
          message: '登录后查看您的订单',
          actionText: '去登录',
          onAction: () => context.push('/auth/login'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('我的订单'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: false,
          tabs: _tabs.map((tab) {
            return Tab(text: tab.label);
          }).toList(),
        ),
      ),
      body: Consumer<OrderProvider>(
        builder: (context, orderProvider, child) {
          if (orderProvider.isLoading && orderProvider.orders.isEmpty) {
            return const LoadingWidget(message: '加载订单中...');
          }

          if (orderProvider.hasError) {
            return EmptyStateWidget(
              icon: Icons.error_outline,
              title: '加载失败',
              message: orderProvider.error ?? '未知错误',
              actionText: '重试',
              onAction: () => orderProvider.loadOrders(),
            );
          }

          return TabBarView(
            controller: _tabController,
            children: _tabs.map((tab) {
              final orders = tab.status == null
                  ? orderProvider.orders
                  : orderProvider.getOrdersByStatus(tab.status!);

              if (orders.isEmpty) {
                return EmptyStateWidget(
                  icon: Icons.receipt_long,
                  title: '暂无订单',
                  message: _getEmptyMessage(tab.status),
                );
              }

              return RefreshIndicator(
                onRefresh: () => orderProvider.refresh(),
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: orders.length,
                  itemBuilder: (context, index) {
                    return AnimatedListItem(
                      index: index,
                      child: _OrderCard(
                        order: orders[index],
                        onCancel: () => _cancelOrder(context, orders[index]),
                        onPay: () => _payOrder(context, orders[index]),
                        onConfirm: () => _confirmOrder(context, orders[index]),
                      ),
                    );
                  },
                ),
              );
            }).toList(),
          );
        },
      ),
    );
  }

  String _getEmptyMessage(OrderStatus? status) {
    switch (status) {
      case OrderStatus.pending:
        return '您还没有待支付的订单';
      case OrderStatus.processing:
        return '您还没有处理中的订单';
      case OrderStatus.completed:
        return '您还没有已完成的订单';
      default:
        return '您还没有创建任何订单';
    }
  }

  Future<void> _cancelOrder(BuildContext context, OrderModel order) async {
    final confirmed = await showConfirmDialog(
      context,
      title: '取消订单',
      message: '确定要取消这个订单吗？',
      confirmText: '确定取消',
      isDangerous: true,
    );

    if (confirmed && context.mounted) {
      showLoadingDialog(context, message: '取消订单中...');

      final success = await context.read<OrderProvider>().cancelOrder(order.id);

      if (context.mounted) {
        hideLoadingDialog(context);

        if (success) {
          showSuccessDialog(
            context,
            title: '取消成功',
            message: '订单已取消',
          );
        } else {
          showErrorDialog(
            context,
            title: '取消失败',
            message: '取消订单失败，请稍后重试',
          );
        }
      }
    }
  }

  Future<void> _payOrder(BuildContext context, OrderModel order) async {
    final confirmed = await showConfirmDialog(
      context,
      title: '确认支付',
      message: '确定要支付 ${order.totalPrice} ${order.priceUnit} 吗？',
      confirmText: '确认支付',
    );

    if (confirmed && context.mounted) {
      showLoadingDialog(context, message: '支付中...');

      final success = await context.read<OrderProvider>().payOrder(order.id);

      if (context.mounted) {
        hideLoadingDialog(context);

        if (success) {
          showSuccessDialog(
            context,
            title: '支付成功',
            message: 'NFT正在铸造中，请耐心等待',
          );
        } else {
          showErrorDialog(
            context,
            title: '支付失败',
            message: '支付失败，请稍后重试',
          );
        }
      }
    }
  }

  Future<void> _confirmOrder(BuildContext context, OrderModel order) async {
    final confirmed = await showConfirmDialog(
      context,
      title: '确认收货',
      message: '确认已收到NFT资产吗？',
      confirmText: '确认收货',
    );

    if (confirmed && context.mounted) {
      showLoadingDialog(context, message: '确认中...');

      final success =
          await context.read<OrderProvider>().confirmOrder(order.id);

      if (context.mounted) {
        hideLoadingDialog(context);

        if (success) {
          showSuccessDialog(
            context,
            title: '确认成功',
            message: '订单已完成',
          );
        } else {
          showErrorDialog(
            context,
            title: '确认失败',
            message: '确认收货失败，请稍后重试',
          );
        }
      }
    }
  }
}

class _OrderTab {
  final String label;
  final OrderStatus? status;

  _OrderTab(this.label, this.status);
}

class _OrderCard extends StatelessWidget {
  final OrderModel order;
  final VoidCallback? onCancel;
  final VoidCallback? onPay;
  final VoidCallback? onConfirm;

  const _OrderCard({
    required this.order,
    this.onCancel,
    this.onPay,
    this.onConfirm,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 订单头部
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).brightness == Brightness.light
                  ? Colors.grey[100]
                  : Colors.grey[800],
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(12),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '订单编号: ${order.id}',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                _OrderStatusBadge(status: order.status),
              ],
            ),
          ),

          // NFT信息
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    order.nftImage,
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        width: 60,
                        height: 60,
                        color: Colors.grey[300],
                        child: const Icon(Icons.image_not_supported),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        order.nftName,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '数量: ${order.quantity}',
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  '${order.totalPrice} ${order.priceUnit}',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).primaryColor,
                  ),
                ),
              ],
            ),
          ),

          // 订单信息
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                _InfoRow('创建时间', _formatDate(order.createdAt)),
                if (order.transactionHash != null)
                  _InfoRow('交易哈希', _shortenHash(order.transactionHash!)),
                if (order.completedAt != null)
                  _InfoRow('完成时间', _formatDate(order.completedAt!)),
              ],
            ),
          ),

          // 操作按钮
          if (_shouldShowActions(order.status))
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: _buildActions(context, order.status),
              ),
            ),
        ],
      ),
    );
  }

  bool _shouldShowActions(OrderStatus status) {
    return status == OrderStatus.pending || status == OrderStatus.processing;
  }

  List<Widget> _buildActions(BuildContext context, OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return [
          if (onCancel != null)
            TextButton(
              onPressed: onCancel,
              child: const Text('取消订单'),
            ),
          const SizedBox(width: 8),
          if (onPay != null)
            ElevatedButton(
              onPressed: onPay,
              child: const Text('立即支付'),
            ),
        ];

      case OrderStatus.processing:
        return [
          if (onConfirm != null)
            ElevatedButton(
              onPressed: onConfirm,
              child: const Text('确认收货'),
            ),
        ];

      default:
        return [];
    }
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')} '
        '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  String _shortenHash(String hash) {
    if (hash.length <= 12) return hash;
    return '${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}';
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 14),
          ),
        ],
      ),
    );
  }
}

class _OrderStatusBadge extends StatelessWidget {
  final OrderStatus status;

  const _OrderStatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    final config = _getStatusConfig(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: config.color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        config.label,
        style: TextStyle(
          fontSize: 12,
          color: config.color,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  _StatusConfig _getStatusConfig(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return _StatusConfig('待支付', Colors.orange);
      case OrderStatus.processing:
        return _StatusConfig('处理中', Colors.blue);
      case OrderStatus.completed:
        return _StatusConfig('已完成', Colors.green);
      case OrderStatus.cancelled:
        return _StatusConfig('已取消', Colors.grey);
      case OrderStatus.failed:
        return _StatusConfig('失败', Colors.red);
    }
  }
}

class _StatusConfig {
  final String label;
  final Color color;

  _StatusConfig(this.label, this.color);
}
