'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  TrendingUp,
  ArrowDownToLine,
  Filter
} from 'lucide-react';

interface Payment {
  id: string;
  transactionId: string;
  orderId: string;
  user: string;
  amount: number;
  method: 'wechat' | 'alipay' | 'bank' | 'crypto';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
}

const initialPayments: Payment[] = [
  { id: '1', transactionId: 'TXN-2024-001', orderId: 'ORD-2024-001234', user: '张三', amount: 598, method: 'wechat', status: 'completed', createdAt: '2024-01-15 14:30', completedAt: '2024-01-15 14:31' },
  { id: '2', transactionId: 'TXN-2024-002', orderId: 'ORD-2024-001235', user: '李四', amount: 597, method: 'alipay', status: 'completed', createdAt: '2024-01-15 13:20', completedAt: '2024-01-15 13:21' },
  { id: '3', transactionId: 'TXN-2024-003', orderId: 'ORD-2024-001236', user: '王五', amount: 499, method: 'bank', status: 'pending', createdAt: '2024-01-15 12:10' },
  { id: '4', transactionId: 'TXN-2024-004', orderId: 'ORD-2024-001237', user: '赵六', amount: 518, method: 'crypto', status: 'failed', createdAt: '2024-01-15 11:05' },
  { id: '5', transactionId: 'TXN-2024-005', orderId: 'ORD-2024-001239', user: '孙八', amount: 995, method: 'wechat', status: 'refunded', createdAt: '2024-01-14 18:30' },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { label: '处理中', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
  completed: { label: '已完成', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: CheckCircle },
  failed: { label: '失败', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
  refunded: { label: '已退款', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: RefreshCw }
};

const methodConfig: Record<string, { label: string; icon: string }> = {
  wechat: { label: '微信支付', icon: '💚' },
  alipay: { label: '支付宝', icon: '💙' },
  bank: { label: '银行卡', icon: '💳' },
  crypto: { label: '加密货币', icon: '🪙' }
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [detailPayment, setDetailPayment] = useState<Payment | null>(null);
  const [refundPayment, setRefundPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPayments = payments.filter(p => {
    if (searchQuery && !p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.user.includes(searchQuery)) return false;
    if (selectedStatus && p.status !== selectedStatus) return false;
    if (selectedMethod && p.method !== selectedMethod) return false;
    return true;
  });

  const stats = [
    { 
      label: '今日收入', 
      value: `¥${payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    { 
      label: '待处理', 
      value: payments.filter(p => p.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    { 
      label: '成功交易', 
      value: payments.filter(p => p.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: '退款金额', 
      value: `¥${payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0)}`,
      icon: RefreshCw,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100'
    },
  ];

  // 退款处理
  const handleRefund = async () => {
    if (!refundPayment) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPayments(prev => prev.map(p => 
      p.id === refundPayment.id ? { ...p, status: 'refunded' as const } : p
    ));
    showToast.success('退款成功', `交易 ${refundPayment.transactionId} 已退款`);
    setRefundPayment(null);
    setIsLoading(false);
  };

  // 重试支付
  const handleRetry = async (payment: Payment) => {
    showToast.info('正在重试', `交易 ${payment.transactionId} 正在重新处理...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPayments(prev => prev.map(p => 
      p.id === payment.id ? { ...p, status: 'completed' as const, completedAt: new Date().toLocaleString() } : p
    ));
    showToast.success('支付成功', `交易 ${payment.transactionId} 已完成`);
  };

  // 导出
  const handleExport = () => {
    const csv = [
      ['交易号', '订单号', '用户', '金额', '支付方式', '状态', '时间'].join(','),
      ...filteredPayments.map(p => [
        p.transactionId,
        p.orderId,
        p.user,
        p.amount,
        methodConfig[p.method].label,
        statusConfig[p.status].label,
        p.createdAt
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast.success('导出成功', `已导出 ${filteredPayments.length} 条交易记录`);
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
              <h1 className="text-2xl font-bold text-gray-900">支付管理</h1>
              <p className="text-gray-500 mt-1">查看和管理所有支付交易</p>
            </div>
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              导出记录
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 筛选栏 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索交易号、订单号、用户..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">全部状态</option>
                <option value="pending">处理中</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
                <option value="refunded">已退款</option>
              </select>
              <select 
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">全部方式</option>
                <option value="wechat">微信支付</option>
                <option value="alipay">支付宝</option>
                <option value="bank">银行卡</option>
                <option value="crypto">加密货币</option>
              </select>
            </div>
          </div>

          {/* 支付列表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">交易信息</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">支付方式</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const status = statusConfig[payment.status];
                  const method = methodConfig[payment.method];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-mono font-medium text-emerald-600">{payment.transactionId}</p>
                          <p className="text-sm text-gray-500">{payment.orderId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{payment.user}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-gray-900">¥{payment.amount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{method.icon}</span>
                          <span className="text-gray-700">{method.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setDetailPayment(payment)}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {payment.status === 'failed' && (
                            <button 
                              onClick={() => handleRetry(payment)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="重试"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          {payment.status === 'completed' && (
                            <button 
                              onClick={() => setRefundPayment(payment)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="退款"
                            >
                              <ArrowDownToLine className="w-4 h-4" />
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
        </main>
      </div>

      {/* 交易详情弹窗 */}
      <Modal
        isOpen={!!detailPayment}
        onClose={() => setDetailPayment(null)}
        title="交易详情"
        size="md"
      >
        {detailPayment && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">交易号</span>
                <span className="font-mono font-medium text-emerald-600">{detailPayment.transactionId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">订单号</span>
                <span className="font-mono text-gray-700">{detailPayment.orderId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <p className="text-3xl font-bold text-emerald-600">¥{detailPayment.amount}</p>
                <p className="text-sm text-emerald-700 mt-1">交易金额</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{methodConfig[detailPayment.method].icon}</span>
                  <span className="font-medium text-blue-700">{methodConfig[detailPayment.method].label}</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">支付方式</p>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-500">用户</span>
                <span className="font-medium">{detailPayment.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">创建时间</span>
                <span>{detailPayment.createdAt}</span>
              </div>
              {detailPayment.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">完成时间</span>
                  <span>{detailPayment.completedAt}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">状态</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[detailPayment.status].bgColor} ${statusConfig[detailPayment.status].color}`}>
                  {statusConfig[detailPayment.status].label}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 退款确认 */}
      <ConfirmDialog
        isOpen={!!refundPayment}
        onClose={() => setRefundPayment(null)}
        onConfirm={handleRefund}
        title="确认退款"
        message={`确定要对交易 ${refundPayment?.transactionId} 进行退款吗？退款金额: ¥${refundPayment?.amount}`}
        type="warning"
        confirmText="确认退款"
        loading={isLoading}
      />
    </div>
  );
}
