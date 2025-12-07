import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

interface UserPayload {
  id: string;
  email?: string;
  walletAddress?: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided'
      });
    }

    // 验证token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as UserPayload;

    // 可选：从用户服务验证用户
    if (process.env.USER_SERVICE_URL) {
      try {
        const response = await axios.get(
          `${process.env.USER_SERVICE_URL}/api/v1/users/verify`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        req.user = response.data.user;
      } catch (error) {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Token verification failed'
        });
      }
    } else {
      req.user = decoded;
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid token',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Authentication error',
      message: 'Failed to authenticate'
    });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }

  next();
};


