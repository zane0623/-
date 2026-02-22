'use client';

// Force dynamic rendering to avoid ToastProvider issues during static generation
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useWishlist } from '@/hooks/useWishlist';
import { Heart, Trash2, ShoppingCart, ExternalLink } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    toast.success('已移除', '已从心愿单移除');
  };

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.id,
      name: item.productType,
      price: item.price,
      quantity: 1,
      image: item.image || '',
      icon: item.productType.includes('葡萄') ? '🍇' : item.productType.includes('橙') ? '🍊' : item.productType.includes('富士') ? '🍎' : '🌾',
      origin: '未知产地',
      maxQuantity: 10,
    });
    toast.success('已加入购物车', item.productType);
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有收藏吗？')) {
      clearWishlist();
      toast.success('已清空', '心愿单已清空');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">我的心愿单</h1>
              <p className="text-slate-400">
                {wishlist.length} 个收藏
              </p>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                清空全部
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-xl text-slate-400 mb-2">心愿单是空的</p>
              <p className="text-slate-500 mb-6">收藏您感兴趣的产品</p>
              <a
                href="/presale"
                className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                去逛逛
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all"
                >
                  <div className="aspect-square bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg mb-4 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.productType} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-4xl">🌾</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.productType}</h3>
                  <p className="text-2xl font-bold text-emerald-400 mb-4">¥{item.price}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      加入购物车
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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
