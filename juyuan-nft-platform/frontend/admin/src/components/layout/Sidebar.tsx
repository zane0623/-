'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart,
  CreditCard,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Search,
  FileCheck,
  Leaf,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const menuItems = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard, color: 'text-emerald-400' },
  { name: '订单管理', href: '/orders', icon: ShoppingCart, color: 'text-orange-400' },
  { name: '用户管理', href: '/users', icon: Users, color: 'text-blue-400' },
  { name: 'NFT管理', href: '/nfts', icon: Package, color: 'text-violet-400' },
  { name: '预售管理', href: '/presales', icon: ShoppingCart, color: 'text-amber-400' },
  { name: '溯源管理', href: '/traceability', icon: Search, color: 'text-teal-400' },
  { name: '支付管理', href: '/payments', icon: CreditCard, color: 'text-pink-400' },
  { name: '物流配送', href: '/deliveries', icon: Truck, color: 'text-cyan-400' },
  { name: 'KYC审核', href: '/kyc', icon: FileCheck, color: 'text-orange-400' },
  { name: '数据统计', href: '/analytics', icon: BarChart3, color: 'text-indigo-400' },
  { name: '系统设置', href: '/settings', icon: Settings, color: 'text-gray-400' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white transition-all duration-300 flex flex-col shadow-2xl',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-gray-800/50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-amber-900" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg block">钜园管理</span>
              <span className="text-xs text-emerald-400 font-medium">ADMIN PANEL</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mx-auto">
            <Leaf className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      
      {/* 折叠按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
      >
        <ChevronLeft className={clsx(
          'w-4 h-4 text-gray-400 transition-transform',
          collapsed && 'rotate-180'
        )} />
      </button>

      {/* 菜单 */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {!collapsed && (
          <div className="px-4 mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">主菜单</span>
          </div>
        )}
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    'group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  )}
                >
                  <Icon className={clsx(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-white' : item.color
                  )} />
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                  {!collapsed && isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 用户信息和退出 */}
      <div className="p-4 border-t border-gray-800/50">
        {!collapsed && (
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
              管
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">管理员</p>
              <p className="text-xs text-gray-500 truncate">admin@juyuan.com</p>
            </div>
          </div>
        )}
        <button
          className={clsx(
            'flex items-center w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3 font-medium">退出登录</span>}
        </button>
      </div>
    </aside>
  );
}

