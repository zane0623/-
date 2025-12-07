import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { KYCService } from '../services/KYCService';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const kycService = new KYCService();

/**
 * @route POST /api/v1/kyc/submit
 * @desc 提交KYC申请
 */
router.post(
  '/submit',
  authenticate,
  [
    body('documentType').isIn(['PASSPORT', 'ID_CARD', 'DRIVER_LICENSE']),
    body('documentNumber').notEmpty(),
    body('fullName').notEmpty(),
    body('dateOfBirth').isISO8601(),
    body('nationality').notEmpty(),
    body('documentFrontUrl').isURL(),
    body('documentBackUrl').optional().isURL(),
    body('selfieUrl').isURL()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.user?.id;
      const kyc = await kycService.submit({ ...req.body, userId });
      res.status(201).json({
        message: 'KYC submitted successfully',
        data: kyc
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/kyc/status
 * @desc 获取用户KYC状态
 */
router.get(
  '/status',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const status = await kycService.getStatus(userId!);
      res.json({ data: status });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/kyc/list
 * @desc 获取KYC申请列表（管理员）
 */
router.get(
  '/list',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const result = await kycService.getList(
        status as string,
        Number(page),
        Number(limit)
      );
      res.json({
        data: result.applications,
        pagination: { page: Number(page), limit: Number(limit), total: result.total }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route PUT /api/v1/kyc/:kycId/approve
 * @desc 审批KYC申请（管理员）
 */
router.put(
  '/:kycId/approve',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { kycId } = req.params;
      const kyc = await kycService.approve(kycId, req.user?.id!);
      res.json({ message: 'KYC approved', data: kyc });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route PUT /api/v1/kyc/:kycId/reject
 * @desc 拒绝KYC申请（管理员）
 */
router.put(
  '/:kycId/reject',
  authenticate,
  requireAdmin,
  [body('reason').notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { kycId } = req.params;
      const { reason } = req.body;
      const kyc = await kycService.reject(kycId, reason, req.user?.id!);
      res.json({ message: 'KYC rejected', data: kyc });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

