'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
            <p className="text-gray-500 mt-1">管理平台配置和系统参数</p>
          </div>

          <div className="flex gap-6">
            {/* 侧边标签 */}
            <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit">
              <nav className="space-y-1">
                {[
                  { id: 'general', label: '基本设置', icon: '⚙️' },
                  { id: 'blockchain', label: '区块链配置', icon: '🔗' },
                  { id: 'payment', label: '支付设置', icon: '💳' },
                  { id: 'notification', label: '通知设置', icon: '🔔' },
                  { id: 'security', label: '安全设置', icon: '🔒' },
                  { id: 'api', label: 'API配置', icon: '🔌' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">基本设置</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">平台名称</label>
                      <input
                        type="text"
                        defaultValue="钜园农业NFT平台"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">平台描述</label>
                      <textarea
                        rows={3}
                        defaultValue="区块链溯源农产品NFT预售平台"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">联系邮箱</label>
                      <input
                        type="email"
                        defaultValue="support@juyuan-nft.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">默认语言</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="zh-CN">简体中文</option>
                        <option value="en-US">English</option>
                        <option value="zh-TW">繁體中文</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'blockchain' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">区块链配置</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">网络</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="polygon">Polygon Mainnet</option>
                        <option value="polygon-mumbai">Polygon Mumbai (测试网)</option>
                        <option value="ethereum">Ethereum Mainnet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NFT合约地址</label>
                      <input
                        type="text"
                        defaultValue="0x..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">预售合约地址</label>
                      <input
                        type="text"
                        defaultValue="0x..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">托管合约地址</label>
                      <input
                        type="text"
                        defaultValue="0x..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">平台手续费 (%)</label>
                      <input
                        type="number"
                        defaultValue="2.5"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">支付设置</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💳</span>
                        <div>
                          <div className="font-medium text-gray-900">Stripe</div>
                          <div className="text-sm text-gray-500">国际信用卡支付</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💚</span>
                        <div>
                          <div className="font-medium text-gray-900">微信支付</div>
                          <div className="text-sm text-gray-500">中国用户首选</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔵</span>
                        <div>
                          <div className="font-medium text-gray-900">支付宝</div>
                          <div className="text-sm text-gray-500">中国用户</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🪙</span>
                        <div>
                          <div className="font-medium text-gray-900">加密货币</div>
                          <div className="text-sm text-gray-500">ETH, USDT, USDC</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 保存按钮 */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

