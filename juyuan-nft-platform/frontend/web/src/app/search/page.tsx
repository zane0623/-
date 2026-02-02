'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  image?: string;
  status: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // 筛选状态
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'popularity'>('popularity');

  useEffect(() => {
    if (query) {
      // 模拟搜索API调用
      setLoading(true);
      setTimeout(() => {
        const mockProducts: Product[] = [
          { id: '1', name: '阳光玫瑰葡萄', type: '葡萄', price: 299, status: 'active' },
          { id: '2', name: '赣南脐橙', type: '橙子', price: 199, status: 'active' },
          { id: '3', name: '五常大米', type: '大米', price: 159, status: 'active' },
        ].filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.type.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(mockProducts);
        setLoading(false);
      }, 500);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const filteredProducts = products
    .filter(p => {
      if (selectedType && p.type !== selectedType) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'date':
          return 0; // 需要日期字段
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container-custom">
          {/* 搜索头部 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {query ? `搜索结果: "${query}"` : '搜索产品'}
            </h1>
            <p className="text-slate-400">
              {query ? `找到 ${filteredProducts.length} 个结果` : '请输入搜索关键词'}
            </p>
          </div>

          {/* 筛选和排序栏 */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              筛选
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="popularity">按热度</option>
              <option value="price">按价格</option>
              <option value="date">按日期</option>
            </select>
          </div>

          {/* 筛选面板 */}
          {showFilters && (
            <div className="mb-6 p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    价格范围: ¥{priceRange[0]} - ¥{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    产品类型
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">全部类型</option>
                    <option value="葡萄">葡萄</option>
                    <option value="橙子">橙子</option>
                    <option value="大米">大米</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 搜索结果 */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              <p className="mt-4 text-slate-400">搜索中...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-xl text-slate-400 mb-2">未找到相关产品</p>
              <p className="text-slate-500">请尝试其他关键词</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg mb-4 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-4xl">🌾</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{product.type}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-400">¥{product.price}</span>
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                      查看详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
