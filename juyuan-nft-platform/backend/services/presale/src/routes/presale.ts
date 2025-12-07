import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { PresaleService } from '../services/PresaleService';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const presaleService = new PresaleService();

/**
 * @route POST /api/v1/presale/create
 * @desc 创建预售活动
 */
router.post(
  '/create',
  authenticate,
  requireAdmin,
  [
    body('productType').notEmpty().withMessage('Product type is required'),
    body('maxSupply').isInt({ min: 1 }).withMessage('Max supply must be positive'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    body('currency').isIn(['ETH', 'USDT', 'USDC']).withMessage('Invalid currency'),
    body('startTime').isISO8601().withMessage('Invalid start time'),
    body('endTime').isISO8601().withMessage('Invalid end time'),
    body('minPurchase').optional().isInt({ min: 1 }),
    body('maxPurchase').optional().isInt({ min: 1 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const presale = await presaleService.createPresale(req.body);
      res.status(201).json({
        message: 'Presale created successfully',
        data: presale
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/presale/list
 * @desc 获取预售列表
 */
router.get(
  '/list',
  [
    query('status').optional().isIn(['UPCOMING', 'ACTIVE', 'ENDED', 'CANCELLED']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  async (req: Request, res: Response) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const result = await presaleService.getPresales(
        status as string,
        Number(page),
        Number(limit)
      );
      
      res.json({
        message: 'Presales retrieved successfully',
        data: result.presales,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total,
          totalPages: Math.ceil(result.total / Number(limit))
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/presale/:presaleId
 * @desc 获取预售详情
 */
router.get(
  '/:presaleId',
  [param('presaleId').isUUID()],
  async (req: Request, res: Response) => {
    try {
      const presale = await presaleService.getPresaleById(req.params.presaleId);
      if (!presale) {
        return res.status(404).json({ error: 'Presale not found' });
      }
      res.json({ data: presale });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route POST /api/v1/presale/:presaleId/purchase
 * @desc 参与预售购买
 */
router.post(
  '/:presaleId/purchase',
  authenticate,
  [
    param('presaleId').isUUID(),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be positive'),
    body('paymentMethod').isIn(['CRYPTO', 'STRIPE', 'WECHAT', 'ALIPAY'])
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { presaleId } = req.params;
      const { quantity, paymentMethod } = req.body;
      const userId = req.user?.id;
      const walletAddress = req.user?.walletAddress;

      const purchase = await presaleService.purchase({
        presaleId,
        userId: userId!,
        walletAddress,
        quantity,
        paymentMethod
      });

      res.status(201).json({
        message: 'Purchase successful',
        data: purchase
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/presale/:presaleId/purchases
 * @desc 获取预售的购买记录
 */
router.get(
  '/:presaleId/purchases',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { presaleId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await presaleService.getPresalePurchases(presaleId, page, limit);
      
      res.json({
        data: result.purchases,
        pagination: {
          page,
          limit,
          total: result.total
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route PUT /api/v1/presale/:presaleId/cancel
 * @desc 取消预售
 */
router.put(
  '/:presaleId/cancel',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const presale = await presaleService.cancelPresale(req.params.presaleId);
      res.json({
        message: 'Presale cancelled',
        data: presale
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/presale/user/purchases
 * @desc 获取用户的购买记录
 */
router.get(
  '/user/purchases',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await presaleService.getUserPurchases(userId!, page, limit);
      
      res.json({
        data: result.purchases,
        pagination: {
          page,
          limit,
          total: result.total
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/presale/stats/overview
 * @desc 获取预售统计
 */
router.get(
  '/stats/overview',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const stats = await presaleService.getPresaleStats();
      res.json({ data: stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

