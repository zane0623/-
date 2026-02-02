// ========================================
// 速率限制中间件
// ========================================

import { Request, Response, NextFunction } from 'express';
import { createClient } from 'ioredis';

// Redis 客户端（如果可用）
let redisClient: ReturnType<typeof createClient> | null = null;

try {
  if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
    redisClient = createClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
    });
  }
} catch (error) {
  console.warn('Redis not available, using in-memory rate limiting');
}

// 内存存储（备用方案）
const memoryStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number; // 时间窗口（毫秒）
  max: number; // 最大请求数
  message?: string; // 错误消息
  skipSuccessfulRequests?: boolean; // 是否跳过成功请求
  skipFailedRequests?: boolean; // 是否跳过失败请求
  keyGenerator?: (req: Request) => string; // 自定义键生成器
}

const defaultOptions: RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 100个请求
  message: 'Too many requests, please try again later.',
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

export function rateLimit(options: Partial<RateLimitOptions> = {}) {
  const opts = { ...defaultOptions, ...options };

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 生成唯一键
      const keyGenerator = opts.keyGenerator || ((req: Request) => {
        // 默认使用 IP 地址
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        return `rate_limit:${opts.windowMs}:${ip}`;
      });

      const key = keyGenerator(req);

      // 获取当前计数
      let count = 0;
      let resetTime = Date.now() + opts.windowMs;

      if (redisClient && redisClient.status === 'ready') {
        // 使用 Redis
        const current = await redisClient.get(key);
        if (current) {
          const data = JSON.parse(current);
          count = data.count;
          resetTime = data.resetTime;
        }

        // 增加计数
        count++;
        await redisClient.setex(
          key,
          Math.ceil(opts.windowMs / 1000),
          JSON.stringify({ count, resetTime })
        );
      } else {
        // 使用内存存储
        const current = memoryStore.get(key);
        if (current && current.resetTime > Date.now()) {
          count = current.count;
          resetTime = current.resetTime;
        } else {
          // 清理过期条目
          memoryStore.delete(key);
        }

        count++;
        memoryStore.set(key, { count, resetTime });

        // 清理过期条目（每5分钟）
        if (Math.random() < 0.01) {
          const now = Date.now();
          for (const [k, v] of memoryStore.entries()) {
            if (v.resetTime <= now) {
              memoryStore.delete(k);
            }
          }
        }
      }

      // 设置响应头
      const remaining = Math.max(0, opts.max - count);
      res.setHeader('X-RateLimit-Limit', opts.max.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', new Date(resetTime).toISOString());

      // 检查是否超过限制
      if (count > opts.max) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: opts.message,
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        });
      }

      // 记录响应状态（用于跳过成功/失败请求）
      const originalSend = res.send;
      res.send = function (body) {
        if (opts.skipSuccessfulRequests && res.statusCode < 400) {
          // 成功请求不计入限制
          if (redisClient && redisClient.status === 'ready') {
            redisClient.decr(key);
          } else {
            const current = memoryStore.get(key);
            if (current) {
              current.count = Math.max(0, current.count - 1);
            }
          }
        }
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      // 如果速率限制失败，允许请求继续（fail open）
      console.error('Rate limit error:', error);
      next();
    }
  };
}

// 预设的速率限制配置
export const rateLimiters = {
  // 严格限制（登录、注册等敏感操作）
  strict: rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 5, // 5次请求
    message: 'Too many attempts, please try again later.',
  }),

  // 标准限制（一般API）
  standard: rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 100次请求
  }),

  // 宽松限制（公开API）
  lenient: rateLimit({
    windowMs: 60 * 60 * 1000, // 1小时
    max: 1000, // 1000次请求
  }),

  // 文件上传限制
  upload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1小时
    max: 20, // 20次上传
    message: 'Too many uploads, please try again later.',
  }),
};
