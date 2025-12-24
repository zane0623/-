'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Phone,
  Navigation,
  RefreshCw
} from 'lucide-react';

interface Delivery {
  id: string;
  orderNo: string;
  trackingNo: string;
  courier: {
    name: string;
    company: string;
    phone: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  product: {
    name: string;
    icon: string;
    quantity: number;
  };
  status: 'preparing' | 'picked' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  estimatedTime: string;
  createdAt: string;
  updatedAt: string;
}

const deliveries: Delivery[] = [
  {
    id: '1',
    orderNo: 'ORD-2024-001234',
    trackingNo: 'SF1234567890123',
    courier: { name: '张师傅', company: '顺丰速运', phone: '138****1234' },
    recipient: { name: '张三', phone: '139****5678', address: '上海市浦东新区世纪大道100号' },
    product: { name: '阳光玫瑰葡萄', icon: '🍇', quantity: 2 },
    status: 'out_for_delivery',
    estimatedTime: '今天 14:00-16:00',
    createdAt: '2024-01-15 09:00',
    updatedAt: '2024-01-15 13:30'
  },
  {
    id: '2',
    orderNo: 'ORD-2024-001235',
    trackingNo: 'JD0987654321012',
    courier: { name: '李师傅', company: '京东物流', phone: '137****2345' },
    recipient: { name: '李四', phone: '136****6789', address: '北京市朝阳区建国路88号' },
    product: { name: '赣南脐橙', icon: '🍊', quantity: 3 },
    status: 'in_transit',
    estimatedTime: '明天 10:00-12:00',
    createdAt: '2024-01-15 08:00',
    updatedAt: '2024-01-15 12:00'
  },
  {
    id: '3',
    orderNo: 'ORD-2024-001236',
    trackingNo: 'YT5678901234567',
    courier: { name: '王师傅', company: '圆通速递', phone: '135****3456' },
    recipient: { name: '王五', phone: '133****7890', address: '广州市天河区体育西路200号' },
    product: { name: '五常大米', icon: '🌾', quantity: 1 },
    status: 'picked',
    estimatedTime: '后天 下午',
    createdAt: '2024-01-15 10:00',
    updatedAt: '2024-01-15 11:00'
  },
  {
    id: '4',
    orderNo: 'ORD-2024-001237',
    trackingNo: 'ZTO4567890123456',
    courier: { name: '-', company: '中通快递', phone: '-' },
    recipient: { name: '赵六', phone: '131****8901', address: '深圳市南山区科技园路50号' },
    product: { name: '烟台红富士', icon: '🍎', quantity: 2 },
    status: 'preparing',
    estimatedTime: '预计3天内送达',
    createdAt: '2024-01-15 11:00',
    updatedAt: '2024-01-15 11:00'
  },
  {
    id: '5',
    orderNo: 'ORD-2024-001230',
    trackingNo: 'SF9876543210987',
    courier: { name: '陈师傅', company: '顺丰速运', phone: '139****4567' },
    recipient: { name: '孙七', phone: '138****0123', address: '杭州市西湖区文三路300号' },
    product: { name: '阳光玫瑰葡萄', icon: '🍇', quantity: 1 },
    status: 'delivered',
    estimatedTime: '-',
    createdAt: '2024-01-14 09:00',
    updatedAt: '2024-01-14 16:00'
  },
  {
    id: '6',
    orderNo: 'ORD-2024-001228',
    trackingNo: 'EMS1234567890CN',
    courier: { name: '周师傅', company: 'EMS', phone: '136****5678' },
    recipient: { name: '周八', phone: '135****2345', address: '成都市武侯区天府大道500号' },
    product: { name: '赣南脐橙', icon: '🍊', quantity: 5 },
    status: 'failed',
    estimatedTime: '-',
    createdAt: '2024-01-13 10:00',
    updatedAt: '2024-01-14 18:00'
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType; step: number }> = {
  preparing: { label: '备货中', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: Package, step: 1 },
  picked: { label: '已揽件', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: CheckCircle, step: 2 },
  in_transit: { label: '运输中', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Truck, step: 3 },
  out_for_delivery: { label: '派送中', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Navigation, step: 4 },
  delivered: { label: '已签收', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: CheckCircle, step: 5 },
  failed: { label: '派送失败', color: 'text-red-700', bgColor: 'bg-red-100', icon: AlertCircle, step: 0 },
};

export default function DeliveriesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeliveries = deliveries.filter(d => {
    if (selectedStatus !== 'all' && d.status !== selectedStatus) return false;
    if (searchQuery && 
        !d.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !d.trackingNo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: '全部', value: deliveries.length, key: 'all' },
    { label: '备货中', value: deliveries.filter(d => d.status === 'preparing').length, key: 'preparing' },
    { label: '运输中', value: deliveries.filter(d => ['picked', 'in_transit'].includes(d.status)).length, key: 'in_transit' },
    { label: '派送中', value: deliveries.filter(d => d.status === 'out_for_delivery').length, key: 'out_for_delivery' },
    { label: '已完成', value: deliveries.filter(d => d.status === 'delivered').length, key: 'delivered' },
    { label: '异常', value: deliveries.filter(d => d.status === 'failed').length, key: 'failed' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">物流配送</h1>
              <p className="text-gray-500 mt-1">跟踪和管理所有配送订单</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary btn-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                刷新状态
              </button>
              <button className="btn-primary btn-sm">
                批量发货
              </button>
            </div>
          </div>

          {/* 状态概览 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {stats.map((stat) => (
              <button
                key={stat.key}
                onClick={() => setSelectedStatus(stat.key)}
                className={`p-4 rounded-xl text-center transition-all ${
                  selectedStatus === stat.key
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white border border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className={`text-2xl font-bold ${selectedStatus === stat.key ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${selectedStatus === stat.key ? 'text-white/80' : 'text-gray-500'}`}>
                  {stat.label}
                </div>
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
                  placeholder="搜索订单号或快递单号..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500">
                <option value="">快递公司</option>
                <option value="sf">顺丰速运</option>
                <option value="jd">京东物流</option>
                <option value="yt">圆通速递</option>
                <option value="zt">中通快递</option>
              </select>
              <select className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500">
                <option value="">发货日期</option>
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

          {/* 配送列表 */}
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => {
              const status = statusConfig[delivery.status];
              const StatusIcon = status.icon;
              
              return (
                <div 
                  key={delivery.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-wrap items-start gap-6">
                    {/* 产品信息 */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                        {delivery.product.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{delivery.product.name}</h3>
                        <p className="text-sm text-gray-500">×{delivery.product.quantity}</p>
                        <p className="text-sm text-emerald-600 font-mono mt-1">{delivery.orderNo}</p>
                      </div>
                    </div>

                    {/* 物流信息 */}
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500">快递单号:</span>
                        <span className="font-mono font-medium text-gray-900">{delivery.trackingNo}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{delivery.courier.company}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          <Clock className="inline w-4 h-4 mr-1" />
                          {delivery.estimatedTime}
                        </span>
                        {delivery.courier.name !== '-' && (
                          <span className="text-gray-500">
                            <Phone className="inline w-4 h-4 mr-1" />
                            {delivery.courier.name} ({delivery.courier.phone})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 收件人 */}
                    <div className="min-w-[200px]">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{delivery.recipient.name}</p>
                          <p className="text-sm text-gray-500">{delivery.recipient.phone}</p>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-1">{delivery.recipient.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* 状态和操作 */}
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${status.bgColor} ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="查看详情">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="物流轨迹">
                          <Navigation className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 物流进度条 */}
                  {delivery.status !== 'failed' && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        {['备货', '揽件', '运输', '派送', '签收'].map((step, index) => {
                          const stepNum = index + 1;
                          const isComplete = status.step >= stepNum;
                          const isCurrent = status.step === stepNum;
                          
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                  isComplete 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                                } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}>
                                  {isComplete ? <CheckCircle className="w-5 h-5" /> : stepNum}
                                </div>
                                <span className={`mt-2 text-xs ${isComplete ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                  {step}
                                </span>
                              </div>
                              {index < 4 && (
                                <div className={`flex-1 h-1 mx-2 rounded ${
                                  status.step > stepNum ? 'bg-emerald-500' : 'bg-gray-200'
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 失败原因 */}
                  {delivery.status === 'failed' && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700">派送失败</p>
                          <p className="text-sm text-red-600 mt-1">收件人电话无法接通，已安排二次配送</p>
                          <button className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium">
                            重新派送 →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 空状态 */}
          {filteredDeliveries.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无配送记录</h3>
              <p className="text-gray-500">没有找到符合条件的配送订单</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

