import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  presale_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  wallet_address?: string;
  transaction_hash?: string;
  product_info: any;
  delivery_address?: any;
  tracking_number?: string;
  nft_token_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  cancelled_at?: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  completed: number;
  cancelled: number;
}

// 获取Token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// 创建API客户端
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加Token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const orderApi = {
  /**
   * 创建订单
   */
  create: async (data: {
    presale_id: string;
    quantity: number;
    wallet_address?: string;
    transaction_hash?: string;
  }): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.post('/orders', data);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * 获取用户订单列表
   */
  getAll: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> => {
    try {
      const response = await api.get('/orders', { params });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * 获取订单详情
   */
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * 取消订单
   */
  cancel: async (id: string): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.post(`/orders/${id}/cancel`);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * 确认收货
   */
  confirm: async (id: string): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.post(`/orders/${id}/confirm`);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * 获取订单统计
   */
  getStats: async (): Promise<ApiResponse<OrderStats>> => {
    try {
      const response = await api.get('/orders/stats');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },
};

