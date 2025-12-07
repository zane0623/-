import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { WhitelistService } from '../services/WhitelistService';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const whitelistService = new WhitelistService();

/**
 * @route POST /api/v1/whitelist/:presaleId/add
 * @desc 添加白名单地址
 */
router.post(
  '/:presaleId/add',
  authenticate,
  requireAdmin,
  [
    param('presaleId').isUUID(),
    body('addresses').isArray({ min: 1 }).withMessage('Addresses array required'),
    body('addresses.*').isEthereumAddress().withMessage('Invalid Ethereum address')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { presaleId } = req.params;
      const { addresses } = req.body;

      const result = await whitelistService.addToWhitelist(presaleId, addresses);
      
      res.json({
        message: `${result.added} addresses added to whitelist`,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route DELETE /api/v1/whitelist/:presaleId/remove
 * @desc 移除白名单地址
 */
router.delete(
  '/:presaleId/remove',
  authenticate,
  requireAdmin,
  [
    param('presaleId').isUUID(),
    body('addresses').isArray({ min: 1 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { presaleId } = req.params;
      const { addresses } = req.body;

      const result = await whitelistService.removeFromWhitelist(presaleId, addresses);
      
      res.json({
        message: `${result.removed} addresses removed from whitelist`,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/whitelist/:presaleId
 * @desc 获取白名单列表
 */
router.get(
  '/:presaleId',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { presaleId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;

      const result = await whitelistService.getWhitelist(presaleId, page, limit);
      
      res.json({
        data: result.addresses,
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
 * @route GET /api/v1/whitelist/:presaleId/check/:address
 * @desc 检查地址是否在白名单中
 */
router.get(
  '/:presaleId/check/:address',
  async (req: Request, res: Response) => {
    try {
      const { presaleId, address } = req.params;
      const isWhitelisted = await whitelistService.isWhitelisted(presaleId, address);
      
      res.json({
        address,
        isWhitelisted
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route POST /api/v1/whitelist/:presaleId/import
 * @desc 批量导入白名单（从CSV）
 */
router.post(
  '/:presaleId/import',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { presaleId } = req.params;
      const { csvData } = req.body;

      const result = await whitelistService.importFromCSV(presaleId, csvData);
      
      res.json({
        message: 'Whitelist imported',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

