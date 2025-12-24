'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  DollarSign,
  RefreshCw,
  Download,
  Filter,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Eye,
  Wallet
} from 'lucide-react';

interface Transaction {
  id: string;
  transactionNo: string;
  type: 'income' | 'refund' | 'withdrawal';
  amount: number;
  fee: number;
  user: {
    name: string;
    wallet?: string;
  };
  orderNo?: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  createdAt: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    transactionNo: 'TXN-2024-001234',
    type: 'income',
    amount: 598,
    fee: 5.98,
    user: { name: '张三', wallet: '0x1234...5678' },
    orderNo: 'ORD-2024-001234',
    status: 'completed',
    method: '微信支付',
    createdAt: '2024-01-15 14:30:25'
  },
  {
    id: '2',
    transactionNo: 'TXN-2024-001235',
    type: 'income',
    amount: 597,
    fee: 5.97,
    user: { name: '李四', wallet: '0x2345...6789' },
    orderNo: 'ORD-2024-001235',
    status: 'completed',
    method: '支付宝',
    createdAt: '2024-01-15 13:20:18'
  },
  {
    id: '3',
    transactionNo: 'TXN-2024-001236',
    type: 'refund',
    amount: -299,
    fee: 0,
    user: { name: '王五' },
    orderNo: 'ORD-2024-001200',
    status: 'completed',
    method: '原路退回',
    createdAt: '2024-01-15 12:15:00'
  },
  {
    id: '4',
    transactionNo: 'TXN-2024-001237',
    type: 'income',
    amount: 499,
    fee: 4.99,
    user: { name: '赵六' },
    orderNo: 'ORD-2024-001236',
    status: 'pending',
    method: '银行卡',
    createdAt: '2024-01-15 11:05:32'
  },
  {
    id: '5',
    transactionNo: 'TXN-2024-001238',
    type: 'withdrawal',
    amount: -10000,
    fee: 10,
    user: { name: '平台提现' },
    status: 'completed',
    method: '银行转账',
    createdAt: '2024-01-15 10:00:00'
  },
  {
    id: '6',
    transactionNo: 'TXN-2024-001239',
    type: 'income',
    amount: 1495,
    fee: 14.95,
    user: { name: '钱七' },
    orderNo: 'ORD-2024-001237',
    status: 'failed',
    method: '微信支付',
    createdAt: '2024-01-14 18:30:45'
  },
];

const stats = [
  { 
    label: '今日收入', 
    value: '¥12,580', 
    change: '+23.5%', 
    positive: true,
    icon: ArrowUpRight,
    gradient: 'from-emerald-500 to-teal-500'
  },
  { 
    label: '今日退款', 
    value: '¥1,280', 
    change: '-8.2%', 
    positive: true,
    icon: ArrowDownLeft,
    gradient: 'from-red-500 to-rose-500'
  },
  { 
    label: '待处理', 
    value: '¥3,450', 
    change: '12笔',
    positive: false,
    icon: Clock,
    gradient: 'from-amber-500 to-orange-500'
  },
  { 
    label: '账户余额', 
    value: '¥458,600', 
    change: '',
    positive: true,
    icon: Wallet,
    gradient: 'from-blue-500 to-cyan-500'
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  completed: { label: '已完成', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: CheckCircle },
  pending: { label: '处理中', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
  failed: { label: '失败', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
};

export default function PaymentsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(t => {
    if (selectedType !== 'all' && t.type !== selectedType) return false;
    if (searchQuery && !t.transactionNo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">支付管理</h1>
              <p className="text-gray-500 mt-1">查看和管理所有支付交易</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary btn-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                同步
              </button>
              <button className="btn-secondary btn-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出
              </button>
              <button className="btn-primary btn-sm">
                手动对账
              </button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {stat.change && (
                      <span className={`text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* 筛选栏 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'income', label: '收入' },
                  { key: 'refund', label: '退款' },
                  { key: 'withdrawal', label: '提现' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedType(item.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedType === item.key
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <div className="relative min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索交易号..."
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
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4" />
                筛选
              </button>
            </div>
          </div>

          {/* 交易记录 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">交易号</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">类型</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">用户</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">关联订单</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">金额</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">手续费</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">支付方式</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((transaction) => {
                    const status = statusConfig[transaction.status];
                    const StatusIcon = status.icon;
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-mono font-medium text-gray-900">{transaction.transactionNo}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{transaction.createdAt}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            transaction.type === 'income' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : transaction.type === 'refund'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {transaction.type === 'income' && <ArrowUpRight className="w-3.5 h-3.5" />}
                            {transaction.type === 'refund' && <ArrowDownLeft className="w-3.5 h-3.5" />}
                            {transaction.type === 'withdrawal' && <Wallet className="w-3.5 h-3.5" />}
                            {transaction.type === 'income' ? '收入' : transaction.type === 'refund' ? '退款' : '提现'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{transaction.user.name}</p>
                            {transaction.user.wallet && (
                              <p className="text-xs text-gray-500 font-mono">{transaction.user.wallet}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {transaction.orderNo ? (
                            <span className="font-mono text-sm text-emerald-600 hover:underline cursor-pointer">
                              {transaction.orderNo}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-lg font-bold ${
                            transaction.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {transaction.amount >= 0 ? '+' : ''}¥{Math.abs(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          ¥{transaction.fee}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {transaction.method}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <Eye className="w-5 h-5" />
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
                显示 1-{filteredTransactions.length} 共 {transactions.length} 条
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">上一页</button>
                <button className="w-10 h-10 rounded-lg bg-emerald-500 text-white font-medium">1</button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">下一页</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

