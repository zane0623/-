'use client';

import { useState, useMemo } from 'react';
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
  Tag,
  Download,
  Upload,
  MoreVertical,
  Copy,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Leaf,
  MapPin,
  Calendar,
  DollarSign,
  Boxes,
  Star,
  Link2,
  QrCode,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  icon: string;
  category: string;
  origin: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sold: number;
  status: 'active' | 'inactive' | 'out_of_stock' | 'pending';
  description: string;
  specification: string;
  qualityGrade: string;
  harvestDate?: string;
  shelfLife?: string;
  weight: string;
  nftTokenId?: string;
  blockchainHash?: string;
  presaleId?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

const initialProducts: Product[] = [
  { 
    id: '1', 
    name: '阳光玫瑰葡萄', 
    icon: '🍇', 
    category: '水果', 
    origin: '云南红河', 
    price: 299, 
    originalPrice: 399,
    stock: 1000, 
    sold: 456,
    status: 'active', 
    description: '云南红河优质阳光玫瑰葡萄，皮薄肉厚，香甜可口，无籽，口感细腻，带有淡淡的玫瑰香气', 
    specification: '精选级',
    qualityGrade: '特级',
    harvestDate: '2024-08-15',
    shelfLife: '7天',
    weight: '2kg/箱',
    nftTokenId: 'NFT-001',
    blockchainHash: '0x1234...abcd',
    presaleId: 'PS-001',
    images: ['/images/grape1.jpg', '/images/grape2.jpg'],
    rating: 4.9,
    reviewCount: 128,
    createdAt: '2024-01-01',
    updatedAt: '2024-12-20'
  },
  { 
    id: '2', 
    name: '赣南脐橙', 
    icon: '🍊', 
    category: '水果', 
    origin: '江西赣州', 
    price: 199, 
    originalPrice: 259,
    stock: 2000, 
    sold: 892,
    status: 'active', 
    description: '江西赣州正宗脐橙，酸甜多汁，富含维生素C',
    specification: '标准级',
    qualityGrade: '一级',
    harvestDate: '2024-11-01',
    shelfLife: '15天',
    weight: '5kg/箱',
    nftTokenId: 'NFT-002',
    blockchainHash: '0x5678...efgh',
    images: [],
    rating: 4.7,
    reviewCount: 256,
    createdAt: '2024-01-05',
    updatedAt: '2024-12-18'
  },
  { 
    id: '3', 
    name: '五常大米', 
    icon: '🌾', 
    category: '粮食', 
    origin: '黑龙江五常', 
    price: 499, 
    stock: 0, 
    sold: 2341,
    status: 'out_of_stock', 
    description: '黑龙江五常有机大米，香糯可口，颗粒饱满',
    specification: '有机认证',
    qualityGrade: '特级',
    harvestDate: '2024-09-20',
    shelfLife: '12个月',
    weight: '10kg/袋',
    images: [],
    rating: 4.8,
    reviewCount: 512,
    createdAt: '2024-01-10',
    updatedAt: '2024-12-15'
  },
  { 
    id: '4', 
    name: '烟台红富士', 
    icon: '🍎', 
    category: '水果', 
    origin: '山东烟台', 
    price: 259, 
    stock: 800, 
    sold: 234,
    status: 'active', 
    description: '山东烟台红富士苹果，脆甜爽口，色泽红润',
    specification: '精品级',
    qualityGrade: '一级',
    harvestDate: '2024-10-10',
    shelfLife: '30天',
    weight: '5kg/箱',
    images: [],
    rating: 4.6,
    reviewCount: 89,
    createdAt: '2024-01-12',
    updatedAt: '2024-12-10'
  },
  { 
    id: '5', 
    name: '新疆哈密瓜', 
    icon: '🍈', 
    category: '水果', 
    origin: '新疆哈密', 
    price: 168, 
    stock: 500, 
    sold: 123,
    status: 'pending', 
    description: '新疆正宗哈密瓜，蜜甜可口，果肉厚实',
    specification: '精选级',
    qualityGrade: '特级',
    harvestDate: '2024-07-15',
    shelfLife: '10天',
    weight: '单个约3kg',
    images: [],
    rating: 4.5,
    reviewCount: 45,
    createdAt: '2024-01-15',
    updatedAt: '2024-12-05'
  },
  { 
    id: '6', 
    name: '恐龙蛋荔枝', 
    icon: '🍒', 
    category: '水果', 
    origin: '广东茂名', 
    price: 399, 
    originalPrice: 599,
    stock: 300, 
    sold: 567,
    status: 'active', 
    description: '广东茂名恐龙蛋荔枝，果大核小，肉厚汁多，甜度极高',
    specification: '限量版',
    qualityGrade: '特级',
    harvestDate: '2024-06-01',
    shelfLife: '3天',
    weight: '2.5kg/箱',
    nftTokenId: 'NFT-006',
    blockchainHash: '0xabcd...1234',
    presaleId: 'PS-002',
    images: [],
    rating: 5.0,
    reviewCount: 203,
    createdAt: '2024-02-01',
    updatedAt: '2024-12-22'
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; darkBgColor: string; icon: React.ReactNode }> = {
  active: { label: '在售', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', darkBgColor: 'dark:bg-emerald-900/30', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  inactive: { label: '下架', color: 'text-gray-700 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-700', darkBgColor: 'dark:bg-gray-700', icon: <XCircle className="w-3.5 h-3.5" /> },
  out_of_stock: { label: '缺货', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', darkBgColor: 'dark:bg-red-900/30', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  pending: { label: '待审核', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', darkBgColor: 'dark:bg-amber-900/30', icon: <RefreshCw className="w-3.5 h-3.5" /> }
};

const categories = ['水果', '粮食', '蔬菜', '肉类', '海鲜', '乳制品', '茶叶', '特产'];
const qualityGrades = ['特级', '一级', '二级', '普通'];
const specifications = ['精选级', '标准级', '精品级', '限量版', '有机认证'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'sold' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [formData, setFormData] = useState({
    name: '',
    icon: '🍇',
    category: '水果',
    origin: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    description: '',
    specification: '标准级',
    qualityGrade: '一级',
    weight: '',
    shelfLife: '',
  });

  // 统计数据
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const outOfStock = products.filter(p => p.status === 'out_of_stock').length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sold), 0);
    return { total, active, outOfStock, totalStock, totalSold, totalRevenue };
  }, [products]);

  // 筛选和排序
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !p.origin.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedStatus && p.status !== selectedStatus) return false;
      return true;
    });

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'sold':
          comparison = a.sold - b.sold;
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const iconOptions = ['🍇', '🍊', '🌾', '🍎', '🍈', '🥕', '🍓', '🫐', '🥬', '🌽', '🥩', '🐟', '🥛', '🍒', '🍑', '🥭', '🍋', '🍉', '🥑', '🌶️'];

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
      sold: 0,
      status: 'pending',
      images: [],
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    setProducts(prev => [newProduct, ...prev]);
    showToast.success('创建成功', `产品 ${formData.name} 已添加，等待审核`);
    setShowCreateModal(false);
    resetForm();
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({ 
      name: '', icon: '🍇', category: '水果', origin: '', 
      price: 0, originalPrice: 0, stock: 0, description: '',
      specification: '标准级', qualityGrade: '一级', weight: '', shelfLife: ''
    });
  };

  // 编辑产品
  const handleEdit = async () => {
    if (!editProduct) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedProduct = {
      ...editProduct,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setProducts(prev => prev.map(p => p.id === editProduct.id ? updatedProduct : p));
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

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedProducts.length === 0) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
    showToast.success('批量删除成功', `已删除 ${selectedProducts.length} 个产品`);
    setSelectedProducts([]);
    setIsLoading(false);
  };

  // 切换状态
  const toggleStatus = (product: Product, newStatus: 'active' | 'inactive') => {
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : p
    ));
    showToast.success(
      newStatus === 'active' ? '已上架' : '已下架',
      `产品 ${product.name} 已${newStatus === 'active' ? '上架' : '下架'}`
    );
  };

  // 审核通过
  const handleApprove = (product: Product) => {
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, status: 'active', updatedAt: new Date().toISOString().split('T')[0] } : p
    ));
    showToast.success('审核通过', `产品 ${product.name} 已上架`);
  };

  // 复制产品ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    showToast.success('已复制', '产品ID已复制到剪贴板');
  };

  // 导出产品
  const handleExport = () => {
    const data = JSON.stringify(products, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast.success('导出成功', '产品数据已导出');
  };

  // 选择产品
  const toggleSelectProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <ToastContainer />
        
        <main className="flex-1 overflow-auto p-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">总产品</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">在售</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.outOfStock}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">缺货</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Boxes className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStock.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">总库存</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSold.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">已售出</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">¥{(stats.totalRevenue / 10000).toFixed(1)}万</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">总销售额</p>
                </div>
              </div>
            </div>
          </div>

          {/* 页面标题和操作 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">产品管理</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">管理所有农产品信息，控制上下架和库存</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedProducts.length > 0 && (
                <button
                  onClick={handleBatchDelete}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
                >
                  删除选中 ({selectedProducts.length})
                </button>
              )}
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-emerald-500/30"
              >
                <Plus className="w-5 h-5" />
                添加产品
              </button>
            </div>
          </div>

          {/* 筛选栏 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索产品名称或产地..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">全部分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">全部状态</option>
                <option value="active">在售</option>
                <option value="inactive">下架</option>
                <option value="out_of_stock">缺货</option>
                <option value="pending">待审核</option>
              </select>
              <select 
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(by);
                  setSortOrder(order);
                }}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="createdAt-desc">最新添加</option>
                <option value="createdAt-asc">最早添加</option>
                <option value="price-desc">价格从高到低</option>
                <option value="price-asc">价格从低到高</option>
                <option value="stock-desc">库存从多到少</option>
                <option value="stock-asc">库存从少到多</option>
                <option value="sold-desc">销量从高到低</option>
                <option value="name-asc">名称 A-Z</option>
              </select>
            </div>
          </div>

          {/* 产品网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all animate-fade-in-up ${
                  selectedProducts.includes(product.id) 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* 选择框 */}
                <div className="p-4 pb-0 flex items-center justify-between">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelectProduct(product.id)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusConfig[product.status].bgColor} ${statusConfig[product.status].color}`}>
                    {statusConfig[product.status].icon}
                    {statusConfig[product.status].label}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-4xl">
                      {product.icon}
                    </div>
                    {product.nftTokenId && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-medium flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        NFT
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {product.origin}
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    {product.category}
                  </div>

                  {/* 评分 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({product.reviewCount}条评价)</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">¥{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="ml-2 text-sm text-gray-400 line-through">¥{product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>库存: <b className={product.stock < 100 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}>{product.stock}</b></span>
                    <span>已售: <b className="text-emerald-600 dark:text-emerald-400">{product.sold}</b></span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDetailProduct(product)}
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      查看详情
                    </button>
                    <button
                      onClick={() => setEditProduct({...product})}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {product.status === 'pending' ? (
                      <button
                        onClick={() => handleApprove(product)}
                        className="px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                        title="通过审核"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleStatus(product, product.status === 'active' ? 'inactive' : 'active')}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          product.status === 'active'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200'
                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'
                        }`}
                        title={product.status === 'active' ? '下架' : '上架'}
                      >
                        {product.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteProduct(product)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无产品</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">未找到符合条件的产品</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                添加第一个产品
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 创建产品弹窗 */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title="添加新产品"
        size="lg"
      >
        <div className="space-y-5">
          {/* 基本信息 */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              基本信息
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">产品名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none transition-all"
                  placeholder="例如：阳光玫瑰葡萄"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 产品图标 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">产品图标</label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    formData.icon === icon 
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 ring-2 ring-emerald-500' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* 产地和规格 */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">产地 *</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                placeholder="例如：云南红河"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">规格等级</label>
              <select
                value={formData.specification}
                onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
              >
                {specifications.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">质量等级</label>
              <select
                value={formData.qualityGrade}
                onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
              >
                {qualityGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 价格和库存 */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              价格与库存
            </h4>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">售价 (元) *</label>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                  placeholder="299"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">原价 (元)</label>
                <input
                  type="number"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                  placeholder="399"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">库存数量 *</label>
                <input
                  type="number"
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">规格重量</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                  placeholder="2kg/箱"
                />
              </div>
            </div>
          </div>

          {/* 产品描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">产品描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none resize-none"
              placeholder="详细描述产品特点、口感、产地优势等..."
            />
          </div>

          {/* 保质期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">保质期</label>
            <input
              type="text"
              value={formData.shelfLife}
              onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
              placeholder="例如：7天、15天、12个月"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => { setShowCreateModal(false); resetForm(); }}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading || !formData.name || !formData.origin || !formData.price}
              className="flex-1 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        size="lg"
      >
        {detailProduct && (
          <div className="space-y-6">
            {/* 头部信息 */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="w-20 h-20 bg-white dark:bg-gray-600 rounded-xl flex items-center justify-center text-5xl shadow-sm">
                {detailProduct.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{detailProduct.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[detailProduct.status].bgColor} ${statusConfig[detailProduct.status].color}`}>
                    {statusConfig[detailProduct.status].label}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{detailProduct.category} · {detailProduct.origin}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">{detailProduct.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">({detailProduct.reviewCount}条评价)</span>
                  {detailProduct.nftTokenId && (
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                      NFT: {detailProduct.nftTokenId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 数据统计 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">¥{detailProduct.price}</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-500">售价</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{detailProduct.stock}</p>
                <p className="text-sm text-blue-700 dark:text-blue-500">库存</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{detailProduct.sold}</p>
                <p className="text-sm text-purple-700 dark:text-purple-500">已售</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">¥{(detailProduct.price * detailProduct.sold).toLocaleString()}</p>
                <p className="text-sm text-amber-700 dark:text-amber-500">销售额</p>
              </div>
            </div>

            {/* 详细信息 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">规格等级</span>
                  <span className="font-medium text-gray-900 dark:text-white">{detailProduct.specification}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">质量等级</span>
                  <span className="font-medium text-gray-900 dark:text-white">{detailProduct.qualityGrade}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">规格重量</span>
                  <span className="font-medium text-gray-900 dark:text-white">{detailProduct.weight || '-'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">采摘日期</span>
                  <span className="font-medium text-gray-900 dark:text-white">{detailProduct.harvestDate || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">保质期</span>
                  <span className="font-medium text-gray-900 dark:text-white">{detailProduct.shelfLife || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">创建时间</span>
                  <span className="font-medium text-gray-900 dark:text-white">{detailProduct.createdAt}</span>
                </div>
              </div>
            </div>

            {/* 区块链信息 */}
            {detailProduct.blockchainHash && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  区块链信息
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">NFT Token ID</span>
                    <span className="font-mono text-gray-900 dark:text-white">{detailProduct.nftTokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">交易哈希</span>
                    <button 
                      onClick={() => handleCopyId(detailProduct.blockchainHash!)}
                      className="font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      {detailProduct.blockchainHash}
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 产品描述 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">产品描述</h4>
              <p className="text-gray-600 dark:text-gray-400">{detailProduct.description || '暂无描述'}</p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => { setDetailProduct(null); setEditProduct({...detailProduct}); }}
                className="flex-1 px-4 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                编辑产品
              </button>
              <button
                onClick={() => setDetailProduct(null)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                关闭
              </button>
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
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">产品名称</label>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分类</label>
                <select
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">产地</label>
                <input
                  type="text"
                  value={editProduct.origin}
                  onChange={(e) => setEditProduct({ ...editProduct, origin: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">规格等级</label>
                <select
                  value={editProduct.specification}
                  onChange={(e) => setEditProduct({ ...editProduct, specification: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                >
                  {specifications.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">质量等级</label>
                <select
                  value={editProduct.qualityGrade}
                  onChange={(e) => setEditProduct({ ...editProduct, qualityGrade: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                >
                  {qualityGrades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">售价 (元)</label>
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">原价 (元)</label>
                <input
                  type="number"
                  value={editProduct.originalPrice || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, originalPrice: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">库存</label>
                <input
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">规格重量</label>
                <input
                  type="text"
                  value={editProduct.weight}
                  onChange={(e) => setEditProduct({ ...editProduct, weight: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">产品描述</label>
              <textarea
                value={editProduct.description}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setEditProduct(null)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
        message={`确定要删除产品「${deleteProduct?.name}」吗？此操作不可撤销，相关的NFT和预售信息可能会受到影响。`}
        type="danger"
        confirmText="确认删除"
        loading={isLoading}
      />
    </div>
  );
}
