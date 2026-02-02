"use strict";
// ========================================
// 钜园农业NFT平台 - 日志工具
// ========================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.createLogger = createLogger;
exports.requestLogger = requestLogger;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize, json } = winston_1.default.format;
// 自定义日志格式
const customFormat = printf(({ level, message, timestamp, service, ...metadata }) => {
    let msg = `${timestamp} [${service || 'app'}] ${level}: ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});
// 创建日志实例
function createLogger(service) {
    const isProduction = process.env.NODE_ENV === 'production';
    return winston_1.default.createLogger({
        level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
        defaultMeta: { service },
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), isProduction ? json() : combine(colorize(), customFormat)),
        transports: [
            new winston_1.default.transports.Console(),
            // 生产环境写入文件
            ...(isProduction
                ? [
                    new winston_1.default.transports.File({
                        filename: `logs/${service}-error.log`,
                        level: 'error',
                        maxsize: 10 * 1024 * 1024, // 10MB
                        maxFiles: 5
                    }),
                    new winston_1.default.transports.File({
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
function requestLogger(logger) {
    return (req, res, next) => {
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
exports.logger = createLogger('app');
//# sourceMappingURL=index.js.map