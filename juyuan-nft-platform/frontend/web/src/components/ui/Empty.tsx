'use client';

import Link from 'next/link';
import { 
  ShoppingCart, 
  Package, 
  Search, 
  FileQuestion, 
  Inbox,
  Heart,
  Bell,
  Users
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * 空状态组件
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon || <Inbox className="w-10 h-10 text-slate-500" />}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-slate-400 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

/**
 * 购物车空状态
 */
export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingCart className="w-10 h-10 text-slate-500" />}
      title="购物车是空的"
      description="快去发现优质的农产品吧"
      action={{
        label: "去购物",
        href: "/presale",
      }}
    />
  );
}

/**
 * NFT空状态
 */
export function EmptyNFTs() {
  return (
    <EmptyState
      icon={<Package className="w-10 h-10 text-slate-500" />}
      title="暂无NFT"
      description="您还没有持有任何农产品NFT，快去预售市场看看吧"
      action={{
        label: "前往预售市场",
        href: "/presale",
      }}
    />
  );
}

/**
 * 搜索无结果
 */
export function EmptySearch({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<Search className="w-10 h-10 text-slate-500" />}
      title="未找到结果"
      description={query ? `未找到与"${query}"相关的内容` : "未找到匹配的内容"}
    />
  );
}

/**
 * 404空状态
 */
export function Empty404() {
  return (
    <EmptyState
      icon={<FileQuestion className="w-10 h-10 text-slate-500" />}
      title="页面不存在"
      description="您访问的页面可能已被移除或暂时不可用"
      action={{
        label: "返回首页",
        href: "/",
      }}
    />
  );
}

/**
 * 收藏空状态
 */
export function EmptyFavorites() {
  return (
    <EmptyState
      icon={<Heart className="w-10 h-10 text-slate-500" />}
      title="暂无收藏"
      description="您还没有收藏任何商品"
      action={{
        label: "去发现",
        href: "/presale",
      }}
    />
  );
}

/**
 * 通知空状态
 */
export function EmptyNotifications() {
  return (
    <EmptyState
      icon={<Bell className="w-10 h-10 text-slate-500" />}
      title="暂无通知"
      description="您的通知列表是空的"
    />
  );
}

/**
 * 订单空状态
 */
export function EmptyOrders() {
  return (
    <EmptyState
      icon={<Package className="w-10 h-10 text-slate-500" />}
      title="暂无订单"
      description="您还没有任何订单记录"
      action={{
        label: "开始购物",
        href: "/presale",
      }}
    />
  );
}

/**
 * 用户列表空状态（管理后台）
 */
export function EmptyUsers() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无用户</h3>
      <p className="text-gray-500">没有找到符合条件的用户</p>
    </div>
  );
}

