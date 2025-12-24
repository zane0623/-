import { z } from 'zod';

// ==========================================
// 通用验证规则
// ==========================================

export const emailSchema = z.string().email('邮箱格式不正确');

export const passwordSchema = z
  .string()
  .min(8, '密码至少8位')
  .max(50, '密码最多50位')
  .regex(/[A-Za-z]/, '密码必须包含字母')
  .regex(/[0-9]/, '密码必须包含数字');

export const usernameSchema = z
  .string()
  .min(2, '用户名至少2位')
  .max(20, '用户名最多20位')
  .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, '用户名只能包含字母、数字、下划线和中文');

export const phoneSchema = z
  .string()
  .regex(/^1[3-9]\d{9}$/, '手机号格式不正确');

export const ethereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, '以太坊地址格式不正确');

export const idSchema = z.string().min(1, 'ID不能为空');

export const positiveNumberSchema = z.number().positive('必须是正数');

export const nonNegativeNumberSchema = z.number().min(0, '不能为负数');

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

// ==========================================
// 用户相关验证
// ==========================================

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  phone: phoneSchema.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '密码不能为空'),
});

export const walletLoginSchema = z.object({
  walletAddress: ethereumAddressSchema,
  signature: z.string().min(1, '签名不能为空'),
  message: z.string().min(1, '消息不能为空'),
});

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  phone: phoneSchema.optional(),
  avatar: z.string().url('头像URL格式不正确').optional(),
});

// ==========================================
// NFT相关验证
// ==========================================

export const mintNFTSchema = z.object({
  recipient: ethereumAddressSchema,
  productType: z.string().min(1).max(100),
  quantity: z.string().min(1).max(20),
  origin: z.string().min(1).max(200),
  harvestDate: z.number().int().positive(),
  qualityGrade: z.enum(['特级', '优级', '一级', '二级']),
  certifications: z.array(z.string()).optional(),
});

export const batchMintNFTSchema = z.object({
  recipients: z.array(ethereumAddressSchema).min(1).max(100),
  productType: z.string().min(1).max(100),
  quantities: z.array(z.string()).optional(),
  origin: z.string().min(1).max(200),
  harvestDate: z.number().int().positive(),
  qualityGrade: z.enum(['特级', '优级', '一级', '二级']),
});

// ==========================================
// 预售相关验证
// ==========================================

export const createPresaleSchema = z.object({
  productType: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  price: positiveNumberSchema,
  totalSupply: z.number().int().positive(),
  minPurchase: z.number().int().positive().default(1),
  maxPurchase: z.number().int().positive(),
  startTime: z.number().int().positive(),
  endTime: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
  metadata: z.record(z.string()).optional(),
}).refine(data => data.endTime > data.startTime, {
  message: '结束时间必须晚于开始时间',
  path: ['endTime'],
}).refine(data => data.maxPurchase >= data.minPurchase, {
  message: '最大购买量必须大于等于最小购买量',
  path: ['maxPurchase'],
});

export const purchasePresaleSchema = z.object({
  presaleId: idSchema,
  quantity: z.number().int().positive(),
  paymentToken: ethereumAddressSchema.optional(),
});

// ==========================================
// 订单相关验证
// ==========================================

export const createOrderSchema = z.object({
  productId: idSchema,
  quantity: z.number().int().positive(),
  shippingAddress: z.object({
    name: z.string().min(1).max(50),
    phone: phoneSchema,
    province: z.string().min(1).max(20),
    city: z.string().min(1).max(20),
    district: z.string().min(1).max(20),
    address: z.string().min(1).max(200),
    postalCode: z.string().optional(),
  }),
  remark: z.string().max(500).optional(),
});

// ==========================================
// 溯源相关验证
// ==========================================

export const addTraceEventSchema = z.object({
  tokenId: z.number().int().positive(),
  eventType: z.enum(['PLANTING', 'GROWING', 'HARVESTING', 'PROCESSING', 'PACKAGING', 'SHIPPING', 'DELIVERED']),
  location: z.string().max(200).optional(),
  operator: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  metadata: z.record(z.string()).optional(),
});

// ==========================================
// KYC相关验证
// ==========================================

export const submitKYCSchema = z.object({
  idType: z.enum(['ID_CARD', 'PASSPORT', 'DRIVER_LICENSE']),
  idNumber: z.string().min(1).max(30),
  realName: z.string().min(1).max(50),
  idFrontImage: z.string().url(),
  idBackImage: z.string().url().optional(),
  selfieImage: z.string().url(),
});

// ==========================================
// 类型导出
// ==========================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WalletLoginInput = z.infer<typeof walletLoginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type MintNFTInput = z.infer<typeof mintNFTSchema>;
export type BatchMintNFTInput = z.infer<typeof batchMintNFTSchema>;
export type CreatePresaleInput = z.infer<typeof createPresaleSchema>;
export type PurchasePresaleInput = z.infer<typeof purchasePresaleSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type AddTraceEventInput = z.infer<typeof addTraceEventSchema>;
export type SubmitKYCInput = z.infer<typeof submitKYCSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

// ==========================================
// 验证辅助函数
// ==========================================

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
  return result.data;
}

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    return { success: false, errors };
  }
  return { success: true, data: result.data };
}

