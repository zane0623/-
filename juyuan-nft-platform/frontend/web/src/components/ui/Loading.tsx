'use client';

import { Leaf } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

/**
 * 加载转圈动画
 */
export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin ${className}`}
    />
  );
}

interface LoadingDotsProps {
  className?: string;
}

/**
 * 加载点动画
 */
export function LoadingDots({ className = '' }: LoadingDotsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
}

/**
 * 页面级加载状态
 */
export function LoadingPage({ message = '加载中...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-bounce" />
      </div>
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-slate-400">{message}</p>
    </div>
  );
}

interface LoadingCardProps {
  count?: number;
}

/**
 * 卡片骨架屏
 */
export function LoadingCard({ count = 1 }: LoadingCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden animate-pulse"
        >
          {/* 图片区域骨架 */}
          <div className="h-48 bg-slate-700/50" />
          
          {/* 内容区域骨架 */}
          <div className="p-6 space-y-4">
            <div className="h-6 bg-slate-700/50 rounded w-3/4" />
            <div className="h-4 bg-slate-700/50 rounded w-1/2" />
            
            {/* 进度条骨架 */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-slate-700/50 rounded w-16" />
                <div className="h-3 bg-slate-700/50 rounded w-12" />
              </div>
              <div className="h-2 bg-slate-700/50 rounded" />
            </div>
            
            {/* 按钮骨架 */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
              <div className="h-8 bg-slate-700/50 rounded w-20" />
              <div className="h-10 bg-slate-700/50 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

interface LoadingTableProps {
  rows?: number;
  cols?: number;
}

/**
 * 表格骨架屏
 */
export function LoadingTable({ rows = 5, cols = 5 }: LoadingTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* 表头骨架 */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      
      {/* 表体骨架 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="px-6 py-4 flex gap-4 border-b border-gray-100 last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-100 rounded flex-1"
              style={{ width: colIndex === 0 ? '40%' : 'auto' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

/**
 * 加载遮罩
 */
export function LoadingOverlay({ isLoading, message, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-inherit">
          <LoadingSpinner size="lg" />
          {message && <p className="mt-4 text-white">{message}</p>}
        </div>
      )}
    </div>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * 加载按钮
 */
export function LoadingButton({
  isLoading,
  children,
  loadingText = '处理中...',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

