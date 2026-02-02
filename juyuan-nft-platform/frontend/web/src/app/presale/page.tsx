'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/ui/Modal';
import { ShoppingCart, Minus, Plus, Wallet, CreditCard, QrCode, CheckCircle, X, Clock, MapPin, Calendar, TrendingUp, Heart, Share2, Bell, SlidersHorizontal } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useWishlist } from '@/hooks/useWishlist';
import { FilterPanel } from '@/components/FilterPanel';

interface Presale {
  id: string;
  productType: string;
  maxSupply: number;
  currentSupply: number;
  price: number;
  currency: string;
  startTime: string;
  endTime: string;
  status: string;
  originBase: string;
  harvestDate: string;
  image?: string;
  description?: string;
}

export default function PresalePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const toast = useToast();
  
  const [presales, setPresales] = useState<Presale[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [notifications, setNotifications] = useState<Set<string>>(new Set());
  
  // 筛选和排序状态
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity');
  
  // 购买弹窗状态
  const [selectedPresale, setSelectedPresale] = useState<Presale | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay' | 'crypto'>('wechat');
  const [buyStep, setBuyStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // 分享弹窗
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePresale, setSharePresale] = useState<Presale | null>(null);
  
  // 检查结账状态
  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      toast.success('支付成功！', '感谢您的购买');
    }
  }, [searchParams, toast]);

  const loadPresales = useCallback(async () => {
    setLoading(true);
    // 模拟数据
    const mockData: Presale[] = [
      {
        id: '1',
        productType: '阳光玫瑰葡萄',
        maxSupply: 1000,
        currentSupply: 680,
        price: 299,
        currency: 'CNY',
        startTime: '2024-01-15',
        endTime: '2024-02-15',
        status: 'ACTIVE',
        originBase: '云南大理',
        harvestDate: '2024-06-20',
        description: '来自云南大理的阳光玫瑰葡萄，果肉饱满，甜度高，玫瑰香气浓郁'
      },
      {
        id: '2',
        productType: '赣南脐橙',
        maxSupply: 2000,
        currentSupply: 1500,
        price: 199,
        currency: 'CNY',
        startTime: '2024-01-10',
        endTime: '2024-02-10',
        status: 'ACTIVE',
        originBase: '江西赣州',
        harvestDate: '2024-11-15',
        description: '正宗赣南脐橙，皮薄多汁，酸甜适中，富含维生素C'
      },
      {
        id: '3',
        productType: '五常大米',
        maxSupply: 500,
        currentSupply: 500,
        price: 499,
        currency: 'CNY',
        startTime: '2024-01-01',
        endTime: '2024-01-31',
        status: 'ENDED',
        originBase: '黑龙江五常',
        harvestDate: '2024-10-01',
        description: '五常稻花香大米，颗粒饱满，煮饭清香，口感绵软'
      },
      {
        id: '4',
        productType: '烟台红富士',
        maxSupply: 800,
        currentSupply: 120,
        price: 259,
        currency: 'CNY',
        startTime: '2024-02-01',
        endTime: '2024-03-01',
        status: 'UPCOMING',
        originBase: '山东烟台',
        harvestDate: '2024-10-20',
        description: '烟台红富士苹果，脆甜爽口，果香浓郁，营养丰富'
      }
    ];

    const filtered = filter === 'ALL'
      ? mockData
      : mockData.filter(p => p.status === filter);

    setPresales(filtered);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadPresales();
  }, [loadPresales]);

  // 收藏功能
  const handleFavorite = (presale: Presale) => {
    if (isInWishlist(presale.id)) {
      removeFromWishlist(presale.id);
      toast.info('已取消收藏');
    } else {
      addToWishlist({
        id: presale.id,
        productType: presale.productType,
        price: presale.price,
        image: presale.image,
      });
      toast.success('已收藏', presale.productType);
    }
  };

  // 开售通知
  const handleNotify = (presale: Presale) => {
    setNotifications(prev => {
      const next = new Set(prev);
      if (next.has(presale.id)) {
        next.delete(presale.id);
        toast.info('已取消通知');
      } else {
        next.add(presale.id);
        toast.success('已设置通知', `${presale.productType}开售时将通知您`);
      }
      return next;
    });
  };

  // 分享功能
  const handleShare = (presale: Presale) => {
    setSharePresale(presale);
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    if (sharePresale) {
      const link = `${window.location.origin}/presale/${sharePresale.id}`;
      navigator.clipboard.writeText(link);
      toast.success('链接已复制');
      setShowShareModal(false);
    }
  };

  // 加入购物车
  const handleAddToCart = (presale: Presale) => {
    addItem({
      productId: presale.id,
      name: presale.productType,
      price: presale.price,
      quantity: 1,
      image: `/products/${presale.id}.jpg`,
      icon: presale.productType.includes('葡萄') ? '🍇' : presale.productType.includes('橙') ? '🍊' : presale.productType.includes('富士') ? '🍎' : '🌾',
      origin: presale.originBase,
      maxQuantity: 10,
    });
    toast.success('已加入购物车', presale.productType);
  };

  const handleBuyClick = (presale: Presale) => {
    setSelectedPresale(presale);
    setQuantity(1);
    setBuyStep('select');
    setShowBuyModal(true);
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // 模拟购买过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    setBuyStep('success');
    setIsPurchasing(false);
  };

  const handleCloseModal = () => {
    setShowBuyModal(false);
    setSelectedPresale(null);
    setBuyStep('select');
    if (buyStep === 'success') {
      toast.success('购买成功！', 'NFT将在收获后铸造并发送到您的钱包');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      UPCOMING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      ENDED: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    const labels: Record<string, string> = {
      UPCOMING: '即将开售',
      ACTIVE: '预售中',
      ENDED: '已结束'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            预售<span className="text-emerald-400">市场</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            精选优质农产品NFT，提前锁定新鲜好货，享受区块链溯源保障
          </p>
        </div>

        {/* 筛选栏 */}
        <div className="flex justify-center gap-4 mb-10">
          {['ALL', 'ACTIVE', 'UPCOMING', 'ENDED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${filter === status
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                }`}
            >
              {status === 'ALL' ? '全部' : status === 'ACTIVE' ? '预售中' : status === 'UPCOMING' ? '即将开售' : '已结束'}
            </button>
          ))}
        </div>

        {/* 预售列表 */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {presales.map((presale) => (
              <div
                key={presale.id}
                className="group bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
              >
                {/* 图片 */}
                <div className="relative h-56 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 group/image">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    {presale.productType.includes('葡萄') ? '🍇' : presale.productType.includes('橙') ? '🍊' : presale.productType.includes('富士') ? '🍎' : '🌾'}
                  </div>
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(presale.status)}
                  </div>
                  {/* 热度标签 */}
                  {presale.currentSupply / presale.maxSupply > 0.7 && presale.status === 'ACTIVE' && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 bg-red-500/90 text-white text-xs rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      热卖中
                    </div>
                  )}
                  
                  {/* 悬浮操作按钮 */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover/image:opacity-100 transition-all duration-300 translate-y-4 group-hover/image:translate-y-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleFavorite(presale); }}
                      className={`p-3 rounded-xl transition-all ${
                        isInWishlist(presale.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                      }`}
                      title="收藏"
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist(presale.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(presale); }}
                      className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-all"
                      title="分享"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    {presale.status === 'UPCOMING' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNotify(presale); }}
                        className={`p-3 rounded-xl transition-all ${
                          notifications.has(presale.id)
                            ? 'bg-amber-500 text-white'
                            : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                        }`}
                        title="开售提醒"
                      >
                        <Bell className={`w-5 h-5 ${notifications.has(presale.id) ? 'fill-current' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* 内容 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {presale.productType}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {presale.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {presale.originBase}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {presale.harvestDate}
                    </span>
                  </div>

                  {/* 进度条 */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">销售进度</span>
                      <span className="text-emerald-400">
                        {Math.round((presale.currentSupply / presale.maxSupply) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                        style={{ width: `${(presale.currentSupply / presale.maxSupply) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>已售 {presale.currentSupply}</span>
                      <span>总量 {presale.maxSupply}</span>
                    </div>
                  </div>

                  {/* 价格和按钮 */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div>
                      <span className="text-3xl font-bold text-emerald-400">¥{presale.price}</span>
                      <span className="text-slate-500 text-sm">/份</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {presale.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleAddToCart(presale)}
                          className="p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
                          title="加入购物车"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleBuyClick(presale)}
                        disabled={presale.status !== 'ACTIVE'}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${presale.status === 'ACTIVE'
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 hover:scale-105'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          }`}
                      >
                        {presale.status === 'ACTIVE' ? (
                          '立即购买'
                        ) : presale.status === 'UPCOMING' ? (
                          <>
                            <Clock className="w-5 h-5" />
                            即将开售
                          </>
                        ) : '已结束'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {presales.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-lg">暂无预售活动</p>
          </div>
        )}
      </main>

      <Footer />

      {/* 购买弹窗 */}
      <Modal
        isOpen={showBuyModal}
        onClose={handleCloseModal}
        title={buyStep === 'success' ? '购买成功' : `购买 ${selectedPresale?.productType}`}
        size="lg"
      >
        {selectedPresale && (
          <>
            {/* 步骤1: 选择数量和支付方式 */}
            {buyStep === 'select' && (
              <div className="space-y-6">
                {/* 产品信息 */}
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                  <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center text-4xl">
                    {selectedPresale.productType.includes('葡萄') ? '🍇' : selectedPresale.productType.includes('橙') ? '🍊' : selectedPresale.productType.includes('富士') ? '🍎' : '🌾'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedPresale.productType}</h3>
                    <p className="text-slate-400 text-sm">{selectedPresale.originBase} · {selectedPresale.harvestDate}收获</p>
                    <p className="text-emerald-400 font-bold mt-1">¥{selectedPresale.price}/份</p>
                  </div>
                </div>

                {/* 数量选择 */}
                <div>
                  <label className="text-slate-400 text-sm block mb-2">购买数量</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-16 text-center text-2xl font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                      className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <span className="text-slate-500 text-sm ml-2">每人限购10份</span>
                  </div>
                </div>

                {/* 支付方式 */}
                <div>
                  <label className="text-slate-400 text-sm block mb-2">支付方式</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'wechat', label: '微信支付', icon: QrCode, color: 'text-green-400' },
                      { key: 'alipay', label: '支付宝', icon: CreditCard, color: 'text-blue-400' },
                      { key: 'crypto', label: '加密货币', icon: Wallet, color: 'text-purple-400' },
                    ].map((method) => (
                      <button
                        key={method.key}
                        onClick={() => setPaymentMethod(method.key as any)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === method.key
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <method.icon className={`w-6 h-6 mx-auto mb-2 ${method.color}`} />
                        <span className="text-white text-sm">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 费用明细 */}
                <div className="p-4 bg-slate-800/30 rounded-xl space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>单价</span>
                    <span>¥{selectedPresale.price}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>数量</span>
                    <span>×{quantity}</span>
                  </div>
                  <div className="h-px bg-slate-700 my-2" />
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>总计</span>
                    <span className="text-emerald-400">¥{selectedPresale.price * quantity}</span>
                  </div>
                </div>

                {/* 确认按钮 */}
                <button
                  onClick={() => setBuyStep('confirm')}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                >
                  确认订单
                </button>
              </div>
            )}

            {/* 步骤2: 确认购买 */}
            {buyStep === 'confirm' && (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">确认支付</h3>
                  <p className="text-slate-400">请确认您的订单信息</p>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">商品</span>
                    <span className="text-white">{selectedPresale.productType} ×{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">支付方式</span>
                    <span className="text-white">
                      {paymentMethod === 'wechat' ? '微信支付' : paymentMethod === 'alipay' ? '支付宝' : '加密货币'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">预计收获</span>
                    <span className="text-white">{selectedPresale.harvestDate}</span>
                  </div>
                  <div className="h-px bg-slate-700" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">支付金额</span>
                    <span className="text-emerald-400">¥{selectedPresale.price * quantity}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setBuyStep('select')}
                    className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    返回修改
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isPurchasing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        处理中...
                      </>
                    ) : (
                      '确认支付'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 步骤3: 购买成功 */}
            {buyStep === 'success' && (
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-14 h-14 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">购买成功！</h3>
                <p className="text-slate-400 mb-6">
                  您已成功预购 {quantity} 份{selectedPresale.productType}
                </p>
                
                <div className="p-4 bg-slate-800/50 rounded-xl mb-6 text-left">
                  <h4 className="text-white font-semibold mb-3">接下来会发生什么？</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">1</div>
                      <p className="text-slate-400">农场将开始为您种植/培育产品</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">2</div>
                      <p className="text-slate-400">收获后，您的NFT将被铸造并发送到钱包</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">3</div>
                      <p className="text-slate-400">使用NFT兑换实物产品并配送到家</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    继续浏览
                  </button>
                  <button
                    onClick={() => {
                      handleCloseModal();
                      window.location.href = '/my-nfts';
                    }}
                    className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    查看我的NFT
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
      {/* 分享弹窗 */}
      {showShareModal && sharePresale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">分享商品</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl mb-6">
              <div className="w-16 h-16 bg-slate-600 rounded-xl flex items-center justify-center text-3xl">
                {sharePresale.productType.includes('葡萄') ? '🍇' : sharePresale.productType.includes('橙') ? '🍊' : sharePresale.productType.includes('富士') ? '🍎' : '🌾'}
              </div>
              <div>
                <h4 className="font-semibold text-white">{sharePresale.productType}</h4>
                <p className="text-emerald-400 font-bold">¥{sharePresale.price}</p>
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
                  window.open(`https://weixin.qq.com/`, '_blank');
                  toast.info('请在微信中分享');
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
                  window.open(`https://weibo.com/`, '_blank');
                  toast.info('请在微博中分享');
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
                  window.open(`https://qq.com/`, '_blank');
                  toast.info('请在QQ中分享');
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

      {/* 筛选面板 */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </div>
  );
}
