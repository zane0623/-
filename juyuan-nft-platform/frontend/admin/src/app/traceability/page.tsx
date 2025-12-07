'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';

interface TraceRecord {
  id: string;
  tokenId: number;
  productType: string;
  eventType: string;
  description: string;
  location: string;
  operator: string;
  timestamp: string;
  txHash: string;
}

export default function TraceabilityPage() {
  const [records] = useState<TraceRecord[]>([
    { id: '1', tokenId: 1001, productType: '阳光玫瑰葡萄', eventType: 'HARVESTING', description: '采收完成', location: '云南大理', operator: '李农户', timestamp: '2024-06-20 06:00', txHash: '0xabc...' },
    { id: '2', tokenId: 1001, productType: '阳光玫瑰葡萄', eventType: 'PROCESSING', description: '品质检测完成', location: '大理加工中心', operator: '质检员', timestamp: '2024-06-20 10:00', txHash: '0xdef...' },
    { id: '3', tokenId: 1002, productType: '赣南脐橙', eventType: 'SHIPPING', description: '冷链运输中', location: '顺丰物流', operator: '物流员', timestamp: '2024-11-18 08:00', txHash: '0x123...' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      PLANTING: '🌱',
      GROWING: '🌿',
      HARVESTING: '🌾',
      PROCESSING: '⚙️',
      PACKAGING: '📦',
      SHIPPING: '🚚',
      DELIVERED: '✅'
    };
    return icons[type] || '📌';
  };

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      PLANTING: '种植',
      GROWING: '生长',
      HARVESTING: '采收',
      PROCESSING: '加工',
      PACKAGING: '包装',
      SHIPPING: '运输',
      DELIVERED: '交付'
    };
    return labels[type] || type;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">溯源管理</h1>
              <p className="text-gray-500 mt-1">管理产品溯源记录和区块链上链</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加溯源事件
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">总溯源记录</div>
              <div className="text-3xl font-bold text-gray-900">12,345</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">今日新增</div>
              <div className="text-3xl font-bold text-emerald-600">156</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">已上链</div>
              <div className="text-3xl font-bold text-blue-600">10,234</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">待上链</div>
              <div className="text-3xl font-bold text-amber-600">2,111</div>
            </div>
          </div>

          {/* 快速添加区域 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快速添加溯源事件</h2>
            <div className="grid grid-cols-7 gap-4">
              {['PLANTING', 'GROWING', 'HARVESTING', 'PROCESSING', 'PACKAGING', 'SHIPPING', 'DELIVERED'].map((type) => (
                <button
                  key={type}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200 transition-colors"
                >
                  <span className="text-3xl mb-2">{getEventIcon(type)}</span>
                  <span className="text-sm text-gray-700">{getEventLabel(type)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 溯源记录列表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="搜索Token ID或产品..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">全部事件类型</option>
                  <option value="PLANTING">种植</option>
                  <option value="GROWING">生长</option>
                  <option value="HARVESTING">采收</option>
                  <option value="PROCESSING">加工</option>
                  <option value="SHIPPING">运输</option>
                </select>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  搜索
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">事件</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Token/产品</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">描述</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">位置</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">操作员</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getEventIcon(record.eventType)}</span>
                        <span className="font-medium text-gray-900">{getEventLabel(record.eventType)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-mono text-emerald-600">#{record.tokenId}</div>
                        <div className="text-sm text-gray-500">{record.productType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{record.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.operator}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-emerald-600 hover:text-emerald-700 mr-3">查看</button>
                      <button className="text-blue-600 hover:text-blue-700">上链</button>
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

