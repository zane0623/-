// ========================================
// 钜园农业NFT平台 - 共享类型定义
// ========================================

// 用户相关类型
export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  kycStatus: KYCStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'USER',
  FARMER = 'FARMER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}

export enum KYCStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// NFT相关类型
export interface NFT {
  id: string;
  tokenId: number;
  contractAddress: string;
  owner: string;
  productType: string;
  quantity: number;
  qualityGrade: string;
  harvestDate: Date;
  originBase: string;
  metadata: NFTMetadata;
  status: NFTStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  traceabilityHash: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export enum NFTStatus {
  MINTED = 'MINTED',
  LISTED = 'LISTED',
  SOLD = 'SOLD',
  DELIVERED = 'DELIVERED',
  REDEEMED = 'REDEEMED'
}

// 预售相关类型
export interface Presale {
  id: string;
  presaleId: number;
  productType: string;
  description: string;
  images: string[];
  totalSupply: number;
  soldAmount: number;
  price: string;
  currency: string;
  startTime: Date;
  endTime: Date;
  status: PresaleStatus;
  originBase: string;
  harvestDate: Date;
  deliveryDate: Date;
  farmer: Farmer;
  createdAt: Date;
  updatedAt: Date;
}

export enum PresaleStatus {
  DRAFT = 'DRAFT',
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED'
}

export interface Farmer {
  id: string;
  name: string;
  walletAddress: string;
  farmName: string;
  location: string;
  description: string;
  certifications: string[];
  rating: number;
  totalSales: number;
}

// 订单相关类型
export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  presaleId: string;
  quantity: number;
  totalAmount: string;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  deliveryAddress: DeliveryAddress;
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentMethod {
  ETH = 'ETH',
  MATIC = 'MATIC',
  USDT = 'USDT',
  USDC = 'USDC',
  WECHAT = 'WECHAT',
  ALIPAY = 'ALIPAY'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum DeliveryStatus {
  NOT_SHIPPED = 'NOT_SHIPPED',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CONFIRMED = 'CONFIRMED'
}

export interface DeliveryAddress {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  postalCode?: string;
}

// 溯源相关类型
export interface TraceRecord {
  id: string;
  tokenId: number;
  eventType: TraceEventType;
  description: string;
  timestamp: Date;
  location?: string;
  operator?: string;
  data?: Record<string, any>;
  images?: string[];
  txHash?: string;
}

export enum TraceEventType {
  PLANTING = 'PLANTING',
  GROWING = 'GROWING',
  FERTILIZING = 'FERTILIZING',
  PEST_CONTROL = 'PEST_CONTROL',
  HARVESTING = 'HARVESTING',
  PROCESSING = 'PROCESSING',
  QUALITY_CHECK = 'QUALITY_CHECK',
  PACKAGING = 'PACKAGING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED'
}

// 通知相关类型
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  ORDER = 'ORDER',
  PRESALE = 'PRESALE',
  DELIVERY = 'DELIVERY',
  PROMOTION = 'PROMOTION'
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
}

// 分页请求类型
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// JWT载荷类型
export interface JWTPayload {
  userId: string;
  walletAddress: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// 事件类型
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, any>;
  timestamp: Date;
  version: number;
}



