'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role: string;
  wallet_address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 从localStorage获取token
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // 保存token到localStorage
  const saveToken = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  };

  // 删除token
  const removeToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        removeToken();
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取用户信息
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        saveToken(token);
        setUser(userData);
      } else {
        throw new Error(response.data.message || '登录失败');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || '登录失败');
    }
  };

  // 注册
  const register = async (email: string, password: string, username?: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        username
      });

      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        saveToken(token);
        setUser(userData);
      } else {
        throw new Error(response.data.message || '注册失败');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || '注册失败');
    }
  };

  // 登出
  const logout = () => {
    removeToken();
    setUser(null);
    // 可选：调用后端登出API
    const token = getToken();
    if (token) {
      axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(err => console.error('Logout API error:', err));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

