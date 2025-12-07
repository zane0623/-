// ========================================
// 钜园农业NFT平台 - Redis工具
// ========================================

import Redis, { RedisOptions } from 'ioredis';
import { createLogger } from '../logger';

const logger = createLogger('redis');

let redisClient: Redis | null = null;

// Redis配置
const defaultConfig: RedisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

// 获取Redis客户端
export function getRedisClient(config?: RedisOptions): Redis {
  if (!redisClient) {
    redisClient = new Redis({ ...defaultConfig, ...config });

    redisClient.on('connect', () => {
      logger.info('Redis connected');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis error', { error: err.message });
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });
  }
  return redisClient;
}

// 关闭Redis连接
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis disconnected');
  }
}

// 缓存工具类
export class CacheService {
  private redis: Redis;
  private prefix: string;

  constructor(prefix: string = 'cache:') {
    this.redis = getRedisClient();
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  // 获取缓存
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(this.getKey(key));
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  // 设置缓存
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.setex(this.getKey(key), ttlSeconds, serialized);
    } else {
      await this.redis.set(this.getKey(key), serialized);
    }
  }

  // 删除缓存
  async del(key: string): Promise<void> {
    await this.redis.del(this.getKey(key));
  }

  // 批量删除
  async delPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(this.getKey(pattern));
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // 检查是否存在
  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(this.getKey(key))) === 1;
  }

  // 获取或设置（缓存穿透保护）
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  // 增加计数
  async incr(key: string, ttlSeconds?: number): Promise<number> {
    const fullKey = this.getKey(key);
    const value = await this.redis.incr(fullKey);
    if (ttlSeconds && value === 1) {
      await this.redis.expire(fullKey, ttlSeconds);
    }
    return value;
  }

  // 哈希操作
  async hget<T>(key: string, field: string): Promise<T | null> {
    const data = await this.redis.hget(this.getKey(key), field);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async hset(key: string, field: string, value: any): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.redis.hset(this.getKey(key), field, serialized);
  }

  async hgetall<T>(key: string): Promise<Record<string, T>> {
    const data = await this.redis.hgetall(this.getKey(key));
    const result: Record<string, T> = {};
    for (const [field, value] of Object.entries(data)) {
      try {
        result[field] = JSON.parse(value) as T;
      } catch {
        result[field] = value as unknown as T;
      }
    }
    return result;
  }
}

// 分布式锁
export class DistributedLock {
  private redis: Redis;
  private lockKey: string;
  private lockValue: string;
  private ttlMs: number;

  constructor(key: string, ttlMs: number = 10000) {
    this.redis = getRedisClient();
    this.lockKey = `lock:${key}`;
    this.lockValue = `${Date.now()}-${Math.random()}`;
    this.ttlMs = ttlMs;
  }

  async acquire(): Promise<boolean> {
    const result = await this.redis.set(
      this.lockKey,
      this.lockValue,
      'PX',
      this.ttlMs,
      'NX'
    );
    return result === 'OK';
  }

  async release(): Promise<void> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await this.redis.eval(script, 1, this.lockKey, this.lockValue);
  }

  async withLock<T>(fn: () => Promise<T>): Promise<T | null> {
    const acquired = await this.acquire();
    if (!acquired) {
      return null;
    }
    try {
      return await fn();
    } finally {
      await this.release();
    }
  }
}

// 限流器
export class RateLimiter {
  private redis: Redis;
  private prefix: string;

  constructor(prefix: string = 'ratelimit:') {
    this.redis = getRedisClient();
    this.prefix = prefix;
  }

  // 滑动窗口限流
  async isAllowed(
    key: string,
    maxRequests: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;
    const fullKey = `${this.prefix}${key}`;

    // 使用有序集合实现滑动窗口
    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(fullKey, 0, windowStart);
    pipeline.zadd(fullKey, now.toString(), `${now}-${Math.random()}`);
    pipeline.zcard(fullKey);
    pipeline.expire(fullKey, windowSeconds);

    const results = await pipeline.exec();
    const count = results?.[2]?.[1] as number || 0;

    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetAt: now + windowSeconds * 1000
    };
  }
}

