'use client';

import Link from 'next/link';
import { ArrowRight, Play, Shield, Leaf, Sparkles, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      {/* 动态光球 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-blob delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
      
      {/* 浮动装饰元素 */}
      <div className="absolute top-20 left-10 animate-float delay-100">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur rounded-2xl border border-emerald-500/20 flex items-center justify-center">
          <Leaf className="w-8 h-8 text-emerald-400" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float delay-300">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur rounded-xl border border-amber-500/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 animate-float delay-500">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur rounded-lg border border-blue-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-blue-400" />
        </div>
      </div>
      <div className="absolute bottom-32 right-32 animate-float delay-700">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur rounded-lg border border-purple-500/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* 标签 */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8 animate-fade-in-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-sm font-medium">
              区块链溯源 · 品质保障 · 新鲜直达
            </span>
          </div>

          {/* 主标题 */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in-up delay-100">
            <span className="block mb-2">农产品NFT</span>
            <span className="text-gradient">预售平台</span>
          </h1>

          {/* 副标题 */}
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            全球首创区块链农产品溯源NFT平台，
            <br className="hidden md:block" />
            让每一份农产品都有<span className="text-emerald-400 font-semibold">可追溯的数字身份</span>
          </p>

          {/* CTA按钮组 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
            <Link
              href="/presale"
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                开始探索
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <button className="group flex items-center gap-3 px-8 py-4 bg-slate-800/50 backdrop-blur border border-slate-700 text-white font-semibold rounded-2xl hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Play className="w-4 h-4 text-emerald-400 ml-0.5" />
              </div>
              观看介绍视频
            </button>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up delay-400">
            {[
              { value: '10,000+', label: 'NFT已铸造', icon: '🎨' },
              { value: '5,000+', label: '活跃用户', icon: '👥' },
              { value: '50+', label: '合作农场', icon: '🌾' },
              { value: '¥2M+', label: '交易金额', icon: '💰' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="group relative p-6 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <span className="text-3xl mb-2 block">{stat.icon}</span>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部渐变 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* 滚动提示 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-soft">
        <div className="w-8 h-12 border-2 border-slate-600 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
