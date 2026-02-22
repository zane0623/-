'use client';

// Force dynamic rendering to avoid ToastProvider issues during static generation
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Bell, CheckCheck, Trash2, Package, Image as ImageIcon, Settings } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface Notification {
  id: string;
  type: 'order' | 'nft' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export default function NotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'nft' | 'system'>('all');

  useEffect(() => {
    // 模拟通知数据
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: '订单已发货',
        message: '您的订单 #12345 已发货，运单号：SF1234567890',
        time: '2分钟前',
        read: false,
        link: '/my-nfts',
      },
      {
        id: '2',
        type: 'nft',
        title: 'NFT已交付',
        message: '您的阳光玫瑰葡萄NFT已成功交付到钱包',
        time: '1小时前',
        read: false,
        link: '/my-nfts',
      },
      {
        id: '3',
        type: 'system',
        title: '系统通知',
        message: '平台维护完成，所有功能已恢复正常',
        time: '3小时前',
        read: true,
      },
      {
        id: '4',
        type: 'order',
        title: '订单确认',
        message: '您的订单 #12344 已确认，正在准备发货',
        time: '1天前',
        read: true,
        link: '/my-nfts',
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success('已标记为已读');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('全部已标记为已读');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('已删除');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'nft':
        return <ImageIcon className="w-5 h-5 text-purple-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* 头部 */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">通知中心</h1>
                <p className="text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} 条未读通知` : '全部已读'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  全部已读
                </button>
              )}
            </div>

            {/* 筛选 */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {[
                { id: 'all', label: '全部' },
                { id: 'unread', label: `未读 (${unreadCount})` },
                { id: 'order', label: '订单' },
                { id: 'nft', label: 'NFT' },
                { id: 'system', label: '系统' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    filter === tab.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 通知列表 */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                  <Bell className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
                  <p className="text-xl text-slate-400 mb-2">暂无通知</p>
                  <p className="text-slate-500">当有新通知时会显示在这里</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white/5 hover:bg-white/10 rounded-xl p-6 border transition-all ${
                      notification.read
                        ? 'border-white/10'
                        : 'border-emerald-500/50 bg-emerald-500/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-slate-400 mb-2">{notification.message}</p>
                            <p className="text-sm text-slate-500">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                          {notification.link && (
                            <a
                              href={notification.link}
                              className="text-sm text-emerald-400 hover:text-emerald-300"
                            >
                              查看详情 →
                            </a>
                          )}
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-slate-400 hover:text-white"
                            >
                              标记已读
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-sm text-red-400 hover:text-red-300 ml-auto"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
