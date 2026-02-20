'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/ui/Modal';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useToast } from '@/context/ToastContext';
import { 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle, 
  Clock,
  Search,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Gift,
  Send,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';

interface NFT {
  tokenId: number;
  productType: string;
  quantity: string;
  qualityGrade: string;
  originBase: string;
  harvestDate: string;
  deliveryStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  image?: string;
}

export default function MyNFTsPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const toast = useToast();
  const [filter, setFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 弹窗状态
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // 交付表单
  const [deliveryForm, setDeliveryForm] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliverySuccess, setDeliverySuccess] = useState(false);
  
  // 转赠
  const [transferAddress, setTransferAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  
  // 复制状态
  const [copied, setCopied] = useState(false);

  // 模拟NFT数据
  const nfts: NFT[] = [
    {
      tokenId: 1001,
      productType: '阳光玫瑰葡萄',
      quantity: '5kg',
      qualityGrade: '特级',
      originBase: '云南大理',
      harvestDate: '2024-06-20',
      deliveryStatus: 'PENDING'
    },
    {
      tokenId: 1002,
      productType: '赣南脐橙',
      quantity: '10kg',
      qualityGrade: '优级',
      originBase: '江西赣州',
      harvestDate: '2024-11-15',
      deliveryStatus: 'SHIPPED'
    },
    {
      tokenId: 1003,
      productType: '五常大米',
      quantity: '20kg',
      qualityGrade: '特级',
      originBase: '黑龙江五常',
      harvestDate: '2024-10-01',
      deliveryStatus: 'DELIVERED'
    }
  ];

  const filteredNFTs = filter === 'ALL'
    ? nfts
    : nfts.filter(n => n.deliveryStatus === filter);

  const getStatusInfo = (status: string) => {
    const config: Record<string, { label: string; color: string; icon: React.ElementType }> = {
      PENDING: { label: '待交付', color: 'text-amber-400 bg-amber-500/20', icon: Clock },
      PROCESSING: { label: '处理中', color: 'text-blue-400 bg-blue-500/20', icon: Package },
      SHIPPED: { label: '配送中', color: 'text-purple-400 bg-purple-500/20', icon: Truck },
      DELIVERED: { label: '已交付', color: 'text-emerald-400 bg-emerald-500/20', icon: CheckCircle },
    };
    return config[status] || config.PENDING;
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('已复制', '钱包地址已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('刷新完成', 'NFT列表已更新');
  };

  const handleDeliverySubmit = async () => {
    if (!deliveryForm.name) {
      toast.error('请填写收件人姓名');
      return;
    }
    if (!deliveryForm.phone) {
      toast.error('请填写联系电话');
      return;
    }
    if (!deliveryForm.address) {
      toast.error('请填写收货地址');
      return;
    }
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(deliveryForm.phone)) {
      toast.error('手机号格式不正确');
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDeliverySuccess(true);
    setIsSubmitting(false);
    toast.success('申请已提交', '我们将在24小时内处理');
  };

  const handleTransfer = async () => {
    if (!transferAddress) {
      toast.error('请输入接收方钱包地址');
      return;
    }
    // 验证钱包地址格式
    if (!/^0x[a-fA-F0-9]{40}$/.test(transferAddress)) {
      toast.error('钱包地址格式不正确');
      return;
    }
    if (transferAddress.toLowerCase() === address?.toLowerCase()) {
      toast.error('不能转赠给自己');
      return;
    }
    
    setIsTransferring(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTransferSuccess(true);
    setIsTransferring(false);
    toast.success('转赠成功', `NFT已发送至 ${transferAddress.slice(0, 6)}...${transferAddress.slice(-4)}`);
  };

  const handleShareNFT = (nft: NFT) => {
    setSelectedNFT(nft);
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    if (selectedNFT) {
      const link = `${window.location.origin}/trace/${selectedNFT.tokenId}`;
      navigator.clipboard.writeText(link);
      toast.success('链接已复制');
      setShowShareModal(false);
    }
  };

  const handleDownloadQR = () => {
    // 模拟下载二维码
    toast.success('二维码已保存', '请在相册中查看');
  };

  const resetModals = () => {
    setShowDeliveryModal(false);
    setShowTransferModal(false);
    setShowQRModal(false);
    setShowShareModal(false);
    setSelectedNFT(null);
    setDeliverySuccess(false);
    setTransferSuccess(false);
    setDeliveryForm({ name: '', phone: '', address: '', note: '' });
    setTransferAddress('');
  };

  // 未连接钱包
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">连接钱包查看您的NFT</h2>
            <p className="text-slate-400 mb-8">
              请先连接您的Web3钱包以查看和管理您的农产品NFT
            </p>
            <div className="flex justify-center">
              <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
                            >
                              连接钱包
                            </button>
                          );
                        }

                        return (
                          <div className="text-center">
                            <p className="text-slate-400 mb-4">钱包已连接</p>
                            <button
                              onClick={openAccountModal}
                              className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                            >
                              {account.displayName}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              我的<span className="text-emerald-400">NFT</span>
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors disabled:opacity-50"
              title="刷新"
            >
              <RefreshCw className={`w-5 h-5 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span>钱包地址: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <button
              onClick={handleCopyAddress}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">{nfts.length}</div>
            <div className="text-slate-400 text-sm">NFT总数</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-2">
              {nfts.filter(n => n.deliveryStatus === 'PENDING').length}
            </div>
            <div className="text-slate-400 text-sm">待交付</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {nfts.filter(n => n.deliveryStatus === 'SHIPPED').length}
            </div>
            <div className="text-slate-400 text-sm">配送中</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-teal-400 mb-2">
              {nfts.filter(n => n.deliveryStatus === 'DELIVERED').length}
            </div>
            <div className="text-slate-400 text-sm">已交付</div>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-2">
          {['ALL', 'PENDING', 'SHIPPED', 'DELIVERED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {status === 'ALL' ? '全部' : status === 'PENDING' ? '待交付' : status === 'SHIPPED' ? '配送中' : '已交付'}
            </button>
          ))}
        </div>

        {/* NFT列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNFTs.map((nft) => {
            const statusInfo = getStatusInfo(nft.deliveryStatus);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={nft.tokenId}
                className="group bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
              >
                  {/* NFT图片区域 */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 flex items-center justify-center group/image">
                  <span className="text-7xl group-hover:scale-110 transition-transform">
                    {nft.productType.includes('葡萄') ? '🍇' : nft.productType.includes('橙') ? '🍊' : '🌾'}
                  </span>
                  <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded-full text-sm text-emerald-400 font-mono">
                    #{nft.tokenId}
                  </div>
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${statusInfo.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusInfo.label}
                  </div>
                  
                  {/* 快速分享按钮 */}
                  <button
                    onClick={() => handleShareNFT(nft)}
                    className="absolute bottom-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg opacity-0 group-hover/image:opacity-100 transition-all hover:bg-white/20"
                    title="分享"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* NFT信息 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {nft.productType}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-slate-400 mb-4">
                    <div className="flex justify-between">
                      <span>产地</span>
                      <span className="text-white">{nft.originBase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>数量</span>
                      <span className="text-white">{nft.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>品质</span>
                      <span className="text-emerald-400">{nft.qualityGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>采收日期</span>
                      <span className="text-white">{nft.harvestDate}</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/50">
                    <div className="flex gap-3">
                      <a
                        href={`/trace/${nft.tokenId}`}
                        className="flex-1 py-3 text-center bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        溯源
                      </a>
                      <button 
                        onClick={() => {
                          setSelectedNFT(nft);
                          setShowQRModal(true);
                        }}
                        className="flex-1 py-3 bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-colors flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        二维码
                      </button>
                    </div>
                    
                    {nft.deliveryStatus === 'PENDING' && (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            setSelectedNFT(nft);
                            setShowDeliveryModal(true);
                          }}
                          className="flex-1 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Truck className="w-4 h-4" />
                          申请交付
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedNFT(nft);
                            setShowTransferModal(true);
                          }}
                          className="flex-1 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Gift className="w-4 h-4" />
                          转赠
                        </button>
                      </div>
                    )}
                    
                    {nft.deliveryStatus === 'SHIPPED' && (
                      <a
                        href={`/track/${nft.tokenId}`}
                        className="block w-full py-3 text-center bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                      >
                        <Truck className="w-4 h-4 inline mr-2" />
                        追踪物流
                      </a>
                    )}
                    
                    {nft.deliveryStatus === 'DELIVERED' && (
                      <a
                        href={`https://etherscan.io/token/${nft.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 text-center bg-slate-700/50 text-white rounded-xl hover:bg-slate-600/50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 inline mr-2" />
                        在区块链查看
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-lg mb-6">暂无NFT</p>
            <a
              href="/presale"
              className="inline-block px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all"
            >
              前往预售市场
            </a>
          </div>
        )}
      </main>

      <Footer />

      {/* 交付申请弹窗 */}
      <Modal
        isOpen={showDeliveryModal}
        onClose={resetModals}
        title={deliverySuccess ? '申请成功' : '申请实物交付'}
        size="lg"
      >
        {selectedNFT && (
          <>
            {!deliverySuccess ? (
              <div className="space-y-6">
                {/* NFT信息 */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                  <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-3xl">
                    {selectedNFT.productType.includes('葡萄') ? '🍇' : selectedNFT.productType.includes('橙') ? '🍊' : '🌾'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedNFT.productType}</h3>
                    <p className="text-slate-400 text-sm">#{selectedNFT.tokenId} · {selectedNFT.quantity}</p>
                  </div>
                </div>

                {/* 收货信息表单 */}
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm block mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      收件人姓名
                    </label>
                    <input
                      type="text"
                      value={deliveryForm.name}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, name: e.target.value })}
                      placeholder="请输入姓名"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm block mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      联系电话
                    </label>
                    <input
                      type="tel"
                      value={deliveryForm.phone}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                      placeholder="请输入手机号"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm block mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      收货地址
                    </label>
                    <textarea
                      value={deliveryForm.address}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                      placeholder="请输入详细地址"
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm block mb-2">备注（选填）</label>
                    <input
                      type="text"
                      value={deliveryForm.note}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, note: e.target.value })}
                      placeholder="如有特殊要求请备注"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleDeliverySubmit}
                  disabled={isSubmitting || !deliveryForm.name || !deliveryForm.phone || !deliveryForm.address}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      提交申请
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">交付申请已提交！</h3>
                <p className="text-slate-400 mb-6">
                  我们将在24小时内处理您的申请，届时会有短信通知
                </p>
                <button
                  onClick={resetModals}
                  className="px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  我知道了
                </button>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* 转赠弹窗 */}
      <Modal
        isOpen={showTransferModal}
        onClose={resetModals}
        title={transferSuccess ? '转赠成功' : '转赠NFT'}
        size="md"
      >
        {selectedNFT && (
          <>
            {!transferSuccess ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                  <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-3xl">
                    {selectedNFT.productType.includes('葡萄') ? '🍇' : selectedNFT.productType.includes('橙') ? '🍊' : '🌾'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedNFT.productType}</h3>
                    <p className="text-slate-400 text-sm">#{selectedNFT.tokenId}</p>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-sm block mb-2">接收方钱包地址</label>
                  <input
                    type="text"
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <p className="text-amber-400 text-sm">
                    ⚠️ 请仔细核对钱包地址，转赠后无法撤销
                  </p>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={isTransferring || !transferAddress}
                  className="w-full py-4 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isTransferring ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      转赠中...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5" />
                      确认转赠
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">转赠成功！</h3>
                <p className="text-slate-400 mb-6">
                  NFT已成功转赠给 {transferAddress.slice(0, 6)}...{transferAddress.slice(-4)}
                </p>
                <button
                  onClick={resetModals}
                  className="px-8 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                >
                  完成
                </button>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* 二维码弹窗 */}
      <Modal
        isOpen={showQRModal}
        onClose={resetModals}
        title="NFT二维码"
        size="sm"
      >
        {selectedNFT && (
          <div className="text-center">
            <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>
            <p className="text-slate-400 text-sm mb-4">
              扫码查看 #{selectedNFT.tokenId} 溯源信息
            </p>
            <button
              onClick={handleDownloadQR}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <Download className="w-4 h-4" />
              保存二维码
            </button>
          </div>
        )}
      </Modal>

      {/* 分享弹窗 */}
      {showShareModal && selectedNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">分享NFT</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl mb-6">
              <div className="w-16 h-16 bg-slate-600 rounded-xl flex items-center justify-center text-3xl">
                {selectedNFT.productType.includes('葡萄') ? '🍇' : selectedNFT.productType.includes('橙') ? '🍊' : '🌾'}
              </div>
              <div>
                <h4 className="font-semibold text-white">{selectedNFT.productType}</h4>
                <p className="text-slate-400 text-sm">#{selectedNFT.tokenId}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mb-6">
              <button
                onClick={copyShareLink}
                className="flex flex-col items-center gap-2 p-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-slate-400">复制链接</span>
              </button>
              <button
                onClick={() => {
                  toast.info('请在微信中分享');
                  setShowShareModal(false);
                }}
                className="flex flex-col items-center gap-2 p-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xl">
                  💬
                </div>
                <span className="text-xs text-slate-400">微信</span>
              </button>
              <button
                onClick={() => {
                  toast.info('请在微博中分享');
                  setShowShareModal(false);
                }}
                className="flex flex-col items-center gap-2 p-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
              >
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-xl">
                  📢
                </div>
                <span className="text-xs text-slate-400">微博</span>
              </button>
              <button
                onClick={() => {
                  toast.info('请在QQ中分享');
                  setShowShareModal(false);
                }}
                className="flex flex-col items-center gap-2 p-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl">
                  🐧
                </div>
                <span className="text-xs text-slate-400">QQ</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
