'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Shield, Truck } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  image: string;
  origin: string;
  harvestDate: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: '阳光玫瑰葡萄',
      price: 299,
      quantity: 2,
      maxQuantity: 10,
      image: '🍇',
      origin: '云南大理',
      harvestDate: '2024年6月'
    },
    {
      id: '2',
      name: '赣南脐橙',
      price: 199,
      quantity: 1,
      maxQuantity: 20,
      image: '🍊',
      origin: '江西赣州',
      harvestDate: '2024年11月'
    }
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, Math.min(item.maxQuantity, item.quantity + delta));
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = Math.round(subtotal * 0.025); // 2.5% 平台服务费
  const total = subtotal + serviceFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-slate-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">购物车是空的</h1>
            <p className="text-slate-400 mb-8">快去预售市场挑选优质农产品吧！</p>
            <Link
              href="/presale"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
            >
              浏览预售市场
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            购物车
          </h1>
          <p className="text-slate-400">共 {cartItems.length} 件商品</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 购物车列表 */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex gap-6">
                  {/* 产品图片 */}
                  <div className="w-28 h-28 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center text-5xl flex-shrink-0">
                    {item.image}
                  </div>

                  {/* 产品信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span>📍 {item.origin}</span>
                          <span>📅 {item.harvestDate}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* 数量控制 */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 rounded-lg bg-slate-700/50 text-white flex items-center justify-center hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-white font-semibold text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="w-10 h-10 rounded-lg bg-slate-700/50 text-white flex items-center justify-center hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 价格 */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          ¥{item.price}/份
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 订单摘要 */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 sticky top-28">
              <h2 className="text-xl font-bold text-white mb-6">订单摘要</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>商品小计</span>
                  <span className="text-white">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>平台服务费 (2.5%)</span>
                  <span className="text-white">¥{serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-700/50 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-white">总计</span>
                    <span className="text-2xl font-bold text-emerald-400">
                      ¥{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 mb-4">
                连接钱包支付
              </button>

              <p className="text-center text-slate-500 text-sm mb-6">
                支持 ETH / MATIC / USDT 支付
              </p>

              {/* 保障说明 */}
              <div className="space-y-3 pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>智能合约托管，资金安全有保障</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>顺丰冷链配送，新鲜直达</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



