// ========================================
// 钜园农业NFT平台 - JWT工具
// ========================================

import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { JWTPayload, UserRole } from '../types';
import { CONFIG } from '../constants';
import { UnauthorizedError } from '../errors';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

// 生成访问令牌
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: CONFIG.JWT.ACCESS_TOKEN_EXPIRES,
    issuer: CONFIG.JWT.ISSUER
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

// 生成刷新令牌
export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: CONFIG.JWT.REFRESH_TOKEN_EXPIRES,
    issuer: CONFIG.JWT.ISSUER
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
}

// 生成令牌对
export function generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
} {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: 900 // 15分钟
  };
}

// 验证访问令牌
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const options: VerifyOptions = {
      issuer: CONFIG.JWT.ISSUER
    };
    return jwt.verify(token, JWT_SECRET, options) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('令牌已过期');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('无效的令牌');
    }
    throw new UnauthorizedError('令牌验证失败');
  }
}

// 验证刷新令牌
export function verifyRefreshToken(token: string): JWTPayload {
  try {
    const options: VerifyOptions = {
      issuer: CONFIG.JWT.ISSUER
    };
    return jwt.verify(token, JWT_REFRESH_SECRET, options) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('刷新令牌已过期，请重新登录');
    }
    throw new UnauthorizedError('无效的刷新令牌');
  }
}

// 刷新令牌
export function refreshTokens(refreshToken: string): {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
} {
  const payload = verifyRefreshToken(refreshToken);
  return generateTokenPair({
    userId: payload.userId,
    walletAddress: payload.walletAddress,
    role: payload.role
  });
}

// 从请求头提取令牌
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

// Express中间件 - 验证JWT
export function authMiddleware(options?: { roles?: UserRole[] }) {
  return (req: any, res: any, next: any) => {
    try {
      const token = extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        throw new UnauthorizedError('未提供访问令牌');
      }

      const payload = verifyAccessToken(token);
      
      // 角色检查
      if (options?.roles && options.roles.length > 0) {
        if (!options.roles.includes(payload.role)) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: '权限不足'
            }
          });
        }
      }

      // 将用户信息附加到请求对象
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        });
      }
      next(error);
    }
  };
}

// 可选认证中间件（不强制要求登录）
export function optionalAuthMiddleware() {
  return (req: any, res: any, next: any) => {
    try {
      const token = extractTokenFromHeader(req.headers.authorization);
      
      if (token) {
        const payload = verifyAccessToken(token);
        req.user = payload;
      }
      
      next();
    } catch {
      // 忽略错误，继续执行
      next();
    }
  };
}



