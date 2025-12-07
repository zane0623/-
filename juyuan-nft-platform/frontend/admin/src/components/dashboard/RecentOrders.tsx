'use client';

import { Eye, MoreHorizontal } from 'lucide-react';

const orders = [
  {
    id: 'ORD-2024-001',
    user: '0x1234...5678',
    product: '恐龙蛋荔枝',
    amount: '0.5 ETH',
    status: 'completed',
    time: '5分钟前',
  },
  {
    id: 'ORD-2024-002',
    user: '0xabcd...efgh',
    product: '有机大米',
    amount: '0.25 ETH',
    status: 'processing',
    time: '15分钟前',
  },
  {
    id: 'ORD-2024-003',
    user: '0x9876...5432',
    product: '普洱茶',
    amount: '0.3 ETH',
    status: 'pending',
    time: '30分钟前',
  },
  {
    id: 'ORD-2024-004',
    user: '0x2468...1357',
    product: '恐龙蛋荔枝',
    amount: '1.0 ETH',
    status: 'shipped',
    time: '1小时前',
  },
  {
    id: 'ORD-2024-005',
    user: '0x1357...2468',
    product: '东北黑木耳',
    amount: '0.1 ETH',
    status: 'completed',
    time: '2小时前',
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: '已发货', color: 'bg-purple-100 text-purple-800' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-800' },
};

export function RecentOrders() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
            <th className="pb-3 font-medium">订单号</th>
            <th className="pb-3 font-medium">用户</th>
            <th className="pb-3 font-medium">产品</th>
            <th className="pb-3 font-medium">金额</th>
            <th className="pb-3 font-medium">状态</th>
            <th className="pb-3 font-medium">时间</th>
            <th className="pb-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="py-4 text-sm text-gray-600 font-mono">
                {order.user}
              </td>
              <td className="py-4 text-sm text-gray-900">
                {order.product}
              </td>
              <td className="py-4 text-sm font-medium text-gray-900">
                {order.amount}
              </td>
              <td className="py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[order.status].color}`}>
                  {statusMap[order.status].label}
                </span>
              </td>
              <td className="py-4 text-sm text-gray-500">
                {order.time}
              </td>
              <td className="py-4">
                <div className="flex items-center space-x-2">
                  <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

