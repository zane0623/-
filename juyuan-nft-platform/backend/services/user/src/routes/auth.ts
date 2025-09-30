import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * @route   POST /api/v1/auth/register
 * @desc    用户注册
 * @access  Public
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, username, walletAddress } = req.body;

      // 检查用户是否已存在
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'User already exists',
          message: 'Email or username is already registered',
        });
      }

      // 哈希密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 创建用户
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          walletAddress,
          role: 'USER',
          kycStatus: 'NOT_SUBMITTED',
        },
        select: {
          id: true,
          email: true,
          username: true,
          walletAddress: true,
          role: true,
          createdAt: true,
        },
      });

      // 生成JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // 查找用户
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid email or password',
        });
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid email or password',
        });
      }

      // 生成JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // 更新最后登录时间
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          role: user.role,
          kycStatus: user.kycStatus,
        },
        token,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/v1/auth/wallet-login
 * @desc    钱包登录
 * @access  Public
 */
router.post('/wallet-login', async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Wallet address, signature, and message are required',
      });
    }

    // TODO: 验证签名
    // const isValid = verifySignature(walletAddress, signature, message);
    // if (!isValid) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
          username: `user_${walletAddress.slice(0, 8)}`,
          email: `${walletAddress.toLowerCase()}@wallet.user`,
          password: '', // 钱包登录不需要密码
          role: 'USER',
          kycStatus: 'NOT_SUBMITTED',
        },
      });
    }

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id, walletAddress: user.walletAddress, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Wallet login successful',
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        role: user.role,
        kycStatus: user.kycStatus,
      },
      token,
    });
  } catch (error: any) {
    console.error('Wallet login error:', error);
    res.status(500).json({
      error: 'Wallet login failed',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    刷新token
 * @access  Private
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // 验证并解码token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // 生成新token
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Invalid token',
      message: error.message,
    });
  }
});

export default router; 