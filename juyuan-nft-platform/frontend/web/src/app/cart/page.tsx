'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard,
  Truck,
  Shield,
  Tag,
  CheckCircle,
  X
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const toast = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const shipping = totalPrice >= 299 ? 0 : 15;
  const finalPrice = totalPrice - discount + shipping;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.warning('请输入优惠码');
      return;
    }

    // 模拟优惠码验证
    const validCoupons: Record<string, number> = {
      'WELCOME10': 0.1,
      'VIP20': 0.2,
      'NEWYEAR': 50,
    };

    const couponValue = validCoupons[couponCode.toUpperCase()];
    if (couponValue) {
      const discountAmount = couponValue < 1 ? totalPrice * couponValue : couponValue;
      setDiscount(discountAmount);
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success('优惠码已应用', `已减免 ¥${discountAmount.toFixed(2)}`);
    } else {
      toast.error('无效的优惠码');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    toast.info('优惠码已移除');
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success('已移除', `${name} 已从购物车移除`);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
    setAppliedCoupon(null);
    setDiscount(0);
    toast.success('购物车已清空');
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.warning('购物车为空');
      return;
    }

    setIsCheckingOut(true);
    
    // 模拟结算过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('订单提交成功！', '正在跳转到支付页面...');
    
    // 模拟跳转
    setTimeout(() => {
      clearCart();
      setAppliedCoupon(null);
      setDiscount(0);
      router.push('/presale?checkout=success');
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">购物车是空的</h1>
          <p className="text-gray-400 mb-8">快去发现优质的农产品吧</p>
          <Link 
            href="/presale"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30"
          >
            <ArrowLeft className="w-5 h-5" />
            去购物
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/presale"
              className="p-2 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">购物车</h1>
              <p className="text-gray-400 text-sm">{totalItems} 件商品</p>
            </div>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            清空购物车
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 商品列表 */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start gap-6">
                  {/* 商品图片 */}
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-5xl flex-shrink-0">
                    {item.icon}
                  </div>

                  {/* 商品信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{item.origin}</p>
                    
                    <div className="flex items-center justify-between">
                      {/* 数量控制 */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-gray-500 text-sm ml-2">
                          最多 {item.maxQuantity} 份
                        </span>
                      </div>

                      {/* 价格 */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-400">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ¥{item.price}/份
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => handleRemoveItem(item.id, item.name)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 结算面板 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-6">订单摘要</h3>

              {/* 优惠码 */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">优惠码</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">{appliedCoupon}</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="输入优惠码"
                      className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      应用
                    </button>
                  </div>
                )}
              </div>

              {/* 价格明细 */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-700/50">
                <div className="flex justify-between text-gray-400">
                  <span>商品小计</span>
                  <span>¥{totalPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>优惠折扣</span>
                    <span>-¥{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>运费</span>
                  <span>{shipping === 0 ? '免运费' : `¥${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    再购 ¥{(299 - totalPrice).toFixed(0)} 即可免运费
                  </p>
                )}
              </div>

              {/* 总计 */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-white">应付总额</span>
                <span className="text-2xl font-bold text-emerald-400">
                  ¥{finalPrice.toFixed(2)}
                </span>
              </div>

              {/* 结算按钮 */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    立即结算
                  </>
                )}
              </button>

              {/* 保障信息 */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>安全支付保障</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>全程冷链配送</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>100%正品保证</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 清空确认弹窗 */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">确认清空购物车？</h3>
            <p className="text-gray-400 text-sm mb-6">此操作将移除购物车中的所有商品</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
