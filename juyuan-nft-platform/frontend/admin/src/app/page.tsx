'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  ArrowRight,
  MoreHorizontal,
  Clock
} from 'lucide-react';

// 统计数据
const stats = [
  { 
    label: '总销售额', 
    value: '¥2,458,600', 
    change: '+23.5%', 
    positive: true,
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-500/30'
  },
  { 
    label: '新增用户', 
    value: '1,234', 
    change: '+18.2%', 
    positive: true,
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/30'
  },
  { 
    label: '活跃预售', 
    value: '12', 
    change: '+4', 
    positive: true,
    icon: ShoppingCart,
    gradient: 'from-violet-500 to-purple-500',
    shadowColor: 'shadow-violet-500/30'
  },
  { 
    label: 'NFT铸造', 
    value: '8,567', 
    change: '-2.1%', 
    positive: false,
    icon: Package,
    gradient: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/30'
  },
];

// 最近订单
const recentOrders = [
  { id: 'ORD001', product: '阳光玫瑰葡萄', user: '张三', amount: '¥299', status: 'completed', time: '2分钟前' },
  { id: 'ORD002', product: '赣南脐橙', user: '李四', amount: '¥199', status: 'processing', time: '15分钟前' },
  { id: 'ORD003', product: '五常大米', user: '王五', amount: '¥499', status: 'pending', time: '1小时前' },
  { id: 'ORD004', product: '烟台红富士', user: '赵六', amount: '¥259', status: 'completed', time: '2小时前' },
  { id: 'ORD005', product: '阳光玫瑰葡萄', user: '钱七', amount: '¥598', status: 'completed', time: '3小时前' },
];

// 热门产品
const topProducts = [
  { name: '阳光玫瑰葡萄', sales: 680, total: 1000, revenue: '¥203,320', icon: '🍇' },
  { name: '赣南脐橙', sales: 1500, total: 2000, revenue: '¥298,500', icon: '🍊' },
  { name: '五常大米', sales: 500, total: 500, revenue: '¥249,500', icon: '🌾' },
  { name: '烟台红富士', sales: 320, total: 800, revenue: '¥82,880', icon: '🍎' },
];

export default function Dashboard() {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; label: string }> = {
      completed: { class: 'badge-success', label: '已完成' },
      processing: { class: 'badge-info', label: '处理中' },
      pending: { class: 'badge-warning', label: '待处理' },
    };
    const style = styles[status];
    return <span className={style.class}>{style.label}</span>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* 欢迎区域 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                欢迎回来，管理员 👋
              </h1>
              <p className="text-gray-500">
                这是您的仪表盘概览，显示平台的关键指标和最新动态
              </p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="stat-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`stat-card-icon bg-gradient-to-br ${stat.gradient} ${stat.shadowColor}`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className={`stat-card-change ${stat.positive ? 'positive' : 'negative'}`}>
                      {stat.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="stat-card-value">{stat.value}</div>
                  <div className="stat-card-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* 主内容区 */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 最近订单 */}
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="card-header flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
                      <p className="text-sm text-gray-500">最新的5笔订单</p>
                    </div>
                    <button className="btn-secondary btn-sm flex items-center gap-2">
                      查看全部
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>订单号</th>
                          <th>产品</th>
                          <th>用户</th>
                          <th>金额</th>
                          <th>状态</th>
                          <th>时间</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="animate-fade-in">
                            <td>
                              <span className="font-mono text-emerald-600 font-medium">{order.id}</span>
                            </td>
                            <td className="font-medium text-gray-900">{order.product}</td>
                            <td>{order.user}</td>
                            <td className="font-semibold text-gray-900">{order.amount}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>
                              <span className="flex items-center gap-1 text-gray-500">
                                <Clock className="w-4 h-4" />
                                {order.time}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 热门产品 */}
              <div className="lg:col-span-1">
                <div className="card h-full">
                  <div className="card-header flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">热门产品</h2>
                      <p className="text-sm text-gray-500">销量TOP4</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="card-body space-y-4">
                    {topProducts.map((product, index) => (
                      <div 
                        key={product.name} 
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                            {product.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                            <p className="text-sm text-emerald-600 font-medium">{product.revenue}</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">销量进度</span>
                            <span className="font-medium text-gray-900">
                              {product.sales}/{product.total}
                            </span>
                          </div>
                          <div className="progress">
                            <div 
                              className="progress-bar" 
                              style={{ width: `${(product.sales / product.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
