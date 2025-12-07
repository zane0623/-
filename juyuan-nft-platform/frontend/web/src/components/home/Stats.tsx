'use client';

import { TrendingUp, Users, Award, Globe } from 'lucide-react';

const stats = [
  { 
    icon: TrendingUp, 
    value: '¥2,500,000+', 
    label: '累计交易额',
    change: '+156%',
    changeLabel: '较上月'
  },
  { 
    icon: Users, 
    value: '50,000+', 
    label: '注册用户',
    change: '+89%',
    changeLabel: '较上月'
  },
  { 
    icon: Award, 
    value: '100+', 
    label: '合作农场',
    change: '+23',
    changeLabel: '本月新增'
  },
  { 
    icon: Globe, 
    value: '8', 
    label: '覆盖地区',
    change: '+2',
    changeLabel: '本月新增'
  }
];

export function Stats() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700" />
      
      {/* 装饰图案 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
      
      {/* 噪点纹理 */}
      <div className="absolute inset-0 noise-texture" />
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            平台数据一览
          </h2>
          <p className="text-xl text-emerald-100/80">
            持续增长，值得信赖
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 图标 */}
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              {/* 数值 */}
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              
              {/* 标签 */}
              <div className="text-lg text-emerald-100/80 mb-4">
                {stat.label}
              </div>
              
              {/* 增长指标 */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold text-white">
                  {stat.change}
                </span>
                <span className="text-sm text-emerald-100/60">
                  {stat.changeLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
