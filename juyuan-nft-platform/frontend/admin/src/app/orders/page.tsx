'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Truck, 
  CheckCircle,
  Clock,
  XCircle,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
  Edit,
  Printer
} from 'lucide-react';

interface Order {
  id: string;
  orderNo: string;
  user: {
    name: string;
    avatar: string;
    email: string;
    phone: string;
  };
  product: {
    name: string;
    icon: string;
    quantity: number;
    price: number;
  };
  amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  deliveryAddress: string;
  trackingNo?: string;
  note?: string;
}

const initialOrders: Order[] = [
  {
    id: '1',
    orderNo: 'ORD-2024-001234',
    user: { name: '张三', avatar: '张', email: 'zhangsan@example.com', phone: '138****1234' },
    product: { name: '阳光玫瑰葡萄', icon: '🍇', quantity: 2, price: 299 },
    amount: 598,
    status: 'delivered',
    paymentMethod: '微信支付',
    createdAt: '2024-01-15 14:30',
    deliveryAddress: '上海市浦东新区世纪大道100号',
    trackingNo: 'SF1234567890'
  },
  {
    id: '2',
    orderNo: 'ORD-2024-001235',
    user: { name: '李四', avatar: '李', email: 'lisi@example.com', phone: '139****5678' },
    product: { name: '赣南脐橙', icon: '🍊', quantity: 3, price: 199 },
    amount: 597,
    status: 'shipped',
    paymentMethod: '支付宝',
    createdAt: '2024-01-15 13:20',
    deliveryAddress: '北京市朝阳区建国路88号',
    trackingNo: 'JD0987654321'
  },
  {
    id: '3',
    orderNo: 'ORD-2024-001236',
    user: { name: '王五', avatar: '王', email: 'wangwu@example.com', phone: '137****9012' },
    product: { name: '五常大米', icon: '🌾', quantity: 1, price: 499 },
    amount: 499,
    status: 'processing',
    paymentMethod: '微信支付',
    createdAt: '2024-01-15 12:10',
    deliveryAddress: '广州市天河区体育西路200号'
  },
  {
    id: '4',
    orderNo: 'ORD-2024-001237',
    user: { name: '赵六', avatar: '赵', email: 'zhaoliu@example.com', phone: '136****3456' },
    product: { name: '烟台红富士', icon: '🍎', quantity: 2, price: 259 },
    amount: 518,
    status: 'paid',
    paymentMethod: '银行卡',
    createdAt: '2024-01-15 11:05',
    deliveryAddress: '深圳市南山区科技园路50号'
  },
  {
    id: '5',
    orderNo: 'ORD-2024-001238',
    user: { name: '钱七', avatar: '钱', email: 'qianqi@example.com', phone: '135****7890' },
    product: { name: '阳光玫瑰葡萄', icon: '🍇', quantity: 1, price: 299 },
    amount: 299,
    status: 'pending',
    paymentMethod: '-',
    createdAt: '2024-01-15 10:00',
    deliveryAddress: '杭州市西湖区文三路300号'
  },
  {
    id: '6',
    orderNo: 'ORD-2024-001239',
    user: { name: '孙八', avatar: '孙', email: 'sunba@example.com', phone: '134****2345' },
    product: { name: '赣南脐橙', icon: '🍊', quantity: 5, price: 199 },
    amount: 995,
    status: 'cancelled',
    paymentMethod: '微信支付',
    createdAt: '2024-01-14 18:30',
    deliveryAddress: '成都市武侯区天府大道500号',
    note: '用户主动取消'
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { label: '待支付', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
  paid: { label: '已支付', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: CheckCircle },
  processing: { label: '处理中', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: RefreshCw },
  shipped: { label: '已发货', color: 'text-cyan-700', bgColor: 'bg-cyan-100', icon: Truck },
  delivered: { label: '已完成', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: XCircle },
  refunded: { label: '已退款', color: 'text-red-700', bgColor: 'bg-red-100', icon: RefreshCw },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [shipOrder, setShipOrder] = useState<Order | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [trackingNo, setTrackingNo] = useState('');
  const [courier, setCourier] = useState('顺丰速运');
  const [isLoading, setIsLoading] = useState(false);

  const filteredOrders = orders.filter(order => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;
    if (searchQuery && !order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.user.name.includes(searchQuery)) return false;
    return true;
  });

  const stats = [
    { label: '全部订单', value: orders.length, color: 'text-gray-900', key: 'all' },
    { label: '待支付', value: orders.filter(o => o.status === 'pending').length, color: 'text-amber-600', key: 'pending' },
    { label: '待处理', value: orders.filter(o => ['paid', 'processing'].includes(o.status)).length, color: 'text-blue-600', key: 'paid' },
    { label: '已发货', value: orders.filter(o => o.status === 'shipped').length, color: 'text-cyan-600', key: 'shipped' },
    { label: '已完成', value: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-600', key: 'delivered' },
  ];

  // 发货处理
  const handleShip = async () => {
    if (!shipOrder || !trackingNo) return;
    setIsLoading(true);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setOrders(prev => prev.map(o => 
      o.id === shipOrder.id 
        ? { ...o, status: 'shipped' as const, trackingNo } 
        : o
    ));
    
    showToast.success('发货成功', `订单 ${shipOrder.orderNo} 已发货`);
    setShipOrder(null);
    setTrackingNo('');
    setIsLoading(false);
  };

  // 取消订单
  const handleCancel = async () => {
    if (!cancelOrder) return;
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setOrders(prev => prev.map(o => 
      o.id === cancelOrder.id 
        ? { ...o, status: 'cancelled' as const, note: '管理员取消' } 
        : o
    ));
    
    showToast.success('取消成功', `订单 ${cancelOrder.orderNo} 已取消`);
    setCancelOrder(null);
    setIsLoading(false);
  };

  // 确认收货
  const handleComplete = async (order: Order) => {
    setOrders(prev => prev.map(o => 
      o.id === order.id 
        ? { ...o, status: 'delivered' as const } 
        : o
    ));
    showToast.success('操作成功', `订单 ${order.orderNo} 已确认收货`);
  };

  // 导出订单
  const handleExport = () => {
    const csv = [
      ['订单号', '用户', '产品', '金额', '状态', '时间'].join(','),
      ...filteredOrders.map(o => [
        o.orderNo,
        o.user.name,
        o.product.name,
        o.amount,
        statusConfig[o.status].label,
        o.createdAt
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast.success('导出成功', `已导出 ${filteredOrders.length} 条订单`);
  };

  // 批量操作
  const handleBatchProcess = () => {
    if (selectedOrders.length === 0) {
      showToast.warning('请选择订单', '请先选择要处理的订单');
      return;
    }
    showToast.info('批量处理', `已选择 ${selectedOrders.length} 条订单`);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <ToastContainer />
        
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
              <p className="text-gray-500 mt-1">管理和处理所有订单</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExport}
                className="btn-secondary btn-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出
              </button>
              <button 
                onClick={handleBatchProcess}
                className="btn-primary btn-sm"
              >
                批量处理 {selectedOrders.length > 0 && `(${selectedOrders.length})`}
              </button>
            </div>
          </div>

          {/* 统计标签 */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {stats.map((stat) => (
              <button
                key={stat.key}
                onClick={() => setSelectedStatus(stat.key)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all whitespace-nowrap ${
                  selectedStatus === stat.key
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="font-medium">{stat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-sm font-bold ${
                  selectedStatus === stat.key
                    ? 'bg-white/20 text-white'
                    : `bg-gray-100 ${stat.color}`
                }`}>
                  {stat.value}
                </span>
              </button>
            ))}
          </div>

          {/* 搜索和筛选 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索订单号、用户名..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500">
                <option value="">支付方式</option>
                <option value="wechat">微信支付</option>
                <option value="alipay">支付宝</option>
                <option value="bank">银行卡</option>
              </select>
              <select className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500">
                <option value="">时间范围</option>
                <option value="today">今天</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4" />
                更多筛选
              </button>
            </div>
          </div>

          {/* 订单表格 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">订单信息</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">用户</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">产品</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">金额</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => toggleSelect(order.id)}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-mono font-medium text-emerald-600">{order.orderNo}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{order.createdAt}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                              {order.user.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{order.user.name}</p>
                              <p className="text-sm text-gray-500">{order.user.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{order.product.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900">{order.product.name}</p>
                              <p className="text-sm text-gray-500">×{order.product.quantity}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-gray-900">¥{order.amount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setDetailOrder(order)}
                              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="查看详情"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {order.status === 'paid' && (
                              <button 
                                onClick={() => setShipOrder(order)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="发货"
                              >
                                <Truck className="w-5 h-5" />
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button 
                                onClick={() => handleComplete(order)}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="确认收货"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                            {['pending', 'paid'].includes(order.status) && (
                              <button 
                                onClick={() => setCancelOrder(order)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="取消订单"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                显示 1-{filteredOrders.length} 共 {orders.length} 条
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50" disabled>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-emerald-500 text-white font-medium">1</button>
                <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50">2</button>
                <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50">3</button>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 订单详情弹窗 */}
      <Modal 
        isOpen={!!detailOrder} 
        onClose={() => setDetailOrder(null)} 
        title="订单详情"
        size="lg"
      >
        {detailOrder && (
          <div className="space-y-6">
            {/* 订单状态 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-500">订单号</p>
                <p className="text-lg font-mono font-bold text-emerald-600">{detailOrder.orderNo}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig[detailOrder.status].bgColor} ${statusConfig[detailOrder.status].color}`}>
                {statusConfig[detailOrder.status].label}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 用户信息 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  用户信息
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">姓名</span>
                    <span className="font-medium">{detailOrder.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">手机</span>
                    <span className="font-medium">{detailOrder.user.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">邮箱</span>
                    <span className="font-medium">{detailOrder.user.email}</span>
                  </div>
                </div>
              </div>

              {/* 收货地址 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  收货地址
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700">{detailOrder.deliveryAddress}</p>
                  {detailOrder.trackingNo && (
                    <p className="mt-2 text-sm text-emerald-600 font-mono">
                      快递单号: {detailOrder.trackingNo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 商品信息 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4" />
                商品信息
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{detailOrder.product.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{detailOrder.product.name}</p>
                    <p className="text-sm text-gray-500">单价: ¥{detailOrder.product.price} × {detailOrder.product.quantity}</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-600">¥{detailOrder.amount}</p>
                </div>
              </div>
            </div>

            {/* 支付信息 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500">
                <CreditCard className="w-4 h-4" />
                支付方式
              </div>
              <span className="font-medium">{detailOrder.paymentMethod}</span>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  showToast.info('打印订单', '正在准备打印...');
                  setDetailOrder(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Printer className="w-5 h-5" />
                打印订单
              </button>
              {detailOrder.status === 'paid' && (
                <button
                  onClick={() => {
                    setDetailOrder(null);
                    setShipOrder(detailOrder);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  <Truck className="w-5 h-5" />
                  立即发货
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 发货弹窗 */}
      <Modal
        isOpen={!!shipOrder}
        onClose={() => setShipOrder(null)}
        title="订单发货"
        size="md"
      >
        {shipOrder && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">订单号</p>
              <p className="font-mono font-bold text-emerald-600">{shipOrder.orderNo}</p>
              <p className="text-sm text-gray-500 mt-2">收货人: {shipOrder.user.name} - {shipOrder.deliveryAddress}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">快递公司</label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                >
                  <option value="顺丰速运">顺丰速运</option>
                  <option value="京东物流">京东物流</option>
                  <option value="圆通速递">圆通速递</option>
                  <option value="中通快递">中通快递</option>
                  <option value="韵达快递">韵达快递</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">快递单号</label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="请输入快递单号"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShipOrder(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleShip}
                disabled={!trackingNo || isLoading}
                className="flex-1 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? '发货中...' : '确认发货'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 取消订单确认 */}
      <ConfirmDialog
        isOpen={!!cancelOrder}
        onClose={() => setCancelOrder(null)}
        onConfirm={handleCancel}
        title="取消订单"
        message={`确定要取消订单 ${cancelOrder?.orderNo} 吗？此操作不可撤销。`}
        type="danger"
        confirmText="确认取消"
        loading={isLoading}
      />
    </div>
  );
}
