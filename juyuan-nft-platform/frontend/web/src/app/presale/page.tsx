'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface Presale {
  id: string;
  productType: string;
  maxSupply: number;
  currentSupply: number;
  price: number;
  currency: string;
  startTime: string;
  endTime: string;
  status: string;
  originBase: string;
  harvestDate: string;
  image?: string;
}

export default function PresalePage() {
  const [presales, setPresales] = useState<Presale[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const loadPresales = useCallback(async () => {
    setLoading(true);
    // 模拟数据
    const mockData: Presale[] = [
      {
        id: '1',
        productType: '阳光玫瑰葡萄',
        maxSupply: 1000,
        currentSupply: 680,
        price: 299,
        currency: 'CNY',
        startTime: '2024-01-15',
        endTime: '2024-02-15',
        status: 'ACTIVE',
        originBase: '云南大理',
        harvestDate: '2024-06-20',
        image: '/images/grape.jpg'
      },
      {
        id: '2',
        productType: '赣南脐橙',
        maxSupply: 2000,
        currentSupply: 1500,
        price: 199,
        currency: 'CNY',
        startTime: '2024-01-10',
        endTime: '2024-02-10',
        status: 'ACTIVE',
        originBase: '江西赣州',
        harvestDate: '2024-11-15',
        image: '/images/orange.jpg'
      },
      {
        id: '3',
        productType: '五常大米',
        maxSupply: 500,
        currentSupply: 500,
        price: 499,
        currency: 'CNY',
        startTime: '2024-01-01',
        endTime: '2024-01-31',
        status: 'ENDED',
        originBase: '黑龙江五常',
        harvestDate: '2024-10-01',
        image: '/images/rice.jpg'
      }
    ];

    const filtered = filter === 'ALL'
      ? mockData
      : mockData.filter(p => p.status === filter);

    setPresales(filtered);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadPresales();
  }, [loadPresales]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      UPCOMING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      ENDED: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    const labels: Record<string, string> = {
      UPCOMING: '即将开售',
      ACTIVE: '预售中',
      ENDED: '已结束'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            预售<span className="text-emerald-400">市场</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            精选优质农产品NFT，提前锁定新鲜好货，享受区块链溯源保障
          </p>
        </div>

        {/* 筛选栏 */}
        <div className="flex justify-center gap-4 mb-10">
          {['ALL', 'ACTIVE', 'UPCOMING', 'ENDED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === status
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                }`}
            >
              {status === 'ALL' ? '全部' : status === 'ACTIVE' ? '预售中' : status === 'UPCOMING' ? '即将开售' : '已结束'}
            </button>
          ))}
        </div>

        {/* 预售列表 */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {presales.map((presale) => (
              <div
                key={presale.id}
                className="group bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
              >
                {/* 图片 */}
                <div className="relative h-56 bg-gradient-to-br from-emerald-600/20 to-teal-600/20">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    {presale.productType.includes('葡萄') ? '🍇' : presale.productType.includes('橙') ? '🍊' : '🌾'}
                  </div>
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(presale.status)}
                  </div>
                </div>

                {/* 内容 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {presale.productType}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      📍 {presale.originBase}
                    </span>
                    <span className="flex items-center gap-1">
                      📅 {presale.harvestDate}
                    </span>
                  </div>

                  {/* 进度条 */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">销售进度</span>
                      <span className="text-emerald-400">
                        {Math.round((presale.currentSupply / presale.maxSupply) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                        style={{ width: `${(presale.currentSupply / presale.maxSupply) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>已售 {presale.currentSupply}</span>
                      <span>总量 {presale.maxSupply}</span>
                    </div>
                  </div>

                  {/* 价格和按钮 */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div>
                      <span className="text-3xl font-bold text-emerald-400">¥{presale.price}</span>
                      <span className="text-slate-500 text-sm">/份</span>
                    </div>
                    <button
                      disabled={presale.status !== 'ACTIVE'}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${presale.status === 'ACTIVE'
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'
                          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                      {presale.status === 'ACTIVE' ? '立即购买' : presale.status === 'UPCOMING' ? '即将开售' : '已结束'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {presales.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-lg">暂无预售活动</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

