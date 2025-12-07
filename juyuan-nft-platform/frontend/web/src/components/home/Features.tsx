'use client';

import { Shield, Leaf, Truck, QrCode, Coins, Globe } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '区块链溯源',
    description: '每一份农产品都有独一无二的数字身份，全程可追溯，确保信息真实可靠',
    gradient: 'from-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-500/30'
  },
  {
    icon: Leaf,
    title: '绿色有机',
    description: '严格筛选合作农场，坚持有机种植标准，为您带来健康安全的农产品',
    gradient: 'from-green-500 to-emerald-500',
    shadowColor: 'shadow-green-500/30'
  },
  {
    icon: Truck,
    title: '产地直发',
    description: '从农场直达您的餐桌，减少中间环节，保证新鲜度和最佳口感',
    gradient: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/30'
  },
  {
    icon: QrCode,
    title: '扫码验真',
    description: '扫描产品二维码即可查看完整溯源信息，假冒伪劣无处遁形',
    gradient: 'from-violet-500 to-purple-500',
    shadowColor: 'shadow-violet-500/30'
  },
  {
    icon: Coins,
    title: 'NFT确权',
    description: '预售NFT代表您的权益凭证，可交易、可转让，数字资产永久保值',
    gradient: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/30'
  },
  {
    icon: Globe,
    title: '全球配送',
    description: '支持多国配送，冷链物流全程保鲜，让全球用户享受优质农产品',
    gradient: 'from-rose-500 to-pink-500',
    shadowColor: 'shadow-rose-500/30'
  }
];

export function Features() {
  return (
    <section className="relative py-32 bg-slate-950 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      <div className="container-custom relative z-10">
        {/* 标题区域 */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
            平台优势
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            为什么选择<span className="text-gradient">钜园农业</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            融合区块链技术与现代农业，打造值得信赖的农产品生态系统
          </p>
        </div>

        {/* 特性网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl hover:border-slate-700 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 悬浮光晕 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
              
              {/* 图标 */}
              <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 ${feature.shadowColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              {/* 内容 */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* 装饰线 */}
              <div className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
