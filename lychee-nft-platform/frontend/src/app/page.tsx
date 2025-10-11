'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { presaleApi, type Presale } from '@/lib/api';

export default function HomePage() {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [presales, setPresales] = useState<Presale[]>([]);
  const [presalesLoading, setPresalesLoading] = useState(true);

  useEffect(() => {
    // 检查后端连接
    fetch(process.env.NEXT_PUBLIC_API_URL + '/health')
      .then(res => res.json())
      .then(data => {
        setSystemStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Backend connection failed:', err);
        setLoading(false);
      });
    
    // 加载热门预售
    loadPresales();
  }, []);

  const loadPresales = async () => {
    setPresalesLoading(true);
    const response = await presaleApi.getAll();
    if (response.success && response.data) {
      // 只显示前3个预售
      setPresales(response.data.slice(0, 3));
    }
    setPresalesLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="fade-in">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                钜园农业
                <span className="block mt-2 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                  NFT预售平台
                </span>
            </h1>
              <p className="text-xl md:text-3xl mb-6 text-green-100 font-semibold">
                区块链赋能优质农产品
            </p>
              <p className="text-lg md:text-xl mb-12 text-green-50 max-w-2xl mx-auto">
                通过NFT技术实现农产品溯源、预售和价值保障，连接生产者与消费者，开启农业数字化新时代
            </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/presales"
                  className="group relative px-10 py-5 bg-white text-green-600 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl hover:shadow-green-500/50 flex items-center gap-3"
              >
                  <span>探索预售</span>
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
              </Link>
              <Link
                href="/about"
                  className="group px-10 py-5 bg-transparent text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border-2 border-white/50 hover:border-white transform hover:scale-105 backdrop-blur-sm flex items-center gap-3"
              >
                  <span>了解更多</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 波浪底部 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: '10,000+', label: '注册用户', icon: '👥', color: 'from-blue-500 to-cyan-600' },
              { number: '3', label: '合作果园', icon: '🌳', color: 'from-green-500 to-emerald-600' },
              { number: '6', label: '预售活动', icon: '🎯', color: 'from-purple-500 to-pink-600' },
              { number: '¥100万+', label: '累计交易额', icon: '💰', color: 'from-orange-500 to-red-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 热门预售 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              🔥 热门预售
            </h2>
            <p className="text-xl text-gray-600">
              精选优质农产品，抢先预订享超值优惠
            </p>
          </div>

          {presalesLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : presales.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                      <div className="absolute top-4 right-4">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg backdrop-blur-sm ${
                          presale.status === 'ACTIVE' ? 'bg-green-500/90 text-white' :
                          presale.status === 'SCHEDULED' ? 'bg-blue-500/90 text-white' :
                          'bg-gray-500/90 text-white'
                        }`}>
                          {presale.status === 'ACTIVE' ? '🔥 进行中' :
                           presale.status === 'SCHEDULED' ? '⏰ 即将开始' : '已结束'}
                </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {presale.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {presale.description}
                      </p>

                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">预售价</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ¥{presale.pricing?.presale_price || '---'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">剩余</p>
                          <p className="text-xl font-bold text-gray-800">
                            {presale.inventory?.available || 0}
                            <span className="text-sm font-normal text-gray-500 ml-1">份</span>
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/presales/${presale.id}`}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform group-hover:scale-105 shadow-lg"
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
              <div className="text-center mt-12">
                <Link
                  href="/presales"
                  className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl border-2 border-green-600"
                >
                  <span>查看全部预售</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-600 text-lg">暂无预售活动</p>
            </div>
          )}
        </div>
      </section>

      {/* 工作流程 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              🚀 如何参与
            </h2>
            <p className="text-xl text-gray-600">
              简单4步，开启您的NFT农产品之旅
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: '浏览预售',
                  description: '浏览精选农产品预售项目，查看详细信息',
                  icon: '🔍',
                  color: 'from-blue-500 to-cyan-600'
                },
                {
                  step: '02',
                  title: '下单购买',
                  description: '选择心仪产品，提交订单并完成支付',
                  icon: '🛒',
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  step: '03',
                  title: '获得NFT',
                  description: '自动铸造NFT凭证，享有数字资产权益',
                  icon: '💎',
                  color: 'from-purple-500 to-pink-600'
                },
                {
                  step: '04',
                  title: '收货验货',
                  description: '按时收货，验证产品品质，确认满意',
                  icon: '📦',
                  color: 'from-orange-500 to-red-600'
                }
              ].map((item, index) => (
                <div key={index} className="relative fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-2">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 text-3xl`}>
                      {item.icon}
                    </div>
                    <div className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                      STEP {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                  {/* 连接线 */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-8">
                      <svg className="w-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
              </div>
            )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              ✨ 平台特色
          </h2>
            <p className="text-xl text-gray-600">
            为什么选择钜园农业NFT预售平台
          </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🔒',
                title: '区块链溯源',
                description: '全流程上链记录，从种植、采摘到配送，每个环节都透明可查，确保产品真实性',
                color: 'from-green-500 to-emerald-600'
              },
              {
                icon: '💎',
                title: 'NFT权益凭证',
                description: '购买即获得独特的NFT凭证，不仅是产品所有权证明，更具有收藏和增值价值',
                color: 'from-purple-500 to-pink-600'
              },
              {
                icon: '🛡️',
                title: '智能合约保障',
                description: '资金由智能合约托管，分阶段释放，确保买卖双方权益，降低交易风险',
                color: 'from-blue-500 to-cyan-600'
              },
              {
                icon: '🌱',
                title: '优质产地直供',
                description: '精选认证果园，有机种植，无中间商赚差价，产地直发保证新鲜',
                color: 'from-green-500 to-teal-600'
              },
              {
                icon: '⚡',
                title: '预售价格优惠',
                description: '提前预订享受超低预售价，最高可享7折优惠，支持农民获得提前收益',
                color: 'from-orange-500 to-red-600'
              },
              {
                icon: '📱',
                title: '便捷操作体验',
                description: '简洁直观的界面设计，一键下单，实时查询订单状态和物流信息',
                color: 'from-indigo-500 to-purple-600'
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-4xl group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 用户评价 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              💬 用户评价
            </h2>
            <p className="text-xl text-gray-600">
              听听他们怎么说
              </p>
            </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: '李女士',
                avatar: '👩',
                location: '北京',
                rating: 5,
                comment: '第一次尝试预售农产品，收到的荔枝非常新鲜，甜度也很高！NFT凭证很有意思，感觉很有收藏价值。',
                date: '2025-04-15'
              },
              {
                name: '王先生',
                avatar: '👨',
                location: '上海',
                rating: 5,
                comment: '区块链溯源功能很棒，可以清楚看到农产品的每个环节，让人很放心。价格也比市场上便宜不少。',
                date: '2025-04-10'
              },
              {
                name: '张女士',
                avatar: '👩‍🦰',
                location: '深圳',
                rating: 5,
                comment: '平台操作简单，客服响应快。收到的果子品质很好，比想象中的还要大！会继续支持的。',
                date: '2025-04-08'
              }
            ].map((review, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl mr-3">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.location}</p>
              </div>
            </div>
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">"{review.comment}"</p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-emerald-300 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto fade-in">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              🚀 开始您的NFT农产品之旅
          </h2>
            <p className="text-xl md:text-2xl text-green-100 mb-10">
            立即探索优质农产品预售，参与区块链农业创新
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/presales"
                className="px-10 py-5 bg-white text-green-600 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl"
              >
                立即探索预售 →
              </Link>
              <Link
                href="/about"
                className="px-10 py-5 bg-transparent text-white rounded-2xl font-bold text-lg border-2 border-white hover:bg-white/10 transition-all transform hover:scale-105"
              >
                了解更多
          </Link>
            </div>
          </div>
        </div>
      </section>

      {/* System Status & Development */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* System Status */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${systemStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-gray-300">
                    系统状态: <span className={systemStatus ? 'text-green-400 font-semibold' : 'text-red-400'}>
                      {systemStatus ? '运行中' : '未连接'}
                    </span>
                  </span>
                </div>
                {systemStatus && (
                  <div className="text-gray-400">
                    环境: {systemStatus.environment || 'development'}
                  </div>
                )}
              </div>
            </div>

            {/* Development Status */}
            <div className="bg-gray-900 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">🚀 开发进度</h3>
              <div className="space-y-4">
                {[
                  { name: '基础架构', status: 'completed', progress: 100 },
                  { name: '数据库设计', status: 'completed', progress: 100 },
                  { name: '智能合约', status: 'completed', progress: 100 },
                  { name: '后端API', status: 'completed', progress: 100 },
                  { name: '前端页面', status: 'in_progress', progress: 85 },
                  { name: '测试部署', status: 'pending', progress: 30 }
                ].map((item, index) => (
                  <div key={index} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">{item.name}</span>
                      <span className={`font-semibold ${
                        item.status === 'completed' ? 'text-green-400' :
                        item.status === 'in_progress' ? 'text-yellow-400' :
                        'text-gray-500'
                      }`}>
                        {item.status === 'completed' ? '✅ 已完成' :
                         item.status === 'in_progress' ? '🚧 进行中' : '⏳ 待开始'}
                      </span>
              </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'in_progress' ? 'bg-yellow-500' :
                          'bg-gray-600'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
              </div>
              </div>
                ))}
              </div>
              <p className="text-center text-gray-400 mt-8">
                项目正在积极开发中，敬请期待更多功能上线 🎉
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">钜园农业NFT预售平台</h3>
            <p className="mb-6">区块链赋能农业，科技创造价值</p>
            <div className="flex justify-center gap-8 text-sm">
              <Link href="/about" className="hover:text-white transition-colors">关于我们</Link>
              <Link href="/contact" className="hover:text-white transition-colors">联系方式</Link>
              <Link href="/terms" className="hover:text-white transition-colors">服务条款</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
              <p>© 2025 钜园农业. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

