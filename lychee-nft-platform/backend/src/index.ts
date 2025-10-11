/**
 * 钜园农业NFT预售平台 - 后端服务入口
 * Juyuan Agriculture NFT Presale Platform - Backend Entry Point
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

// 导入路由
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import presaleRoutes from './routes/presale.routes';
import orderRoutes from './routes/order.routes';
import nftRoutes from './routes/nft.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';

// 导入中间件
import { errorHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';
import { requestLogger } from './middlewares/logger.middleware';

// 加载环境变量
dotenv.config();

// 初始化Express应用
const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// 初始化Prisma客户端
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// 基础中间件
app.use(helmet()); // 安全头
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志
app.use(requestLogger);

// 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制100个请求
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 健康检查
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/presales', presaleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// 错误处理中间件
app.use(errorHandler);

// WebSocket 连接处理
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
  
  // 订阅订单更新
  socket.on('subscribe:order', (orderId: string) => {
    socket.join(`order:${orderId}`);
    logger.info(`Socket ${socket.id} subscribed to order:${orderId}`);
  });
  
  // 订阅预售更新
  socket.on('subscribe:presale', (presaleId: string) => {
    socket.join(`presale:${presaleId}`);
    logger.info(`Socket ${socket.id} subscribed to presale:${presaleId}`);
  });
});

// 导出io实例供其他模块使用
export { io };

// 启动服务器
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 连接数据库
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    // 启动HTTP服务器
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🌐 API: http://localhost:${PORT}/api`);
      logger.info(`💚 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// 未捕获的异常处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

