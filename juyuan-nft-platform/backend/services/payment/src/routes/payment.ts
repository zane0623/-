import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { PaymentService } from '../services/PaymentService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const paymentService = new PaymentService();

/**
 * @route POST /api/v1/payment/create-intent
 * @desc 创建支付意图（Stripe）
 * @access Private
 */
router.post(
  '/create-intent',
  authenticate,
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('currency').isIn(['USD', 'SGD', 'CNY', 'HKD', 'EUR']).withMessage('Invalid currency'),
    body('presaleId').optional().isInt().withMessage('Invalid presale ID')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { amount, currency, presaleId, metadata } = req.body;
      const userId = req.user?.id;

      const paymentIntent = await paymentService.createStripePaymentIntent({
        amount,
        currency,
        userId,
        presaleId,
        metadata
      });

      res.json({
        message: 'Payment intent created',
        data: paymentIntent
      });
    } catch (error: any) {
      console.error('Create payment intent error:', error);
      res.status(500).json({
        error: 'Failed to create payment intent',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/v1/payment/wechat/create
 * @desc 创建微信支付订单
 * @access Private
 */
router.post(
  '/wechat/create',
  authenticate,
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('description').notEmpty().withMessage('Description is required'),
    body('presaleId').optional().isInt()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { amount, description, presaleId } = req.body;
      const userId = req.user?.id;

      const order = await paymentService.createWeChatPayment({
        amount,
        description,
        userId,
        presaleId
      });

      res.json({
        message: 'WeChat payment order created',
        data: order
      });
    } catch (error: any) {
      console.error('Create WeChat payment error:', error);
      res.status(500).json({
        error: 'Failed to create WeChat payment',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/v1/payment/alipay/create
 * @desc 创建支付宝订单
 * @access Private
 */
router.post(
  '/alipay/create',
  authenticate,
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('presaleId').optional().isInt()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { amount, subject, presaleId } = req.body;
      const userId = req.user?.id;

      const order = await paymentService.createAlipayPayment({
        amount,
        subject,
        userId,
        presaleId
      });

      res.json({
        message: 'Alipay order created',
        data: order
      });
    } catch (error: any) {
      console.error('Create Alipay payment error:', error);
      res.status(500).json({
        error: 'Failed to create Alipay payment',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/v1/payment/crypto
 * @desc 创建加密货币支付
 * @access Private
 */
router.post(
  '/crypto',
  authenticate,
  [
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be non-negative'),
    body('currency').isIn(['ETH', 'USDT', 'USDC', 'BTC']).withMessage('Invalid crypto currency'),
    body('presaleId').isInt().withMessage('Presale ID is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { amount, currency, presaleId } = req.body;
      const userId = req.user?.id;
      const walletAddress = req.user?.walletAddress;

      const payment = await paymentService.createCryptoPayment({
        amount,
        currency,
        userId,
        walletAddress,
        presaleId
      });

      res.json({
        message: 'Crypto payment created',
        data: payment
      });
    } catch (error: any) {
      console.error('Create crypto payment error:', error);
      res.status(500).json({
        error: 'Failed to create crypto payment',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/payment/:paymentId
 * @desc 获取支付详情
 * @access Private
 */
router.get(
  '/:paymentId',
  authenticate,
  [
    param('paymentId').isUUID().withMessage('Invalid payment ID')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { paymentId } = req.params;
      const payment = await paymentService.getPayment(paymentId);

      if (!payment) {
        return res.status(404).json({
          error: 'Payment not found'
        });
      }

      res.json({
        message: 'Payment retrieved successfully',
        data: payment
      });
    } catch (error: any) {
      console.error('Get payment error:', error);
      res.status(500).json({
        error: 'Failed to get payment',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/payment/user/:userId
 * @desc 获取用户的支付历史
 * @access Private
 */
router.get(
  '/user/:userId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      // 确保用户只能查看自己的支付
      if (req.user?.id !== userId && req.user?.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Cannot access other user\'s payments'
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await paymentService.getUserPayments(userId, page, limit);

      res.json({
        message: 'User payments retrieved successfully',
        data: result.payments,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error: any) {
      console.error('Get user payments error:', error);
      res.status(500).json({
        error: 'Failed to get user payments',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/v1/payment/:paymentId/confirm
 * @desc 确认支付
 * @access Private
 */
router.post(
  '/:paymentId/confirm',
  authenticate,
  [
    param('paymentId').isUUID().withMessage('Invalid payment ID')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { paymentId } = req.params;
      const result = await paymentService.confirmPayment(paymentId);

      res.json({
        message: 'Payment confirmed',
        data: result
      });
    } catch (error: any) {
      console.error('Confirm payment error:', error);
      res.status(500).json({
        error: 'Failed to confirm payment',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/v1/payment/:paymentId/refund
 * @desc 退款
 * @access Private (Admin only)
 */
router.post(
  '/:paymentId/refund',
  authenticate,
  [
    param('paymentId').isUUID().withMessage('Invalid payment ID'),
    body('reason').optional().isString()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { paymentId } = req.params;
      const { reason } = req.body;

      const result = await paymentService.refundPayment(paymentId, reason);

      res.json({
        message: 'Payment refunded successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Refund payment error:', error);
      res.status(500).json({
        error: 'Failed to refund payment',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/payment/stats/overview
 * @desc 获取支付统计
 * @access Private (Admin only)
 */
router.get(
  '/stats/overview',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const stats = await paymentService.getPaymentStats();

      res.json({
        message: 'Payment stats retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Get payment stats error:', error);
      res.status(500).json({
        error: 'Failed to get payment stats',
        message: error.message
      });
    }
  }
);

export default router;


