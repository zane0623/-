'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Package,
  Image as ImageIcon,
  Tag
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  icon: string;
  category: string;
  origin: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  description: string;
  createdAt: string;
}

const initialProducts: Product[] = [
  { id: '1', name: '阳光玫瑰葡萄', icon: '🍇', category: '水果', origin: '云南红河', price: 299, stock: 1000, status: 'active', description: '云南红河优质阳光玫瑰葡萄，皮薄肉厚，香甜可口', createdAt: '2024-01-01' },
  { id: '2', name: '赣南脐橙', icon: '🍊', category: '水果', origin: '江西赣州', price: 199, stock: 2000, status: 'active', description: '江西赣州正宗脐橙，酸甜多汁', createdAt: '2024-01-05' },
  { id: '3', name: '五常大米', icon: '🌾', category: '粮食', origin: '黑龙江五常', price: 499, stock: 0, status: 'out_of_stock', description: '黑龙江五常有机大米，香糯可口', createdAt: '2024-01-10' },
  { id: '4', name: '烟台红富士', icon: '🍎', category: '水果', origin: '山东烟台', price: 259, stock: 800, status: 'active', description: '山东烟台红富士苹果，脆甜爽口', createdAt: '2024-01-12' },
  { id: '5', name: '新疆哈密瓜', icon: '🍈', category: '水果', origin: '新疆', price: 168, stock: 500, status: 'inactive', description: '新疆正宗哈密瓜，蜜甜可口', createdAt: '2024-01-15' },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  active: { label: '在售', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  inactive: { label: '下架', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  out_of_stock: { label: '缺货', color: 'text-red-700', bgColor: 'bg-red-100' }
};

const categories = ['水果', '粮食', '蔬菜', '肉类', '海鲜', '乳制品'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    icon: '🍇',
    category: '水果',
    origin: '',
    price: 0,
    stock: 0,
    description: '',
  });

  const filteredProducts = products.filter(p => {
    if (searchQuery && !p.name.includes(searchQuery)) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    return true;
  });

  const iconOptions = ['🍇', '🍊', '🌾', '🍎', '🍈', '🥕', '🍓', '🫐', '🥬', '🌽', '🥩', '🐟', '🥛'];

  // 创建产品
  const handleCreate = async () => {
    if (!formData.name || !formData.origin) {
      showToast.warning('请填写必填项', '产品名称和产地不能为空');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProduct: Product = {
      id: `${Date.now()}`,
      ...formData,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setProducts(prev => [newProduct, ...prev]);
    showToast.success('创建成功', `产品 ${formData.name} 已添加`);
    setShowCreateModal(false);
    setFormData({ name: '', icon: '🍇', category: '水果', origin: '', price: 0, stock: 0, description: '' });
    setIsLoading(false);
  };

  // 编辑产品
  const handleEdit = async () => {
    if (!editProduct) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProducts(prev => prev.map(p => p.id === editProduct.id ? editProduct : p));
    showToast.success('保存成功', `产品 ${editProduct.name} 已更新`);
    setEditProduct(null);
    setIsLoading(false);
  };

  // 删除产品
  const handleDelete = async () => {
    if (!deleteProduct) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
    showToast.success('删除成功', `产品 ${deleteProduct.name} 已删除`);
    setDeleteProduct(null);
    setIsLoading(false);
  };

  // 切换状态
  const toggleStatus = (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, status: newStatus as 'active' | 'inactive' } : p
    ));
    showToast.success(
      newStatus === 'active' ? '已上架' : '已下架',
      `产品 ${product.name} 已${newStatus === 'active' ? '上架' : '下架'}`
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <ToastContainer />
        
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
              <p className="text-gray-500 mt-1">管理所有农产品信息</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              添加产品
            </button>
          </div>

          {/* 筛选栏 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
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
                <option value="">全部分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 产品网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center text-4xl">
                      {product.icon}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[product.status].bgColor} ${statusConfig[product.status].color}`}>
                      {statusConfig[product.status].label}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{product.origin}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-emerald-600">¥{product.price}</span>
                    <span className="text-sm text-gray-500">库存: {product.stock}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setDetailProduct(product)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => setEditProduct({...product})}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleStatus(product)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        product.status === 'active'
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                    >
                      {product.status === 'active' ? '下架' : '上架'}
                    </button>
                    <button
                      onClick={() => setDeleteProduct(product)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* 创建产品弹窗 */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="添加产品"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">产品名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                placeholder="例如：阳光玫瑰葡萄"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">产品图标</label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    formData.icon === icon 
                      ? 'bg-emerald-100 ring-2 ring-emerald-500' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">产地 *</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                placeholder="例如：云南红河"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">单价 (元)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">库存</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">产品描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? '添加中...' : '添加产品'}
            </button>
          </div>
        </div>
      </Modal>

      {/* 产品详情弹窗 */}
      <Modal
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        title="产品详情"
        size="md"
      >
        {detailProduct && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-5xl shadow-sm">
                {detailProduct.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{detailProduct.name}</h3>
                <p className="text-gray-500">{detailProduct.category} · {detailProduct.origin}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-emerald-600">¥{detailProduct.price}</p>
                <p className="text-sm text-emerald-700">单价</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-600">{detailProduct.stock}</p>
                <p className="text-sm text-blue-700">库存</p>
              </div>
              <div className="p-4 bg-violet-50 rounded-xl text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[detailProduct.status].bgColor} ${statusConfig[detailProduct.status].color}`}>
                  {statusConfig[detailProduct.status].label}
                </span>
                <p className="text-sm text-violet-700 mt-1">状态</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-700 mb-2">产品描述</h4>
              <p className="text-gray-600">{detailProduct.description || '暂无描述'}</p>
            </div>

            <div className="text-sm text-gray-500">
              创建时间：{detailProduct.createdAt}
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑产品弹窗 */}
      <Modal
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        title="编辑产品"
        size="lg"
      >
        {editProduct && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品名称</label>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                <select
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产地</label>
                <input
                  type="text"
                  value={editProduct.origin}
                  onChange={(e) => setEditProduct({ ...editProduct, origin: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">单价 (元)</label>
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">库存</label>
                <input
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">产品描述</label>
              <textarea
                value={editProduct.description}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setEditProduct(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? '保存中...' : '保存更改'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 删除确认 */}
      <ConfirmDialog
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
        title="删除产品"
        message={`确定要删除产品 ${deleteProduct?.name} 吗？此操作不可撤销。`}
        type="danger"
        confirmText="确认删除"
        loading={isLoading}
      />
    </div>
  );
}
