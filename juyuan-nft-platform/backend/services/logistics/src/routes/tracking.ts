import express, { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { TrackingService } from '../services/TrackingService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const trackingService = new TrackingService();

/**
 * @route GET /api/v1/tracking/:trackingNumber
 * @desc 追踪物流信息
 * @access Public
 */
router.get(
  '/:trackingNumber',
  [
    param('trackingNumber').notEmpty().withMessage('Tracking number is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { trackingNumber } = req.params;
      const courier = req.query.courier as string;

      const trackingInfo = await trackingService.getTrackingInfo(
        trackingNumber,
        courier
      );

      res.json({
        message: 'Tracking info retrieved successfully',
        data: trackingInfo
      });
    } catch (error: any) {
      console.error('Get tracking info error:', error);
      res.status(500).json({
        error: 'Failed to get tracking info',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/tracking/delivery/:deliveryId
 * @desc 获取配送的追踪信息
 * @access Private
 */
router.get(
  '/delivery/:deliveryId',
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
      const trackingInfo = await trackingService.getTrackingByDeliveryId(deliveryId);

      res.json({
        message: 'Tracking info retrieved successfully',
        data: trackingInfo
      });
    } catch (error: any) {
      console.error('Get tracking by delivery error:', error);
      res.status(500).json({
        error: 'Failed to get tracking info',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/v1/tracking/:deliveryId/event
 * @desc 添加追踪事件
 * @access Private (System only)
 */
router.post(
  '/:deliveryId/event',
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
      const { status, location, description, timestamp } = req.body;

      const event = await trackingService.addTrackingEvent({
        deliveryId,
        status,
        location,
        description,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      });

      res.status(201).json({
        message: 'Tracking event added',
        data: event
      });
    } catch (error: any) {
      console.error('Add tracking event error:', error);
      res.status(500).json({
        error: 'Failed to add tracking event',
        message: error.message
      });
    }
  }
);

export default router;


