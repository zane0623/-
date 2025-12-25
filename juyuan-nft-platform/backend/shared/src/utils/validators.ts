/**
 * 验证工具函数集合
 * 用于服务端数据验证
 */

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号格式（中国大陆）
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证以太坊钱包地址
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * 验证身份证号（中国大陆）
 */
export function isValidIdCard(idCard: string): boolean {
  // 18位身份证号正则
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  
  if (!idCardRegex.test(idCard)) {
    return false;
  }
  
  // 校验码验证
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weights[i];
  }
  
  const checkCode = checkCodes[sum % 11];
  return idCard[17].toUpperCase() === checkCode;
}

/**
 * 验证密码强度
 * 至少8位，包含大小写字母和数字
 */
export function isStrongPassword(password: string): boolean {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber
  );
}

/**
 * 验证URL格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证日期格式 (YYYY-MM-DD)
 */
export function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 验证价格（正数，最多两位小数）
 */
export function isValidPrice(price: number | string): boolean {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num) || num < 0) {
    return false;
  }
  
  // 最多两位小数
  const decimalPlaces = (num.toString().split('.')[1] || '').length;
  return decimalPlaces <= 2;
}

/**
 * 验证整数
 */
export function isValidInteger(value: number | string): boolean {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isInteger(num);
}

/**
 * 验证正整数
 */
export function isPositiveInteger(value: number | string): boolean {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isInteger(num) && num > 0;
}

/**
 * 验证UUID格式
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 验证快递单号（简单验证，只检查长度和字符）
 */
export function isValidTrackingNumber(trackingNo: string): boolean {
  // 快递单号通常是10-20位的字母数字组合
  const trackingRegex = /^[A-Za-z0-9]{10,25}$/;
  return trackingRegex.test(trackingNo);
}

/**
 * 验证JSON字符串
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证枚举值
 */
export function isValidEnum<T>(value: unknown, enumObject: Record<string, T>): value is T {
  return Object.values(enumObject).includes(value as T);
}

/**
 * 验证数组不为空
 */
export function isNonEmptyArray<T>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * 验证对象不为空
 */
export function isNonEmptyObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;
}

/**
 * 验证字符串长度
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * 验证银行卡号（简单验证，Luhn算法）
 */
export function isValidBankCard(cardNumber: string): boolean {
  // 移除空格和横线
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  if (!/^\d{16,19}$/.test(cleanNumber)) {
    return false;
  }
  
  // Luhn算法验证
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * 创建验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 验证器构建器
 */
export class Validator {
  private errors: string[] = [];
  private value: unknown;
  private fieldName: string;

  constructor(value: unknown, fieldName: string) {
    this.value = value;
    this.fieldName = fieldName;
  }

  required(): this {
    if (this.value === undefined || this.value === null || this.value === '') {
      this.errors.push(`${this.fieldName} 是必填项`);
    }
    return this;
  }

  email(): this {
    if (typeof this.value === 'string' && !isValidEmail(this.value)) {
      this.errors.push(`${this.fieldName} 格式不正确`);
    }
    return this;
  }

  phone(): this {
    if (typeof this.value === 'string' && !isValidPhone(this.value)) {
      this.errors.push(`${this.fieldName} 格式不正确`);
    }
    return this;
  }

  minLength(min: number): this {
    if (typeof this.value === 'string' && this.value.length < min) {
      this.errors.push(`${this.fieldName} 至少需要 ${min} 个字符`);
    }
    return this;
  }

  maxLength(max: number): this {
    if (typeof this.value === 'string' && this.value.length > max) {
      this.errors.push(`${this.fieldName} 不能超过 ${max} 个字符`);
    }
    return this;
  }

  min(min: number): this {
    if (typeof this.value === 'number' && this.value < min) {
      this.errors.push(`${this.fieldName} 不能小于 ${min}`);
    }
    return this;
  }

  max(max: number): this {
    if (typeof this.value === 'number' && this.value > max) {
      this.errors.push(`${this.fieldName} 不能大于 ${max}`);
    }
    return this;
  }

  pattern(regex: RegExp, message?: string): this {
    if (typeof this.value === 'string' && !regex.test(this.value)) {
      this.errors.push(message || `${this.fieldName} 格式不正确`);
    }
    return this;
  }

  custom(fn: (value: unknown) => boolean, message: string): this {
    if (!fn(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
    };
  }
}

/**
 * 创建验证器
 */
export function validate(value: unknown, fieldName: string): Validator {
  return new Validator(value, fieldName);
}

/**
 * 合并多个验证结果
 */
export function mergeValidationResults(...results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap(r => r.errors);
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

