'use client';

import { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  ChevronDown,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export default function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: '新订单', message: '用户张三购买了阳光玫瑰葡萄', time: '2分钟前', read: false },
    { id: 2, title: 'KYC申请', message: '3个新的实名认证申请待审核', time: '15分钟前', read: false },
    { id: 3, title: '系统通知', message: '数据库备份已完成', time: '1小时前', read: true },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* 左侧搜索 */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索用户、订单、产品..."
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            ⌘K
          </span>
        </div>
      </div>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-2">
        {/* 主题切换 */}
        <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
          <Sun className="w-5 h-5" />
        </button>

        {/* 帮助 */}
        <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* 消息 */}
        <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* 通知 */}
        <div className="relative">
          <button 
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* 通知下拉 */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-scale-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">通知</h3>
                  <button className="text-sm text-emerald-600 hover:text-emerald-700">全部已读</button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-emerald-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${!notif.read ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                        <p className="text-gray-500 text-sm truncate">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100">
                <button className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  查看全部通知
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 分隔线 */}
        <div className="w-px h-8 bg-gray-200 mx-2" />

        {/* 用户菜单 */}
        <div className="relative">
          <button 
            className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-xl transition-all"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
              管
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900">管理员</p>
              <p className="text-xs text-gray-500">超级管理员</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* 用户下拉菜单 */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-scale-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">管理员</p>
                <p className="text-sm text-gray-500">admin@juyuan.com</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="w-5 h-5 text-gray-400" />
                  个人资料
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5 text-gray-400" />
                  账户设置
                </button>
              </div>
              <div className="border-t border-gray-100 py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-5 h-5" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
