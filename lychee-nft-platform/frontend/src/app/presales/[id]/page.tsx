'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { presaleApi, type Presale } from '@/lib/api';

export default function PresaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [presale, setPresale] = useState<Presale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'orchard'>('details');

  useEffect(() => {
    if (params.id) {
      loadPresale(params.id as string);
    }
  }, [params.id]);

  const loadPresale = async (id: string) => {
    setLoading(true);
    const response = await presaleApi.getById(id);

    if (response.success && response.data) {
      setPresale(response.data);
      setError(null);
    } else {
      setError(response.error || '加载失败');
    }

    setLoading(false);
  };

  const handleQuantityChange = (delta: number) => {
    if (!presale) return;
    const newQuantity = quantity + delta;
    const min = presale.inventory?.min_purchase || 1;
    const max = Math.min(
      presale.inventory?.max_purchase || 10,
      presale.inventory?.available || 0
    );
    
    if (newQuantity >= min && newQuantity <= max) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    // TODO: 实现购买逻辑
    alert(`购买 ${quantity} 份，总价：¥${(presale!.pricing?.presale_price || 0) * quantity}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
          <p className="text-gray-600 text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !presale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">预售不存在</h2>
          <p className="text-gray-600 mb-6">{error || '找不到该预售活动'}</p>
          <Link
            href="/presales"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            返回预售列表
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = (presale.pricing?.presale_price || 0) * quantity;
  const savedAmount = ((presale.pricing?.market_price || 0) - (presale.pricing?.presale_price || 0)) * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 返回按钮 */}
      <div className="bg-white border-b sticky top-0 z-10 backdrop-blur-lg bg-opacity-90">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">返回列表</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 图片区域 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-[16/10] bg-gradient-to-br from-green-400 to-emerald-600 relative">
                {presale.cover_image ? (
                  <img
                    src={presale.cover_image}
                    alt={presale.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white text-9xl">
                    🌿
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                    presale.status === 'ACTIVE' ? 'bg-green-500 text-white' :
                    presale.status === 'SCHEDULED' ? 'bg-blue-500 text-white' :
                    presale.status === 'ENDED' ? 'bg-gray-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {presale.status === 'ACTIVE' ? '🔥 进行中' :
                     presale.status === 'SCHEDULED' ? '⏰ 即将开始' :
                     presale.status === 'ENDED' ? '✓ 已结束' : '📝 草稿'}
                  </span>
                </div>
              </div>
            </div>

            {/* 标签导航 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === 'details'
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  产品详情
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === 'timeline'
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  时间安排
                </button>
                <button
                  onClick={() => setActiveTab('orchard')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === 'orchard'
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  果园信息
                </button>
              </div>

              <div className="p-6">
                {/* 产品详情 */}
                {activeTab === 'details' && (
                  <div className="space-y-6 fade-in">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">产品介绍</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {presale.description}
                      </p>
                    </div>

                    {presale.product_info && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">产品规格</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">品类</div>
                            <div className="font-semibold text-gray-800">{presale.product_info.category}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">品种</div>
                            <div className="font-semibold text-gray-800">{presale.product_info.variety}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">规格</div>
                            <div className="font-semibold text-gray-800">{presale.product_info.specification}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">产地</div>
                            <div className="font-semibold text-gray-800">{presale.product_info.origin}</div>
                          </div>
                        </div>

                        {presale.product_info.features && presale.product_info.features.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">产品特色</h4>
                            <div className="flex flex-wrap gap-2">
                              {presale.product_info.features.map((feature: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                                >
                                  ✓ {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 时间安排 */}
                {activeTab === 'timeline' && presale.timeline && (
                  <div className="space-y-4 fade-in">
                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="text-sm text-gray-500">预售开始</div>
                      <div className="font-semibold text-gray-800">
                        {new Date(presale.timeline.presale_start).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="text-sm text-gray-500">预售结束</div>
                      <div className="font-semibold text-gray-800">
                        {new Date(presale.timeline.presale_end).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="text-sm text-gray-500">采摘期</div>
                      <div className="font-semibold text-gray-800">
                        {new Date(presale.timeline.harvest_start).toLocaleDateString('zh-CN')} - {new Date(presale.timeline.harvest_end).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <div className="text-sm text-gray-500">配送期</div>
                      <div className="font-semibold text-gray-800">
                        {new Date(presale.timeline.delivery_start).toLocaleDateString('zh-CN')} - {new Date(presale.timeline.delivery_end).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                  </div>
                )}

                {/* 果园信息 */}
                {activeTab === 'orchard' && presale.orchard && (
                  <div className="space-y-4 fade-in">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{presale.orchard.name}</h3>
                      {presale.orchard.verified && (
                        <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          已认证果园
                        </span>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">位置</div>
                      <div className="font-semibold text-gray-800">
                        {presale.orchard.location?.country} {presale.orchard.location?.province} {presale.orchard.location?.city}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：购买卡片（固定） */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 价格卡片 */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{presale.title}</h2>
                  {presale.subtitle && (
                    <p className="text-gray-600">{presale.subtitle}</p>
                  )}
                </div>

                {/* 价格 */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-green-600">
                      ¥{presale.pricing?.presale_price}
                    </span>
                    <span className="text-gray-500">/份</span>
                  </div>
                  {presale.pricing?.market_price && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through">
                        ¥{presale.pricing.market_price}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                        省¥{presale.pricing.market_price - presale.pricing.presale_price}
                      </span>
                    </div>
                  )}
                </div>

                {/* 库存 */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">剩余库存</span>
                    <span className="text-xl font-bold text-gray-800">
                      {presale.inventory?.available} 份
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${((presale.inventory?.sold || 0) / (presale.inventory?.total || 1)) * 100}%`
                      }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-500 text-center">
                    已售 {presale.inventory?.sold || 0} / {presale.inventory?.total} 份
                  </div>
                </div>

                {/* 数量选择 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    购买数量
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center font-bold text-xl"
                      disabled={quantity <= (presale.inventory?.min_purchase || 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      min={presale.inventory?.min_purchase || 1}
                      max={Math.min(presale.inventory?.max_purchase || 10, presale.inventory?.available || 0)}
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center font-bold text-xl"
                      disabled={quantity >= Math.min(presale.inventory?.max_purchase || 10, presale.inventory?.available || 0)}
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    限购 {presale.inventory?.min_purchase} - {presale.inventory?.max_purchase} 份
                  </p>
                </div>

                {/* 小计 */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">小计</span>
                    <span className="text-2xl font-bold text-green-600">
                      ¥{totalPrice}
                    </span>
                  </div>
                  {savedAmount > 0 && (
                    <div className="text-sm text-green-600 text-right">
                      已为您节省 ¥{savedAmount}
                    </div>
                  )}
                </div>

                {/* 购买按钮 */}
                <button
                  onClick={handleBuyNow}
                  disabled={presale.status !== 'ACTIVE' || (presale.inventory?.available || 0) === 0}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                >
                  {presale.status !== 'ACTIVE' ? '预售未开始' :
                   (presale.inventory?.available || 0) === 0 ? '已售罄' :
                   '立即购买'}
                </button>

                {/* NFT提示 */}
                {presale.nft_config?.enabled && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      购买即获赠NFT数字凭证
                    </div>
                  </div>
                )}
              </div>

              {/* 配送信息 */}
              {presale.shipping && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    配送信息
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">配送方式</span>
                      <span className="font-medium text-gray-800">
                        {presale.shipping.methods?.join('、')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">运费</span>
                      <span className="font-medium text-green-600">
                        {presale.shipping.fees?.standard === 0 ? '免运费' : `¥${presale.shipping.fees?.standard}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">预计送达</span>
                      <span className="font-medium text-gray-800">
                        {presale.shipping.estimated_days?.standard} 天内
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

