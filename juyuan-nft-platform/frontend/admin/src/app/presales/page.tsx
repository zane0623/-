'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';

interface Presale {
  id: string;
  productType: string;
  maxSupply: number;
  currentSupply: number;
  price: number;
  status: string;
  startTime: string;
  endTime: string;
}

export default function PresalesPage() {
  const [presales] = useState<Presale[]>([
    { id: '1', productType: '阳光玫瑰葡萄', maxSupply: 1000, currentSupply: 680, price: 299, status: 'ACTIVE', startTime: '2024-01-15', endTime: '2024-02-15' },
    { id: '2', productType: '赣南脐橙', maxSupply: 2000, currentSupply: 1500, price: 199, status: 'ACTIVE', startTime: '2024-01-10', endTime: '2024-02-10' },
    { id: '3', productType: '五常大米', maxSupply: 500, currentSupply: 500, price: 499, status: 'ENDED', startTime: '2024-01-01', endTime: '2024-01-31' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      UPCOMING: 'bg-amber-100 text-amber-800',
      ACTIVE: 'bg-emerald-100 text-emerald-800',
      ENDED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    const labels: Record<string, string> = {
      UPCOMING: '即将开售',
      ACTIVE: '预售中',
      ENDED: '已结束',
      CANCELLED: '已取消'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
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
              <h1 className="text-2xl font-bold text-gray-900">预售管理</h1>
              <p className="text-gray-500 mt-1">管理所有预售活动</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建预售
            </button>
          </div>

          {/* 筛选栏 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">全部状态</option>
                <option value="UPCOMING">即将开售</option>
                <option value="ACTIVE">预售中</option>
                <option value="ENDED">已结束</option>
              </select>
              <input
                type="text"
                placeholder="搜索产品名称..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
              />
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                搜索
              </button>
            </div>
          </div>

          {/* 预售列表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">销售进度</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {presales.map((presale) => (
                  <tr key={presale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl">
                          {presale.productType.includes('葡萄') ? '🍇' : presale.productType.includes('橙') ? '🍊' : '🌾'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{presale.productType}</div>
                          <div className="text-sm text-gray-500">ID: {presale.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-emerald-600">¥{presale.price}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">{presale.currentSupply}/{presale.maxSupply}</span>
                          <span className="text-emerald-600">{Math.round(presale.currentSupply / presale.maxSupply * 100)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(presale.currentSupply / presale.maxSupply) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{presale.startTime}</div>
                      <div>至 {presale.endTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(presale.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-emerald-600 hover:text-emerald-700 mr-3">编辑</button>
                      <button className="text-blue-600 hover:text-blue-700 mr-3">详情</button>
                      <button className="text-red-600 hover:text-red-700">取消</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

