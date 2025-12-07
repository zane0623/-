'use client';

import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';

const products = [
  {
    id: 1,
    name: '阳光玫瑰葡萄',
    origin: '云南大理',
    price: 299,
    originalPrice: 399,
    image: '🍇',
    harvestDate: '2024-06-20',
    sold: 680,
    total: 1000,
    status: 'active',
    grade: '特级'
  },
  {
    id: 2,
    name: '赣南脐橙',
    origin: '江西赣州',
    price: 199,
    originalPrice: 259,
    image: '🍊',
    harvestDate: '2024-11-15',
    sold: 1500,
    total: 2000,
    status: 'active',
    grade: '优级'
  },
  {
    id: 3,
    name: '五常大米',
    origin: '黑龙江五常',
    price: 499,
    originalPrice: 599,
    image: '🌾',
    harvestDate: '2024-10-01',
    sold: 500,
    total: 500,
    status: 'soldout',
    grade: '特级'
  },
  {
    id: 4,
    name: '烟台红富士',
    origin: '山东烟台',
    price: 259,
    originalPrice: 329,
    image: '🍎',
    harvestDate: '2024-09-15',
    sold: 320,
    total: 800,
    status: 'upcoming',
    grade: '优级'
  }
];

export function FeaturedProducts() {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: '预售中' },
      upcoming: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: '即将开售' },
      soldout: { bg: 'bg-slate-500/20', text: 'text-slate-400', label: '已售罄' }
    };
    const style = styles[status];
    return (
      <span className={`px-3 py-1 ${style.bg} ${style.text} text-xs font-semibold rounded-full border border-current/20`}>
        {style.label}
      </span>
    );
  };

  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        {/* 标题区域 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              精选预售
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              热门<span className="text-gradient">农产品</span>NFT
            </h2>
            <p className="text-xl text-slate-400">
              精心挑选，品质保证，限量发售
            </p>
          </div>
          <Link
            href="/presale"
            className="group inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors mt-6 md:mt-0"
          >
            查看全部
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 产品网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 产品图片区域 */}
              <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                <span className="text-8xl group-hover:scale-125 transition-transform duration-500">
                  {product.image}
                </span>
                
                {/* 状态标签 */}
                <div className="absolute top-4 left-4">
                  {getStatusBadge(product.status)}
                </div>
                
                {/* 品质标签 */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-amber-400 font-medium">{product.grade}</span>
                </div>

                {/* 悬浮遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
              </div>

              {/* 产品信息 */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {product.origin}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {product.harvestDate}
                  </span>
                </div>

                {/* 进度条 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">销售进度</span>
                    <span className="text-emerald-400 font-medium">
                      {Math.round((product.sold / product.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${(product.sold / product.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 价格和按钮 */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div>
                    <span className="text-2xl font-bold text-emerald-400">¥{product.price}</span>
                    <span className="text-sm text-slate-500 line-through ml-2">¥{product.originalPrice}</span>
                  </div>
                  <button
                    disabled={product.status !== 'active'}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      product.status === 'active'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {product.status === 'active' ? '立即购买' : product.status === 'upcoming' ? '即将开售' : '已售罄'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
