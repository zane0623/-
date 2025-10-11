'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { presaleApi, type Presale } from '@/lib/api';

export default function PresalesPage() {
  const [presales, setPresales] = useState<Presale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPresales();
  }, []);

  const loadPresales = async () => {
    setLoading(true);
    const response = await presaleApi.getAll();
    
    if (response.success && response.data) {
      setPresales(response.data);
      setError(null);
    } else {
      setError(response.error || '加载失败');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white py-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-emerald-300 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center fade-in">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              🌱 预售列表
            </h1>
            <p className="text-lg md:text-xl text-green-100">
              探索优质农产品预售项目，抢先预订新鲜直达
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">连接失败</h3>
                  <p className="mt-2 text-yellow-700">
                    无法连接到后端服务器。请确保后端服务正在运行。
                  </p>
                  <p className="mt-2 text-sm text-yellow-600">
                    错误信息: {error}
                  </p>
                  <button
                    onClick={loadPresales}
                    className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                  >
                    重试
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && presales.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <div className="text-6xl mb-6">🌱</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                暂无预售活动
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                目前还没有正在进行的预售活动，敬请期待！
              </p>
              <Link
                href="/"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                返回首页
              </Link>
            </div>
          </div>
        )}

        {/* Presales Grid */}
        {!loading && !error && presales.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {presales.map((presale, index) => (
              <div
                key={presale.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
                  {presale.cover_image ? (
                    <img
                      src={presale.cover_image}
                      alt={presale.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white text-7xl group-hover:scale-110 transition-transform duration-500">
                      🌿
                    </div>
                  )}
                  {/* 状态标签 */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg backdrop-blur-sm ${
                      presale.status === 'ACTIVE' ? 'bg-green-500/90 text-white' :
                      presale.status === 'SCHEDULED' ? 'bg-blue-500/90 text-white' :
                      presale.status === 'ENDED' ? 'bg-gray-500/90 text-white' :
                      'bg-yellow-500/90 text-white'
                    }`}>
                      {presale.status === 'ACTIVE' ? '🔥 进行中' :
                       presale.status === 'SCHEDULED' ? '⏰ 即将开始' :
                       presale.status === 'ENDED' ? '✓ 已结束' : '📝 草稿'}
                    </span>
                  </div>
                  {/* 渐变遮罩 */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {presale.title}
                  </h3>
                  {presale.subtitle && (
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      {presale.subtitle}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {presale.description}
                  </p>

                  {/* Pricing & Inventory */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">预售价</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ¥{presale.pricing?.presale_price || '---'}
                      </p>
                      {presale.pricing?.market_price && (
                        <p className="text-xs text-gray-400 line-through mt-1">
                          原价 ¥{presale.pricing.market_price}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">剩余</p>
                      <p className="text-xl font-bold text-gray-800">
                        {presale.inventory?.available || 0}
                        <span className="text-sm font-normal text-gray-500 ml-1">份</span>
                      </p>
                      <div className="mt-2 w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, ((presale.inventory?.sold || 0) / (presale.inventory?.total || 1)) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/presales/${presale.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3.5 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform group-hover:scale-105 shadow-lg group-hover:shadow-green-500/50"
                  >
                    <span>查看详情</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && !error && presales.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              共找到 <span className="font-bold text-green-600">{presales.length}</span> 个预售活动
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

