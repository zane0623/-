import * as crypto from 'crypto';

/**
 * 加密工具函数集合
 */

/**
 * 生成随机字符串
 */
export function generateRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * 生成UUID v4
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * 生成安全的随机令牌
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}

/**
 * SHA256 哈希
 */
export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * SHA512 哈希
 */
export function sha512(data: string): string {
  return crypto.createHash('sha512').update(data).digest('hex');
}

/**
 * MD5 哈希（注意：不适合用于密码，仅用于非安全场景如文件校验）
 */
export function md5(data: string): string {
  return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * HMAC SHA256
 */
export function hmacSha256(data: string, key: string): string {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

/**
 * HMAC SHA512
 */
export function hmacSha512(data: string, key: string): string {
  return crypto.createHmac('sha512', key).update(data).digest('hex');
}

/**
 * 密码哈希（使用 scrypt）
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':');
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
}

/**
 * AES-256-GCM 加密
 */
export function encrypt(plaintext: string, key: string): string {
  // 确保key长度为32字节
  const keyBuffer = Buffer.alloc(32);
  Buffer.from(key).copy(keyBuffer);
  
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * AES-256-GCM 解密
 */
export function decrypt(ciphertext: string, key: string): string {
  const [ivHex, authTagHex, encrypted] = ciphertext.split(':');
  
  // 确保key长度为32字节
  const keyBuffer = Buffer.alloc(32);
  Buffer.from(key).copy(keyBuffer);
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * 生成签名（用于API请求签名）
 */
export function generateSignature(
  params: Record<string, string | number | boolean>,
  secret: string,
  timestamp?: number
): string {
  const ts = timestamp || Date.now();
  const sortedKeys = Object.keys(params).sort();
  
  let signString = '';
  for (const key of sortedKeys) {
    signString += `${key}=${params[key]}&`;
  }
  signString += `timestamp=${ts}&secret=${secret}`;
  
  return sha256(signString);
}

/**
 * 验证签名
 */
export function verifySignature(
  params: Record<string, string | number | boolean>,
  signature: string,
  secret: string,
  timestamp: number,
  maxAgeMs: number = 5 * 60 * 1000 // 默认5分钟有效
): boolean {
  // 检查时间戳是否过期
  const now = Date.now();
  if (Math.abs(now - timestamp) > maxAgeMs) {
    return false;
  }
  
  const expectedSignature = generateSignature(params, secret, timestamp);
  
  // 使用时间安全比较防止时序攻击
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * 生成订单号
 */
export function generateOrderNo(prefix: string = 'ORD'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * 生成验证码
 */
export function generateVerificationCode(length: number = 6): string {
  const chars = '0123456789';
  let code = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  
  return code;
}

/**
 * 生成邀请码
 */
export function generateInviteCode(length: number = 8): string {
  // 排除容易混淆的字符 O/0, I/1/l
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  
  return code;
}

/**
 * 脱敏手机号
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}

/**
 * 脱敏邮箱
 */
export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!domain) return email;
  
  const maskedName = name.length > 2 
    ? name[0] + '***' + name[name.length - 1]
    : name[0] + '***';
    
  return `${maskedName}@${domain}`;
}

/**
 * 脱敏身份证号
 */
export function maskIdCard(idCard: string): string {
  if (!idCard || idCard.length < 18) return idCard;
  return idCard.slice(0, 6) + '********' + idCard.slice(-4);
}

/**
 * 脱敏银行卡号
 */
export function maskBankCard(cardNo: string): string {
  if (!cardNo || cardNo.length < 16) return cardNo;
  return cardNo.slice(0, 4) + ' **** **** ' + cardNo.slice(-4);
}

/**
 * 脱敏钱包地址
 */
export function maskWalletAddress(address: string, chars: number = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

