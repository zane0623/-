'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { User, Mail, Wallet, Calendar, Edit2, Shield, Bell, Settings } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');

  // 模拟用户数据
  const userData = {
    username: '用户_' + (address?.slice(0, 6) || '未连接'),
    email: 'user@example.com',
    walletAddress: address || '未连接钱包',
    joinDate: '2024-01-15',
    nftCount: 5,
    orderCount: 12,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* 用户信息卡片 */}
            <div className="bg-white/5 rounded-2xl p-8 mb-6 border border-white/10">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {userData.username[0]}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">{userData.username}</h1>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {userData.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      加入于 {userData.joinDate}
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  编辑资料
                </button>
              </div>

              {/* 统计信息 */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-slate-400 text-sm mb-1">NFT数量</div>
                  <div className="text-2xl font-bold text-white">{userData.nftCount}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-slate-400 text-sm mb-1">订单数量</div>
                  <div className="text-2xl font-bold text-white">{userData.orderCount}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-slate-400 text-sm mb-1">钱包地址</div>
                  <div className="text-sm font-mono text-emerald-400 truncate">{userData.walletAddress}</div>
                </div>
              </div>
            </div>

            {/* 标签页 */}
            <div className="flex gap-2 mb-6 border-b border-white/10">
              {[
                { id: 'profile', label: '个人资料', icon: User },
                { id: 'settings', label: '账户设置', icon: Settings },
                { id: 'security', label: '安全设置', icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? 'text-emerald-400 border-b-2 border-emerald-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* 标签内容 */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-6">个人资料</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">用户名</label>
                      <input
                        type="text"
                        defaultValue={userData.username}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">邮箱</label>
                      <input
                        type="email"
                        defaultValue={userData.email}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">钱包地址</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={userData.walletAddress}
                          readOnly
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-emerald-400 font-mono text-sm"
                        />
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                          复制
                        </button>
                      </div>
                    </div>
                    <button className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                      保存更改
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-6">账户设置</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <div className="text-white font-medium">邮件通知</div>
                        <div className="text-sm text-slate-400">接收订单和NFT相关通知</div>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <div className="text-white font-medium">推送通知</div>
                        <div className="text-sm text-slate-400">浏览器推送通知</div>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-6">安全设置</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">当前密码</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">新密码</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">确认新密码</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <button className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                      更新密码
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
