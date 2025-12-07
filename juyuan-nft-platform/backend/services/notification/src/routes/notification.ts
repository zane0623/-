import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { NotificationService } from '../services/NotificationService';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const notificationService = new NotificationService();

/**
 * @route POST /api/v1/notifications/send
 * @desc 发送通知
 */
router.post(
  '/send',
  [
    body('userId').notEmpty(),
    body('type').isIn(['EMAIL', 'SMS', 'PUSH', 'IN_APP']),
    body('title').notEmpty(),
    body('content').notEmpty()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const notification = await notificationService.send(req.body);
      res.status(201).json({
        message: 'Notification sent',
        data: notification
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route POST /api/v1/notifications/send-batch
 * @desc 批量发送通知
 */
router.post(
  '/send-batch',
  authenticate,
  requireAdmin,
  [
    body('userIds').isArray({ min: 1 }),
    body('type').isIn(['EMAIL', 'SMS', 'PUSH', 'IN_APP']),
    body('title').notEmpty(),
    body('content').notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      const { userIds, type, title, content, data } = req.body;
      const result = await notificationService.sendBatch(userIds, { type, title, content, data });
      res.json({
        message: `${result.sent} notifications sent`,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/notifications/user/:userId
 * @desc 获取用户通知列表
 */
router.get(
  '/user/:userId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const unreadOnly = req.query.unreadOnly === 'true';

      const result = await notificationService.getUserNotifications(userId, page, limit, unreadOnly);
      res.json({
        data: result.notifications,
        pagination: { page, limit, total: result.total },
        unreadCount: result.unreadCount
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route PUT /api/v1/notifications/:notificationId/read
 * @desc 标记通知为已读
 */
router.put(
  '/:notificationId/read',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const notification = await notificationService.markAsRead(req.params.notificationId);
      res.json({ message: 'Marked as read', data: notification });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route PUT /api/v1/notifications/user/:userId/read-all
 * @desc 标记用户所有通知为已读
 */
router.put(
  '/user/:userId/read-all',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const result = await notificationService.markAllAsRead(req.params.userId);
      res.json({ message: `${result.count} notifications marked as read` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route DELETE /api/v1/notifications/:notificationId
 * @desc 删除通知
 */
router.delete(
  '/:notificationId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      await notificationService.delete(req.params.notificationId);
      res.json({ message: 'Notification deleted' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route POST /api/v1/notifications/broadcast
 * @desc 广播通知给所有用户
 */
router.post(
  '/broadcast',
  authenticate,
  requireAdmin,
  [
    body('type').isIn(['EMAIL', 'SMS', 'PUSH', 'IN_APP']),
    body('title').notEmpty(),
    body('content').notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      const result = await notificationService.broadcast(req.body);
      res.json({
        message: 'Broadcast queued',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

