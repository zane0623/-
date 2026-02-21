'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { authApi } from '@/lib/api';
import { useToast } from './ToastContext';

interface User {
  id: string;
  email?: string;
  username: string;
  walletAddress?: string;
  role: string;
  kycStatus?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  walletLogin: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();

  // 从localStorage加载用户信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user_data');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  // 保存到localStorage
  const saveAuth = (newToken: string, newUser: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user_data', JSON.stringify(newUser));
    }
    setToken(newToken);
    setUser(newUser);
  };

  // 清除认证信息
  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
    setToken(null);
    setUser(null);
  };

  // 邮箱登录
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      saveAuth(response.token, response.user);
      toast.success('登录成功', `欢迎回来，${response.user.username}`);
    } catch (error: any) {
      const message = error.response?.data?.message || '登录失败，请检查邮箱和密码';
      toast.error('登录失败', message);
      throw error;
    }
  };

  // 注册
  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await authApi.register({ email, password, username });
      saveAuth(response.token, response.user);
      toast.success('注册成功', `欢迎加入，${response.user.username}`);
    } catch (error: any) {
      const message = error.response?.data?.message || '注册失败，请重试';
      toast.error('注册失败', message);
      throw error;
    }
  };

  // 钱包登录
  const walletLogin = async () => {
    if (!isConnected || !address) {
      toast.error('请先连接钱包', '请连接您的钱包后再登录');
      throw new Error('Wallet not connected');
    }

    try {
      // 生成登录消息
      const message = `请签名以登录钜园农业NFT平台\n\n钱包地址: ${address}\n时间戳: ${Date.now()}`;

      // 请求用户签名
      const signature = await signMessageAsync({ 
        account: address as `0x${string}`,
        message: message as any,
      });

      // 调用后端API
      const response = await authApi.walletLogin(address, signature, message);
      
      saveAuth(response.token, response.user);
      toast.success('钱包登录成功', `欢迎，${response.user.username}`);
    } catch (error: any) {
      if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
        toast.error('签名被拒绝', '请确认签名以完成登录');
      } else {
        const message = error.response?.data?.message || '钱包登录失败';
        toast.error('登录失败', message);
      }
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    await authApi.logout();
    clearAuth();
    toast.success('已登出', '您已成功登出');
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      // 这里可以调用获取用户信息的API
      // const userData = await userApi.getCurrentUser();
      // setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    walletLogin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
