'use client';

import { useState, useEffect, useCallback } from 'react';

interface WishlistItem {
  id: string;
  productType: string;
  price: number;
  image?: string;
  addedAt: string;
}

const WISHLIST_STORAGE_KEY = 'juyuan_wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载心愿单
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存到本地存储
  const saveWishlist = useCallback((items: WishlistItem[]) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      setWishlist(items);
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }, []);

  // 添加到心愿单
  const addToWishlist = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    const newItem: WishlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };
    const updated = [...wishlist, newItem];
    saveWishlist(updated);
    return true;
  }, [wishlist, saveWishlist]);

  // 从心愿单移除
  const removeFromWishlist = useCallback((id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    saveWishlist(updated);
  }, [wishlist, saveWishlist]);

  // 检查是否已收藏
  const isInWishlist = useCallback((id: string) => {
    return wishlist.some(item => item.id === id);
  }, [wishlist]);

  // 清空心愿单
  const clearWishlist = useCallback(() => {
    saveWishlist([]);
  }, [saveWishlist]);

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    count: wishlist.length,
  };
}
