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
  shipping_address?: Record<string, unknown>;
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

export interface KYCApplication {
  id: string;
  user_id: string;
  real_name?: string;
  id_card_no?: string;
  id_card_front_url?: string;
  id_card_back_url?: string;
  selfie_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  reject_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  tx_hash?: string;
  external_order_id?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// Admin API 函数
// ==========================================

// 获取所有产品（管理员）
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

// 创建产品
export async function createProduct(product: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

// 更新产品
export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

// 删除产品
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// 获取所有用户
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as User[];
}

// 更新用户状态
export async function updateUserStatus(id: string, is_active: boolean) {
  const { data, error } = await supabase
    .from('users')
    .update({ is_active })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// 获取所有订单
export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, users(username, email), products(name, icon)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 更新订单状态
export async function updateOrderStatus(id: string, status: Order['status']) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

// 获取KYC申请
export async function getKYCApplications() {
  const { data, error } = await supabase
    .from('kyc_applications')
    .select('*, users(username, email, wallet_address)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 审核KYC
export async function reviewKYC(id: string, status: 'approved' | 'rejected', reject_reason?: string) {
  const { data, error } = await supabase
    .from('kyc_applications')
    .update({ 
      status, 
      reject_reason,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 获取配送信息
export async function getAllDeliveries() {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*, orders(order_no, users(username))')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 更新配送状态
export async function updateDeliveryStatus(id: string, updates: Partial<Delivery>) {
  const { data, error } = await supabase
    .from('deliveries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Delivery;
}

// 获取统计数据
export async function getDashboardStats() {
  const [
    { count: totalUsers },
    { count: totalProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { count: pendingKYC },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('kyc_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  return {
    totalUsers: totalUsers || 0,
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    pendingOrders: pendingOrders || 0,
    pendingKYC: pendingKYC || 0,
  };
}

// 获取预售列表（管理员）
export async function getAllPresales() {
  const { data, error } = await supabase
    .from('presales')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Presale[];
}

// 创建预售
export async function createPresale(presale: Partial<Presale>) {
  const { data, error } = await supabase
    .from('presales')
    .insert(presale)
    .select()
    .single();

  if (error) throw error;
  return data as Presale;
}

// 更新预售
export async function updatePresale(id: string, updates: Partial<Presale>) {
  const { data, error } = await supabase
    .from('presales')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Presale;
}


