'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  Package,
  ShoppingCart,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity
} from 'lucide-react';

const monthlyData = [
  { month: '1月', revenue: 125000, orders: 450, users: 120 },
  { month: '2月', revenue: 158000, orders: 520, users: 150 },
  { month: '3月', revenue: 189000, orders: 680, users: 180 },
  { month: '4月', revenue: 245000, orders: 890, users: 220 },
  { month: '5月', revenue: 278000, orders: 950, users: 280 },
  { month: '6月', revenue: 312000, orders: 1100, users: 320 },
];

const productStats = [
  { name: '阳光玫瑰葡萄', sales: 2580, revenue: 771420, percent: 35 },
  { name: '赣南脐橙', sales: 1890, revenue: 376110, percent: 25 },
  { name: '五常大米', sales: 1200, revenue: 598800, percent: 20 },
  { name: '烟台红富士', sales: 980, revenue: 254020, percent: 12 },
  { name: '其他', sales: 650, revenue: 150000, percent: 8 },
];

const regionStats = [
  { name: '华东地区', value: 42 },
  { name: '华北地区', value: 25 },
  { name: '华南地区', value: 18 },
  { name: '西南地区', value: 10 },
  { name: '其他地区', value: 5 },
];

const recentTrends = [
  { label: '日活用户', value: '3,256', change: '+12.5%', positive: true, icon: Users },
  { label: '日均订单', value: '156', change: '+8.3%', positive: true, icon: ShoppingCart },
  { label: '转化率', value: '4.2%', change: '-0.3%', positive: false, icon: Activity },
  { label: '平均客单价', value: '¥358', change: '+5.2%', positive: true, icon: DollarSign },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">数据统计</h1>
              <p className="text-gray-500 mt-1">分析平台运营数据和用户行为</p>
            </div>
            <div className="flex gap-3">
              {/* 时间选择 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['week', 'month', 'quarter', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      timeRange === range
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === 'week' ? '本周' : range === 'month' ? '本月' : range === 'quarter' ? '本季度' : '本年'}
                  </button>
                ))}
              </div>
              <button className="btn-secondary btn-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                自定义
              </button>
              <button className="btn-primary btn-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出报表
              </button>
            </div>
          </div>

          {/* 趋势指标 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {recentTrends.map((trend, index) => {
              const Icon = trend.icon;
              return (
                <div 
                  key={trend.label}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      trend.positive ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {trend.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {trend.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{trend.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{trend.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* 收入趋势图 */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">收入趋势</h2>
                  <p className="text-sm text-gray-500">近6个月收入变化</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-sm text-gray-500">收入</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-500">订单</span>
                  </div>
                </div>
              </div>
              
              {/* 简易柱状图 */}
              <div className="h-64 flex items-end gap-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end gap-1" style={{ height: '200px' }}>
                      <div 
                        className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-700 hover:to-emerald-500"
                        style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                      />
                      <div 
                        className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                        style={{ height: `${(data.orders / 1100) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{data.month}</span>
                  </div>
                ))}
              </div>

              {/* 汇总数据 */}
              <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">总收入</p>
                  <p className="text-2xl font-bold text-gray-900">¥1,307,000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">总订单</p>
                  <p className="text-2xl font-bold text-gray-900">4,590</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">新增用户</p>
                  <p className="text-2xl font-bold text-gray-900">1,270</p>
                </div>
              </div>
            </div>

            {/* 地区分布 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">地区分布</h2>
                  <p className="text-sm text-gray-500">用户地理分布</p>
                </div>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>

              {/* 饼图占位 */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {regionStats.reduce((acc, stat, index) => {
                    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#6b7280'];
                    const startAngle = acc.angle;
                    const sliceAngle = (stat.value / 100) * 360;
                    const endAngle = startAngle + sliceAngle;
                    
                    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                    
                    const largeArc = sliceAngle > 180 ? 1 : 0;
                    
                    acc.elements.push(
                      <path
                        key={index}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={colors[index]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );
                    acc.angle = endAngle;
                    return acc;
                  }, { elements: [] as React.ReactNode[], angle: 0 }).elements}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">100%</span>
                    <span className="text-xs text-gray-500">用户分布</span>
                  </div>
                </div>
              </div>

              {/* 图例 */}
              <div className="space-y-3">
                {regionStats.map((stat, index) => {
                  const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500', 'bg-gray-500'];
                  return (
                    <div key={stat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                        <span className="text-sm text-gray-600">{stat.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{stat.value}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 产品销售排行 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">产品销售排行</h2>
                <p className="text-sm text-gray-500">各产品销售数据对比</p>
              </div>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                查看全部 →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-y border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">排名</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">产品</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">销量</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">收入</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">占比</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">趋势</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productStats.map((product, index) => (
                    <tr key={product.name} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-amber-100 text-amber-600' :
                          index === 1 ? 'bg-gray-200 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{product.sales.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">¥{product.revenue.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                              style={{ width: `${product.percent}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">{product.percent}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                          index < 3 ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {index < 3 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {index < 3 ? '+' : ''}{(Math.random() * 10).toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

