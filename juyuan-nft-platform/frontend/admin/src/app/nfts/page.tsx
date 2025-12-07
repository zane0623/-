'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';

interface NFT {
  id: string;
  tokenId: number;
  productType: string;
  owner: string;
  quantity: string;
  qualityGrade: string;
  deliveryStatus: string;
  createdAt: string;
}

export default function NFTsPage() {
  const [nfts] = useState<NFT[]>([
    { id: '1', tokenId: 1001, productType: '阳光玫瑰葡萄', owner: '0x1234...5678', quantity: '5kg', qualityGrade: '特级', deliveryStatus: 'PENDING', createdAt: '2024-01-15' },
    { id: '2', tokenId: 1002, productType: '赣南脐橙', owner: '0x2345...6789', quantity: '10kg', qualityGrade: '优级', deliveryStatus: 'DELIVERED', createdAt: '2024-01-14' },
    { id: '3', tokenId: 1003, productType: '五常大米', owner: '0x3456...7890', quantity: '20kg', qualityGrade: '特级', deliveryStatus: 'SHIPPED', createdAt: '2024-01-13' },
  ]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-amber-100 text-amber-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-emerald-100 text-emerald-800'
    };
    const labels: Record<string, string> = {
      PENDING: '待交付',
      PROCESSING: '处理中',
      SHIPPED: '运输中',
      DELIVERED: '已交付'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NFT管理</h1>
              <p className="text-gray-500 mt-1">查看和管理所有已铸造的NFT</p>
            </div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              批量铸造
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">总NFT数量</div>
              <div className="text-3xl font-bold text-gray-900">1,234</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">待交付</div>
              <div className="text-3xl font-bold text-amber-600">156</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">运输中</div>
              <div className="text-3xl font-bold text-purple-600">89</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">已交付</div>
              <div className="text-3xl font-bold text-emerald-600">989</div>
            </div>
          </div>

          {/* NFT列表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="搜索Token ID或产品..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">全部状态</option>
                  <option value="PENDING">待交付</option>
                  <option value="SHIPPED">运输中</option>
                  <option value="DELIVERED">已交付</option>
                </select>
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Token ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">产品</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">持有者</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">数量/品质</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {nfts.map((nft) => (
                  <tr key={nft.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-emerald-600 font-medium">#{nft.tokenId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">
                          {nft.productType.includes('葡萄') ? '🍇' : nft.productType.includes('橙') ? '🍊' : '🌾'}
                        </div>
                        <span className="font-medium text-gray-900">{nft.productType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-500">{nft.owner}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{nft.quantity}</div>
                        <div className="text-sm text-emerald-600">{nft.qualityGrade}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(nft.deliveryStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {nft.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-emerald-600 hover:text-emerald-700 mr-3">溯源</button>
                      <button className="text-blue-600 hover:text-blue-700">详情</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分页 */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-500">显示 1-10 共 1,234 条</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">上一页</button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">下一页</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

