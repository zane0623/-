import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 数据库类型定义
// ==========================================

export interface Product {
  id: string;
  name: string;
  icon: string;
  category: string;
  origin: string;
  price: number;
  original_price?: number;
  stock: number;
  sold: number;
  status: 'active' | 'inactive' | 'out_of_stock' | 'pending';
  description?: string;
  specification?: string;
  quality_grade?: string;
  harvest_date?: string;
  shelf_life?: string;
  weight?: string;
  images?: string[];
  rating: number;
  review_count: number;
  nft_token_id?: string;
  blockchain_hash?: string;
  presale_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Presale {
  id: string;
  product_id?: string;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  min_purchase: number;
  max_purchase: number;
  total_supply: number;
  current_supply: number;
  price: number;
  status: 'upcoming' | 'active' | 'ended' | 'cancelled';
  is_whitelist_only: boolean;
  contract_address?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  wallet_address?: string;
  email?: string;
  phone?: string;
  username?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'super_admin';
  kyc_status: 'none' | 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_no: string;
  user_id: string;
  product_id: string;
  presale_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_method?: string;
  payment_tx_hash?: string;
  shipping_address?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
  };
  created_at: string;
  updated_at: string;
}

export interface NFT {
  id: string;
  token_id: number;
  product_id: string;
  order_id?: string;
  owner_address: string;
  original_owner_address?: string;
  product_type?: string;
  quantity?: number;
  quality_grade?: string;
  harvest_date?: string;
  origin?: string;
  ipfs_hash?: string;
  metadata?: Record<string, unknown>;
  is_delivered: boolean;
  mint_timestamp?: string;
  contract_address?: string;
  tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  nft_id?: string;
  tracking_no?: string;
  carrier?: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'failed';
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TraceEvent {
  id: string;
  nft_id?: string;
  product_id?: string;
  event_type: string;
  title: string;
  description?: string;
  location?: string;
  operator?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  tx_hash?: string;
  event_time: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id?: string;
  rating: number;
  content?: string;
  images?: string[];
  is_anonymous: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

// ==========================================
// API 辅助函数
// ==========================================

// 获取所有产品
export async function getProducts(options?: {
  category?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

// 获取单个产品
export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

// 获取预售列表
export async function getPresales(options?: {
  status?: string;
  limit?: number;
}) {
  let query = supabase
    .from('presales')
    .select('*')
    .order('start_time', { ascending: true });

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Presale[];
}

// 获取分类列表
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as Category[];
}

// 获取产品评价
export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(username, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 获取溯源事件
export async function getTraceEvents(nftId?: string, productId?: string) {
  let query = supabase
    .from('trace_events')
    .select('*')
    .order('event_time', { ascending: false });

  if (nftId) {
    query = query.eq('nft_id', nftId);
  }
  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as TraceEvent[];
}


