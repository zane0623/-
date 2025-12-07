/**
 * JWT认证中间件
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * JWT认证中间件
 * 验证请求头中的Token
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取Token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证Token'
      });
    }

    // 验证Token
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token已过期，请重新登录'
          });
        }
        
        return res.status(403).json({
          success: false,
          message: 'Token无效'
        });
      }

      // 将用户信息附加到请求对象
      (req as any).user = decoded;
      next();
    });
  } catch (error: any) {
    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: '认证失败',
      error: error.message
    });
  }
};

/**
 * 可选认证中间件
 * Token有效则附加用户信息，无效也继续执行
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (!err && decoded) {
        (req as any).user = decoded;
      }
      next();
    });
  } catch (error) {
    // 忽略错误，继续执行
    next();
  }
};

/**
 * 角色验证中间件
 * 验证用户是否具有指定角色
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    next();
  };
};

