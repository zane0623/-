'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAccount } from 'wagmi';

interface NFT {
  tokenId: number;
  productType: string;
  quantity: string;
  qualityGrade: string;
  originBase: string;
  harvestDate: string;
  deliveryStatus: 'PENDING' | 'DELIVERED';
}

export default function MyNFTsPage() {
  const { isConnected, address } = useAccount();
  const [filter, setFilter] = useState<string>('ALL');

  // 模拟NFT数据
  const nfts: NFT[] = [
    {
      tokenId: 1001,
      productType: '阳光玫瑰葡萄',
      quantity: '5kg',
      qualityGrade: '特级',
      originBase: '云南大理',
      harvestDate: '2024-06-20',
      deliveryStatus: 'PENDING'
    },
    {
      tokenId: 1002,
      productType: '赣南脐橙',
      quantity: '10kg',
      qualityGrade: '优级',
      originBase: '江西赣州',
      harvestDate: '2024-11-15',
      deliveryStatus: 'DELIVERED'
    },
    {
      tokenId: 1003,
      productType: '五常大米',
      quantity: '20kg',
      qualityGrade: '特级',
      originBase: '黑龙江五常',
      harvestDate: '2024-10-01',
      deliveryStatus: 'DELIVERED'
    }
  ];

  const filteredNFTs = filter === 'ALL'
    ? nfts
    : nfts.filter(n => n.deliveryStatus === filter);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">连接钱包查看您的NFT</h2>
            <p className="text-slate-400 mb-8">
              请先连接您的Web3钱包以查看和管理您的农产品NFT
            </p>
            <button className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30">
              连接钱包
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            我的<span className="text-emerald-400">NFT</span>
          </h1>
          <p className="text-slate-400">
            钱包地址: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">{nfts.length}</div>
            <div className="text-slate-400">NFT总数</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">
              {nfts.filter(n => n.deliveryStatus === 'PENDING').length}
            </div>
            <div className="text-slate-400">待交付</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-teal-400 mb-2">
              {nfts.filter(n => n.deliveryStatus === 'DELIVERED').length}
            </div>
            <div className="text-slate-400">已交付</div>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="flex justify-center gap-4 mb-10">
          {['ALL', 'PENDING', 'DELIVERED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === status
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {status === 'ALL' ? '全部' : status === 'PENDING' ? '待交付' : '已交付'}
            </button>
          ))}
        </div>

        {/* NFT列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNFTs.map((nft) => (
            <div
              key={nft.tokenId}
              className="group bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
            >
              {/* NFT图片区域 */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 flex items-center justify-center">
                <span className="text-7xl">
                  {nft.productType.includes('葡萄') ? '🍇' : nft.productType.includes('橙') ? '🍊' : '🌾'}
                </span>
                <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded-full text-sm text-emerald-400">
                  #{nft.tokenId}
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${
                  nft.deliveryStatus === 'DELIVERED'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {nft.deliveryStatus === 'DELIVERED' ? '已交付' : '待交付'}
                </div>
              </div>

              {/* NFT信息 */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {nft.productType}
                </h3>
                
                <div className="space-y-2 text-sm text-slate-400 mb-4">
                  <div className="flex justify-between">
                    <span>产地</span>
                    <span className="text-white">{nft.originBase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>数量</span>
                    <span className="text-white">{nft.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>品质</span>
                    <span className="text-emerald-400">{nft.qualityGrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>采收日期</span>
                    <span className="text-white">{nft.harvestDate}</span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                  <a
                    href={`/trace/${nft.tokenId}`}
                    className="flex-1 py-3 text-center bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-colors"
                  >
                    溯源查询
                  </a>
                  {nft.deliveryStatus === 'PENDING' && (
                    <button className="flex-1 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors">
                      申请交付
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-lg mb-6">暂无NFT</p>
            <a
              href="/presale"
              className="inline-block px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all"
            >
              前往预售市场
            </a>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

