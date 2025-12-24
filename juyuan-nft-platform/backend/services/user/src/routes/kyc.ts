import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

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
 * @route   POST /api/v1/kyc/submit
 * @desc    提交KYC申请
 * @access  Private
 */
router.post(
  '/submit',
  authMiddleware,
  [
    body('idType').notEmpty().withMessage('ID type is required'),
    body('idNumber').notEmpty().withMessage('ID number is required'),
    body('fullName').notEmpty().withMessage('Full name is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { idType, idNumber, fullName, idFrontImage, idBackImage, selfieImage } = req.body;

      // 检查是否已有待审核的申请
      const existingKyc = await prisma.kYCApplication.findFirst({
        where: {
          userId: req.user?.userId,
          status: 'PENDING',
        },
      });

      if (existingKyc) {
        return res.status(400).json({
          error: 'KYC application already pending',
          message: 'You have a pending KYC application',
        });
      }

      // 创建KYC申请
      const kyc = await prisma.kYCApplication.create({
        data: {
          userId: req.user?.userId as string,
          idType,
          idNumber,
          fullName,
          idFrontImage,
          idBackImage,
          selfieImage,
          status: 'PENDING',
          riskLevel: 'LOW',
        },
      });

      // 更新用户KYC状态
      await prisma.user.update({
        where: { id: req.user?.userId },
        data: { kycStatus: 'PENDING' },
      });

      res.status(201).json({
        message: 'KYC application submitted successfully',
        kyc: {
          id: kyc.id,
          status: kyc.status,
          submittedAt: kyc.createdAt,
        },
      });
    } catch (error: any) {
      console.error('KYC submit error:', error);
      res.status(500).json({ error: 'Failed to submit KYC', message: error.message });
    }
  }
);

/**
 * @route   GET /api/v1/kyc/status
 * @desc    获取当前用户KYC状态
 * @access  Private
 */
router.get('/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: { kycStatus: true },
    });

    const kyc = await prisma.kYCApplication.findFirst({
      where: { userId: req.user?.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        riskLevel: true,
        reviewedAt: true,
        rejectReason: true,
        createdAt: true,
      },
    });

    res.json({
      kycStatus: user?.kycStatus || 'NOT_SUBMITTED',
      application: kyc,
    });
  } catch (error: any) {
    console.error('Get KYC status error:', error);
    res.status(500).json({ error: 'Failed to get KYC status', message: error.message });
  }
});

/**
 * @route   GET /api/v1/kyc/applications
 * @desc    获取KYC申请列表（管理员）
 * @access  Admin
 */
router.get('/applications', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const status = req.query.status as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [applications, total] = await Promise.all([
      prisma.kYCApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              walletAddress: true,
            },
          },
        },
      }),
      prisma.kYCApplication.count({ where }),
    ]);

    res.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('List KYC applications error:', error);
    res.status(500).json({ error: 'Failed to list applications', message: error.message });
  }
});

/**
 * @route   PUT /api/v1/kyc/:id/approve
 * @desc    通过KYC申请（管理员）
 * @access  Admin
 */
router.put('/:id/approve', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const kyc = await prisma.kYCApplication.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        reviewedBy: req.user?.userId,
        reviewedAt: new Date(),
      },
    });

    // 更新用户KYC状态
    await prisma.user.update({
      where: { id: kyc.userId },
      data: { kycStatus: 'APPROVED' },
    });

    res.json({ message: 'KYC application approved', kyc });
  } catch (error: any) {
    console.error('Approve KYC error:', error);
    res.status(500).json({ error: 'Failed to approve KYC', message: error.message });
  }
});

/**
 * @route   PUT /api/v1/kyc/:id/reject
 * @desc    拒绝KYC申请（管理员）
 * @access  Admin
 */
router.put('/:id/reject', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { reason } = req.body;

    const kyc = await prisma.kYCApplication.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        rejectReason: reason || 'Application rejected',
        reviewedBy: req.user?.userId,
        reviewedAt: new Date(),
      },
    });

    // 更新用户KYC状态
    await prisma.user.update({
      where: { id: kyc.userId },
      data: { kycStatus: 'REJECTED' },
    });

    res.json({ message: 'KYC application rejected', kyc });
  } catch (error: any) {
    console.error('Reject KYC error:', error);
    res.status(500).json({ error: 'Failed to reject KYC', message: error.message });
  }
});

export default router;

