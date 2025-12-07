import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AMLService } from '../services/AMLService';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const amlService = new AMLService();

/**
 * @route POST /api/v1/aml/check
 * @desc 执行AML检查
 */
router.post(
  '/check',
  authenticate,
  requireAdmin,
  [
    body('userId').notEmpty(),
    body('transactionType').isIn(['PURCHASE', 'TRANSFER', 'WITHDRAWAL']),
    body('amount').isFloat({ min: 0 }),
    body('currency').notEmpty()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await amlService.check(req.body);
      res.json({ data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route POST /api/v1/aml/wallet/check
 * @desc 检查钱包地址
 */
router.post(
  '/wallet/check',
  authenticate,
  [body('walletAddress').isEthereumAddress()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { walletAddress } = req.body;
      const result = await amlService.checkWallet(walletAddress);
      res.json({ data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/aml/reports
 * @desc 获取AML报告（管理员）
 */
router.get(
  '/reports',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { startDate, endDate, riskLevel } = req.query;
      const reports = await amlService.getReports({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        riskLevel: riskLevel as string
      });
      res.json({ data: reports });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/aml/user/:userId/risk
 * @desc 获取用户风险评估
 */
router.get(
  '/user/:userId/risk',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const risk = await amlService.getUserRisk(userId);
      res.json({ data: risk });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

