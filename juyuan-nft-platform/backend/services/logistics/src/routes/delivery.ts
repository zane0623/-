import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { DeliveryService } from '../services/DeliveryService';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const deliveryService = new DeliveryService();

/**
 * @route POST /api/v1/delivery/create
 * @desc 创建配送订单
 * @access Private (Admin only)
 */
router.post(
  '/create',
  authenticate,
  requireAdmin,
  [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('recipientName').notEmpty().withMessage('Recipient name is required'),
    body('recipientPhone').notEmpty().withMessage('Recipient phone is required'),
    body('address').isObject().withMessage('Address must be an object'),
    body('address.province').notEmpty(),
    body('address.city').notEmpty(),
    body('address.district').notEmpty(),
    body('address.detail').notEmpty(),
    body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        orderId,
        recipientName,
        recipientPhone,
        address,
        items,
        notes
      } = req.body;

      const delivery = await deliveryService.createDelivery({
        orderId,
        recipientName,
        recipientPhone,
        address,
        items,
        notes
      });

      res.status(201).json({
        message: 'Delivery created successfully',
        data: delivery
      });
    } catch (error: any) {
      console.error('Create delivery error:', error);
      res.status(500).json({
        error: 'Failed to create delivery',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/delivery/:deliveryId
 * @desc 获取配送详情
 * @access Private
 */
router.get(
  '/:deliveryId',
  authenticate,
  [
    param('deliveryId').isUUID().withMessage('Invalid delivery ID')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { deliveryId } = req.params;
      const delivery = await deliveryService.getDelivery(deliveryId);

      if (!delivery) {
        return res.status(404).json({
          error: 'Delivery not found'
        });
      }

      res.json({
        message: 'Delivery retrieved successfully',
        data: delivery
      });
    } catch (error: any) {
      console.error('Get delivery error:', error);
      res.status(500).json({
        error: 'Failed to get delivery',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/delivery/order/:orderId
 * @desc 根据订单ID获取配送信息
 * @access Private
 */
router.get(
  '/order/:orderId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const deliveries = await deliveryService.getDeliveriesByOrderId(orderId);

      res.json({
        message: 'Deliveries retrieved successfully',
        data: deliveries
      });
    } catch (error: any) {
      console.error('Get deliveries by order error:', error);
      res.status(500).json({
        error: 'Failed to get deliveries',
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/v1/delivery/:deliveryId/ship
 * @desc 发货
 * @access Private (Admin only)
 */
router.put(
  '/:deliveryId/ship',
  authenticate,
  requireAdmin,
  [
    param('deliveryId').isUUID().withMessage('Invalid delivery ID'),
    body('courier').notEmpty().withMessage('Courier is required'),
    body('trackingNumber').notEmpty().withMessage('Tracking number is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { deliveryId } = req.params;
      const { courier, trackingNumber, estimatedDelivery } = req.body;

      const delivery = await deliveryService.shipDelivery({
        deliveryId,
        courier,
        trackingNumber,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined
      });

      res.json({
        message: 'Delivery shipped successfully',
        data: delivery
      });
    } catch (error: any) {
      console.error('Ship delivery error:', error);
      res.status(500).json({
        error: 'Failed to ship delivery',
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/v1/delivery/:deliveryId/update-status
 * @desc 更新配送状态
 * @access Private (Admin only)
 */
router.put(
  '/:deliveryId/update-status',
  authenticate,
  requireAdmin,
  [
    param('deliveryId').isUUID().withMessage('Invalid delivery ID'),
    body('status').isIn(['PENDING', 'PREPARING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])
      .withMessage('Invalid status')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { deliveryId } = req.params;
      const { status, notes } = req.body;

      const delivery = await deliveryService.updateDeliveryStatus(
        deliveryId,
        status,
        notes
      );

      res.json({
        message: 'Delivery status updated',
        data: delivery
      });
    } catch (error: any) {
      console.error('Update delivery status error:', error);
      res.status(500).json({
        error: 'Failed to update delivery status',
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/v1/delivery/:deliveryId/confirm
 * @desc 确认收货
 * @access Private
 */
router.put(
  '/:deliveryId/confirm',
  authenticate,
  [
    param('deliveryId').isUUID().withMessage('Invalid delivery ID')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { deliveryId } = req.params;
      const { rating, feedback } = req.body;

      const delivery = await deliveryService.confirmDelivery(
        deliveryId,
        rating,
        feedback
      );

      res.json({
        message: 'Delivery confirmed successfully',
        data: delivery
      });
    } catch (error: any) {
      console.error('Confirm delivery error:', error);
      res.status(500).json({
        error: 'Failed to confirm delivery',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/delivery/stats/overview
 * @desc 获取配送统计
 * @access Private (Admin only)
 */
router.get(
  '/stats/overview',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const stats = await deliveryService.getDeliveryStats();

      res.json({
        message: 'Delivery stats retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Get delivery stats error:', error);
      res.status(500).json({
        error: 'Failed to get delivery stats',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/delivery/search
 * @desc 搜索配送订单
 * @access Private (Admin only)
 */
router.get(
  '/search',
  authenticate,
  requireAdmin,
  [
    query('status').optional().isIn(['PENDING', 'PREPARING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']),
    query('courier').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601()
  ],
  async (req: Request, res: Response) => {
    try {
      const filters = {
        status: req.query.status as string,
        courier: req.query.courier as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
      };

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await deliveryService.searchDeliveries(filters, page, limit);

      res.json({
        message: 'Deliveries searched successfully',
        data: result.deliveries,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error: any) {
      console.error('Search deliveries error:', error);
      res.status(500).json({
        error: 'Failed to search deliveries',
        message: error.message
      });
    }
  }
);

export default router;


