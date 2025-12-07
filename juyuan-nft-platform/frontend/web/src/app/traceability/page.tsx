'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, QrCode, Shield, Clock, MapPin, Leaf, CheckCircle2 } from 'lucide-react';

export default function TraceabilityPage() {
  const router = useRouter();
  const [tokenId, setTokenId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId.trim()) return;
    
    setIsSearching(true);
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push(`/trace/${tokenId}`);
  };

  const features = [
    {
      icon: Shield,
      title: '区块链存证',
      description: '所有数据上链存储，不可篡改，永久可查'
    },
    {
      icon: Clock,
      title: '全程追溯',
      description: '从种植、生长、采收到配送，每个环节清晰可见'
    },
    {
      icon: MapPin,
      title: '产地定位',
      description: '精确到农场的地理位置，了解产品真实来源'
    },
    {
      icon: Leaf,
      title: '品质保证',
      description: '质检报告、农药检测等证书一目了然'
    }
  ];

  const recentTraces = [
    { tokenId: '1001', product: '阳光玫瑰葡萄', origin: '云南大理', time: '2分钟前' },
    { tokenId: '1002', product: '赣南脐橙', origin: '江西赣州', time: '5分钟前' },
    { tokenId: '1003', product: '五常大米', origin: '黑龙江五常', time: '12分钟前' },
    { tokenId: '1004', product: '恐龙蛋李子', origin: '四川攀枝花', time: '18分钟前' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
          {/* 网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">区块链溯源系统</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                溯源查询
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              输入NFT编号或扫描产品二维码，查看农产品从种植到餐桌的全程信息
            </p>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                  <input
                    type="text"
                    placeholder="输入NFT编号，如: 1001"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-slate-800/80 border border-slate-700 rounded-2xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !tokenId.trim()}
                  className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      查询中
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      查询
                    </>
                  )}
                </button>
              </div>

              {/* 扫码提示 */}
              <div className="flex items-center justify-center gap-6 mt-6 text-slate-400">
                <button 
                  type="button"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  <span>扫描二维码</span>
                </button>
                <span className="w-px h-5 bg-slate-700" />
                <span className="text-sm">支持扫描产品包装上的溯源码</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 功能特点 */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              为什么选择<span className="text-emerald-400">区块链溯源</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              传统溯源依赖中心化数据库，数据可被篡改。我们采用区块链技术，确保每一条记录真实可信
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl hover:border-emerald-500/50 transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 最近查询 */}
      <section className="py-20 bg-slate-800/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              最近查询记录
            </h2>
            <p className="text-slate-400">查看其他用户最近查询的产品</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {recentTraces.map((trace, index) => (
              <button
                key={index}
                onClick={() => router.push(`/trace/${trace.tokenId}`)}
                className="w-full flex items-center justify-between p-5 bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">{trace.product}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                        #{trace.tokenId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {trace.origin}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm">{trace.time}</span>
                  <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 溯源流程 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              溯源信息<span className="text-emerald-400">包含什么</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* 连接线 */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-slate-700 hidden md:block" />

              {[
                { step: '种植', desc: '品种选择、种植日期、农场位置、土壤检测' },
                { step: '生长', desc: '施肥记录、灌溉数据、病虫害防治、生长照片' },
                { step: '采收', desc: '采收日期、成熟度检测、人员信息' },
                { step: '加工', desc: '分拣标准、清洗消毒、包装规格' },
                { step: '物流', desc: '冷链温度、运输路线、时效追踪' },
                { step: '交付', desc: '签收确认、品质评价、售后服务' },
              ].map((item, index) => (
                <div key={index} className="relative pl-20 pb-10 last:pb-0">
                  <div className="absolute left-0 w-16 h-16 bg-slate-800 border-4 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                    <h4 className="text-white font-semibold text-lg mb-2">{item.step}</h4>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

