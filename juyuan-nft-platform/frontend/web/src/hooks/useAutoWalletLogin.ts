'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

/**
 * 自动钱包登录 Hook
 * 当钱包连接且用户未登录时，自动触发钱包登录
 */
export function useAutoWalletLogin() {
  const { address, isConnected } = useAccount();
  const { isAuthenticated, walletLogin } = useAuth();
  const toast = useToast();

  useEffect(() => {
    // 如果钱包已连接但用户未登录，提示用户进行钱包登录
    if (isConnected && address && !isAuthenticated) {
      // 不自动登录，让用户主动点击登录按钮
      // 这样可以避免每次连接钱包都弹出签名请求
    }
  }, [isConnected, address, isAuthenticated]);
}
