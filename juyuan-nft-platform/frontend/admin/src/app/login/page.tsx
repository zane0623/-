'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Sparkles, Eye, EyeOff, Lock, User, ArrowRight, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (formData.username === 'admin' && formData.password === 'admin123') {
      localStorage.setItem('adminToken', 'demo-token-12345');
      localStorage.setItem('adminUser', JSON.stringify({
        id: '1',
        username: 'admin',
        email: 'admin@juyuan.com',
        role: 'SUPER_ADMIN',
        avatar: null,
      }));
      router.push('/');
    } else {
      setError('用户名或密码错误');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧装饰区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* 网格背景 */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <Leaf className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-amber-900" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">钜园农业</h1>
              <p className="text-emerald-400 font-medium">NFT 管理平台</p>
            </div>
          </div>

          {/* 特性 */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              农产品溯源
              <br />
              <span className="text-emerald-400">区块链赋能</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              打造透明可信的农产品供应链，让每一份产品都拥有独特的数字身份
            </p>
          </div>

          {/* 统计 */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-emerald-400">10K+</div>
              <div className="text-gray-500 mt-1">NFT 铸造</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">5K+</div>
              <div className="text-gray-500 mt-1">活跃用户</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">100%</div>
              <div className="text-gray-500 mt-1">可追溯</div>
            </div>
          </div>
        </div>

        {/* 浮动卡片装饰 */}
        <div className="absolute bottom-20 right-20 w-64 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold">企业级安全</div>
              <div className="text-sm text-gray-400">数据加密保护</div>
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">钜园管理</span>
              <span className="block text-sm text-emerald-600">ADMIN PANEL</span>
            </div>
          </div>

          {/* 标题 */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2>
            <p className="text-gray-500">请登录您的管理员账户</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                  placeholder="请输入用户名"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                  placeholder="请输入密码"
                  required
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">记住我</span>
              </label>
              <button type="button" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                忘记密码？
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:ring-4 focus:ring-emerald-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  登录
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* 底部提示 */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              演示账号：<span className="font-mono text-gray-700">admin / admin123</span>
            </p>
          </div>

          {/* 版权信息 */}
          <div className="mt-12 text-center text-sm text-gray-400">
            <p>© 2024 钜园农业科技. 保留所有权利.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

