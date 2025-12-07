'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Leaf } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* 深色渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* 装饰光球 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* 主卡片 */}
          <div className="relative p-12 md:p-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-[3rem] overflow-hidden">
            {/* 卡片内光效 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
            
            {/* 浮动装饰 */}
            <div className="absolute top-10 left-10 animate-float">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div className="absolute top-20 right-16 animate-float delay-300">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="absolute bottom-16 left-20 animate-float delay-500">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            
            {/* 内容 */}
            <div className="text-center relative z-10">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                限时优惠进行中
              </span>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                立即加入
                <span className="text-gradient"> 钜园农业</span>
              </h2>
              
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                注册即可获得新用户专属优惠，开启您的区块链农产品之旅
                <br />
                <span className="text-emerald-400 font-semibold">首次购买享9折优惠</span>
              </p>
              
              {/* 按钮组 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/presale"
                  className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    开始购买
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                
                <Link
                  href="/about"
                  className="px-10 py-5 bg-transparent border-2 border-slate-600 text-white font-semibold text-lg rounded-2xl hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300"
                >
                  了解更多
                </Link>
              </div>
              
              {/* 信任标识 */}
              <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-500">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">安全支付</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Leaf className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">品质保障</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">区块链认证</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
