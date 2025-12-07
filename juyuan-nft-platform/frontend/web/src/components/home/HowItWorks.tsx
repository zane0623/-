'use client';

import { Wallet, ShoppingCart, Package, Search, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: '连接钱包',
    description: '使用MetaMask或其他Web3钱包连接平台，开启您的NFT之旅',
    color: 'from-violet-500 to-purple-500',
    shadowColor: 'shadow-violet-500/30'
  },
  {
    icon: ShoppingCart,
    title: '选购预售',
    description: '浏览精选农产品，选择心仪的NFT进行预购，享受预售优惠价格',
    color: 'from-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-500/30'
  },
  {
    icon: Package,
    title: '收获实物',
    description: '农产品成熟后，凭NFT兑换实物，冷链配送新鲜到家',
    color: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/30'
  },
  {
    icon: Search,
    title: '溯源查询',
    description: '扫码查看完整溯源信息，了解每一份农产品的前世今生',
    color: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/30'
  }
];

export function HowItWorks() {
  return (
    <section className="relative py-32 bg-slate-950 overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      
      <div className="container-custom relative z-10">
        {/* 标题 */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
            使用指南
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            如何<span className="text-gradient">开始</span>使用
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            简单四步，开启您的区块链农产品之旅
          </p>
        </div>

        {/* 步骤 */}
        <div className="relative">
          {/* 连接线 - 仅在大屏幕显示 */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-violet-500 via-emerald-500 via-amber-500 to-blue-500 opacity-20 rounded-full" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* 步骤卡片 */}
                <div className="relative p-8 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl hover:border-slate-700 transition-all duration-500 hover:-translate-y-2">
                  {/* 步骤编号 */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gradient">{index + 1}</span>
                  </div>
                  
                  {/* 图标 */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 ${step.shadowColor} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* 内容 */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* 箭头 - 仅在最后一个之前显示 */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/presale"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
          >
            立即开始
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
