'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
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

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  // 加载通知（模拟数据）
  useEffect(() => {
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
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'nft':
        return '🎨';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  return (
    <div ref={notificationRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-slate-400 hover:text-white transition-colors duration-300 hover:bg-slate-800/50 rounded-xl"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] overflow-hidden flex flex-col">
          {/* 头部 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">通知</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="全部已读"
                >
                  <CheckCheck className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* 通知列表 */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-gray-500 dark:text-gray-400">暂无通知</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notification.read ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                            >
                              标记已读
                            </button>
                          )}
                          {notification.link && (
                            <a
                              href={notification.link}
                              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                              onClick={() => setIsOpen(false)}
                            >
                              查看详情
                            </a>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-500 hover:text-red-600 ml-auto"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部 */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="/notifications"
                className="block text-center text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                查看全部通知
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
