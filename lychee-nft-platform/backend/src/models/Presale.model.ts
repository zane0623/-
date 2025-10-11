/**
 * 预售活动数据模型
 * Presale Activity Model
 */

export interface PresaleActivity {
  // 基本信息
  id: string;
  presale_number: string;
  title: string;
  subtitle: string;
  description: string;
  cover_image: string;
  banner_images: string[];
  
  // 产品信息
  product_info: ProductInfo;
  
  // 价格策略
  pricing: PricingStrategy;
  
  // 库存管理
  inventory: InventoryInfo;
  
  // 时间节点
  timeline: TimelineInfo;
  
  // NFT配置
  nft_config: NFTConfig;
  
  // 配送信息
  shipping: ShippingInfo;
  
  // 状态
  status: PresaleStatus;
  audit_status: AuditStatus;
  
  // 果园信息
  orchard_id: string;
  orchard_info?: OrchardInfo;
  
  // 标签
  tags: string[];
  
  // 统计数据
  stats: PresaleStats;
  
  // 时间戳
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

export interface ProductInfo {
  category: 'lychee' | 'longan' | 'mango' | 'durian' | 'tea' | 'honey';
  variety: string;
  grade: 'premium' | 'first' | 'second';
  weight: number;
  unit: string;
  specs: Record<string, any>;
}

export interface PricingStrategy {
  original_price: number;
  presale_price: number;
  discount_rate: number;
  deposit?: number;
  final_payment?: number;
  group_discount?: GroupDiscount[];
  early_bird_discount?: EarlyBirdDiscount;
}

export interface GroupDiscount {
  min_quantity: number;
  discount_rate: number;
}

export interface EarlyBirdDiscount {
  end_time: Date;
  discount_rate: number;
}

export interface InventoryInfo {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  min_purchase: number;
  max_purchase: number;
  limit_per_user: number;
}

export interface TimelineInfo {
  presale_start: Date;
  presale_end: Date;
  harvest_start: Date;
  harvest_end: Date;
  delivery_deadline: Date;
  deposit_deadline?: Date;
}

export interface NFTConfig {
  collection_name: string;
  contract_address: string;
  token_id_start: number;
  metadata_uri: string;
  rights: string[];
  transferable: boolean;
  royalty_rate: number;
}

export interface ShippingInfo {
  regions: string[];
  free_shipping: boolean;
  shipping_fee: number;
  cold_chain: boolean;
  insurance: boolean;
  estimated_days: number;
}

export interface OrchardInfo {
  id: string;
  name: string;
  location: string;
  certification: string[];
  rating: number;
}

export interface PresaleStats {
  views: number;
  likes: number;
  shares: number;
  conversion_rate: number;
}

export enum PresaleStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  SOLD_OUT = 'sold_out',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

export enum AuditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// 创建预售DTO
export interface CreatePresaleDTO {
  title: string;
  subtitle?: string;
  description: string;
  cover_image: string;
  banner_images?: string[];
  product_info: ProductInfo;
  pricing: PricingStrategy;
  inventory: InventoryInfo;
  timeline: TimelineInfo;
  nft_config?: Partial<NFTConfig>;
  shipping: ShippingInfo;
  tags?: string[];
}

// 更新预售DTO
export interface UpdatePresaleDTO extends Partial<CreatePresaleDTO> {
  status?: PresaleStatus;
}

// 查询预售DTO
export interface QueryPresaleDTO {
  page?: number;
  limit?: number;
  category?: string;
  status?: PresaleStatus;
  sort?: 'latest' | 'popular' | 'price_asc' | 'price_desc';
  keyword?: string;
  orchard_id?: string;
}

