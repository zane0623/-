'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useAccount } from 'wagmi';
import { Mail, Lock, User, Wallet, Loader2 } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, walletLogin, isAuthenticated } = useAuth();
  const { isConnected } = useAccount();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });

  // 如果已登录，重定向
  if (isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert('密码不匹配');
          setIsLoading(false);
          return;
        }
        await register(formData.email, formData.password, formData.username);
      }
      router.push('/');
    } catch (error) {
      // 错误已在AuthContext中处理
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    if (!isConnected) {
      return; // 等待用户连接钱包
    }

    setIsWalletLoading(true);
    try {
      await walletLogin();
      router.push('/');
    } catch (error) {
      // 错误已在AuthContext中处理
    } finally {
      setIsWalletLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              {/* 标题 */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {isLogin ? '欢迎回来' : '创建账户'}
                </h1>
                <p className="text-slate-400">
                  {isLogin ? '登录您的账户以继续' : '注册新账户开始使用'}
                </p>
              </div>

              {/* 钱包登录 */}
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <span className="px-4 text-sm text-slate-400">或使用钱包登录</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                
                <div className="space-y-3">
                  <ConnectButton.Custom>
                    {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      return (
                        <div>
                          {!connected ? (
                            <button
                              onClick={openConnectModal}
                              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <Wallet className="w-5 h-5" />
                              连接钱包
                            </button>
                          ) : (
                            <div className="space-y-3">
                              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-slate-400">钱包地址</span>
                                  <span className="text-xs text-emerald-400 font-mono">
                                    {account.displayName}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-400">网络</span>
                                  <span className="text-xs text-white">{chain.name}</span>
                                </div>
                              </div>
                              <button
                                onClick={handleWalletLogin}
                                disabled={isWalletLoading}
                                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                {isWalletLoading ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    登录中...
                                  </>
                                ) : (
                                  <>
                                    <Wallet className="w-5 h-5" />
                                    钱包登录
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </div>

              {/* 邮箱登录/注册表单 */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="px-4 text-sm text-slate-400">或使用邮箱</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      用户名
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required={!isLogin}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="请输入用户名"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    邮箱
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="请输入邮箱"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    密码
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="请输入密码"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      确认密码
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        required={!isLogin}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="请再次输入密码"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isLogin ? '登录中...' : '注册中...'}
                    </>
                  ) : (
                    isLogin ? '登录' : '注册'
                  )}
                </button>
              </form>

              {/* 切换登录/注册 */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({
                      email: '',
                      password: '',
                      username: '',
                      confirmPassword: '',
                    });
                  }}
                  className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {isLogin ? (
                    <>还没有账户？<span className="text-emerald-400 font-medium">立即注册</span></>
                  ) : (
                    <>已有账户？<span className="text-emerald-400 font-medium">立即登录</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
