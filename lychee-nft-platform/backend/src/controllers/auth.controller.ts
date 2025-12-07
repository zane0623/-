/**
 * 认证控制器 - Authentication Controller
 */

import { Request, Response } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// JWT密钥（从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token有效期7天

/**
 * 生成JWT Token
 */
const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * 用户注册
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, phone } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码为必填项'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }

    // 验证密码强度（至少6位）
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码至少需要6位'
      });
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        username: username || email.split('@')[0], // 如果没提供用户名，使用邮箱前缀
        phone: phone || null,
        role: 'USER',
        status: 'ACTIVE',
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username || email.split('@')[0])}&background=10b981&color=fff`,
        bio: '这个人很懒，什么都没留下'
      }
    });

    // 生成Token
    const token = generateToken(user.id, user.email || '');

    logger.info(`New user registered: ${user.email}`);

    // 返回用户信息（不包含密码）
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar_url,
          role: user.role
        }
      }
    });
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试',
      error: error.message
    });
  }
};

/**
 * 用户登录
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码为必填项'
      });
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 检查是否设置了密码
    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        message: '该账号未设置密码，请使用其他登录方式'
      });
    }

    // 检查用户状态
    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: '账号已被暂停，请联系客服'
      });
    }

    if (user.status === 'DELETED') {
      return res.status(403).json({
        success: false,
        message: '账号已被删除'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() }
    });

    // 生成Token
    const token = generateToken(user.id, user.email || '');

    logger.info(`User logged in: ${user.email}`);

    // 返回用户信息和Token
    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar_url,
          role: user.role,
          wallet_address: user.wallet_address
        }
      }
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试',
      error: error.message
    });
  }
};

/**
 * 获取当前用户信息
 * GET /api/auth/me
 * 需要认证
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // 从请求中获取用户ID（由认证中间件设置）
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      });
    }

    // 查询用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        wallet_address: true,
        avatar_url: true,
        bio: true,
        role: true,
        status: true,
        kyc_status: true,
        created_at: true,
        last_login_at: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: {
        ...user,
        avatar: user.avatar_url
      }
    });
  } catch (error: any) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    });
  }
};

/**
 * 用户登出
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response) => {
  try {
    // 客户端应该删除Token
    // 这里可以记录登出日志
    const userId = (req as any).user?.userId;
    if (userId) {
      logger.info(`User logged out: ${userId}`);
    }

    res.json({
      success: true,
      message: '登出成功'
    });
  } catch (error: any) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: '登出失败',
      error: error.message
    });
  }
};

/**
 * 验证Token
 * POST /api/auth/verify
 */
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token为必填项'
      });
    }

    // 验证Token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // 查询用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        message: 'Token无效'
      });
    }

    res.json({
      success: true,
      message: 'Token有效',
      data: {
        userId: decoded.userId,
        email: decoded.email
      }
    });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token无效'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token已过期'
      });
    }

    logger.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Token验证失败',
      error: error.message
    });
  }
};

