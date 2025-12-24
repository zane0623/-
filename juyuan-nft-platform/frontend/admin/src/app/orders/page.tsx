'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
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
  ChevronRight
} from 'lucide-react';

interface Order {
  id: string;
  orderNo: string;
  user: {
    name: string;
    avatar: string;
    email: string;
  };
  product: {
    name: string;
    icon: string;
    quantity: number;
  };
  amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  deliveryAddress: string;
}

const orders: Order[] = [
  {
    id: '1',
    orderNo: 'ORD-2024-001234',
    user: { name: '张三', avatar: '张', email: 'zhangsan@example.com' },
    product: { name: '阳光玫瑰葡萄', icon: '🍇', quantity: 2 },
    amount: 598,
    status: 'delivered',
    paymentMethod: '微信支付',
    createdAt: '2024-01-15 14:30',
    deliveryAddress: '上海市浦东新区...'
  },
  {
    id: '2',
    orderNo: 'ORD-2024-001235',
    user: { name: '李四', avatar: '李', email: 'lisi@example.com' },
    product: { name: '赣南脐橙', icon: '🍊', quantity: 3 },
    amount: 597,
    status: 'shipped',
    paymentMethod: '支付宝',
    createdAt: '2024-01-15 13:20',
    deliveryAddress: '北京市朝阳区...'
  },
  {
    id: '3',
    orderNo: 'ORD-2024-001236',
    user: { name: '王五', avatar: '王', email: 'wangwu@example.com' },
    product: { name: '五常大米', icon: '🌾', quantity: 1 },
    amount: 499,
    status: 'processing',
    paymentMethod: '微信支付',
    createdAt: '2024-01-15 12:10',
    deliveryAddress: '广州市天河区...'
  },
  {
    id: '4',
    orderNo: 'ORD-2024-001237',
    user: { name: '赵六', avatar: '赵', email: 'zhaoliu@example.com' },
    product: { name: '烟台红富士', icon: '🍎', quantity: 2 },
    amount: 518,
    status: 'paid',
    paymentMethod: '银行卡',
    createdAt: '2024-01-15 11:05',
    deliveryAddress: '深圳市南山区...'
  },
  {
    id: '5',
    orderNo: 'ORD-2024-001238',
    user: { name: '钱七', avatar: '钱', email: 'qianqi@example.com' },
    product: { name: '阳光玫瑰葡萄', icon: '🍇', quantity: 1 },
    amount: 299,
    status: 'pending',
    paymentMethod: '-',
    createdAt: '2024-01-15 10:00',
    deliveryAddress: '杭州市西湖区...'
  },
  {
    id: '6',
    orderNo: 'ORD-2024-001239',
    user: { name: '孙八', avatar: '孙', email: 'sunba@example.com' },
    product: { name: '赣南脐橙', icon: '🍊', quantity: 5 },
    amount: 995,
    status: 'cancelled',
    paymentMethod: '微信支付',
    createdAt: '2024-01-14 18:30',
    deliveryAddress: '成都市武侯区...'
  },
  {
    id: '7',
    orderNo: 'ORD-2024-001240',
    user: { name: '周九', avatar: '周', email: 'zhoujiu@example.com' },
    product: { name: '五常大米', icon: '🌾', quantity: 2 },
    amount: 998,
    status: 'refunded',
    paymentMethod: '支付宝',
    createdAt: '2024-01-14 16:20',
    deliveryAddress: '武汉市洪山区...'
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
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const filteredOrders = orders.filter(order => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;
    if (searchQuery && !order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.user.name.includes(searchQuery)) return false;
    return true;
  });

  const stats = [
    { label: '全部订单', value: orders.length, color: 'text-gray-900' },
    { label: '待支付', value: orders.filter(o => o.status === 'pending').length, color: 'text-amber-600' },
    { label: '处理中', value: orders.filter(o => ['paid', 'processing'].includes(o.status)).length, color: 'text-blue-600' },
    { label: '已发货', value: orders.filter(o => o.status === 'shipped').length, color: 'text-cyan-600' },
    { label: '已完成', value: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-600' },
  ];

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
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
              <p className="text-gray-500 mt-1">管理和处理所有订单</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary btn-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出
              </button>
              <button className="btn-primary btn-sm">
                批量处理
              </button>
            </div>
          </div>

          {/* 统计标签 */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {stats.map((stat) => (
              <button
                key={stat.label}
                onClick={() => setSelectedStatus(stat.label === '全部订单' ? 'all' : 
                  stat.label === '待支付' ? 'pending' :
                  stat.label === '处理中' ? 'paid' :
                  stat.label === '已发货' ? 'shipped' : 'delivered'
                )}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all whitespace-nowrap ${
                  (selectedStatus === 'all' && stat.label === '全部订单') ||
                  (selectedStatus === 'pending' && stat.label === '待支付') ||
                  (selectedStatus === 'paid' && stat.label === '处理中') ||
                  (selectedStatus === 'shipped' && stat.label === '已发货') ||
                  (selectedStatus === 'delivered' && stat.label === '已完成')
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="font-medium">{stat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-sm font-bold ${
                  (selectedStatus === 'all' && stat.label === '全部订单') ||
                  (selectedStatus === 'pending' && stat.label === '待支付') ||
                  (selectedStatus === 'paid' && stat.label === '处理中') ||
                  (selectedStatus === 'shipped' && stat.label === '已发货') ||
                  (selectedStatus === 'delivered' && stat.label === '已完成')
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">支付方式</th>
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
                              <p className="text-sm text-gray-500">{order.user.email}</p>
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
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.paymentMethod}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Package className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
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
    </div>
  );
}

