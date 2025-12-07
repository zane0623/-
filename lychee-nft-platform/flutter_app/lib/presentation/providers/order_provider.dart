import 'package:flutter/material.dart';
import '../../data/models/order_model.dart';
import '../../data/models/nft_model.dart';
import '../../main.dart' show logger;

/// 订单加载状态
enum OrderLoadingState {
  initial,
  loading,
  loaded,
  error,
}

/// 订单Provider
class OrderProvider extends ChangeNotifier {
  OrderLoadingState _state = OrderLoadingState.initial;
  List<OrderModel> _orders = [];
  OrderModel? _currentOrder;
  String? _error;

  OrderLoadingState get state => _state;
  List<OrderModel> get orders => _orders;
  OrderModel? get currentOrder => _currentOrder;
  String? get error => _error;

  bool get isLoading => _state == OrderLoadingState.loading;
  bool get hasError => _state == OrderLoadingState.error;

  /// 获取各状态订单数量
  int get totalCount => _orders.length;
  int get pendingCount =>
      _orders.where((o) => o.status == OrderStatus.pending).length;
  int get processingCount =>
      _orders.where((o) => o.status == OrderStatus.processing).length;
  int get completedCount =>
      _orders.where((o) => o.status == OrderStatus.completed).length;

  /// 加载订单列表
  Future<void> loadOrders({OrderStatus? status}) async {
    try {
      _state = OrderLoadingState.loading;
      _error = null;
      notifyListeners();

      logger.i('加载订单列表, status: $status');

      // TODO: 调用API获取订单列表
      await Future.delayed(const Duration(seconds: 1));

      // 模拟数据
      _orders = _generateMockOrders();

      // 按状态筛选
      if (status != null) {
        _orders = _orders.where((o) => o.status == status).toList();
      }

      _state = OrderLoadingState.loaded;
      logger.i('订单列表加载成功, 数量: ${_orders.length}');
      notifyListeners();
    } catch (e) {
      logger.e('加载订单列表失败', error: e);
      _error = e.toString();
      _state = OrderLoadingState.error;
      notifyListeners();
    }
  }

  /// 获取订单详情
  Future<OrderModel?> getOrderDetail(String orderId) async {
    try {
      logger.i('获取订单详情: $orderId');

      // TODO: 调用API获取订单详情
      await Future.delayed(const Duration(milliseconds: 500));

      _currentOrder = _orders.firstWhere(
        (o) => o.id == orderId,
        orElse: () => _generateMockOrders().first,
      );

      notifyListeners();
      return _currentOrder;
    } catch (e) {
      logger.e('获取订单详情失败', error: e);
      return null;
    }
  }

  /// 创建订单
  Future<OrderModel?> createOrder({
    required String userId,
    required NftModel nft,
    required int quantity,
  }) async {
    try {
      logger.i('创建订单: NFT=${nft.name}, 数量=$quantity');

      // TODO: 调用API创建订单
      await Future.delayed(const Duration(seconds: 2));

      // 模拟创建订单
      final order = OrderModel(
        id: 'order_${DateTime.now().millisecondsSinceEpoch}',
        userId: userId,
        nftId: nft.id,
        nftName: nft.name,
        nftImage: nft.imageUrl,
        quantity: quantity,
        unitPrice: nft.price,
        totalPrice: nft.price * quantity,
        priceUnit: nft.priceUnit,
        status: OrderStatus.pending,
        createdAt: DateTime.now(),
      );

      _orders.insert(0, order);
      _currentOrder = order;

      logger.i('订单创建成功: ${order.id}');
      notifyListeners();

      return order;
    } catch (e) {
      logger.e('创建订单失败', error: e);
      return null;
    }
  }

  /// 取消订单
  Future<bool> cancelOrder(String orderId) async {
    try {
      logger.i('取消订单: $orderId');

      // TODO: 调用API取消订单
      await Future.delayed(const Duration(seconds: 1));

      final index = _orders.indexWhere((o) => o.id == orderId);
      if (index != -1) {
        _orders[index] = _orders[index].copyWith(
          status: OrderStatus.cancelled,
          updatedAt: DateTime.now(),
        );

        logger.i('订单已取消: $orderId');
        notifyListeners();
        return true;
      }

      return false;
    } catch (e) {
      logger.e('取消订单失败', error: e);
      return false;
    }
  }

  /// 支付订单
  Future<bool> payOrder(String orderId) async {
    try {
      logger.i('支付订单: $orderId');

      // TODO: 调用支付API
      await Future.delayed(const Duration(seconds: 2));

      final index = _orders.indexWhere((o) => o.id == orderId);
      if (index != -1) {
        _orders[index] = _orders[index].copyWith(
          status: OrderStatus.processing,
          updatedAt: DateTime.now(),
          transactionHash:
              '0x${DateTime.now().millisecondsSinceEpoch.toRadixString(16)}',
        );

        logger.i('订单支付成功: $orderId');
        notifyListeners();
        return true;
      }

      return false;
    } catch (e) {
      logger.e('订单支付失败', error: e);
      return false;
    }
  }

  /// 确认收货
  Future<bool> confirmOrder(String orderId) async {
    try {
      logger.i('确认收货: $orderId');

      // TODO: 调用API确认收货
      await Future.delayed(const Duration(seconds: 1));

      final index = _orders.indexWhere((o) => o.id == orderId);
      if (index != -1) {
        _orders[index] = _orders[index].copyWith(
          status: OrderStatus.completed,
          updatedAt: DateTime.now(),
          completedAt: DateTime.now(),
        );

        logger.i('订单已完成: $orderId');
        notifyListeners();
        return true;
      }

      return false;
    } catch (e) {
      logger.e('确认收货失败', error: e);
      return false;
    }
  }

  /// 刷新订单列表
  Future<void> refresh() async {
    await loadOrders();
  }

  /// 按状态筛选订单
  List<OrderModel> getOrdersByStatus(OrderStatus status) {
    return _orders.where((o) => o.status == status).toList();
  }

  /// 生成模拟订单数据
  List<OrderModel> _generateMockOrders() {
    final statuses = [
      OrderStatus.pending,
      OrderStatus.processing,
      OrderStatus.completed,
      OrderStatus.cancelled,
    ];

    return List.generate(10, (index) {
      final status = statuses[index % statuses.length];
      final createdAt = DateTime.now().subtract(Duration(days: index));

      return OrderModel(
        id: 'order_${1000 + index}',
        userId: 'user_1',
        nftId: 'nft_${index + 1}',
        nftName: '恐龙蛋荔枝 #${index + 1}',
        nftImage: 'https://picsum.photos/400/400?random=$index',
        quantity: (index % 3) + 1,
        unitPrice: 0.1 + (index * 0.05),
        totalPrice: (0.1 + (index * 0.05)) * ((index % 3) + 1),
        priceUnit: 'ETH',
        status: status,
        transactionHash:
            status != OrderStatus.pending && status != OrderStatus.cancelled
                ? '0x${index.toString().padLeft(40, '0')}'
                : null,
        createdAt: createdAt,
        updatedAt: createdAt.add(const Duration(hours: 1)),
        completedAt: status == OrderStatus.completed
            ? createdAt.add(const Duration(days: 2))
            : null,
      );
    });
  }
}




