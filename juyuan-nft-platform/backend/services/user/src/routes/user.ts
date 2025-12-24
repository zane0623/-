import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 认证中间件
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * @route   GET /api/v1/users/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        email: true,
        username: true,
        walletAddress: true,
        role: true,
        kycStatus: true,
        avatar: true,
        phone: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user', message: error.message });
  }
});

/**
 * @route   PUT /api/v1/users/me
 * @desc    更新用户信息
 * @access  Private
 */
router.put('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { username, phone, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user?.userId },
      data: {
        ...(username && { username }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        walletAddress: true,
        role: true,
        kycStatus: true,
        avatar: true,
        phone: true,
      },
    });

    res.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user', message: error.message });
  }
});

/**
 * @route   GET /api/v1/users/:id
 * @desc    获取指定用户信息（管理员）
 * @access  Admin
 */
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        username: true,
        walletAddress: true,
        role: true,
        kycStatus: true,
        avatar: true,
        phone: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Get user by id error:', error);
    res.status(500).json({ error: 'Failed to get user', message: error.message });
  }
});

/**
 * @route   GET /api/v1/users
 * @desc    获取用户列表（管理员）
 * @access  Admin
 */
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          walletAddress: true,
          role: true,
          kycStatus: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to list users', message: error.message });
  }
});

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    删除用户（管理员）
 * @access  Admin
 */
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user', message: error.message });
  }
});

export default router;

