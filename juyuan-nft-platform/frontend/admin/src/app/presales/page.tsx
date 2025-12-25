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
  Play,
  Pause,
  Search,
  Calendar,
  Package,
  Users,
  TrendingUp
} from 'lucide-react';

interface Presale {
  id: string;
  productType: string;
  icon: string;
  maxSupply: number;
  currentSupply: number;
  price: number;
  status: 'upcoming' | 'active' | 'ended' | 'cancelled';
  startTime: string;
  endTime: string;
  description: string;
  whitelistOnly: boolean;
  whitelistCount: number;
}

const initialPresales: Presale[] = [
  { id: '1', productType: '阳光玫瑰葡萄', icon: '🍇', maxSupply: 1000, currentSupply: 680, price: 299, status: 'active', startTime: '2024-01-15', endTime: '2024-02-15', description: '云南红河优质阳光玫瑰葡萄', whitelistOnly: false, whitelistCount: 0 },
  { id: '2', productType: '赣南脐橙', icon: '🍊', maxSupply: 2000, currentSupply: 1500, price: 199, status: 'active', startTime: '2024-01-10', endTime: '2024-02-10', description: '江西赣州正宗脐橙', whitelistOnly: false, whitelistCount: 0 },
  { id: '3', productType: '五常大米', icon: '🌾', maxSupply: 500, currentSupply: 500, price: 499, status: 'ended', startTime: '2024-01-01', endTime: '2024-01-31', description: '黑龙江五常有机大米', whitelistOnly: true, whitelistCount: 200 },
  { id: '4', productType: '新疆哈密瓜', icon: '🍈', maxSupply: 800, currentSupply: 0, price: 168, status: 'upcoming', startTime: '2024-02-01', endTime: '2024-03-01', description: '新疆正宗哈密瓜', whitelistOnly: true, whitelistCount: 150 },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  upcoming: { label: '即将开售', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  active: { label: '预售中', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  ended: { label: '已结束', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  cancelled: { label: '已取消', color: 'text-red-700', bgColor: 'bg-red-100' }
};

export default function PresalesPage() {
  const [presales, setPresales] = useState<Presale[]>(initialPresales);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editPresale, setEditPresale] = useState<Presale | null>(null);
  const [detailPresale, setDetailPresale] = useState<Presale | null>(null);
  const [cancelPresale, setCancelPresale] = useState<Presale | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    productType: '',
    icon: '🍇',
    maxSupply: 1000,
    price: 299,
    startTime: '',
    endTime: '',
    description: '',
    whitelistOnly: false,
  });

  const filteredPresales = presales.filter(p => {
    if (searchQuery && !p.productType.includes(searchQuery)) return false;
    if (selectedStatus && p.status !== selectedStatus) return false;
    return true;
  });

  const stats = [
    { label: '活跃预售', value: presales.filter(p => p.status === 'active').length, icon: Play, color: 'text-emerald-600' },
    { label: '总销售额', value: `¥${presales.reduce((sum, p) => sum + p.currentSupply * p.price, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600' },
    { label: '总NFT铸造', value: presales.reduce((sum, p) => sum + p.currentSupply, 0), icon: Package, color: 'text-violet-600' },
    { label: '白名单用户', value: presales.reduce((sum, p) => sum + p.whitelistCount, 0), icon: Users, color: 'text-amber-600' },
  ];

  // 创建预售
  const handleCreate = async () => {
    if (!formData.productType || !formData.startTime || !formData.endTime) {
      showToast.warning('请填写必填项', '产品名称和时间不能为空');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPresale: Presale = {
      id: `${Date.now()}`,
      ...formData,
      currentSupply: 0,
      status: 'upcoming',
      whitelistCount: 0,
    };
    
    setPresales(prev => [newPresale, ...prev]);
    showToast.success('创建成功', `预售 ${formData.productType} 已创建`);
    setShowCreateModal(false);
    setFormData({
      productType: '',
      icon: '🍇',
      maxSupply: 1000,
      price: 299,
      startTime: '',
      endTime: '',
      description: '',
      whitelistOnly: false,
    });
    setIsLoading(false);
  };

  // 编辑预售
  const handleEdit = async () => {
    if (!editPresale) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPresales(prev => prev.map(p => p.id === editPresale.id ? editPresale : p));
    showToast.success('保存成功', `预售 ${editPresale.productType} 已更新`);
    setEditPresale(null);
    setIsLoading(false);
  };

  // 取消预售
  const handleCancel = async () => {
    if (!cancelPresale) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPresales(prev => prev.map(p => 
      p.id === cancelPresale.id ? { ...p, status: 'cancelled' as const } : p
    ));
    showToast.success('取消成功', `预售 ${cancelPresale.productType} 已取消`);
    setCancelPresale(null);
    setIsLoading(false);
  };

  // 开始/暂停预售
  const handleToggleStatus = async (presale: Presale) => {
    const newStatus = presale.status === 'active' ? 'upcoming' : 'active';
    setPresales(prev => prev.map(p => 
      p.id === presale.id ? { ...p, status: newStatus as 'active' | 'upcoming' } : p
    ));
    showToast.success(
      newStatus === 'active' ? '已开始' : '已暂停',
      `预售 ${presale.productType} ${newStatus === 'active' ? '已开始' : '已暂停'}`
    );
  };

  const iconOptions = ['🍇', '🍊', '🌾', '🍎', '🍈', '🥕', '🍓', '🫐', '🥬', '🌽'];

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
              <h1 className="text-2xl font-bold text-gray-900">预售管理</h1>
              <p className="text-gray-500 mt-1">管理所有预售活动</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              创建预售
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">全部状态</option>
                <option value="upcoming">即将开售</option>
                <option value="active">预售中</option>
                <option value="ended">已结束</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
          </div>

          {/* 预售列表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">产品</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">销售进度</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPresales.map((presale) => (
                  <tr key={presale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl">
                          {presale.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{presale.productType}</div>
                          <div className="text-sm text-gray-500">ID: {presale.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-emerald-600">¥{presale.price}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">{presale.currentSupply}/{presale.maxSupply}</span>
                          <span className="text-emerald-600">{Math.round(presale.currentSupply / presale.maxSupply * 100)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${(presale.currentSupply / presale.maxSupply) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{presale.startTime}</div>
                      <div>至 {presale.endTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[presale.status].bgColor} ${statusConfig[presale.status].color}`}>
                        {statusConfig[presale.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setDetailPresale(presale)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {['upcoming', 'active'].includes(presale.status) && (
                          <>
                            <button 
                              onClick={() => handleToggleStatus(presale)}
                              className={`p-2 rounded-lg transition-colors ${
                                presale.status === 'active' 
                                  ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={presale.status === 'active' ? '暂停' : '开始'}
                            >
                              {presale.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => setEditPresale({...presale})}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="编辑"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setCancelPresale(presale)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="取消"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* 创建预售弹窗 */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="创建预售"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">产品名称 *</label>
              <input
                type="text"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                placeholder="例如：阳光玫瑰葡萄"
              />
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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">单价 (元) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">总供应量 *</label>
              <input
                type="number"
                value={formData.maxSupply}
                onChange={(e) => setFormData({ ...formData, maxSupply: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">开始时间 *</label>
              <input
                type="date"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">结束时间 *</label>
              <input
                type="date"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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
              placeholder="输入产品描述..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="whitelistOnly"
              checked={formData.whitelistOnly}
              onChange={(e) => setFormData({ ...formData, whitelistOnly: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="whitelistOnly" className="text-sm text-gray-700">
              仅白名单用户可参与
            </label>
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
              {isLoading ? '创建中...' : '创建预售'}
            </button>
          </div>
        </div>
      </Modal>

      {/* 预售详情弹窗 */}
      <Modal
        isOpen={!!detailPresale}
        onClose={() => setDetailPresale(null)}
        title="预售详情"
        size="md"
      >
        {detailPresale && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl shadow-sm">
                {detailPresale.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{detailPresale.productType}</h3>
                <p className="text-gray-500">{detailPresale.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-emerald-600">¥{detailPresale.price}</p>
                <p className="text-sm text-emerald-700">单价</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-600">{detailPresale.currentSupply}/{detailPresale.maxSupply}</p>
                <p className="text-sm text-blue-700">销售进度</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">销售进度</span>
                <span className="font-medium">{Math.round(detailPresale.currentSupply / detailPresale.maxSupply * 100)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  style={{ width: `${(detailPresale.currentSupply / detailPresale.maxSupply) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">开始:</span>
                <span className="font-medium">{detailPresale.startTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">结束:</span>
                <span className="font-medium">{detailPresale.endTime}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-500">白名单限制</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                detailPresale.whitelistOnly ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {detailPresale.whitelistOnly ? `是 (${detailPresale.whitelistCount}人)` : '否'}
              </span>
            </div>

            <div className="p-4 bg-violet-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-violet-600">
                ¥{(detailPresale.currentSupply * detailPresale.price).toLocaleString()}
              </p>
              <p className="text-sm text-violet-700">累计销售额</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑预售弹窗 */}
      <Modal
        isOpen={!!editPresale}
        onClose={() => setEditPresale(null)}
        title="编辑预售"
        size="lg"
      >
        {editPresale && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品名称</label>
                <input
                  type="text"
                  value={editPresale.productType}
                  onChange={(e) => setEditPresale({ ...editPresale, productType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">单价 (元)</label>
                <input
                  type="number"
                  value={editPresale.price}
                  onChange={(e) => setEditPresale({ ...editPresale, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">总供应量</label>
                <input
                  type="number"
                  value={editPresale.maxSupply}
                  onChange={(e) => setEditPresale({ ...editPresale, maxSupply: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
                <input
                  type="date"
                  value={editPresale.endTime}
                  onChange={(e) => setEditPresale({ ...editPresale, endTime: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">产品描述</label>
              <textarea
                value={editPresale.description}
                onChange={(e) => setEditPresale({ ...editPresale, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setEditPresale(null)}
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

      {/* 取消预售确认 */}
      <ConfirmDialog
        isOpen={!!cancelPresale}
        onClose={() => setCancelPresale(null)}
        onConfirm={handleCancel}
        title="取消预售"
        message={`确定要取消预售 ${cancelPresale?.productType} 吗？已购买的用户将收到退款通知。`}
        type="danger"
        confirmText="确认取消"
        loading={isLoading}
      />
    </div>
  );
}
