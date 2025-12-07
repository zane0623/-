import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { EventService } from '../services/EventService';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const eventService = new EventService();

/**
 * @route POST /api/v1/events
 * @desc 添加溯源事件
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('tokenId').isInt({ min: 0 }),
    body('eventType').isIn(['PLANTING', 'GROWING', 'HARVESTING', 'PROCESSING', 'PACKAGING', 'SHIPPING', 'DELIVERED']),
    body('description').notEmpty(),
    body('location').optional().isObject()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const event = await eventService.addEvent(req.body);
      res.status(201).json({
        message: 'Event added successfully',
        data: event
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/events/:tokenId
 * @desc 获取NFT的所有溯源事件
 */
router.get(
  '/:tokenId',
  async (req: Request, res: Response) => {
    try {
      const tokenId = parseInt(req.params.tokenId);
      const events = await eventService.getEvents(tokenId);
      res.json({ data: events });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route POST /api/v1/events/batch
 * @desc 批量添加溯源事件
 */
router.post(
  '/batch',
  authenticate,
  requireAdmin,
  [body('events').isArray({ min: 1 })],
  async (req: Request, res: Response) => {
    try {
      const { events } = req.body;
      const result = await eventService.addBatchEvents(events);
      res.status(201).json({
        message: `${result.count} events added`,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route PUT /api/v1/events/:eventId
 * @desc 更新溯源事件
 */
router.put(
  '/:eventId',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const event = await eventService.updateEvent(req.params.eventId, req.body);
      res.json({ message: 'Event updated', data: event });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route POST /api/v1/events/:eventId/media
 * @desc 为事件添加媒体文件
 */
router.post(
  '/:eventId/media',
  authenticate,
  requireAdmin,
  [
    body('type').isIn(['IMAGE', 'VIDEO', 'DOCUMENT']),
    body('url').isURL()
  ],
  async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const { type, url, description } = req.body;
      const media = await eventService.addMedia(eventId, { type, url, description });
      res.status(201).json({ message: 'Media added', data: media });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

