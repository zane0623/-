'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import {
  Search,
  Download,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  ExternalLink,
  Copy,
  QrCode,
  MapPin,
  Calendar,
  Shield,
  Sparkles,
  Filter
} from 'lucide-react';

interface NFT {
  id: string;
  tokenId: number;
  productType: string;
  owner: string;
  ownerName?: string;
  quantity: string;
  qualityGrade: string;
  deliveryStatus: string;
  originBase: string;
  harvestDate: string;
  createdAt: string;
  txHash?: string;
}

const initialNFTs: NFT[] = [
  { id: '1', tokenId: 1001, productType: '阳光玫瑰葡萄', owner: '0x1234...5678', ownerName: '张三', quantity: '5kg', qualityGrade: '特级', deliveryStatus: 'PENDING', originBase: '云南大理', harvestDate: '2024-06-20', createdAt: '2024-01-15', txHash: '0xabc...123' },
  { id: '2', tokenId: 1002, productType: '赣南脐橙', owner: '0x2345...6789', ownerName: '李四', quantity: '10kg', qualityGrade: '优级', deliveryStatus: 'DELIVERED', originBase: '江西赣州', harvestDate: '2024-11-15', createdAt: '2024-01-14', txHash: '0xdef...456' },
  { id: '3', tokenId: 1003, productType: '五常大米', owner: '0x3456...7890', ownerName: '王五', quantity: '20kg', qualityGrade: '特级', deliveryStatus: 'SHIPPED', originBase: '黑龙江五常', harvestDate: '2024-10-01', createdAt: '2024-01-13', txHash: '0xghi...789' },
  { id: '4', tokenId: 1004, productType: '烟台红富士', owner: '0x4567...8901', ownerName: '赵六', quantity: '8kg', qualityGrade: '优级', deliveryStatus: 'PROCESSING', originBase: '山东烟台', harvestDate: '2024-10-20', createdAt: '2024-01-12', txHash: '0xjkl...012' },
  { id: '5', tokenId: 1005, productType: '阳光玫瑰葡萄', owner: '0x5678...9012', ownerName: '钱七', quantity: '3kg', qualityGrade: '特级', deliveryStatus: 'PENDING', originBase: '云南大理', harvestDate: '2024-06-25', createdAt: '2024-01-11', txHash: '0xmno...345' },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  PENDING: { label: '待交付', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
  PROCESSING: { label: '处理中', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: RefreshCw },
  SHIPPED: { label: '运输中', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Truck },
  DELIVERED: { label: '已交付', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: CheckCircle }
};

export default function NFTsPage() {
  const [nfts, setNfts] = useState<NFT[]>(initialNFTs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [detailNFT, setDetailNFT] = useState<NFT | null>(null);
  const [showMintModal, setShowMintModal] = useState(false);
  const [shipNFT, setShipNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [trackingNo, setTrackingNo] = useState('');
  const [courier, setCourier] = useState('顺丰速运');

  // 批量铸造表单
  const [mintForm, setMintForm] = useState({
    productType: '阳光玫瑰葡萄',
    quantity: 1,
    qualityGrade: '特级',
    originBase: '',
    harvestDate: ''
  });

  const filteredNFTs = nfts.filter(nft => {
    if (searchQuery && 
        !nft.tokenId.toString().includes(searchQuery) &&
        !nft.productType.includes(searchQuery) &&
        !nft.owner.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedStatus && nft.deliveryStatus !== selectedStatus) return false;
    if (selectedProduct && nft.productType !== selectedProduct) return false;
    return true;
  });

  const stats = [
    { label: '总NFT数量', value: nfts.length, color: 'text-gray-900' },
    { label: '待交付', value: nfts.filter(n => n.deliveryStatus === 'PENDING').length, color: 'text-amber-600' },
    { label: '运输中', value: nfts.filter(n => n.deliveryStatus === 'SHIPPED').length, color: 'text-purple-600' },
    { label: '已交付', value: nfts.filter(n => n.deliveryStatus === 'DELIVERED').length, color: 'text-emerald-600' },
  ];

  // 复制地址
  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    showToast.success('复制成功', `${label}已复制到剪贴板`);
  };

  // 批量铸造
  const handleMint = async () => {
    if (!mintForm.originBase || !mintForm.harvestDate) {
      showToast.warning('请完善信息', '请填写产地和收获日期');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newNFTs: NFT[] = [];
    for (let i = 0; i < mintForm.quantity; i++) {
      const tokenId = Math.max(...nfts.map(n => n.tokenId)) + i + 1;
      newNFTs.push({
        id: `${Date.now()}-${i}`,
        tokenId,
        productType: mintForm.productType,
        owner: '0x0000...0000',
        quantity: '5kg',
        qualityGrade: mintForm.qualityGrade,
        deliveryStatus: 'PENDING',
        originBase: mintForm.originBase,
        harvestDate: mintForm.harvestDate,
        createdAt: new Date().toISOString().split('T')[0],
        txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
      });
    }

    setNfts(prev => [...newNFTs, ...prev]);
    showToast.success('铸造成功', `成功铸造 ${mintForm.quantity} 个 NFT`);
    setShowMintModal(false);
    setMintForm({ productType: '阳光玫瑰葡萄', quantity: 1, qualityGrade: '特级', originBase: '', harvestDate: '' });
    setIsLoading(false);
  };

  // 发货
  const handleShip = async () => {
    if (!shipNFT || !trackingNo) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setNfts(prev => prev.map(n =>
      n.id === shipNFT.id ? { ...n, deliveryStatus: 'SHIPPED' } : n
    ));
    showToast.success('发货成功', `NFT #${shipNFT.tokenId} 已发货`);
    setShipNFT(null);
    setTrackingNo('');
    setIsLoading(false);
  };

  // 确认收货
  const handleComplete = async (nft: NFT) => {
    setNfts(prev => prev.map(n =>
      n.id === nft.id ? { ...n, deliveryStatus: 'DELIVERED' } : n
    ));
    showToast.success('操作成功', `NFT #${nft.tokenId} 已确认收货`);
  };

  // 导出
  const handleExport = () => {
    const csv = [
      ['Token ID', '产品', '持有者', '数量', '品质', '状态', '创建时间'].join(','),
      ...filteredNFTs.map(n => [
        n.tokenId,
        n.productType,
        n.owner,
        n.quantity,
        n.qualityGrade,
        statusConfig[n.deliveryStatus].label,
        n.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nfts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showToast.success('导出成功', `已导出 ${filteredNFTs.length} 条NFT数据`);
  };

  const getProductIcon = (productType: string) => {
    if (productType.includes('葡萄')) return '🍇';
    if (productType.includes('橙')) return '🍊';
    if (productType.includes('富士') || productType.includes('苹果')) return '🍎';
    return '🌾';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <ToastContainer />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NFT管理</h1>
              <p className="text-gray-500 mt-1">查看和管理所有已铸造的NFT</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExport}
                className="btn-secondary btn-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出
              </button>
              <button 
                onClick={() => setShowMintModal(true)}
                className="btn-primary btn-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                批量铸造
              </button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* 搜索和筛选 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索Token ID、产品或钱包地址..."
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
                <option value="PENDING">待交付</option>
                <option value="PROCESSING">处理中</option>
                <option value="SHIPPED">运输中</option>
                <option value="DELIVERED">已交付</option>
              </select>
              <select 
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">全部产品</option>
                <option value="阳光玫瑰葡萄">阳光玫瑰葡萄</option>
                <option value="赣南脐橙">赣南脐橙</option>
                <option value="五常大米">五常大米</option>
                <option value="烟台红富士">烟台红富士</option>
              </select>
            </div>
          </div>

          {/* NFT列表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Token ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">产品</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">持有者</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">数量/品质</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNFTs.map((nft) => {
                  const status = statusConfig[nft.deliveryStatus];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={nft.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-emerald-600 font-medium">#{nft.tokenId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">
                            {getProductIcon(nft.productType)}
                          </div>
                          <span className="font-medium text-gray-900">{nft.productType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{nft.ownerName || '未知'}</p>
                          <p className="font-mono text-sm text-gray-500">{nft.owner}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{nft.quantity}</div>
                          <div className="text-sm text-emerald-600">{nft.qualityGrade}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nft.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setDetailNFT(nft)}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a 
                            href={`/trace/${nft.tokenId}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="溯源"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          {nft.deliveryStatus === 'PENDING' && (
                            <button 
                              onClick={() => setShipNFT(nft)}
                              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="发货"
                            >
                              <Truck className="w-4 h-4" />
                            </button>
                          )}
                          {nft.deliveryStatus === 'SHIPPED' && (
                            <button 
                              onClick={() => handleComplete(nft)}
                              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="确认收货"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 分页 */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-500">显示 1-{Math.min(10, filteredNFTs.length)} 共 {filteredNFTs.length} 条</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-emerald-600 text-white rounded-lg font-medium">{currentPage}</button>
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* NFT详情弹窗 */}
      <Modal
        isOpen={!!detailNFT}
        onClose={() => setDetailNFT(null)}
        title="NFT详情"
        size="lg"
      >
        {detailNFT && (
          <div className="space-y-6">
            {/* NFT卡片预览 */}
            <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                <Sparkles className="w-4 h-4" />
                NFT #{detailNFT.tokenId}
              </div>
              <div className="text-6xl mb-4">{getProductIcon(detailNFT.productType)}</div>
              <h3 className="text-2xl font-bold mb-2">{detailNFT.productType}</h3>
              <p className="text-emerald-100">{detailNFT.quantity} · {detailNFT.qualityGrade}</p>
            </div>

            {/* 详细信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  产地
                </div>
                <p className="font-medium">{detailNFT.originBase}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  收获日期
                </div>
                <p className="font-medium">{detailNFT.harvestDate}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Shield className="w-4 h-4" />
                  品质等级
                </div>
                <p className="font-medium text-emerald-600">{detailNFT.qualityGrade}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Package className="w-4 h-4" />
                  交付状态
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[detailNFT.deliveryStatus].bgColor} ${statusConfig[detailNFT.deliveryStatus].color}`}>
                  {statusConfig[detailNFT.deliveryStatus].label}
                </span>
              </div>
            </div>

            {/* 链上信息 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">链上信息</h4>
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">持有者</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{detailNFT.owner}</span>
                    <button 
                      onClick={() => handleCopy(detailNFT.owner, '钱包地址')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">交易哈希</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{detailNFT.txHash}</span>
                    <button 
                      onClick={() => handleCopy(detailNFT.txHash || '', '交易哈希')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">创建时间</span>
                  <span className="font-medium">{detailNFT.createdAt}</span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setDetailNFT(null);
                  showToast.info('查看溯源', '正在跳转到溯源页面...');
                  window.open(`/trace/${detailNFT.tokenId}`, '_blank');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                查看溯源
              </button>
              <button
                onClick={() => {
                  showToast.success('生成二维码', '二维码已生成');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <QrCode className="w-5 h-5" />
                生成二维码
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 批量铸造弹窗 */}
      <Modal
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
        title="批量铸造NFT"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">产品类型</label>
            <select
              value={mintForm.productType}
              onChange={(e) => setMintForm({ ...mintForm, productType: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
            >
              <option value="阳光玫瑰葡萄">阳光玫瑰葡萄</option>
              <option value="赣南脐橙">赣南脐橙</option>
              <option value="五常大米">五常大米</option>
              <option value="烟台红富士">烟台红富士</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">铸造数量</label>
            <input
              type="number"
              min="1"
              max="100"
              value={mintForm.quantity}
              onChange={(e) => setMintForm({ ...mintForm, quantity: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">品质等级</label>
            <select
              value={mintForm.qualityGrade}
              onChange={(e) => setMintForm({ ...mintForm, qualityGrade: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
            >
              <option value="特级">特级</option>
              <option value="优级">优级</option>
              <option value="一级">一级</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">产地 *</label>
            <input
              type="text"
              value={mintForm.originBase}
              onChange={(e) => setMintForm({ ...mintForm, originBase: e.target.value })}
              placeholder="如：云南大理"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">收获日期 *</label>
            <input
              type="date"
              value={mintForm.harvestDate}
              onChange={(e) => setMintForm({ ...mintForm, harvestDate: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl">
            <p className="text-sm text-emerald-700">
              <Sparkles className="w-4 h-4 inline mr-2" />
              将铸造 <strong>{mintForm.quantity}</strong> 个 {mintForm.productType} NFT
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowMintModal(false)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleMint}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? '铸造中...' : '确认铸造'}
            </button>
          </div>
        </div>
      </Modal>

      {/* 发货弹窗 */}
      <Modal
        isOpen={!!shipNFT}
        onClose={() => setShipNFT(null)}
        title="NFT发货"
        size="md"
      >
        {shipNFT && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getProductIcon(shipNFT.productType)}</span>
                <div>
                  <p className="font-bold">{shipNFT.productType}</p>
                  <p className="text-sm text-gray-500">Token ID: #{shipNFT.tokenId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">快递公司</label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                >
                  <option value="顺丰速运">顺丰速运</option>
                  <option value="京东物流">京东物流</option>
                  <option value="圆通速递">圆通速递</option>
                  <option value="中通快递">中通快递</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">快递单号</label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="请输入快递单号"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShipNFT(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleShip}
                disabled={!trackingNo || isLoading}
                className="flex-1 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? '处理中...' : '确认发货'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
