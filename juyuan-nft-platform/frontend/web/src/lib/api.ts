import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 创建axios实例
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 认证API
export const authApi = {
  // 邮箱登录
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // 注册
  register: async (data: { email: string; password: string; username: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // 钱包登录
  walletLogin: async (walletAddress: string, signature: string, message: string) => {
    const response = await api.post('/auth/wallet-login', {
      walletAddress,
      signature,
      message,
    });
    return response.data;
  },

  // 刷新token
  refreshToken: async (token: string) => {
    const response = await api.post('/auth/refresh', { token });
    return response.data;
  },

  // 登出
  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },
};

// 用户API
export const userApi = {
  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // 更新用户信息
  updateUser: async (data: any) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },
};

export default api;
