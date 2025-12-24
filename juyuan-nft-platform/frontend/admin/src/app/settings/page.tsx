'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Key,
  Globe,
  Save,
  Upload,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Wallet,
  Link,
  Mail,
  Smartphone
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const tabs: TabItem[] = [
  { id: 'profile', label: '账户信息', icon: User },
  { id: 'security', label: '安全设置', icon: Shield },
  { id: 'notification', label: '通知设置', icon: Bell },
  { id: 'appearance', label: '外观设置', icon: Palette },
  { id: 'blockchain', label: '区块链配置', icon: Wallet },
  { id: 'system', label: '系统设置', icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            {/* 头像 */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  管
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">管理员头像</h3>
                <p className="text-sm text-gray-500">支持 JPG、PNG 格式，最大 2MB</p>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                <input
                  type="text"
                  defaultValue="admin"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">显示名称</label>
                <input
                  type="text"
                  defaultValue="超级管理员"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
                <input
                  type="email"
                  defaultValue="admin@juyuan.com"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">手机号码</label>
                <input
                  type="tel"
                  defaultValue="138****1234"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>
            </div>

            {/* 角色信息 */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">超级管理员</p>
                  <p className="text-sm text-emerald-600">拥有所有系统权限</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8">
            {/* 修改密码 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">修改密码</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none pr-12"
                      placeholder="请输入当前密码"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                      placeholder="请输入新密码"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                      placeholder="请再次输入新密码"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 两步验证 */}
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">两步验证</h4>
                    <p className="text-sm text-gray-500">使用手机验证码进行二次验证</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  启用
                </button>
              </div>
            </div>

            {/* 登录历史 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">登录历史</h3>
              <div className="space-y-3">
                {[
                  { device: 'Chrome on macOS', ip: '192.168.1.100', time: '刚刚', current: true },
                  { device: 'Safari on iPhone', ip: '192.168.1.105', time: '2小时前', current: false },
                  { device: 'Chrome on Windows', ip: '192.168.1.110', time: '昨天', current: false },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{session.device}</p>
                        <p className="text-sm text-gray-500">IP: {session.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{session.time}</span>
                      {session.current ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">当前设备</span>
                      ) : (
                        <button className="text-red-500 hover:text-red-600 text-sm">撤销</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notification':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">通知偏好设置</h3>
            {[
              { icon: Mail, title: '邮件通知', desc: '接收重要系统通知和报告', enabled: true },
              { icon: Smartphone, title: '短信通知', desc: '接收安全验证和紧急通知', enabled: true },
              { icon: Bell, title: '浏览器推送', desc: '在浏览器中接收实时通知', enabled: false },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                  </label>
                </div>
              );
            })}

            <h3 className="text-lg font-semibold text-gray-900 pt-4">通知类型</h3>
            {[
              { title: '新订单提醒', enabled: true },
              { title: 'KYC审核提醒', enabled: true },
              { title: '系统告警', enabled: true },
              { title: '每日报表', enabled: false },
              { title: '营销活动', enabled: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{item.title}</span>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case 'blockchain':
        return (
          <div className="space-y-8">
            {/* 网络配置 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">区块链网络</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border-2 border-emerald-500 cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-gray-900">以太坊主网</span>
                  </div>
                  <p className="text-sm text-gray-500">Chain ID: 1</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-gray-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                    <span className="font-semibold text-gray-900">Polygon</span>
                  </div>
                  <p className="text-sm text-gray-500">Chain ID: 137</p>
                </div>
              </div>
            </div>

            {/* 合约地址 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">智能合约</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NFT 合约地址</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue="0x1234567890abcdef1234567890abcdef12345678"
                      className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-mono text-sm focus:bg-white focus:border-emerald-500 outline-none"
                      readOnly
                    />
                    <button className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                      <Link className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">预售合约地址</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue="0xabcdef1234567890abcdef1234567890abcdef12"
                      className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-mono text-sm focus:bg-white focus:border-emerald-500 outline-none"
                      readOnly
                    />
                    <button className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                      <Link className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* API 密钥 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API 配置</h3>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">敏感信息</p>
                    <p className="text-sm text-amber-700">请妥善保管您的 API 密钥，不要分享给他人</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Infura API Key</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    defaultValue="abcdef1234567890abcdef1234567890"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none pr-12 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-8">
            {/* 站点设置 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">站点设置</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">站点名称</label>
                  <input
                    type="text"
                    defaultValue="钜园农业NFT平台"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">站点域名</label>
                  <input
                    type="text"
                    defaultValue="https://juyuan.com"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 维护模式 */}
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">维护模式</h4>
                  <p className="text-sm text-gray-500">开启后用户将无法访问前台</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
            </div>

            {/* 数据管理 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">数据管理</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors text-left">
                  <Database className="w-6 h-6 text-gray-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">备份数据</h4>
                  <p className="text-sm text-gray-500">创建完整的数据备份</p>
                </button>
                <button className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors text-left">
                  <Upload className="w-6 h-6 text-gray-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">恢复数据</h4>
                  <p className="text-sm text-gray-500">从备份文件恢复数据</p>
                </button>
              </div>
            </div>

            {/* 危险操作 */}
            <div className="p-6 bg-red-50 rounded-xl border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">危险操作</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900">清除缓存</p>
                    <p className="text-sm text-red-600">清除系统所有缓存数据</p>
                  </div>
                  <button className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors">
                    清除
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900">重置系统</p>
                    <p className="text-sm text-red-600">将系统恢复到初始状态</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    重置
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Palette className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">外观设置</h3>
            <p className="text-gray-500">主题和显示选项</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
              <p className="text-gray-500 mt-1">管理您的账户和系统配置</p>
            </div>
            <button 
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? '已保存' : '保存更改'}
            </button>
          </div>

          <div className="flex gap-8">
            {/* 侧边标签栏 */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 p-2 sticky top-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-emerald-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
