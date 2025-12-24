// ========================================
// 钜园农业NFT平台 - 日志工具
// ========================================

import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

// 自定义日志格式
const customFormat = printf(({ level, message, timestamp, service, ...metadata }) => {
  let msg = `${timestamp} [${service || 'app'}] ${level}: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// 创建日志实例
export function createLogger(service: string) {
  const isProduction = process.env.NODE_ENV === 'production';

  return winston.createLogger({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    defaultMeta: { service },
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      isProduction ? json() : combine(colorize(), customFormat)
    ),
    transports: [
      new winston.transports.Console(),
      // 生产环境写入文件
      ...(isProduction
        ? [
            new winston.transports.File({
              filename: `logs/${service}-error.log`,
              level: 'error',
              maxsize: 10 * 1024 * 1024, // 10MB
              maxFiles: 5
            }),
            new winston.transports.File({
              filename: `logs/${service}-combined.log`,
              maxsize: 10 * 1024 * 1024,
              maxFiles: 5
            })
          ]
        : [])
    ]
  });
}

// 请求日志中间件
export function requestLogger(logger: winston.Logger) {
  return (req: any, res: any, next: any) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { method, originalUrl, ip } = req;
      const { statusCode } = res;

      const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

      logger.log(logLevel, `${method} ${originalUrl}`, {
        statusCode,
        duration: `${duration}ms`,
        ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.userId
      });
    });

    next();
  };
}

// 默认日志实例
export const logger = createLogger('app');



