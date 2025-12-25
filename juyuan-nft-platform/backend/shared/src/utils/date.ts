/**
 * 日期工具函数集合
 */

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const milliseconds = String(d.getMilliseconds()).padStart(3, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', milliseconds);
}

/**
 * 解析日期字符串
 */
export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date;
}

/**
 * 获取今天的开始时间
 */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 获取今天的结束时间
 */
export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 获取本周的开始时间（周一）
 */
export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 获取本周的结束时间（周日）
 */
export function endOfWeek(date: Date = new Date()): Date {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 获取本月的开始时间
 */
export function startOfMonth(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 获取本月的结束时间
 */
export function endOfMonth(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 获取本年的开始时间
 */
export function startOfYear(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 获取本年的结束时间
 */
export function endOfYear(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setMonth(11, 31);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 添加天数
 */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * 添加小时
 */
export function addHours(date: Date, hours: number): Date {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

/**
 * 添加分钟
 */
export function addMinutes(date: Date, minutes: number): Date {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

/**
 * 添加月份
 */
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * 添加年份
 */
export function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

/**
 * 计算两个日期之间的天数差
 */
export function diffDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 计算两个日期之间的小时差
 */
export function diffHours(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60));
}

/**
 * 计算两个日期之间的分钟差
 */
export function diffMinutes(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60));
}

/**
 * 判断是否是同一天
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 判断是否是今天
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * 判断是否是昨天
 */
export function isYesterday(date: Date): boolean {
  const yesterday = addDays(new Date(), -1);
  return isSameDay(date, yesterday);
}

/**
 * 判断日期是否在范围内
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/**
 * 判断是否过期
 */
export function isExpired(date: Date): boolean {
  return date < new Date();
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years}年前`;
  if (months > 0) return `${months}个月前`;
  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  if (seconds > 10) return `${seconds}秒前`;
  return '刚刚';
}

/**
 * 获取农历信息（简化版，仅用于展示）
 */
export function getLunarDateInfo(date: Date = new Date()): { month: string; day: string } {
  const months = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  const days = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
  
  // 这里返回简化的模拟数据，实际项目中应使用农历算法库
  const dayOfMonth = date.getDate();
  const monthIndex = date.getMonth();
  
  return {
    month: months[monthIndex] + '月',
    day: days[Math.min(dayOfMonth - 1, days.length - 1)],
  };
}

/**
 * 获取时间戳（秒）
 */
export function getUnixTimestamp(date: Date = new Date()): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * 从Unix时间戳创建日期
 */
export function fromUnixTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * 获取季度
 */
export function getQuarter(date: Date = new Date()): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

/**
 * 获取本季度开始时间
 */
export function startOfQuarter(date: Date = new Date()): Date {
  const quarter = getQuarter(date);
  const d = new Date(date);
  d.setMonth((quarter - 1) * 3, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 获取本季度结束时间
 */
export function endOfQuarter(date: Date = new Date()): Date {
  const quarter = getQuarter(date);
  const d = new Date(date);
  d.setMonth(quarter * 3, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 格式化持续时间（毫秒转可读格式）
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}天${hours % 24}小时`;
  }
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`;
  }
  if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`;
  }
  return `${seconds}秒`;
}

