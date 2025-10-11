/**
 * API客户端 - 统一的后端API调用接口
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // GET请求
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST请求
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT请求
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE请求
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 创建API客户端实例
const api = new ApiClient(API_BASE_URL);

// 健康检查
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return null;
  }
};

// ============================================
// 预售相关API
// ============================================

export interface Presale {
  id: string;
  presale_number: string;
  title: string;
  subtitle?: string;
  description: string;
  cover_image: string;
  banner_images: string[];
  product_info: any;
  pricing: any;
  inventory: any;
  timeline: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export const presaleApi = {
  // 获取所有预售
  getAll: () => api.get<Presale[]>('/presales'),
  
  // 获取单个预售详情
  getById: (id: string) => api.get<Presale>(`/presales/${id}`),
  
  // 创建预售
  create: (data: Partial<Presale>) => api.post<Presale>('/presales', data),
  
  // 更新预售
  update: (id: string, data: Partial<Presale>) => api.put<Presale>(`/presales/${id}`, data),
};

// ============================================
// 订单相关API
// ============================================

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  presale_id: string;
  product_info: any;
  amount_info: any;
  shipping_info: any;
  status: string;
  created_at: string;
}

export const orderApi = {
  // 获取用户订单
  getMyOrders: () => api.get<Order[]>('/orders/my'),
  
  // 获取订单详情
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  
  // 创建订单
  create: (data: Partial<Order>) => api.post<Order>('/orders', data),
};

// ============================================
// 用户相关API
// ============================================

export interface User {
  id: string;
  email?: string;
  phone?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  wallet_address?: string;
  role: string;
  status: string;
}

export const userApi = {
  // 获取当前用户信息
  getMe: () => api.get<User>('/users/me'),
  
  // 更新用户信息
  update: (data: Partial<User>) => api.put<User>('/users/me', data),
};

// ============================================
// 认证相关API
// ============================================

export const authApi = {
  // 注册
  register: (data: { email: string; password: string; username?: string }) =>
    api.post('/auth/register', data),
  
  // 登录
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  // 登出
  logout: () => api.post('/auth/logout'),
  
  // Web3钱包连接
  connectWallet: (data: { wallet_address: string; signature: string }) =>
    api.post('/auth/wallet', data),
};

// ============================================
// NFT相关API
// ============================================

export interface NFT {
  id: string;
  token_id: string;
  user_id: string;
  presale_id: string;
  contract_address: string;
  token_uri: string;
  metadata: any;
  status: string;
  redeemed: boolean;
}

export const nftApi = {
  // 获取用户NFT
  getMyNFTs: () => api.get<NFT[]>('/nfts/my'),
  
  // 获取NFT详情
  getById: (id: string) => api.get<NFT>(`/nfts/${id}`),
  
  // 兑换NFT
  redeem: (id: string) => api.post(`/nfts/${id}/redeem`, {}),
};

// ============================================
// 支付相关API
// ============================================

export const paymentApi = {
  // 创建支付
  create: (data: { order_id: string; payment_method: string; amount: number }) =>
    api.post('/payments', data),
  
  // 确认支付
  confirm: (id: string, data: { tx_hash?: string }) =>
    api.post(`/payments/${id}/confirm`, data),
};

export default api;

