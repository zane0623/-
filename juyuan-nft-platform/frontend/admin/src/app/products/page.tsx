'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Star,
  TrendingUp,
  Leaf
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  icon: string;
  category: string;
  origin: string;
  price: number;
  stock: number;
  sold: number;
  status: 'active' | 'draft' | 'archived';
  rating: number;
  images: string[];
  createdAt: string;
}

const products: Product[] = [
  {
    id: '1',
    name: '阳光玫瑰葡萄',
    icon: '🍇',
    category: '新鲜水果',
    origin: '云南红河',
    price: 299,
    stock: 320,
    sold: 680,
    status: 'active',
    rating: 4.9,
    images: ['/grape1.jpg'],
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: '赣南脐橙',
    icon: '🍊',
    category: '新鲜水果',
    origin: '江西赣州',
    price: 199,
    stock: 500,
    sold: 1500,
    status: 'active',
    rating: 4.8,
    images: ['/orange1.jpg'],
    createdAt: '2024-01-05'
  },
  {
    id: '3',
    name: '五常大米',
    icon: '🌾',
    category: '粮油主食',
    origin: '黑龙江五常',
    price: 499,
    stock: 0,
    sold: 500,
    status: 'archived',
    rating: 5.0,
    images: ['/rice1.jpg'],
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    name: '烟台红富士',
    icon: '🍎',
    category: '新鲜水果',
    origin: '山东烟台',
    price: 259,
    stock: 480,
    sold: 320,
    status: 'active',
    rating: 4.7,
    images: ['/apple1.jpg'],
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    name: '新疆哈密瓜',
    icon: '🍈',
    category: '新鲜水果',
    origin: '新疆哈密',
    price: 168,
    stock: 200,
    sold: 0,
    status: 'draft',
    rating: 0,
    images: ['/melon1.jpg'],
    createdAt: '2024-01-15'
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  active: { label: '在售', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  draft: { label: '草稿', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  archived: { label: '已下架', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter(p => {
    if (searchQuery && !p.name.includes(searchQuery)) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  const stats = [
    { label: '全部产品', value: products.length },
    { label: '在售', value: products.filter(p => p.status === 'active').length },
    { label: '草稿', value: products.filter(p => p.status === 'draft').length },
    { label: '已下架', value: products.filter(p => p.status === 'archived').length },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
              <p className="text-gray-500 mt-1">管理平台上的所有农产品</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              添加产品
            </button>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 筛选和搜索 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索产品名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">全部分类</option>
                <option value="新鲜水果">新鲜水果</option>
                <option value="粮油主食">粮油主食</option>
                <option value="蔬菜">蔬菜</option>
              </select>
              <select className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500">
                <option value="">全部状态</option>
                <option value="active">在售</option>
                <option value="draft">草稿</option>
                <option value="archived">已下架</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100">
                <Filter className="w-4 h-4" />
                更多筛选
              </button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 产品列表 - 网格视图 */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const status = statusConfig[product.status];
                return (
                  <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                    {/* 产品图片 */}
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative flex items-center justify-center">
                      <span className="text-8xl">{product.icon}</span>
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50">
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* 产品信息 */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                        <Leaf className="w-4 h-4" />
                        {product.origin}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-emerald-600">¥{product.price}</span>
                        <span className="text-sm text-gray-500">库存: {product.stock}</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          已售 {product.sold}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 产品列表 - 列表视图 */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">产品</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">分类</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">产地</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">价格</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">库存/销量</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const status = statusConfig[product.status];
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                              {product.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{product.name}</p>
                              {product.rating > 0 && (
                                <div className="flex items-center gap-1 text-amber-500 mt-1">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="text-xs">{product.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.origin}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-emerald-600">¥{product.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                              {product.stock}
                            </span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-emerald-600">{product.sold}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-5 h-5 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit className="w-5 h-5 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

