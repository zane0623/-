import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并Tailwind类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化价格（人民币）
 */
export function formatPrice(price: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    ...options,
  }).format(price);
}

/**
 * 格式化价格（ETH）
 */
export function formatEther(wei: bigint): string {
  const ether = Number(wei) / 1e18;
  return ether.toFixed(4) + ' ETH';
}

/**
 * 缩短钱包地址
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 30) return formatDate(d);
  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return '刚刚';
}

/**
 * 格式化大数字
 */
export function formatNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * 生成随机ID
 */
export function generateId(prefix = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

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
 * 验证钱包地址格式（以太坊）
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * 计算百分比
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * 安全解析JSON
 */
export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        await delay(delayMs * (i + 1)); // 指数退避
      }
    }
  }
  
  throw lastError;
}

/**
 * 获取产品图标
 */
export function getProductIcon(productType: string): string {
  if (productType.includes('葡萄')) return '🍇';
  if (productType.includes('橙') || productType.includes('脐橙')) return '🍊';
  if (productType.includes('苹果') || productType.includes('富士')) return '🍎';
  if (productType.includes('米') || productType.includes('大米')) return '🌾';
  if (productType.includes('荔枝')) return '🍒';
  if (productType.includes('芒果')) return '🥭';
  if (productType.includes('草莓')) return '🍓';
  if (productType.includes('西瓜')) return '🍉';
  if (productType.includes('柠檬')) return '🍋';
  if (productType.includes('桃')) return '🍑';
  return '🌿';
}

/**
 * 获取状态颜色
 */
export function getStatusColor(status: string): { bg: string; text: string; border: string } {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    shipped: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    delivered: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
    completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    cancelled: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
    failed: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    ended: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
    upcoming: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  };
  
  return colors[status.toLowerCase()] || colors.pending;
}

/**
 * 获取状态标签
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: '待处理',
    active: '进行中',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已交付',
    completed: '已完成',
    cancelled: '已取消',
    failed: '失败',
    ended: '已结束',
    upcoming: '即将开始',
    approved: '已通过',
    rejected: '已拒绝',
    reviewing: '审核中',
  };
  
  return labels[status.toLowerCase()] || status;
}

/**
 * 本地存储操作
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return safeParseJSON<T>(item, fallback);
  },
  
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
  
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

/**
 * 会话存储操作
 */
export const sessionStorage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    const item = window.sessionStorage.getItem(key);
    if (!item) return fallback;
    return safeParseJSON<T>(item, fallback);
  },
  
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },
  
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(key);
  },
};

