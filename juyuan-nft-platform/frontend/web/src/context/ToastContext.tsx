'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer } from '@/components/ui/Toast';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface ToastContextType {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

// 创建一个安全的 fallback
const noOpToast = {
  success: () => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('useToast called outside ToastProvider - Toast will not be displayed');
    }
  },
  error: () => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('useToast called outside ToastProvider - Toast will not be displayed');
    }
  },
  info: () => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('useToast called outside ToastProvider - Toast will not be displayed');
    }
  },
  warning: () => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('useToast called outside ToastProvider - Toast will not be displayed');
    }
  },
};

export function useToast() {
  const context = useContext(ToastContext);
  // 如果 context 不可用，返回 no-op 函数而不是抛出错误
  // 这允许页面在构建时和客户端水合时成功渲染
  // 在开发环境中会显示警告，帮助开发者发现配置问题
  if (context === undefined) {
    return noOpToast;
  }
  return context;
}

